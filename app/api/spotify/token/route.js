import { NextResponse } from 'next/server'

export async function POST(req) {
  const { code, refresh_token } = await req.json()

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

  const body = new URLSearchParams(
    code
      ? { grant_type: 'authorization_code', code, redirect_uri: redirectUri }
      : { grant_type: 'refresh_token', refresh_token }
  )

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    body
  })

  const data = await res.json()
  return NextResponse.json(data)
}