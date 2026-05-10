import { NextResponse } from 'next/server'

const attempts = new Map()

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const max = 5

  const record = attempts.get(ip) || { count: 0, start: now }
  if (now - record.start > windowMs) {
    attempts.set(ip, { count: 1, start: now })
  } else if (record.count >= max) {
    return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 })
  } else {
    attempts.set(ip, { count: record.count + 1, start: record.start })
  }

  const { password } = await req.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}