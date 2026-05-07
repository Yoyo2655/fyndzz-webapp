const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
].join(' ')

export function getSpotifyAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    scope: SCOPES,
  })
  return `https://accounts.spotify.com/authorize?${params}`
}

export async function getValidToken() {
  const expiresAt = parseInt(localStorage.getItem('spotify_expires_at') || '0')
  let token = localStorage.getItem('spotify_access_token')

  if (Date.now() > expiresAt - 60000) {
    const refresh = localStorage.getItem('spotify_refresh_token')
    if (!refresh) return null

    const res = await fetch('/api/spotify/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    })
    const data = await res.json()
    if (data.access_token) {
      token = data.access_token
      localStorage.setItem('spotify_access_token', token)
      localStorage.setItem('spotify_expires_at', Date.now() + data.expires_in * 1000)
    }
  }
  return token
}

export async function spotifyAPI(endpoint, method = 'GET', body = null) {
  const token = await getValidToken()
  if (!token) return null

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  })

  if (res.status === 204) return {}
  if (!res.ok) return null
  return res.json()
}