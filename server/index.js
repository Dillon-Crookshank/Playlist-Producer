const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

const port = 5000;

//initialize environment variables
dotenv.config();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

//initialize the express app
const app = express();
app.use(cors());

//initialize the API token to an empty string
let access_token = '';
let refresh_token = '';

//Initialize the state query for extra safety
let state = generateRandomString(16);

//begin express app on port 5000
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

//backend call to redirect the user to the spotify login page
app.get('/auth/login', (req, res) => {
    const scope = "streaming user-read-email user-read-private user-top-read user-read-playback-state";

    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        state: state,
        show_dialog: "false", //for debug only
        redirect_uri: "http://localhost:5000/auth/callback",
    });

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

//backend call that is done after user logs into spotify, stores the api token in local storage
app.get('/auth/callback', async (req, res) => {
    //get the code attribute from the url queries
    const code = req.query.code;

    //validate the state
    if (state != req.query.state) {
        //throw new Error("State is invalid");
        //instead of throwing an error, redirect back to login page
        res.redirect("http://localhost:3000");
    }

    //initialize the URL Queries
    const body = new URLSearchParams({
        code: code,
        redirect_uri: 'http://localhost:5000/auth/callback',
        grant_type: 'authorization_code'
    });

    //send a post request to the spotify api
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        body.toString(), {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }}
    );

    //make sure the request was successful by checking the status code
    if (response.status == 200) {
        //save the tokens in local memory
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;

        //console.log(`API Token: ${access_token}`);

        //send the user back to the main page
        res.redirect('http://localhost:3000/');
    } else {
        console.log(`Could not retrieve API Token. Status code: ${response.statusCode}`);
    }

    //set an interval to automatically refresh the API token a minute before it expires
    //this probably wont ever be useful, so lets leave it commented out until I inevitably need it later
    /*
    setInterval(() => {
        refreshAPIToken();
    }, (response.data.expires_in - 60) * 1000);
    */
});

//backend call to get the api token from local storage
app.get('/auth/token', (req, res) => {
    res.json({ "token": access_token })
});

async function refreshAPIToken() {
    //initialize the URL Queries
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    });

    //send a post request to the spotify api
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        body.toString(), {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }}
    );

    //make sure the request was successful by checking the status code
    if (response.status == 200) {
        //save the new token in local memory
        access_token = response.data.access_token;

        //console.log(`Refreshed API Token: ${access_token}`);

    } else {
        console.log(`Could not refresh API Token. Status code: ${response.statusCode}`);
    }
}

//used to generate the state query
function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
