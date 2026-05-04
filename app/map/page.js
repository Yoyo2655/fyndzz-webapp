'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import SimulateGPS from '@/components/SimulateGPS'
import { 
  Search, 
  Menu, 
  X, 
  Navigation, 
  Mic, 
  ChevronUp, 
  Navigation2, 
  User, 
  Settings, 
  LogOut,
  MapPin,
  Clock,
  Zap
} from 'lucide-react'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

// --- CONSTANTES DESIGN FYNDZZ ---
const BRAND_GRADIENT = "bg-gradient-to-b from-[#160C6B] to-[#3D2CD5]";
const ACCENT_GREEN = "#00FF66";

export default function MapPage() {
  // ─── ÉTAT ET LOGIQUE (CONSERVÉS À L'IDENTIQUE) ───
  const [sensors, setSensors] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [routeInfo, setRouteInfo] = useState(null)
  const [navMode, setNavMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)

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
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', data.user.id)
          .single()
        if (profile?.first_name || profile?.last_name) {
          setInitials(
            `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
          )
        } else {
          setInitials(data.user.email?.slice(0, 2).toUpperCase() || '?')
        }
      }
    })
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
    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
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

  const handleSearchInput = (value) => {
    setSearch(value)
    clearTimeout(debounceRef.current)
    if (!value.trim() || value.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=fr&addressdetails=1`
        )
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (err) { console.error(err) }
    }, 300)
  }

  const selectSuggestion = (suggestion) => {
    setSearch(suggestion.display_name.split(',')[0])
    setShowSuggestions(false)
    setSuggestions([])
    window.__fyndzz_destination = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    }
    window.__fyndzz_search_trigger?.()
  }

  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'fr-FR'
    utt.rate = 1.05
    window.speechSynthesis.speak(utt)
  }, [])

  const handleStepAdvance = useCallback((newStep) => {
    setCurrentStep(newStep)
    const step = routeInfo?.steps?.[newStep]
    if (step) speak(formatStep(step))
  }, [routeInfo, speak])

  const startNavigation = () => {
    setNavMode(true)
    setCurrentStep(0)
    const firstStep = routeInfo?.steps?.[0]
    if (firstStep) speak(formatStep(firstStep))
  }

  const stopNavigation = () => {
    setNavMode(false)
    setRouteInfo(null)
    setCurrentStep(0)
    window.speechSynthesis?.cancel()
    window.__fyndzz_clear_route?.()
  }

  const formatStep = (step) => {
    if (!step) return ''
    const type = step.maneuver?.type || ''
    const mod = step.maneuver?.modifier || ''
    const name = step.name || ''
    const dist = step.distance ? `dans ${Math.round(step.distance)} mètres` : ''
    if (type === 'depart') return `Démarrez ${name ? 'sur ' + name : ''}`
    if (type === 'arrive') return `Vous êtes arrivé ${name ? 'sur ' + name : ''}. Bonne journée !`
    if (mod === 'left') return `Tournez à gauche ${name ? 'sur ' + name : ''} ${dist}`
    if (mod === 'right') return `Tournez à droite ${name ? 'sur ' + name : ''} ${dist}`
    if (mod === 'slight left') return `Restez à gauche ${name ? 'sur ' + name : ''} ${dist}`
    if (mod === 'slight right') return `Restez à droite ${name ? 'sur ' + name : ''} ${dist}`
    if (mod === 'straight') return `Continuez tout droit ${name ? 'sur ' + name : ''} ${dist}`
    if (type === 'roundabout') return `Prenez le rond-point ${dist}`
    return `Continuez ${name ? 'sur ' + name : ''} ${dist}`
  }

  const getStepIcon = (step) => {
    if (!step) return '⬆️'
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
  const [initials, setInitials] = useState('?')
  const currentStepData = routeInfo?.steps?.[currentStep]
  const totalSteps = routeInfo?.steps?.length || 0
  const walkDistLabel = routeInfo?.walkDist ? (routeInfo.walkDist > 1000 ? `${(routeInfo.walkDist / 1000).toFixed(1)}km` : `${routeInfo.walkDist}m`) : null

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-screen overflow-hidden bg-[#160C6B] font-sans selection:bg-[#00FF66]">
        
        {/* ── CARTE (Z-INDEX 1) ── */}
        <div className="absolute inset-0 z-0">
          <Map
            sensors={sensors}
            onRouteFound={(info) => { setRouteInfo(info); setNavMode(false) }}
            navMode={navMode}
            currentStep={currentStep}
            onStepAdvance={handleStepAdvance}
          />
          {process.env.NODE_ENV === 'development' && (
            <SimulateGPS routeInfo={routeInfo} onStepAdvance={handleStepAdvance} />
          )}
        </div>

        {/* ══════════════ MODE NAVIGATION (Z-INDEX 50) ══════════════ */}
        {navMode && (
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col">
            {/* Bandeau d'instruction (Haut) */}
            <div className={`pointer-events-auto p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] ${BRAND_GRADIENT} rounded-b-[2.5rem] shadow-2xl border-b border-white/10 animate-in slide-in-from-top duration-500`}>
              <div className="max-w-xl mx-auto flex items-center gap-4">
                <div className="w-14 h-14 bg-[#00FF66] rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[#00FF66]/30">
                  {getStepIcon(currentStepData)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-black text-xl leading-tight">
                    {formatStep(currentStepData)}
                  </div>
                  {currentStepData?.distance > 0 && (
                    <div className="text-white/60 font-bold text-sm mt-1">
                      <span className="text-[#00FF66]">
                        {currentStepData.distance > 1000 ? `${(currentStepData.distance / 1000).toFixed(1)} km` : `${Math.round(currentStepData.distance)} m`}
                      </span>
                      <span className="mx-2 opacity-30">|</span>
                      Étape {currentStep + 1}/{totalSteps}
                    </div>
                  )}
                </div>
                <button onClick={stopNavigation} className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="max-w-xl mx-auto mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FF66] transition-all duration-700" 
                  style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="flex-1" />

            {/* Panneau Stats GPS (Bas) */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] rounded-t-[3rem] shadow-[0_-15px_40px_-10px_rgba(22,12,107,0.2)] border-t border-slate-100 animate-in slide-in-from-bottom duration-500">
               <div className="max-w-xl mx-auto flex flex-col gap-6">
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#160C6B]">{routeInfo?.mins} min</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Temps</div>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-100" />
                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-800">
                        {routeInfo?.dist > 1000 ? `${(routeInfo.dist / 1000).toFixed(1)}km` : `${Math.round(routeInfo?.dist || 0)}m`}
                      </div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Distance</div>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-100" />
                    <div className="text-center">
                      <div className="text-2xl font-black text-[#00FF66]">-{co2Saved}kg</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">CO₂ Évité</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#3D2CD5] rounded-xl flex items-center justify-center text-white">
                        <MapPin size={20} />
                      </div>
                      <div className="font-bold text-slate-700 truncate max-w-[200px]">
                        {routeInfo?.street}
                      </div>
                    </div>
                    <div className="text-amber-500 font-black text-lg">{price}€</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ══════════════ MODE NORMAL (Z-INDEX 40) ══════════════ */}
        {!navMode && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col">
            
            {/* Header Flottant (Waze Style) */}
            <div className="pointer-events-auto p-4 flex items-center gap-3 max-w-2xl w-full mx-auto mt-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${BRAND_GRADIENT}`}
              >
                <Menu size={24} />
              </button>
              
              <div className="flex-1 relative">
                <div className="bg-white h-14 rounded-2xl shadow-xl flex items-center px-5 gap-3 border border-slate-100">
                  <Search size={20} className="text-slate-400 flex-shrink-0" />
                  <form onSubmit={handleSearch} className="flex-1">
                    <input 
                      type="text" 
                      value={search}
                      onChange={e => handleSearchInput(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      placeholder="Où va-t-on ?" 
                      className="w-full outline-none text-slate-800 font-bold placeholder-slate-400 bg-transparent text-lg"
                    />
                  </form>
                  {search && !searching && (
                    <button 
                      onClick={handleSearch} 
                      className="text-white bg-[#3D2CD5] font-black text-sm px-3 py-1.5 rounded-xl flex-shrink-0"
                    >
                      Aller
                    </button>
                  )}
                  {searching && (
                    <div className="w-5 h-5 border-2 border-[#3D2CD5] border-t-transparent animate-spin rounded-full flex-shrink-0" />
                  )}
                </div>

                {/* Liste de suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    {suggestions.map((s, i) => {
                      const main = s.display_name.split(',')[0]
                      const secondary = s.display_name.split(',').slice(1, 3).join(',').trim()
                      return (
                        <button
                          key={i}
                          onMouseDown={() => selectSuggestion(s)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                        >
                          <div className="w-8 h-8 bg-[#3D2CD5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} className="text-[#3D2CD5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-sm truncate">{main}</div>
                            <div className="text-slate-400 text-xs truncate">{secondary}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <Link href="/profile" className="w-14 h-14 rounded-2xl shadow-xl overflow-hidden border-2 border-white hover:scale-105 transition-transform bg-white flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-[#160C6B] font-black text-lg bg-gradient-to-br from-[#00FF66]/20 to-[#3D2CD5]/20">
                  {initials}
                </div>
              </Link>
            </div>

            {/* Sidebar / Drawer (Gauche) */}
            <div className={`pointer-events-auto absolute inset-y-0 left-0 w-80 shadow-2xl z-50 transform transition-transform duration-500 ease-out p-6 flex flex-col rounded-r-[3rem] ${BRAND_GRADIENT} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex items-center justify-between mb-8">
                <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={140} height={40} className="object-contain" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white/10 rounded-full text-white/60 hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Stats Section */}
                <div className="bg-white/10 p-5 rounded-3xl text-white border border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">Temps Réel</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <div className="text-[#00FF66] text-2xl font-black">{free}</div>
                      <div className="text-[10px] font-bold opacity-80">Libres</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl">
                      <div className="text-white text-2xl font-black">{sensors.length}</div>
                      <div className="text-[10px] font-bold opacity-80">Total</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-white/60">
                      <span>Occupation</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div className="h-full rounded-full" style={{ 
                        width: `${pct}%`,
                        background: pct > 70 ? '#FF4D6D' : pct > 50 ? '#FFB800' : '#00FF66'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Street List */}
                <div className="space-y-3">
                  <h3 className="text-white/40 font-black text-[10px] uppercase tracking-widest">Places par rue</h3>
                  {Object.entries(byStreet).map(([street, data]) => (
                    <div key={street} className="flex flex-col gap-1.5 p-3 hover:bg-white/10 rounded-2xl transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm truncate max-w-[150px]">{street}</span>
                        {(() => {
                          const ratio = data.free / data.total
                          const color = ratio <= 0.2 ? '#FF4D6D' : ratio <= 0.5 ? '#FFB800' : '#00FF66'
                          return (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md" style={{ color, background: `${color}20` }}>
                              {data.free}/{data.total}
                            </span>
                          )
                        })()}
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full" style={{ 
                          width: `${(data.free / data.total) * 100}%`,
                          background: data.free / data.total <= 0.2 ? '#FF4D6D' : data.free / data.total <= 0.5 ? '#FFB800' : '#00FF66'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <Link href="/profile" className="flex items-center gap-4 p-4 rounded-2xl font-bold text-white/70 hover:bg-white/10 transition-colors">
                  <Settings size={20} /> Paramètres
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={20} /> Déconnexion
                </button>
              </div>
            </div>

            <div className="flex-1" />

            {/* Barre d'info "Route trouvée" (Waze ETA Bubble) */}
            {routeInfo && (
              <div className="pointer-events-auto mx-4 mb-24 max-w-xl self-center bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(22,12,107,0.25)] border border-slate-100 p-6 flex flex-col gap-6 animate-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#160C6B]">{routeInfo.mins} min</span>
                      <span className="text-slate-400 font-bold text-lg">{price}€</span>
                    </div>
                    <div className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
                      <MapPin size={14} className="text-[#3D2CD5]" /> {routeInfo.street}
                    </div>
                  </div>
                  <button onClick={() => setRouteInfo(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"><X size={18}/></button>
                </div>

                <div className="flex gap-4">
                   <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="bg-emerald-50 p-3 rounded-2xl flex flex-col">
                        <span className="text-emerald-600 font-black text-xs uppercase">CO₂</span>
                        <span className="text-emerald-700 font-black">-{co2Saved}kg</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl flex flex-col">
                        <span className="text-slate-400 font-black text-xs uppercase">Distance</span>
                        <span className="text-slate-700 font-black">{routeInfo.dist > 1000 ? `${(routeInfo.dist / 1000).toFixed(1)}km` : `${Math.round(routeInfo.dist)}m`}</span>
                      </div>
                   </div>
                   <button 
                    onClick={startNavigation}
                    className={`${BRAND_GRADIENT} text-white px-8 h-16 rounded-2xl font-black text-xl shadow-xl shadow-[#3D2CD5]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3`}
                  >
                    <span>Y ALLER</span>
                    <Navigation size={22} fill="currentColor" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Nav Bar (Waze Mobile Style) */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur-xl h-20 border-t border-slate-100 flex items-center justify-around px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
              <Link href="/profile" className="flex flex-col items-center gap-1 group">
                <User size={22} className="text-slate-400 group-hover:text-[#3D2CD5] transition-colors" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-[#3D2CD5]">Profil</span>
              </Link>
              
              <Link href="/map" className="relative -mt-10 group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 border-4 border-white ${BRAND_GRADIENT}`}>
                  <Navigation size={28} className="text-[#00FF66]" fill="currentColor" />
                </div>
              </Link>

              <Link href="/payment" className="flex flex-col items-center gap-1 group">
                <Zap size={22} className="text-slate-400 group-hover:text-[#00FF66] transition-colors" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-[#00FF66]">Premium</span>
              </Link>
            </div>
          </div>
        )}

        {/* Bouton Recentrer Flottant (Toujours visible au dessus de la carte) */}
        {!navMode && (
          <button 
            className="absolute right-6 bottom-32 z-40 bg-white p-4 rounded-2xl shadow-xl text-[#3D2CD5] hover:scale-110 active:scale-90 transition-all border border-slate-100"
            onClick={() => window.__fyndzz_recenter?.()}
          >
            <Navigation2 size={24} fill="currentColor" />
          </button>
        )}

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          @supports (padding-bottom: env(safe-area-inset-bottom)) {
            .bottom-bar { padding-bottom: env(safe-area-inset-bottom); }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}