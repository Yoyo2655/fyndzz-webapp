'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

const TARIF_MINUTE = 0.04 // 4 centimes / minute = 2.40€/heure

const FORFAITS = [
  { label: '30 min', minutes: 30, cents: 120 },
  { label: '1 heure', minutes: 60, cents: 200 },
  { label: '2 heures', minutes: 120, cents: 350 },
  { label: '4 heures', minutes: 240, cents: 600 },
]

export default function PaymentPage() {
  const [mode, setMode] = useState('fixed')
  const [selectedForfait, setSelectedForfait] = useState(1)
  const [street, setStreet] = useState('Rue de Passy')
  const [profile, setProfile] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('pay')

  // Compteur à la minute
  const [counter, setCounter] = useState(0)
  const [counting, setCounting] = useState(false)
  const [counterInterval, setCounterInterval] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: pays } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (pays) setPayments(pays)
    }
    load()
  }, [])

  // Compteur à la minute
  const startCounter = () => {
    setCounting(true)
    const interval = setInterval(() => setCounter(c => c + 1), 60000) // +1 min toutes les 60s
    setCounterInterval(interval)
  }

  const stopCounter = async () => {
    clearInterval(counterInterval)
    setCounting(false)
    if (counter === 0) return
    await checkout(Math.round(counter * TARIF_MINUTE * 100), counter, 'meter')
  }

  const checkout = async (cents, minutes, payMode) => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: cents,
          duration_minutes: minutes,
          mode: payMode,
          street,
          user_id: user?.id,
          sensor_id: null
        })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const formatAmount = (cents) => `${(cents / 100).toFixed(2)} €`

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <ProtectedRoute>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff', paddingBottom: '5rem' }}>
        <style>{`input::placeholder { color: rgba(255,255,255,0.3); }`}</style>

        {/* HEADER */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/map" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Paiement stationnement</span>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', padding: '1.2rem 1.5rem 0', gap: '0.5rem' }}>
            {[{ id: 'pay', label: 'Payer' }, { id: 'history', label: 'Historique' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '0.5rem 1.2rem', borderRadius: '100px', border: 'none',
                background: tab === t.id ? '#00FF66' : 'rgba(255,255,255,0.08)',
                color: tab === t.id ? '#0A0040' : 'rgba(255,255,255,0.6)',
                fontWeight: tab === t.id ? '700' : '400',
                fontSize: '0.85rem', cursor: 'pointer'
            }}>{t.label}</button>
            ))}
        </div>

        <div style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>

            {/* ── PAYER ── */}
            {tab === 'pay' && (
            <>
                {/* Véhicule actif */}
                {profile && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🚗</span>
                    <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                        {profile.vehicle_brand} {profile.vehicle_model} — {profile.plate}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Véhicule actif</div>
                    </div>
                </div>
                )}

                {/* Rue */}
                <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Rue de stationnement</label>
                <input style={inputStyle} value={street} onChange={e => setStreet(e.target.value)} placeholder="Rue de Passy" />
                </div>

                {/* Mode */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[{ id: 'fixed', label: '🕐 Durée fixe' }, { id: 'meter', label: '⏱ À la minute' }].map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)} style={{
                    flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: mode === m.id ? '#00FF66' : 'rgba(255,255,255,0.08)',
                    color: mode === m.id ? '#0A0040' : '#fff',
                    fontWeight: mode === m.id ? '700' : '400', fontSize: '0.88rem'
                    }}>{m.label}</button>
                ))}
                </div>

                {/* Durée fixe */}
                {mode === 'fixed' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {FORFAITS.map((f, i) => (
                        <button key={i} onClick={() => setSelectedForfait(i)} style={{
                        padding: '1rem', borderRadius: '12px', border: `1px solid ${selectedForfait === i ? '#00FF66' : 'rgba(255,255,255,0.1)'}`,
                        background: selectedForfait === i ? 'rgba(0,255,102,0.1)' : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer', textAlign: 'center'
                        }}>
                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: selectedForfait === i ? '#00FF66' : '#fff' }}>{f.label}</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>{formatAmount(f.cents)}</div>
                        </button>
                    ))}
                    </div>
                    <button
                    onClick={() => checkout(FORFAITS[selectedForfait].cents, FORFAITS[selectedForfait].minutes, 'fixed')}
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                    {loading ? 'Chargement...' : `Payer ${formatAmount(FORFAITS[selectedForfait].cents)} →`}
                    </button>
                </>
                )}

                {/* À la minute */}
                {mode === 'meter' && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: '#00FF66', letterSpacing: '-0.03em' }}>
                        {counter} min
                    </div>
                    <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                        {formatAmount(Math.round(counter * TARIF_MINUTE * 100))}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
                        0.04 € / minute
                    </div>
                    </div>
                    {!counting ? (
                    <button onClick={startCounter} style={{ width: '100%', padding: '1rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}>
                        ▶ Démarrer le compteur
                    </button>
                    ) : (
                    <button onClick={stopCounter} disabled={loading} style={{ width: '100%', padding: '1rem', background: '#FF4D6D', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        ⏹ Arrêter et payer {formatAmount(Math.round(counter * TARIF_MINUTE * 100))}
                    </button>
                    )}
                </div>
                )}

                <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Paiement sécurisé via Stripe · Apple Pay & Google Pay acceptés
                </div>
            </>
            )}

            {/* ── HISTORIQUE ── */}
            {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {payments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '3rem 0', fontSize: '0.9rem' }}>
                    Aucun paiement pour l'instant
                </div>
                ) : payments.map(p => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.street}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                        {p.duration_minutes} min · {formatDate(p.created_at)}
                    </div>
                    <div style={{ marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '100px', background: p.status === 'paid' ? 'rgba(0,255,102,0.1)' : 'rgba(255,77,109,0.1)', color: p.status === 'paid' ? '#00FF66' : '#FF4D6D', fontWeight: '600' }}>
                        {p.status === 'paid' ? 'Payé' : 'En attente'}
                        </span>
                    </div>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#00FF66' }}>
                    {formatAmount(p.amount_cents)}
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </ProtectedRoute>
  )
}