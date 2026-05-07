'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, Briefcase, MapPin, Volume2, VolumeX, Ruler, Save, Search } from 'lucide-react'
import { getSpotifyAuthUrl } from '@/lib/spotify'

const BRAND_GRADIENT = "bg-gradient-to-b from-[#160C6B] to-[#3D2CD5]"

const FAVS = [
  { key: 'home', icon: Home, label: 'Maison', color: '#00FF66' },
  { key: 'work', icon: Briefcase, label: 'Travail', color: '#3D2CD5' },
  { key: '3', icon: MapPin, label: 'Favori 3', color: '#FFB800' },
  { key: '4', icon: MapPin, label: 'Favori 4', color: '#FF4D6D' },
  { key: '5', icon: MapPin, label: 'Favori 5', color: '#A78BFA' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [searchingFav, setSearchingFav] = useState(null)
  const [favSearch, setFavSearch] = useState('')
  const [favSuggestions, setFavSuggestions] = useState([])
  const [spotifyConnected, setSpotifyConnected] = useState(false)

  const [settings, setSettings] = useState({
    gps_voice: true,
    units: 'km',
    avoid_tolls: false,
    avoid_highways: false,
    show_fuel: false,
    show_elec: false,
    show_sensors: true,
    fav_home: '', fav_home_lat: null, fav_home_lng: null,
    fav_work: '', fav_work_lat: null, fav_work_lng: null,
    fav_3_name: '', fav_3_lat: null, fav_3_lng: null,
    fav_4_name: '', fav_4_lat: null, fav_4_lng: null,
    fav_5_name: '', fav_5_lat: null, fav_5_lng: null,
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setSettings({
          gps_voice: data.gps_voice ?? true,
          units: data.units ?? 'km',
          avoid_tolls: data.avoid_tolls ?? false,
          avoid_highways: data.avoid_highways ?? false,
          show_fuel: data.show_fuel ?? false,
          show_elec: data.show_elec ?? false,
          show_sensors: data.show_sensors ?? true,
          fav_home: data.fav_home || '',
          fav_home_lat: data.fav_home_lat,
          fav_home_lng: data.fav_home_lng,
          fav_work: data.fav_work || '',
          fav_work_lat: data.fav_work_lat,
          fav_work_lng: data.fav_work_lng,
          fav_3_name: data.fav_3_name || '',
          fav_3_lat: data.fav_3_lat,
          fav_3_lng: data.fav_3_lng,
          fav_4_name: data.fav_4_name || '',
          fav_4_lat: data.fav_4_lat,
          fav_4_lng: data.fav_4_lng,
          fav_5_name: data.fav_5_name || '',
          fav_5_lat: data.fav_5_lat,
          fav_5_lng: data.fav_5_lng,
        })
      }

      // Vérifier connexion Spotify
      const token = localStorage.getItem('spotify_access_token')
      const expiresAt = parseInt(localStorage.getItem('spotify_expires_at') || '0')
      setSpotifyConnected(!!token && Date.now() < expiresAt)

      setLoading(false)
    }
    load()
  }, [])

  const disconnectSpotify = () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
    localStorage.removeItem('spotify_expires_at')
    setSpotifyConnected(false)
  }

  const searchFav = async (query) => {
    setFavSearch(query)
    if (query.length < 4) { setFavSuggestions([]); return }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr&addressdetails=1`)
      const data = await res.json()
      setFavSuggestions(data)
    } catch { }
  }

  const selectFav = (key, suggestion) => {
    const name = suggestion.display_name.split(',').slice(0, 2).join(',').trim()
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)
    if (key === 'home') setSettings(p => ({ ...p, fav_home: name, fav_home_lat: lat, fav_home_lng: lng }))
    else if (key === 'work') setSettings(p => ({ ...p, fav_work: name, fav_work_lat: lat, fav_work_lng: lng }))
    else setSettings(p => ({ ...p, [`fav_${key}_name`]: name, [`fav_${key}_lat`]: lat, [`fav_${key}_lng`]: lng }))
    setSearchingFav(null)
    setFavSearch('')
    setFavSuggestions([])
  }

  const clearFav = (key) => {
    if (key === 'home') setSettings(p => ({ ...p, fav_home: '', fav_home_lat: null, fav_home_lng: null }))
    else if (key === 'work') setSettings(p => ({ ...p, fav_work: '', fav_work_lat: null, fav_work_lng: null }))
    else setSettings(p => ({ ...p, [`fav_${key}_name`]: '', [`fav_${key}_lat`]: null, [`fav_${key}_lng`]: null }))
  }

  const getFavValue = (key) => {
    if (key === 'home') return settings.fav_home
    if (key === 'work') return settings.fav_work
    return settings[`fav_${key}_name`]
  }

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`w-14 h-7 rounded-full transition-all duration-300 relative ${value ? 'bg-[#00FF66]' : 'bg-white/20'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-8' : 'left-1'}`} />
    </button>
  )

  const save = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({
      gps_voice: settings.gps_voice,
      units: settings.units,
      avoid_tolls: settings.avoid_tolls,
      avoid_highways: settings.avoid_highways,
      show_fuel: settings.show_fuel,
      show_elec: settings.show_elec,
      show_sensors: settings.show_sensors,
      fav_home: settings.fav_home,
      fav_home_lat: settings.fav_home_lat,
      fav_home_lng: settings.fav_home_lng,
      fav_work: settings.fav_work,
      fav_work_lat: settings.fav_work_lat,
      fav_work_lng: settings.fav_work_lng,
      fav_3_name: settings.fav_3_name,
      fav_3_lat: settings.fav_3_lat,
      fav_3_lng: settings.fav_3_lng,
      fav_4_name: settings.fav_4_name,
      fav_4_lat: settings.fav_4_lat,
      fav_4_lng: settings.fav_4_lng,
      fav_5_name: settings.fav_5_name,
      fav_5_lat: settings.fav_5_lat,
      fav_5_lng: settings.fav_5_lng,
    }).eq('id', user.id)

    if (typeof window !== 'undefined') {
      window.__fyndzz_settings = {
        ...window.__fyndzz_settings,
        show_fuel: settings.show_fuel,
        show_elec: settings.show_elec,
        gps_voice: settings.gps_voice,
        units: settings.units,
        avoid_tolls: settings.avoid_tolls,
        avoid_highways: settings.avoid_highways,
        show_sensors: settings.show_sensors,
      }
      window.__fyndzz_reload_stations?.()
      window.__fyndzz_reload_sensors?.()
    }

    setSaving(false)
    setSuccessMsg('Paramètres sauvegardés ✓')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  if (loading) return (
    <div className={`min-h-screen ${BRAND_GRADIENT} flex items-center justify-center`}>
      <div className="w-10 h-10 border-2 border-white/20 border-t-[#00FF66] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className={`min-h-screen ${BRAND_GRADIENT} font-sans text-white pb-10`}>

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#160C6B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/map" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-black text-lg">Paramètres</span>
        <div className="flex-1" />
        {successMsg && <span className="text-[#00FF66] text-sm font-bold">{successMsg}</span>}
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00FF66] text-[#160C6B] font-black px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="max-w-lg mx-auto px-6 pt-8 space-y-8">

        {/* ── FAVORIS ── */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Lieux favoris</h2>
          <div className="space-y-3">
            {FAVS.map(({ key, icon: Icon, label, color }) => {
              const value = getFavValue(key)
              return (
                <div key={key} className="bg-white/08 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span className="font-bold text-white/80">{label}</span>
                    {value && (
                      <button onClick={() => clearFav(key)} className="ml-auto text-white/30 hover:text-red-400 text-xs font-bold transition-colors">
                        Supprimer
                      </button>
                    )}
                  </div>
                  {value ? (
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                      <MapPin size={14} style={{ color }} />
                      <span className="text-sm text-white/80 truncate">{value}</span>
                      <button onClick={() => { setSearchingFav(key); setFavSearch('') }} className="ml-auto text-white/40 hover:text-white text-xs transition-colors">
                        Modifier
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setSearchingFav(key); setFavSearch('') }} className="w-full flex items-center gap-2 bg-white/05 border border-dashed border-white/20 rounded-xl px-3 py-2 text-white/40 hover:text-white hover:border-white/40 transition-all text-sm">
                      <Search size={14} />
                      Ajouter une adresse...
                    </button>
                  )}
                  {searchingFav === key && (
                    <div className="mt-3">
                      <input
                        autoFocus
                        type="text"
                        value={favSearch}
                        onChange={e => searchFav(e.target.value)}
                        placeholder="Rechercher une adresse..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/30 outline-none focus:border-[#00FF66] text-sm"
                      />
                      {favSuggestions.length > 0 && (
                        <div className="mt-2 bg-[#1a1060] border border-white/10 rounded-xl overflow-hidden">
                          {favSuggestions.map((s, i) => (
                            <button key={i} onClick={() => selectFav(key, s)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/05 last:border-0 text-left">
                              <MapPin size={14} className="text-white/40 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-white truncate">{s.display_name.split(',')[0]}</div>
                                <div className="text-xs text-white/40 truncate">{s.display_name.split(',').slice(1, 3).join(',')}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => { setSearchingFav(null); setFavSuggestions([]) }} className="mt-2 text-xs text-white/30 hover:text-white transition-colors">
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── NAVIGATION ── */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Navigation</h2>
          <div className="space-y-3">
            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.gps_voice ? <Volume2 size={20} className="text-[#00FF66]" /> : <VolumeX size={20} className="text-white/40" />}
                <div>
                  <div className="font-bold text-white">Instructions vocales</div>
                  <div className="text-xs text-white/40">Guidage vocal pendant la navigation</div>
                </div>
              </div>
              <Toggle value={settings.gps_voice} onChange={() => setSettings(p => ({ ...p, gps_voice: !p.gps_voice }))} />
            </div>

            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFB800]/20 flex items-center justify-center"><span className="text-lg">🚧</span></div>
                <div>
                  <div className="font-bold text-white">Éviter les péages</div>
                  <div className="text-xs text-white/40">Itinéraires sans péage</div>
                </div>
              </div>
              <Toggle value={settings.avoid_tolls} onChange={() => setSettings(p => ({ ...p, avoid_tolls: !p.avoid_tolls }))} />
            </div>

            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/20 flex items-center justify-center"><span className="text-lg">🛣️</span></div>
                <div>
                  <div className="font-bold text-white">Éviter les autoroutes</div>
                  <div className="text-xs text-white/40">Privilégier les routes secondaires</div>
                </div>
              </div>
              <Toggle value={settings.avoid_highways} onChange={() => setSettings(p => ({ ...p, avoid_highways: !p.avoid_highways }))} />
            </div>
          </div>
        </section>

        {/* ── CARTE ── */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Carte</h2>
          <div className="space-y-3">
            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00FF66]/20 flex items-center justify-center"><span className="text-lg">🟢</span></div>
                <div>
                  <div className="font-bold text-white">Capteurs de stationnement</div>
                  <div className="text-xs text-white/40">Afficher les places libres/occupées</div>
                </div>
              </div>
              <Toggle value={settings.show_sensors} onChange={() => setSettings(p => ({ ...p, show_sensors: !p.show_sensors }))} />
            </div>

            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFB800]/20 flex items-center justify-center"><span className="text-lg">⛽</span></div>
                <div>
                  <div className="font-bold text-white">Stations essence</div>
                  <div className="text-xs text-white/40">Afficher sur la carte avec les prix</div>
                </div>
              </div>
              <Toggle value={settings.show_fuel} onChange={() => setSettings(p => ({ ...p, show_fuel: !p.show_fuel }))} />
            </div>

            <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3D2CD5]/30 flex items-center justify-center"><span className="text-lg">⚡</span></div>
                <div>
                  <div className="font-bold text-white">Bornes électriques</div>
                  <div className="text-xs text-white/40">Afficher les bornes de recharge</div>
                </div>
              </div>
              <Toggle value={settings.show_elec} onChange={() => setSettings(p => ({ ...p, show_elec: !p.show_elec }))} />
            </div>
          </div>
        </section>

        {/* ── AFFICHAGE ── */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Affichage</h2>
          <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ruler size={20} className="text-[#00FF66]" />
              <div>
                <div className="font-bold text-white">Unités de distance</div>
                <div className="text-xs text-white/40">Kilomètres ou miles</div>
              </div>
            </div>
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              {['km', 'mi'].map(unit => (
                <button
                  key={unit}
                  onClick={() => setSettings(p => ({ ...p, units: unit }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${settings.units === unit ? 'bg-[#00FF66] text-[#160C6B]' : 'text-white/50 hover:text-white'}`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPOTIFY ── */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Musique</h2>
          <div className="bg-white/08 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(29,185,84,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-white">Spotify</div>
                <div className="text-xs text-white/40">
                  {spotifyConnected ? '✓ Compte connecté · Premium requis' : 'Non connecté · Premium requis'}
                </div>
              </div>
            </div>

            {spotifyConnected ? (
              <button
                onClick={disconnectSpotify}
                className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-400/10 px-3 py-1.5 rounded-xl transition-colors"
              >
                Déconnecter
              </button>
            ) : (
              <button
                onClick={() => window.location.href = getSpotifyAuthUrl()}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                style={{ background: '#1DB954', color: 'white' }}
              >
                Connecter
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}