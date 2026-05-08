import { NextResponse } from 'next/server'

export async function POST(req) {
  const { password } = await req.json()
  console.log('Password reçu:', password)
  console.log('Password attendu:', process.env.ADMIN_PASSWORD)
  console.log('Égaux:', password === process.env.ADMIN_PASSWORD)
  
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}