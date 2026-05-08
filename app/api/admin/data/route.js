import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  const [
    { data: users, count: userCount },
    { data: sensors },
    { data: payments },
    { data: allPayments },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('id, first_name, last_name, email, created_at, vehicle_brand, vehicle_model, plate, total_trips', { count: 'exact' }).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('sensors').select('*'),
    supabaseAdmin.from('payments').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('payments').select('amount_cents'),
  ])

  return NextResponse.json({ users, userCount, sensors, payments, allPayments })
}