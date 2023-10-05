import React from 'react'

function SongListItem({index, track, children}) {
  return (
    <div className="flex-row song-list-box">
        <p className="song-list-index">{index}</p>
        <img src={track.album.images[0].url} className="song-list-icon" />
        <div className="flex-column">
            <p className="song-list-name">{track.name}</p>
            <p className="song-list-artist">{track.artists[0].name}</p>
        </div>
        {children}
    </div>
  )
}

export default SongListItem