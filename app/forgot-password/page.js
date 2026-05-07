'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      fontFamily: 'sans-serif', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/">
            <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={130} height={36} style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.8rem' }}>Email envoyé !</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', marginBottom: '2rem' }}>
              Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
            </p>
            <Link href="/login" style={{ color: '#00FF66', fontWeight: '700', textDecoration: 'none' }}>
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Mot de passe oublié
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Entre ton email et on t'envoie un lien de réinitialisation.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  style={{
                    width: '100%', padding: '0.9rem 1rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px', color: '#fff',
                    fontSize: '0.95rem', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(255,77,109,0.15)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#FF4D6D' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.9rem', background: '#00FF66', color: '#0A0040',
                  border: 'none', borderRadius: '10px', fontWeight: '700',
                  fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Envoi...' : 'Envoyer le lien →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}