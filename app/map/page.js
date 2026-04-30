'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function MapPage() {
  const [sensors, setSensors] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)

  // Navigation GPS
  const [routeInfo, setRouteInfo] = useState(null)
  const [navMode, setNavMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [navStarted, setNavStarted] = useState(false)
  const watchIdRef = useRef(null)
  const synthRef = useRef(null)

  const free = sensors.filter(s => s.is_free).length
  const taken = sensors.length - free
  const pct = sensors.length ? Math.round((taken / sensors.length) * 100) : 0

  const byStreet = sensors.reduce((acc, s) => {
    if (!acc[s.street]) acc[s.street] = { free: 0, total: 0 }
    acc[s.street].total++
    if (s.is_free) acc[s.street].free++
    return acc
  }, {})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const fetchSensors = async () => {
      const { data } = await supabase.from('sensors').select('*')
      if (data) setSensors(data)
    }
    fetchSensors()
    const channel = supabase
      .channel('sensors')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sensors' }, (payload) => {
        setSensors(prev => prev.map(s => s.id === payload.new.id ? payload.new : s))
      })
      .subscribe()
    if (window.innerWidth < 768) setSidebarOpen(false)
    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`)
      const data = await res.json()
      if (data[0]) {
        window.__fyndzz_destination = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        window.__fyndzz_search_trigger?.()
      }
    } catch (err) { console.error(err) }
    setSearching(false)
  }

  const speak = (text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'fr-FR'
    utt.rate = 1.05
    window.speechSynthesis.speak(utt)
  }

  const startNavigation = () => {
    setNavStarted(true)
    setCurrentStep(0)
    const firstStep = routeInfo?.steps?.[0]
    if (firstStep?.maneuver?.instruction || firstStep) {
      speak(formatStep(firstStep))
    }

    // Suivi GPS
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(pos => {
        window.__fyndzz_userpos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      }, null, { enableHighAccuracy: true })
    }
  }

  const stopNavigation = () => {
    setNavMode(false)
    setNavStarted(false)
    setRouteInfo(null)
    setCurrentStep(0)
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    window.speechSynthesis?.cancel()
  }

  const nextStep = () => {
    const next = currentStep + 1
    if (next < (routeInfo?.steps?.length || 0)) {
      setCurrentStep(next)
      speak(formatStep(routeInfo.steps[next]))
    } else {
      speak('Vous êtes arrivé à destination. Bonne journée !')
      setTimeout(stopNavigation, 3000)
    }
  }

  const prevStep = () => {
    const prev = Math.max(0, currentStep - 1)
    setCurrentStep(prev)
    speak(formatStep(routeInfo?.steps?.[prev]))
  }

  const formatStep = (step) => {
    if (!step) return ''
    const type = step.maneuver?.type || ''
    const modifier = step.maneuver?.modifier || ''
    const name = step.name || ''
    const dist = step.distance ? `dans ${Math.round(step.distance)} mètres` : ''

    if (type === 'depart') return `Démarrez ${name ? 'sur ' + name : ''}`
    if (type === 'arrive') return `Vous êtes arrivé${name ? ' sur ' + name : ''}`
    if (modifier === 'left') return `Tournez à gauche ${name ? 'sur ' + name : ''} ${dist}`
    if (modifier === 'right') return `Tournez à droite ${name ? 'sur ' + name : ''} ${dist}`
    if (modifier === 'slight left') return `Restez à gauche ${name ? 'sur ' + name : ''} ${dist}`
    if (modifier === 'slight right') return `Restez à droite ${name ? 'sur ' + name : ''} ${dist}`
    if (modifier === 'straight') return `Continuez tout droit ${name ? 'sur ' + name : ''} ${dist}`
    if (type === 'roundabout') return `Prenez le rond-point ${dist}`
    return `Continuez ${name ? 'sur ' + name : ''} ${dist}`
  }

  const getStepIcon = (step) => {
    if (!step) return '➡️'
    const type = step.maneuver?.type || ''
    const mod = step.maneuver?.modifier || ''
    if (type === 'depart') return '🚦'
    if (type === 'arrive') return '🅿️'
    if (mod === 'left') return '⬅️'
    if (mod === 'right') return '➡️'
    if (mod === 'slight left') return '↖️'
    if (mod === 'slight right') return '↗️'
    if (mod === 'straight') return '⬆️'
    if (type === 'roundabout') return '🔄'
    return '⬆️'
  }

  const co2Saved = routeInfo ? Math.round(routeInfo.dist * 0.00012 * 100) / 100 : 0
  const price = routeInfo ? (Math.ceil(routeInfo.mins / 30) * 1.2).toFixed(2) : 0

  const initials = user?.email?.slice(0, 2).toUpperCase() || '?'

  const currentStepData = routeInfo?.steps?.[currentStep]

  return (
    <ProtectedRoute>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#160C6B', fontFamily: 'sans-serif', overflow: 'hidden' }}>

        {/* ── OVERLAY GPS ── */}
        {navMode && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: '#0d0a3e', display: 'flex', flexDirection: 'column'
          }}>
            {/* Instruction courante */}
            <div style={{
              background: '#3D2CD5', padding: '1.5rem',
              paddingTop: 'calc(1.5rem + env(safe-area-inset-top))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{getStepIcon(currentStepData)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', lineHeight: '1.3' }}>
                    {formatStep(currentStepData)}
                  </div>
                  {currentStepData?.distance > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>
                      Dans {Math.round(currentStepData.distance)} m
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Carte en mode nav */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Map sensors={sensors} onRouteFound={setRouteInfo} />

              {/* Contrôles étapes */}
              <div style={{
                position: 'absolute', bottom: '1rem', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', gap: '0.5rem', zIndex: 100
              }}>
                <button onClick={prevStep} style={{
                  background: 'rgba(22,12,107,0.9)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', padding: '0.6rem 1rem', color: '#fff',
                  fontSize: '0.85rem', cursor: 'pointer'
                }}>← Préc.</button>
                <button onClick={nextStep} style={{
                  background: '#00FF66', border: 'none',
                  borderRadius: '10px', padding: '0.6rem 1.2rem', color: '#0A0040',
                  fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
                }}>Suiv. →</button>
              </div>
            </div>

            {/* Panneau bas GPS */}
            <div style={{
              background: 'rgba(22,12,107,0.97)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              padding: '1.2rem 1.5rem',
              paddingBottom: 'calc(1.2rem + env(safe-area-inset-bottom))'
            }}>
              {/* Stats trajet */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00FF66' }}>{routeInfo?.mins} min</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Temps estimé</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                    {routeInfo?.dist > 1000 ? `${(routeInfo.dist / 1000).toFixed(1)} km` : `${Math.round(routeInfo?.dist || 0)} m`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Distance</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00FF66' }}>-{co2Saved} kg</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>CO₂ économisé</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFB800' }}>{price}€</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Stationnement</div>
                </div>
              </div>

              {/* Destination + stop */}
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Destination</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>🅿️ {routeInfo?.street}</div>
                </div>
                <button onClick={stopNavigation} style={{
                  background: 'rgba(255,77,109,0.15)', border: '1px solid rgba(255,77,109,0.3)',
                  borderRadius: '10px', padding: '0.7rem 1.2rem',
                  color: '#FF4D6D', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer'
                }}>
                  ✕ Arrêter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── HEADER ── */}
        <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 100 }}>
          <div style={{ height: '52px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {sidebarOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="2" y1="2" x2="16" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="2" x2="2" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="2" y1="4" x2="16" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="2" y1="9" x2="16" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>

            <div className="logo-desktop">
              <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={120} height={32} style={{ objectFit: 'contain', display: 'block' }} />
            </div>
            <div className="logo-mobile">
              <Image src="/Logo-RBG_Fyndzz.png" alt="Fyndzz" width={32} height={32} style={{ objectFit: 'contain', display: 'block' }} />
            </div>

            <form onSubmit={handleSearch} className="search-desktop" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0 12px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une destination..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '12px', padding: '7px 0' }} />
              {search && (
                <button type="submit" style={{ background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Y aller →
                </button>
              )}
              {searching && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>...</span>}
            </form>

            <Link href="/profile" style={{ textDecoration: 'none', flexShrink: 0, marginLeft: 'auto' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #3D2CD5, #00FF66)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', cursor: 'pointer' }}>
                {initials}
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="search-mobile" style={{ display: 'none', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', margin: '0 12px 10px', padding: '0 12px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une destination..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '12px', padding: '10px 0' }} />
            {search && (
              <button type="submit" style={{ background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Y aller →
              </button>
            )}
          </form>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Map sensors={sensors} onRouteFound={(info) => { setRouteInfo(info); setNavMode(false) }} />
          </div>

          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)} className="mobile-overlay" style={{ display: 'none', position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9 }} />
          )}

          <div style={{ width: sidebarOpen ? '230px' : '0', flexShrink: 0, background: 'rgba(22,12,107,0.97)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s ease', zIndex: 10, position: 'relative' }}>
            <div style={{ width: '230px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', fontWeight: '600' }}>Temps réel</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>Places libres</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#00FF66' }}>{free}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>Occupées</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#FF4D6D' }}>{taken}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>Capteurs actifs</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{sensors.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  <span>Occupation</span><span>{pct}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '5px' }}>
                  <div style={{ width: `${pct}%`, height: '5px', borderRadius: '4px', background: pct > 70 ? '#FF4D6D' : pct > 40 ? '#FFB800' : '#00FF66', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div style={{ padding: '14px 16px', flex: 1 }}>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', fontWeight: '600' }}>Par rue</div>
                {Object.entries(byStreet).map(([street, data]) => {
                  const streetPct = Math.round((data.free / data.total) * 100)
                  const color = streetPct > 50 ? '#00FF66' : streetPct > 20 ? '#FFB800' : '#FF4D6D'
                  return (
                    <div key={street} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{street}</span>
                        <span style={{ fontSize: '10px', color, flexShrink: 0 }}>{data.free}/{data.total}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '3px', height: '4px' }}>
                        <div style={{ width: `${streetPct}%`, height: '4px', borderRadius: '3px', background: color, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Mise à jour en temps réel</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANNEAU ROUTE TROUVÉE ── */}
        {routeInfo && !navMode && (
          <div style={{
            flexShrink: 0,
            background: 'rgba(22,12,107,0.98)',
            borderTop: '1px solid rgba(0,255,102,0.3)',
            padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem' }}>Place trouvée</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>🅿️ {routeInfo.street}</div>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00FF66' }}>{routeInfo.mins} min</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>Trajet</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                  {routeInfo.dist > 1000 ? `${(routeInfo.dist / 1000).toFixed(1)}km` : `${Math.round(routeInfo.dist)}m`}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>Distance</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00FF66' }}>-{co2Saved}kg</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>CO₂</div>
              </div>
            </div>
            <button
              onClick={() => { setNavMode(true); startNavigation() }}
              style={{
                background: '#00FF66', color: '#0A0040',
                border: 'none', borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontWeight: '800', fontSize: '0.95rem',
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              ▶ Démarrer
            </button>
            <button onClick={() => setRouteInfo(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.75rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>
              ✕
            </button>
          </div>
        )}

        {/* ── BOTTOM BAR ── */}
        <div className="bottom-bar" style={{
          flexShrink: 0, height: '64px',
          background: 'rgba(22,12,107,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          padding: '0 16px', zIndex: 100
        }}>
          <Link href="/profile" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>Profil</span>
          </Link>
          <Link href="/map" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#00FF66', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-8px', boxShadow: '0 0 20px rgba(0,255,102,0.4)', border: '3px solid rgba(22,12,107,0.97)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#0A0040" strokeWidth="2"/>
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#0A0040" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '10px', color: '#00FF66', fontWeight: '700' }}>Carte</span>
          </Link>
          <Link href="/payment" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
              <line x1="2" y1="10" x2="22" y2="10" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
              <rect x="5" y="13" width="4" height="2" rx="1" fill="rgba(255,255,255,0.45)"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>Paiement</span>
          </Link>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-overlay { display: block !important; }
            .logo-desktop { display: none !important; }
            .logo-mobile { display: block !important; }
            .search-desktop { display: none !important; }
            .search-mobile { display: flex !important; }
          }
          @media (min-width: 769px) {
            .logo-desktop { display: block !important; }
            .logo-mobile { display: none !important; }
            .search-desktop { display: flex !important; }
            .search-mobile { display: none !important; }
          }
          @supports (padding-bottom: env(safe-area-inset-bottom)) {
            .bottom-bar {
              padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
              height: auto;
              min-height: 64px;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}