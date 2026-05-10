'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getLevel, getNextLevel, getUnlockedBadges, getNextBadge, REWARDS, spendSPTZ } from '@/lib/sptz'

const TARIF_MINUTE = 0.04
const FORFAITS = [
  { label: '30 min', minutes: 30, cents: 120 },
  { label: '1 heure', minutes: 60, cents: 200 },
  { label: '2 heures', minutes: 120, cents: 350 },
  { label: '4 heures', minutes: 240, cents: 600 },
]

const BADGES_DEF = [
  { threshold: 250, emoji: '🅿️', name: 'Rookie' },
  { threshold: 500, emoji: '⚡', name: 'Chargé' },
  { threshold: 750, emoji: '🔥', name: 'En feu' },
  { threshold: 1000, emoji: '🎯', name: 'Précis' },
  { threshold: 1250, emoji: '🚀', name: 'Lancé' },
  { threshold: 1500, emoji: '💎', name: 'Diamant' },
  { threshold: 1750, emoji: '🌟', name: 'Étoile' },
  { threshold: 2000, emoji: '👑', name: 'Roi du parking' },
  { threshold: 2500, emoji: '🏆', name: 'Champion' },
  { threshold: 5000, emoji: '🦁', name: 'Légende' },
]

export default function PaymentPage() {
  const [mode, setMode] = useState('fixed')
  const [selectedForfait, setSelectedForfait] = useState(1)
  const [street, setStreet] = useState('Rue de Passy')
  const [profile, setProfile] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('pay')

  // SPTZ
  const [sptzData, setSptzData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [claimingReward, setClaimingReward] = useState(null)
  const [rewardMsg, setRewardMsg] = useState('')

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
      setSptzData({
        total: prof?.sptz_total || 0,
        balance: prof?.sptz_balance || 0,
        streak: prof?.sptz_streak || 0,
        badges: prof?.sptz_badges || [],
      })
      const { data: pays } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (pays) setPayments(pays)
      const { data: txs } = await supabase.from('sptz_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      setTransactions(txs || [])
    }
    load()
  }, [])

  const startCounter = () => {
    setCounting(true)
    const interval = setInterval(() => setCounter(c => c + 1), 60000)
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
        body: JSON.stringify({ amount_cents: cents, duration_minutes: minutes, mode: payMode, street, user_id: user?.id, sensor_id: null })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {}
    setLoading(false)
  }

  const handleClaimReward = async (reward) => {
    setClaimingReward(reward.id)
    const { data: { user } } = await supabase.auth.getUser()
    const result = await spendSPTZ(user.id, reward.id)
    if (result.error) {
      setRewardMsg(`❌ ${result.error}`)
    } else {
      setSptzData(prev => ({ ...prev, balance: prev.balance - reward.cost }))
      setRewardMsg(`✅ ${reward.label} — votre récompense a été enregistrée !`)
    }
    setTimeout(() => setRewardMsg(''), 4000)
    setClaimingReward(null)
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
  const sectionTitle = { fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00FF66', fontWeight: '700', marginBottom: '1rem' }

  const level = sptzData ? getLevel(sptzData.total) : null
  const nextLevel = sptzData ? getNextLevel(sptzData.total) : null
  const nextBadge = sptzData ? getNextBadge(sptzData.total) : null
  const progressToNext = nextLevel ? Math.round(((sptzData.total - (level?.minThreshold || 0)) / (nextLevel.threshold - (level?.minThreshold || 0))) * 100) : 100

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
        <div style={{ display: 'flex', padding: '1.2rem 1.5rem 0', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'pay', label: 'Payer' },
            { id: 'sptz', label: '⚡ SPTZ' },
            { id: 'history', label: 'Historique' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.5rem 1.2rem', borderRadius: '100px', border: 'none',
              background: tab === t.id ? '#00FF66' : 'rgba(255,255,255,0.08)',
              color: tab === t.id ? '#0A0040' : 'rgba(255,255,255,0.6)',
              fontWeight: tab === t.id ? '700' : '400',
              fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>

          {/* ── PAYER ── */}
          {tab === 'pay' && (
            <>
              {profile && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>🚗</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{profile.vehicle_brand} {profile.vehicle_model} — {profile.plate}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Véhicule actif</div>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Rue de stationnement</label>
                <input style={inputStyle} value={street} onChange={e => setStreet(e.target.value)} placeholder="Rue de Passy" />
              </div>
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
                  <button onClick={() => checkout(FORFAITS[selectedForfait].cents, FORFAITS[selectedForfait].minutes, 'fixed')} disabled={loading} style={{ width: '100%', padding: '1rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Chargement...' : `Payer ${formatAmount(FORFAITS[selectedForfait].cents)} →`}
                  </button>
                </>
              )}
              {mode === 'meter' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: '#00FF66', letterSpacing: '-0.03em' }}>{counter} min</div>
                    <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>{formatAmount(Math.round(counter * TARIF_MINUTE * 100))}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>0.04 € / minute</div>
                  </div>
                  {!counting ? (
                    <button onClick={startCounter} style={{ width: '100%', padding: '1rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}>▶ Démarrer le compteur</button>
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

          {/* ── SPTZ ── */}
          {tab === 'sptz' && sptzData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* Solde + niveau */}
              <div style={{ background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00FF66', fontWeight: '700', marginBottom: '0.5rem' }}>Solde disponible</div>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#00FF66', letterSpacing: '-0.03em' }}>{sptzData.balance}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>SPTZ</div>
                <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                  <span>Total cumulé : <strong style={{ color: '#fff' }}>{sptzData.total}</strong></span>
                  <span>Streak : <strong style={{ color: '#FFB800' }}>🔥 {sptzData.streak}j</strong></span>
                </div>
              </div>

              {/* Niveau + progression */}
              {level && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontWeight: '700', color: level.color }}>{level.name}</span>
                    {nextLevel && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>→ {nextLevel.name} à {nextLevel.threshold} SPTZ</span>}
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(progressToNext, 100)}%`, background: level.color, borderRadius: '100px', transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', textAlign: 'right' }}>
                    {sptzData.total} / {nextLevel?.threshold || sptzData.total} SPTZ
                  </div>
                </div>
              )}

              {/* Battle Pass Badges */}
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
                <div style={sectionTitle}>Badges ·SPOTZZ PASS</div>
                {nextBadge && (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                    Prochain badge à {nextBadge.threshold} SPTZ — encore {nextBadge.threshold - sptzData.total} SPTZ
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {BADGES_DEF.map((b, i) => {
                    const unlocked = sptzData.total >= b.threshold
                    return (
                      <div key={i} style={{ textAlign: 'center', opacity: unlocked ? 1 : 0.3 }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto 0.3rem',
                          background: unlocked ? 'rgba(0,255,102,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${unlocked ? 'rgba(0,255,102,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.3rem'
                        }}>
                          {unlocked ? b.emoji : '🔒'}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: unlocked ? '#00FF66' : 'rgba(255,255,255,0.3)', fontWeight: '600', lineHeight: '1.2' }}>{b.threshold}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Récompenses */}
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
                <div style={sectionTitle}>Récompenses</div>
                {rewardMsg && (
                  <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: rewardMsg.startsWith('✅') ? 'rgba(0,255,102,0.1)' : 'rgba(255,77,109,0.1)', border: `1px solid ${rewardMsg.startsWith('✅') ? 'rgba(0,255,102,0.3)' : 'rgba(255,77,109,0.3)'}`, borderRadius: '10px', fontSize: '0.85rem', color: rewardMsg.startsWith('✅') ? '#00FF66' : '#FF4D6D' }}>
                    {rewardMsg}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {REWARDS.map(r => {
                    const canClaim = sptzData.balance >= r.cost
                    return (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${canClaim ? 'rgba(0,255,102,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{r.emoji} {r.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#FFB800', fontWeight: '700', marginTop: '0.2rem' }}>{r.cost} SPTZ</div>
                        </div>
                        <button
                          onClick={() => handleClaimReward(r)}
                          disabled={!canClaim || claimingReward === r.id}
                          style={{
                            padding: '0.45rem 1rem', borderRadius: '8px', border: 'none', cursor: canClaim ? 'pointer' : 'not-allowed',
                            background: canClaim ? '#00FF66' : 'rgba(255,255,255,0.08)',
                            color: canClaim ? '#0A0040' : 'rgba(255,255,255,0.3)',
                            fontWeight: '700', fontSize: '0.8rem', opacity: claimingReward === r.id ? 0.7 : 1
                          }}
                        >
                          {claimingReward === r.id ? '...' : 'Réclamer'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Historique transactions */}
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
                <div style={sectionTitle}>Historique SPTZ</div>
                {transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '1.5rem 0', fontSize: '0.85rem' }}>Aucune transaction</div>
                ) : transactions.map(tx => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{tx.reason}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{formatDate(tx.created_at)}</div>
                    </div>
                    <div style={{ fontWeight: '800', color: tx.amount > 0 ? '#00FF66' : '#FF4D6D', fontSize: '0.95rem' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} SPTZ
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ── HISTORIQUE PAIEMENTS ── */}
          {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '3rem 0', fontSize: '0.9rem' }}>Aucun paiement pour l&apos;instant</div>
              ) : payments.map(p => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.street}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{p.duration_minutes} min · {formatDate(p.created_at)}</div>
                    <div style={{ marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '100px', background: p.status === 'paid' ? 'rgba(0,255,102,0.1)' : 'rgba(255,77,109,0.1)', color: p.status === 'paid' ? '#00FF66' : '#FF4D6D', fontWeight: '600' }}>
                        {p.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#00FF66' }}>{formatAmount(p.amount_cents)}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}