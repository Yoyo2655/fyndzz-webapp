'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/map')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '420px',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image
            src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
            alt="Fyndzz"
            width={200}
            height={48}
            style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }}
          />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Connexion à votre compte
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
              Adresse e-mail
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              required
              style={{
                width: '100%', padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px', color: '#fff',
                fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
              Mot de passe
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px', color: '#fff',
                fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box'
              }}
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
            fontWeight: '700', fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          Pas de compte ?{' '}
          <Link href="/register" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: '600' }}>
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}