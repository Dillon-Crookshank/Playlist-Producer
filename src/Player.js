import React, { useEffect, useState } from 'react'
import QueueItem from './QueueItem';
import defaultAlbum from './assets/SpotifyLogo.png';
import './Css/Player.css';

const axios = require('axios');

async function fetchQueue(token) {
    const result = await fetch("https://api.spotify.com/v1/me/player/queue?limit=50", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

function Player({ token }) {

    const [player, setPlayer] = useState(undefined);

    const [is_paused, setPaused] = useState(false);
    const [current_track, setTrack] = useState(null);
    const [queue, setQueue] = useState([]);

    const [volume, setVolume] = useState(0.05);



    useEffect(() => {
        //add a new script tag to the dom tree which loads the web playback sdk
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        //create event that fires when the web playback script is ready
        window.onSpotifyWebPlaybackSDKReady = () => {


            const player = new window.Spotify.Player({
                name: 'Playlist Producer',
                getOAuthToken: cb => { cb(token); },
                volume: 0.05
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Event emitted whenever the state of the player has changed(i.e new song, device changed)
            player.addListener('player_state_changed', async (state) => {
                if (state === null) {
                    return;
                } else {
                    setTrack(state.track_window.current_track);
                    setPaused(state.paused);
                    setQueue((await fetchQueue(token)).queue);
                }
            });



            player.connect();

        };
    }, []);

    useEffect(() => {
        if (player == null)
            return;

        player.setVolume(volume);
    }, [volume]);

    return (
        <>
            <div id="player-container">
                <img src={current_track !== null ? current_track.album.images[0].url : defaultAlbum} id="album-cover-image" />
                <div id="song-info-container">
                    <p id="song-name">{current_track !== null ? current_track.name : "Change device in Spotify app to \"Playlist Producer\""}</p>
                    <p id="song-artist">{current_track !== null ? current_track.artists[0].name : " "}</p>
                    <div id="player-controls">
                        <button className="icon-button" onClick={() => { player.previousTrack() }} >
                            <i className="material-icons">skip_previous</i>
                        </button>
                        <button className="icon-button" onClick={() => { player.togglePlay() }} >
                            {!is_paused ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}
                        </button>
                        <button className="icon-button" onClick={() => { player.nextTrack() }} >
                            <i className="material-icons">skip_next</i>
                        </button>
                    </div>

                    <input type="range" min="0" max="1" step="0.01" value={volume} id="volume-slider" onChange={(event) => { setVolume(event.target.value); }} />
                </div>
            </div>

            <div id="queue-container">
                <p className="title">Queue</p>
                {queue.map((track, index) => <QueueItem key={index} index={index + 1} track={track} />)}
            </div>
        </>
    )
}

export default Player