'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Suspense } from 'react'
import { addSPTZ } from '@/lib/sptz'
import { posthog } from '@/lib/posthog'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [done, setDone] = useState(false)
  const [sptzEarned, setSptzEarned] = useState(0)
  const [newBadges, setNewBadges] = useState([])
  const [streakBonus, setStreakBonus] = useState(0)

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('vehicle_energy, vehicle2_energy, vehicle3_energy, vehicle4_energy, active_vehicle')
        .eq('id', user.id)
        .single()

      const energies = [
        profile?.vehicle_energy,
        profile?.vehicle2_energy,
        profile?.vehicle3_energy,
        profile?.vehicle4_energy,
      ]
      const activeEnergy = energies[(profile?.active_vehicle || 1) - 1]
      const multiplier = activeEnergy === 'Électrique' ? 2 : 1
      const basePoints = 10 * multiplier

      const result = await addSPTZ(user.id, basePoints, '🅿️ Trajet complété')
      if (result) {
        posthog.capture('payment_completed', { sptz_earned: basePoints + (result.streakBonus || 0), multiplier })
        setSptzEarned(basePoints + (result.streakBonus || 0))
        setNewBadges(result.newBadges || [])
        setStreakBonus(result.streakBonus || 0)
      }

      setDone(true)
    }
    save()
  }, [sessionId])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%' }}>

        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.8rem' }}>Paiement confirmé !</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Votre stationnement est enregistré. Un reçu a été envoyé à votre adresse email.
        </p>

        {sptzEarned > 0 && (
          <div style={{ background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.25)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#00FF66' }}>+{sptzEarned} SPTZ</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>Spotzz Points gagnés</div>
            {streakBonus > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#FFB800', marginTop: '0.4rem', fontWeight: '600' }}>
                🔥 +{streakBonus} bonus streak inclus !
              </div>
            )}
          </div>
        )}

        {newBadges.length > 0 && (
          <div style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFB800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
              🏅 Nouveau{newBadges.length > 1 ? 'x' : ''} badge{newBadges.length > 1 ? 's' : ''} débloqué{newBadges.length > 1 ? 's' : ''} !
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {newBadges.map((b, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.5rem 0.8rem', fontSize: '0.85rem', fontWeight: '600' }}>
                  {b.emoji} {b.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href="/map" style={{ display: 'inline-block', padding: '0.9rem 2rem', background: '#00FF66', color: '#0A0040', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>
          Retour à la carte →
        </Link>

        <div style={{ marginTop: '1rem' }}>
          <Link href="/payment" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Voir mes Spotzz Points →
          </Link>
        </div>

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