'use client'
import { useEffect, useState, useCallback } from 'react'
import { getSpotifyAuthUrl, spotifyAPI, getValidToken } from '@/lib/spotify'

export default function SpotifyPlayer() {
  const [connected, setConnected] = useState(false)
  const [track, setTrack] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [loading, setLoading] = useState(false)

  const checkConnected = useCallback(async () => {
    const token = await getValidToken()
    setConnected(!!token)
    return !!token
  }, [])

  const fetchCurrentTrack = useCallback(async () => {
    const data = await spotifyAPI('/me/player')
    if (data?.item) {
      setTrack({
        name: data.item.name,
        artist: data.item.artists.map(a => a.name).join(', '),
        image: data.item.album.images[1]?.url,
        duration: data.item.duration_ms,
        progress: data.progress_ms,
      })
      setPlaying(data.is_playing)
      setVolume(data.device?.volume_percent ?? 50)
    }
  }, [])

  useEffect(() => {
    checkConnected().then(ok => {
      if (ok) fetchCurrentTrack()
    })
    const interval = setInterval(() => {
      if (connected) fetchCurrentTrack()
    }, 5000)
    return () => clearInterval(interval)
  }, [connected])

  const togglePlay = async () => {
    setLoading(true)
    await spotifyAPI(`/me/player/${playing ? 'pause' : 'play'}`, 'PUT')
    setPlaying(!playing)
    setLoading(false)
  }

  const skip = async (dir) => {
    await spotifyAPI(`/me/player/${dir === 'next' ? 'next' : 'previous'}`, 'POST')
    setTimeout(fetchCurrentTrack, 500)
  }

  const changeVolume = async (v) => {
    setVolume(v)
    await spotifyAPI(`/me/player/volume?volume_percent=${v}`, 'PUT')
  }

  if (!connected) return (
    <button
      onClick={() => window.location.href = getSpotifyAuthUrl()}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#1DB954', color: 'white',
        border: 'none', borderRadius: '12px',
        padding: '10px 16px', cursor: 'pointer',
        fontWeight: '700', fontSize: '13px', width: '100%',
        justifyContent: 'center'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      Connecter Spotify
    </button>
  )

  return (
    <div style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '16px', padding: '12px', width: '100%' }}>
      {track ? (
        <>
          {/* Track info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {track.image && (
              <img src={track.image} style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0 }} alt="" />
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</div>
            </div>
            {/* Spotify logo */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" style={{ flexShrink: 0 }}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>

          {/* Contrôles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '10px' }}>
            <button onClick={() => skip('previous')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
            </button>

            <button
              onClick={togglePlay}
              disabled={loading}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1DB954', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {playing
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              }
            </button>

            <button onClick={() => skip('next')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14 4.72 3.14L8 16.14V9.86zM16 6h2v12h-2z"/></svg>
            </button>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={e => changeVolume(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: '#1DB954', height: '3px', cursor: 'pointer' }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '8px 0' }}>
          Aucune lecture en cours
        </div>
      )}
    </div>
  )
}