'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const save = async () => {
      if (!sessionId || done) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('payments').insert({
        user_id: user.id,
        stripe_session_id: sessionId,
        status: 'paid',
        amount_cents: 0,
        street: 'Fyndzz',
      })
      setDone(true)
    }
    save()
  }, [sessionId])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.8rem' }}>Paiement confirmé !</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Votre stationnement est enregistré. Un reçu a été envoyé à votre adresse email.
        </p>
        <Link href="/map" style={{ display: 'inline-block', padding: '0.9rem 2rem', background: '#00FF66', color: '#0A0040', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>
          Retour à la carte →
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}