import React from 'react'

function QueueItem({index, track}) {
  return (
    <div className="queue-box">
        <p className="queue-index">{index}</p>
        <img src={track.album.images[0].url} className="queue-image" />
        <div className="queue-song-info">
            <p className="queue-song-name">{track.name}</p>
            <p className="queue-song-artist">{track.artists[0].name}</p>
        </div>
    </div>
  )
}

export default QueueItem