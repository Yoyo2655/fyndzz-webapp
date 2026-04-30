'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COLORS = ['#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706']

const emptyVehicle = { plate: '', brand: '', model: '', year: '', color: '', energy: '' }

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('infos')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '',
    address: '', city: '', postal_code: '', country: ''
  })

  const [vehicles, setVehicles] = useState([
    { ...emptyVehicle }, { ...emptyVehicle },
    { ...emptyVehicle }, { ...emptyVehicle }
  ])
  const [defaultVehicle, setDefaultVehicle] = useState(1)
  const [activeVehicle, setActiveVehicle] = useState(1)
  const [vehicleCount, setVehicleCount] = useState(1)

  // Sécurité
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data) { setLoading(false); return }

      setProfile({ ...data, email: user.email })
      setForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        country: data.country || 'France'
      })

      // Charger les 4 véhicules
      const v = [
        { plate: data.plate || '', brand: data.vehicle_brand || '', model: data.vehicle_model || '', year: data.vehicle_year || '', color: data.vehicle_color || '', energy: data.vehicle_energy || '' },
        { plate: data.vehicle2_plate || '', brand: data.vehicle2_brand || '', model: data.vehicle2_model || '', year: data.vehicle2_year || '', color: data.vehicle2_color || '', energy: data.vehicle2_energy || '' },
        { plate: data.vehicle3_plate || '', brand: data.vehicle3_brand || '', model: data.vehicle3_model || '', year: data.vehicle3_year || '', color: data.vehicle3_color || '', energy: data.vehicle3_energy || '' },
        { plate: data.vehicle4_plate || '', brand: data.vehicle4_brand || '', model: data.vehicle4_model || '', year: data.vehicle4_year || '', color: data.vehicle4_color || '', energy: data.vehicle4_energy || '' },
      ]
      setVehicles(v)
      setDefaultVehicle(data.default_vehicle || 1)
      setActiveVehicle(data.active_vehicle || 1)

      // Compter les véhicules renseignés
      const count = v.filter(veh => veh.plate || veh.brand).length
      setVehicleCount(Math.max(1, count))
      setLoading(false)
    }
    load()
  }, [])

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const updateVehicle = (idx, key, val) => {
    const copy = [...vehicles]
    copy[idx] = { ...copy[idx], [key]: val }
    setVehicles(copy)
  }

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }
  const showError = (msg) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 3000) }

  const saveInfos = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update({
      first_name: form.first_name,
      last_name: form.last_name,
      full_name: `${form.first_name} ${form.last_name}`,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postal_code: form.postal_code,
      country: form.country
    }).eq('id', user.id)
    setSaving(false)
    if (error) showError('Erreur lors de la sauvegarde')
    else showSuccess('Informations mises à jour ✓')
  }

  const saveVehicles = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const v = vehicles
    const { error } = await supabase.from('profiles').update({
      plate: v[0].plate, vehicle_brand: v[0].brand, vehicle_model: v[0].model, vehicle_year: v[0].year, vehicle_color: v[0].color, vehicle_energy: v[0].energy,
      vehicle2_plate: v[1].plate, vehicle2_brand: v[1].brand, vehicle2_model: v[1].model, vehicle2_year: v[1].year, vehicle2_color: v[1].color, vehicle2_energy: v[1].energy,
      vehicle3_plate: v[2].plate, vehicle3_brand: v[2].brand, vehicle3_model: v[2].model, vehicle3_year: v[2].year, vehicle3_color: v[2].color, vehicle3_energy: v[2].energy,
      vehicle4_plate: v[3].plate, vehicle4_brand: v[3].brand, vehicle4_model: v[3].model, vehicle4_year: v[3].year, vehicle4_color: v[3].color, vehicle4_energy: v[3].energy,
      default_vehicle: defaultVehicle,
      active_vehicle: activeVehicle
    }).eq('id', user.id)
    setSaving(false)
    if (error) showError('Erreur lors de la sauvegarde')
    else showSuccess('Véhicules mis à jour ✓')
  }

  const changeEmail = async () => {
    if (!newEmail) return
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) showError(error.message)
    else { showSuccess('Email mis à jour — vérifie ta boîte mail ✓'); setNewEmail('') }
  }

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) { showError('6 caractères minimum'); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) showError(error.message)
    else { showSuccess('Mot de passe mis à jour ✓'); setNewPassword('') }
  }

  const deleteAccount = async () => {
    if (confirmDelete !== 'SUPPRIMER') { showError('Tape SUPPRIMER pour confirmer'); return }
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const fetchVehicleAuto = async (idx) => {
    const plate = vehicles[idx].plate
    if (!plate) return
    try {
      const res = await fetch(`https://api-lapi.com/lapi/immat/json/${plate.replace(/\s|-/g, '')}`)
      const data = await res.json()
      if (data?.marque) {
        const copy = [...vehicles]
        copy[idx] = { ...copy[idx], brand: data.marque || '', model: data.modele || '', year: data.annee || '', color: data.couleur || '', energy: data.energie || '' }
        setVehicles(copy)
      }
    } catch { }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #00FF66', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || '?'
  const avatarColor = COLORS[(profile?.first_name?.charCodeAt(0) || 0) % COLORS.length]

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box'
  }
  const labelStyle = { display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }
  const sectionTitle = { fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00FF66', fontWeight: '700', marginBottom: '1rem' }

  const tabs = [
    { id: 'infos', label: 'Mes infos' },
    { id: 'vehicles', label: 'Véhicules' },
    { id: 'stats', label: 'Stats' },
    { id: 'security', label: 'Sécurité' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff', paddingBottom: '2rem' }}>
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
        select option { background: #1e1a6e; color: #fff; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/map" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
        <span style={{ fontWeight: '700', fontSize: '1rem' }}>Mon profil</span>
      </div>

      {/* AVATAR + NOM */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: avatarColor, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.6rem', fontWeight: '800',
          marginBottom: '0.8rem', boxShadow: `0 0 24px ${avatarColor}55`
        }}>
          {initials}
        </div>
        <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{profile?.first_name} {profile?.last_name}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{profile?.email}</div>
        <div style={{ marginTop: '0.5rem', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.25)', color: '#00FF66', fontSize: '0.7rem', fontWeight: '700', padding: '0.25rem 0.8rem', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Bêta testeur
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', padding: '0 1.5rem', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '0.5rem 1.1rem', borderRadius: '100px', border: 'none',
            background: activeTab === t.id ? '#00FF66' : 'rgba(255,255,255,0.08)',
            color: activeTab === t.id ? '#0A0040' : 'rgba(255,255,255,0.6)',
            fontWeight: activeTab === t.id ? '700' : '400',
            fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TOAST */}
      {successMsg && (
        <div style={{ margin: '0 1.5rem 1rem', padding: '0.8rem 1rem', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.3)', borderRadius: '10px', color: '#00FF66', fontSize: '0.88rem' }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ margin: '0 1.5rem 1rem', padding: '0.8rem 1rem', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: '10px', color: '#FF4D6D', fontSize: '0.88rem' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ padding: '0 1.5rem', maxWidth: '600px', margin: '0 auto' }}>

        {/* ── INFOS ── */}
        {activeTab === 'infos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={sectionTitle}>Informations personnelles</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input style={inputStyle} value={form.first_name} onChange={e => update('first_name', e.target.value)} placeholder="Marie" />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input style={inputStyle} value={form.last_name} onChange={e => update('last_name', e.target.value)} placeholder="Dupont" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Téléphone</label>
              <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+33 6 00 00 00 00" type="tel" />
            </div>

            <div style={{ ...sectionTitle, marginTop: '0.5rem' }}>Adresse</div>

            <div>
              <label style={labelStyle}>Rue</label>
              <input style={inputStyle} value={form.address} onChange={e => update('address', e.target.value)} placeholder="12 rue de la Paix" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Code postal</label>
                <input style={inputStyle} value={form.postal_code} onChange={e => update('postal_code', e.target.value)} placeholder="75001" />
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} placeholder="Paris" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Pays</label>
              <select value={form.country} onChange={e => update('country', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Maroc">Maroc</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <button onClick={saveInfos} disabled={saving} style={{
              padding: '0.9rem', background: '#00FF66', color: '#0A0040',
              border: 'none', borderRadius: '10px', fontWeight: '700',
              fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem'
            }}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        )}

        {/* ── VÉHICULES ── */}
        {activeTab === 'vehicles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={sectionTitle}>Mes véhicules ({vehicleCount}/4)</div>

            {/* Véhicule actif temporaire */}
            <div style={{ background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#00FF66', fontWeight: '700', marginBottom: '0.6rem' }}>Véhicule actif maintenant</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from({ length: vehicleCount }).map((_, i) => {
                  const v = vehicles[i]
                  if (!v.plate && !v.brand) return null
                  return (
                    <button key={i} onClick={() => setActiveVehicle(i + 1)} style={{
                      padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: activeVehicle === i + 1 ? '#00FF66' : 'rgba(255,255,255,0.1)',
                      color: activeVehicle === i + 1 ? '#0A0040' : '#fff',
                      fontWeight: activeVehicle === i + 1 ? '700' : '400', fontSize: '0.85rem'
                    }}>
                      {v.brand || v.plate || `Voiture ${i + 1}`}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Liste des véhicules */}
            {Array.from({ length: Math.min(vehicleCount + (vehicleCount < 4 ? 1 : 0), 4) }).map((_, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${defaultVehicle === idx + 1 ? 'rgba(0,255,102,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: defaultVehicle === idx + 1 ? '#00FF66' : 'rgba(255,255,255,0.6)' }}>
                    Voiture {idx + 1} {defaultVehicle === idx + 1 ? '· Par défaut' : ''}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {defaultVehicle !== idx + 1 && (vehicles[idx].plate || vehicles[idx].brand) && (
                      <button onClick={() => setDefaultVehicle(idx + 1)} style={{ fontSize: '0.72rem', color: '#00FF66', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
                        Définir par défaut
                      </button>
                    )}
                    {idx > 0 && (vehicles[idx].plate || vehicles[idx].brand) && (
                      <button onClick={() => {
                        const copy = [...vehicles]
                        copy[idx] = { ...emptyVehicle }
                        setVehicles(copy)
                        setVehicleCount(prev => Math.max(1, prev - 1))
                      }} style={{ fontSize: '0.72rem', color: '#FF4D6D', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>

                {/* Plaque + Auto */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="AB-123-CD"
                    value={vehicles[idx].plate}
                    onChange={e => {
                      updateVehicle(idx, 'plate', e.target.value.toUpperCase())
                      if (idx >= vehicleCount) setVehicleCount(idx + 1)
                    }}
                  />
                  <button type="button" onClick={() => fetchVehicleAuto(idx)} style={{
                    padding: '0 0.9rem', background: 'rgba(0,255,102,0.1)',
                    border: '1px solid rgba(0,255,102,0.25)', borderRadius: '10px',
                    color: '#00FF66', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}>
                    🔍 Auto
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { key: 'brand', label: 'Marque', placeholder: 'Renault' },
                    { key: 'model', label: 'Modèle', placeholder: 'Clio' },
                    { key: 'year', label: 'Année', placeholder: '2020' },
                    { key: 'color', label: 'Couleur', placeholder: 'Blanc' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input style={inputStyle} placeholder={placeholder} value={vehicles[idx][key]}
                        onChange={e => updateVehicle(idx, key, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <label style={labelStyle}>Énergie</label>
                  <select value={vehicles[idx].energy} onChange={e => updateVehicle(idx, 'energy', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Sélectionner</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Électrique">Électrique</option>
                    <option value="Hybride">Hybride</option>
                    <option value="GPL">GPL</option>
                  </select>
                </div>
              </div>
            ))}

            <button onClick={saveVehicles} disabled={saving} style={{
              padding: '0.9rem', background: '#00FF66', color: '#0A0040',
              border: 'none', borderRadius: '10px', fontWeight: '700',
              fontSize: '0.95rem', cursor: 'pointer'
            }}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder les véhicules'}
            </button>
          </div>
        )}

        {/* ── STATS ── */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={sectionTitle}>Mes statistiques</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Trajets effectués', value: profile?.total_trips || 0, unit: '', color: '#00FF66' },
                { label: 'Temps économisé', value: profile?.total_minutes_saved || 0, unit: ' min', color: '#00FF66' },
                { label: 'CO₂ économisé', value: Math.round((profile?.total_co2_saved_g || 0) / 1000 * 10) / 10, unit: ' kg', color: '#00FF66' },
                { label: 'Taux de réussite', value: profile?.total_trips > 0 ? 100 : 0, unit: '%', color: '#00FF66' },
              ].map(({ label, value, unit, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color, letterSpacing: '-0.02em' }}>{value}{unit}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                Les stats se mettront à jour automatiquement après chaque trajet Fyndzz.
              </div>
            </div>
          </div>
        )}

        {/* ── SÉCURITÉ ── */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Changer email */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
              <div style={sectionTitle}>Changer d'email</div>
              <label style={labelStyle}>Nouvel email</label>
              <input style={{ ...inputStyle, marginBottom: '0.75rem' }} type="email" placeholder="nouveau@exemple.fr" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <button onClick={changeEmail} style={{ width: '100%', padding: '0.8rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                Mettre à jour l'email
              </button>
            </div>

            {/* Changer mot de passe */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' }}>
              <div style={sectionTitle}>Changer le mot de passe</div>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <input style={{ ...inputStyle, marginBottom: '0.75rem' }} type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button onClick={changePassword} style={{ width: '100%', padding: '0.8rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                Mettre à jour le mot de passe
              </button>
            </div>

            {/* Déconnexion */}
            <button onClick={logout} style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
              Se déconnecter
            </button>

            {/* Supprimer le compte */}
            <div style={{ background: 'rgba(255,77,109,0.06)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '14px', padding: '1.2rem' }}>
              <div style={{ ...sectionTitle, color: '#FF4D6D' }}>Zone dangereuse</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.8rem' }}>
                Cette action est irréversible. Tape <strong style={{ color: '#fff' }}>SUPPRIMER</strong> pour confirmer.
              </div>
              <input style={{ ...inputStyle, marginBottom: '0.75rem', borderColor: 'rgba(255,77,109,0.3)' }} placeholder="SUPPRIMER" value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} />
              <button onClick={deleteAccount} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,77,109,0.15)', color: '#FF4D6D', border: '1px solid rgba(255,77,109,0.3)', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}