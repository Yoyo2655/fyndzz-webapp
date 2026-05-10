'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit faire au moins 6 caractères')
      return
    }
    setLoading(true)
    setError('')
    setPasswordError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setSuccess(true)
      setTimeout(() => router.push('/map'), 2000)
    }
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

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.8rem' }}>Mot de passe mis à jour !</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Redirection vers la carte...</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Nouveau mot de passe
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Choisis un nouveau mot de passe sécurisé.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Nouveau mot de passe', value: password, set: setPassword, placeholder: '••••••••' },
                { label: 'Confirmer le mot de passe', value: confirm, set: setConfirm, placeholder: '••••••••' }
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                    {label}
                  </label>
                  <input
                    type="password"
                    value={value}
                    onChange={e => {
                      set(e.target.value)
                      if (label === 'Nouveau mot de passe') {
                        setPasswordError(confirm && e.target.value !== confirm ? 'Les mots de passe ne correspondent pas' : '')
                      } else {
                        setPasswordError(e.target.value && password !== e.target.value ? 'Les mots de passe ne correspondent pas' : '')
                      }
                    }}
                    placeholder={placeholder}
                    required
                    style={{
                      width: '100%', padding: '0.9rem 1rem',
                      background: 'rgba(255,255,255,0.08)',
                      border: `1px solid ${passwordError ? 'rgba(255,77,109,0.5)' : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '10px', color: '#fff',
                      fontSize: '0.95rem', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}

              {passwordError && (
                <div style={{ fontSize: '0.82rem', color: '#FF4D6D', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '-0.5rem' }}>
                  ⚠️ {passwordError}
                </div>
              )}

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
                {loading ? 'Mise à jour...' : 'Mettre à jour →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}