'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const TYPES = [
  { value: 'conducteur', label: 'Je suis conducteur' },
  { value: 'ville', label: 'Je représente une ville / mairie' },
  { value: 'investisseur', label: 'Je suis investisseur' },
  { value: 'autre', label: 'Autre' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        type: form.type,
        message: form.message,
      })

    if (insertError) {
      setError("Une erreur est survenue. Réessayez dans un instant.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', marginBottom: '1rem',
    fontFamily: 'inherit',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem',
  }
  const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', padding: '2rem 0',
    }}>
      <style>{`
        select option { background: #1e1a6e; color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '460px',
        backdropFilter: 'blur(20px)', margin: '0 1rem',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link href="/">
            <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={200} height={48} style={{ objectFit: 'contain', display: 'block', margin: '0 auto', cursor: 'pointer' }} />
          </Link>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Une question ? Écrivez-nous.
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.6rem' }}>Message envoyé !</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              Merci de nous avoir contactés. Nous reviendrons vers vous dès que possible.
            </p>
            <Link href="/" style={{ display: 'inline-block', background: '#00FF66', color: '#0A0040', textDecoration: 'none', padding: '0.8rem 1.8rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input style={inputStyle} placeholder="Marie" value={form.first_name} onChange={e => update('first_name', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input style={inputStyle} placeholder="Dupont" value={form.last_name} onChange={e => update('last_name', e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Adresse e-mail</label>
              <input style={inputStyle} type="email" placeholder="vous@exemple.fr" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Vous êtes</label>
              <select style={selectStyle} value={form.type} onChange={e => update('type', e.target.value)} required>
                <option value="" disabled>Sélectionner…</option>
                {TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder="Votre message…"
                value={form.message}
                onChange={e => update('message', e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ color: '#FF4D6D', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem',
              background: '#00FF66', color: '#0A0040',
              border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Envoi…' : 'Envoyer le message →'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  )
}