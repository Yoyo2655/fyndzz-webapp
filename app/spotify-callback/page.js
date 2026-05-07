'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SpotifyCallback() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) { router.push('/map'); return }

    fetch('/api/spotify/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('spotify_access_token', data.access_token)
          localStorage.setItem('spotify_refresh_token', data.refresh_token)
          localStorage.setItem('spotify_expires_at', Date.now() + data.expires_in * 1000)
        }
        router.push('/map')
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#160C6B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #00FF66', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p>Connexion Spotify...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}