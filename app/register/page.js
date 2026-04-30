'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    first_name: '', last_name: '',
    email: '', password: '', confirm_password: '', phone: '',
    address: '', city: '', postal_code: '', country: 'France',
    plate: '', vehicle_brand: '', vehicle_model: '',
    vehicle_year: '', vehicle_color: '', vehicle_energy: ''
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const fetchVehicle = async () => {
    if (!form.plate) return
    setLoading(true)
    try {
      const res = await fetch(`https://api-lapi.com/lapi/immat/json/${form.plate.replace(/\s|-/g, '')}`)
      const data = await res.json()
      if (data?.marque) {
        update('vehicle_brand', data.marque || '')
        update('vehicle_model', data.modele || '')
        update('vehicle_year', data.annee || '')
        update('vehicle_color', data.couleur || '')
        update('vehicle_energy', data.energie || '')
      }
    } catch {
      // L'utilisateur remplit manuellement
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const userId = data.user?.id
    if (userId) {
      await supabase.from('profiles').insert({
        id: userId,
        first_name: form.first_name,
        last_name: form.last_name,
        full_name: `${form.first_name} ${form.last_name}`,
        email: form.email,
        phone: form.phone,
        address: form.address,
        postal_code: form.postal_code,
        city: form.city,
        country: form.country,
        plate: form.plate,
        vehicle_brand: form.vehicle_brand,
        vehicle_model: form.vehicle_model,
        vehicle_year: form.vehicle_year,
        vehicle_color: form.vehicle_color,
        vehicle_energy: form.vehicle_energy
      })
    }

    router.push('/map')
  }

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', marginBottom: '1rem'
  }

  const labelStyle = {
    display: 'block', fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem'
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    color: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', padding: '2rem 0'
    }}>
      <style>{`
        select option {
          background: #1e1a6e;
          color: #fff;
        }
        select:focus {
          border-color: rgba(0,255,102,0.5) !important;
        }
        input::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '440px',
        backdropFilter: 'blur(20px)', margin: '0 1rem'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Image
            src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
            alt="Fyndzz"
            width={200}
            height={48}
            style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }}
          />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Créer votre compte
          </div>
        </div>

        {/* Progress bar — 3 étapes */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: step >= s ? '#00FF66' : 'rgba(255,255,255,0.15)'
            }} />
          ))}
        </div>

        <form onSubmit={
          step === 1 ? (e) => { e.preventDefault(); setStep(2) } :
          step === 2 ? (e) => { e.preventDefault(); setStep(3) } :
          handleRegister
        }>

          {/* ── ÉTAPE 1 — Compte ── */}
          {step === 1 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Étape 1 — Compte
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input style={inputStyle} placeholder="Marie" value={form.first_name}
                    onChange={e => update('first_name', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input style={inputStyle} placeholder="Dupont" value={form.last_name}
                    onChange={e => update('last_name', e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Adresse e-mail</label>
                <input style={inputStyle} type="email" placeholder="vous@exemple.fr" value={form.email}
                  onChange={e => update('email', e.target.value)} required />
              </div>

              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={form.password}
                  onChange={e => update('password', e.target.value)} required minLength={6} />
              </div>

              <div>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={form.confirm_password}
                  onChange={e => update('confirm_password', e.target.value)} required minLength={6} />
              </div>

              <div>
                <label style={labelStyle}>Téléphone</label>
                <input style={inputStyle} type="tel" placeholder="+33 6 00 00 00 00" value={form.phone}
                  onChange={e => update('phone', e.target.value)} />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '0.9rem',
                background: '#00FF66', color: '#0A0040',
                border: 'none', borderRadius: '10px',
                fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer'
              }}>
                Continuer →
              </button>
            </>
          )}

          {/* ── ÉTAPE 2 — Adresse ── */}
          {step === 2 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Étape 2 — Adresse
              </div>

              <div>
                <label style={labelStyle}>Rue</label>
                <input style={inputStyle} placeholder="12 rue de la Paix" value={form.address}
                  onChange={e => update('address', e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Code postal</label>
                  <input style={inputStyle} placeholder="75001" value={form.postal_code}
                    onChange={e => update('postal_code', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input style={inputStyle} placeholder="Paris" value={form.city}
                    onChange={e => update('city', e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Pays</label>
                <select
                  value={form.country}
                  onChange={e => update('country', e.target.value)}
                  style={selectStyle}
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  flex: 1, padding: '0.9rem',
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', fontWeight: '600',
                  fontSize: '0.95rem', cursor: 'pointer'
                }}>
                  ← Retour
                </button>
                <button type="submit" style={{
                  flex: 2, padding: '0.9rem',
                  background: '#00FF66', color: '#0A0040',
                  border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer'
                }}>
                  Continuer →
                </button>
              </div>
            </>
          )}

          {/* ── ÉTAPE 3 — Véhicule ── */}
          {step === 3 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Étape 3 — Votre véhicule
              </div>

              <div>
                <label style={labelStyle}>Plaque d'immatriculation</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    placeholder="AB-123-CD"
                    value={form.plate}
                    onChange={e => update('plate', e.target.value.toUpperCase())}
                  />
                  <button type="button" onClick={fetchVehicle} disabled={loading} style={{
                    padding: '0 1rem',
                    background: 'rgba(0,255,102,0.15)',
                    border: '1px solid rgba(0,255,102,0.3)',
                    borderRadius: '10px', color: '#00FF66',
                    fontSize: '0.8rem', fontWeight: '600',
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}>
                    {loading ? '...' : '🔍 Auto'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Marque</label>
                  <input style={inputStyle} placeholder="Renault" value={form.vehicle_brand}
                    onChange={e => update('vehicle_brand', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Modèle</label>
                  <input style={inputStyle} placeholder="Clio" value={form.vehicle_model}
                    onChange={e => update('vehicle_model', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Année</label>
                  <input style={inputStyle} placeholder="2020" value={form.vehicle_year}
                    onChange={e => update('vehicle_year', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Couleur</label>
                  <input style={inputStyle} placeholder="Blanc" value={form.vehicle_color}
                    onChange={e => update('vehicle_color', e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Énergie</label>
                <select
                  value={form.vehicle_energy}
                  onChange={e => update('vehicle_energy', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Sélectionner</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Hybride">Hybride</option>
                  <option value="GPL">GPL</option>
                </select>
              </div>

              {error && (
                <div style={{ color: '#FF4D6D', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" onClick={() => setStep(2)} style={{
                  flex: 1, padding: '0.9rem',
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', fontWeight: '600',
                  fontSize: '0.95rem', cursor: 'pointer'
                }}>
                  ← Retour
                </button>
                <button type="submit" disabled={loading} style={{
                  flex: 2, padding: '0.9rem',
                  background: '#00FF66', color: '#0A0040',
                  border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}>
                  {loading ? 'Création...' : 'Créer mon compte →'}
                </button>
              </div>
            </>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: '600' }}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}