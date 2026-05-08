'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { NextResponse } from 'next/server'

const BRAND_GRADIENT = 'linear-gradient(180deg, #160C6B 0%, #0d0a3e 100%)'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSensors: 0,
    freeSensors: 0,
    totalRevenue: 0,
    totalPayments: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [topStreets, setTopStreets] = useState([])
  const [sensors, setSensors] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  const login = async () => {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    if (res.ok) {
      setAuthed(true)
      sessionStorage.setItem('fyndzz_admin', '1')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('fyndzz_admin') === '1') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    loadData()
  }, [authed])

  const loadData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/data')
    const { users, userCount, sensors, payments, allPayments } = await res.json()

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const activeCount = (users || []).filter(u => u.created_at >= sevenDaysAgo).length
    const totalRevenue = (allPayments || []).reduce((sum, p) => sum + (p.amount_cents || 0), 0)

    const streetMap = {}
    ;(sensors || []).forEach(s => {
      if (!streetMap[s.street]) streetMap[s.street] = { total: 0, taken: 0 }
      streetMap[s.street].total++
      if (!s.is_free) streetMap[s.street].taken++
    })
    const streets = Object.entries(streetMap)
      .map(([name, data]) => ({ name, ...data, pct: Math.round((data.taken / data.total) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 8)

    setStats({
      totalUsers: userCount || 0,
      activeUsers: activeCount,
      totalSensors: sensors?.length || 0,
      freeSensors: sensors?.filter(s => s.is_free).length || 0,
      totalRevenue,
      totalPayments: allPayments?.length || 0,
    })
    setRecentUsers(users || [])
    setRecentPayments(payments || [])
    setTopStreets(streets)
    setSensors(sensors || [])
    setLoading(false)
  }

  const pct = stats.totalSensors ? Math.round(((stats.totalSensors - stats.freeSensors) / stats.totalSensors) * 100) : 0

  // ── LOGIN ──
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: BRAND_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.3rem' }}>Admin Fyndzz</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Accès restreint</div>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Mot de passe admin"
          style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' }}
        />
        {error && <div style={{ color: '#FF4D6D', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</div>}
        <button onClick={login} style={{ width: '100%', padding: '0.9rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
          Accéder au dashboard
        </button>
      </div>
    </div>
  )

  const card = (num, label, sub, color = '#00FF66') => (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', color, letterSpacing: '-0.02em' }}>{num}</div>
      <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.9rem', marginTop: '0.3rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  )

  const tabs = ['overview', 'users', 'sensors', 'payments']
  const tabLabels = { overview: '📊 Vue d\'ensemble', users: '👥 Utilisateurs', sensors: '📡 Capteurs', payments: '💳 Paiements' }

  return (
    <div style={{ minHeight: '100vh', background: BRAND_GRADIENT, fontFamily: 'sans-serif', color: '#fff' }}>

      {/* HEADER */}
      <div style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/map" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem' }}>← Carte</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ fontWeight: '800', fontSize: '1rem' }}>🛡️ Admin Dashboard</span>
          <span style={{ background: 'rgba(0,255,102,0.15)', border: '1px solid rgba(0,255,102,0.3)', color: '#00FF66', fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '100px', letterSpacing: '0.08em' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={loadData} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.4rem 0.9rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', cursor: 'pointer' }}>
            🔄 Rafraîchir
          </button>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem('fyndzz_admin') }} style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '8px', padding: '0.4rem 0.9rem', color: '#FF4D6D', fontSize: '0.82rem', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: '1.5rem 2rem 0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '0.5rem 1.2rem', borderRadius: '100px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            background: activeTab === t ? '#00FF66' : 'rgba(255,255,255,0.08)',
            color: activeTab === t ? '#0A0040' : 'rgba(255,255,255,0.6)',
            fontWeight: activeTab === t ? '700' : '400', fontSize: '0.85rem'
          }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem 2rem 3rem', maxWidth: '1200px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #00FF66', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            Chargement...
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {!loading && activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {card(stats.totalUsers, 'Utilisateurs inscrits', 'Total')}
              {card(stats.activeUsers, 'Nouveaux (7j)', 'Derniers 7 jours', '#00FF66')}
              {card(`${stats.freeSensors}/${stats.totalSensors}`, 'Capteurs libres', `${100 - pct}% disponibles`, '#00FF66')}
              {card(`${(stats.totalRevenue / 100).toFixed(2)}€`, 'Revenus totaux', `${stats.totalPayments} paiements`, '#FFB800')}
            </div>

            {/* Occupation globale */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '1rem' }}>Occupation globale en temps réel</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                <span>{stats.totalSensors - stats.freeSensors} occupées</span>
                <span>{pct}%</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct > 70 ? '#FF4D6D' : pct > 50 ? '#FFB800' : '#00FF66', borderRadius: '100px', transition: 'width 0.5s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                <span>🟢 {stats.freeSensors} libres</span>
                <span>🔴 {stats.totalSensors - stats.freeSensors} occupées</span>
              </div>
            </div>

            {/* Top rues */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '1rem' }}>Top rues les plus occupées</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {topStreets.map((s, i) => {
                  const color = s.pct > 70 ? '#FF4D6D' : s.pct > 50 ? '#FFB800' : '#00FF66'
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: '600', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{s.name}</span>
                        <span style={{ color, fontWeight: '700', flexShrink: 0 }}>{s.pct}% · {s.taken}/{s.total}</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: color, borderRadius: '100px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Derniers inscrits + paiements côte à côte */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '1rem' }}>Derniers inscrits</div>
                {recentUsers.slice(0, 5).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3D2CD5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 }}>
                      {(u.first_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.email}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFB800', marginBottom: '1rem' }}>Derniers paiements</div>
                {recentPayments.slice(0, 5).length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Aucun paiement</div>
                ) : recentPayments.slice(0, 5).map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{p.street || 'Place'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        {p.duration_minutes}min · {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: '#FFB800', fontSize: '0.95rem' }}>
                      {((p.amount_cents || 0) / 100).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {!loading && activeTab === 'users' && (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF66' }}>
                {stats.totalUsers} utilisateurs inscrits
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Utilisateur', 'Email', 'Véhicule', 'Plaque', 'Trajets', 'Inscrit le'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3D2CD5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.7rem', flexShrink: 0 }}>
                            {(u.first_name?.[0] || '?').toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600' }}>{u.first_name || '—'} {u.last_name || ''}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{u.email || '—'}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{u.vehicle_brand ? `${u.vehicle_brand} ${u.vehicle_model || ''}` : '—'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {u.plate ? <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{u.plate}</span> : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#00FF66', fontWeight: '700' }}>{u.total_trips || 0}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CAPTEURS ── */}
        {!loading && activeTab === 'sensors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {card(stats.totalSensors, 'Total capteurs', 'Île-de-France')}
              {card(stats.freeSensors, 'Places libres', `${100 - pct}% disponibles`, '#00FF66')}
              {card(stats.totalSensors - stats.freeSensors, 'Places occupées', `${pct}% d'occupation`, '#FF4D6D')}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '1rem' }}>Occupation par rue</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '500px', overflowY: 'auto' }}>
                {topStreets.map((s, i) => {
                  const color = s.pct > 70 ? '#FF4D6D' : s.pct > 50 ? '#FFB800' : '#00FF66'
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: '600' }}>{s.name}</span>
                        <span style={{ color, fontWeight: '700' }}>{s.pct}% · {s.taken}/{s.total}</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: color, borderRadius: '100px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── PAIEMENTS ── */}
        {!loading && activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {card(`${(stats.totalRevenue / 100).toFixed(2)}€`, 'Revenus totaux', 'Tous paiements confondus', '#FFB800')}
              {card(stats.totalPayments, 'Transactions', 'Total')}
              {card(stats.totalPayments > 0 ? `${((stats.totalRevenue / 100) / stats.totalPayments).toFixed(2)}€` : '0€', 'Panier moyen', 'Par transaction', '#FFB800')}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFB800' }}>Derniers paiements</div>
              </div>
              {recentPayments.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Aucun paiement enregistré</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {['Rue', 'Durée', 'Mode', 'Montant', 'Statut', 'Date'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((p, i) => (
                        <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>{p.street || '—'}</td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{p.duration_minutes} min</td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.6)' }}>{p.mode || '—'}</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#FFB800' }}>{((p.amount_cents || 0) / 100).toFixed(2)}€</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{
                              background: p.status === 'paid' ? 'rgba(0,255,102,0.15)' : 'rgba(255,184,0,0.15)',
                              color: p.status === 'paid' ? '#00FF66' : '#FFB800',
                              padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700'
                            }}>
                              {p.status || 'pending'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}