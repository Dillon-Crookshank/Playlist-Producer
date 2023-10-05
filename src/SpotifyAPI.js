function fetchProfile() {
    //https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
}

function fetchTopItems() {
    //https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
}

function fetchRecommendations() {
    //https://developer.spotify.com/documentation/web-api/reference/get-recommendations
}

function fetchSearchResults() {
    //https://developer.spotify.com/documentation/web-api/reference/search
}

function fetchUsersPlaylists() {
    //https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
}

function fetchPlaylist() {
    //https://developer.spotify.com/documentation/web-api/reference/get-playlist
    //or
    //https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks

    //for cover image
    //https://developer.spotify.com/documentation/web-api/reference/get-playlist-cover
}

function appendToPlaylist() {
    //https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
}

function removeFromPlaylist() {
    //https://developer.spotify.com/documentation/web-api/reference/remove-tracks-playlist
}

/**
 * This function transfers playback to the device associated with the given device_id
 * @param {String} token The Spotify API token
 * @param {String} device_id The device id that playback should be transferred to.
 */
export async function transferPlayback(token, device_id) {
    const body = {
        device_ids: [device_id]
    }
    
    const result = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT", 
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
    });
}