'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  // Si déjà connecté → /map directement
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/map')
      else setChecking(false)
    })
  }, [])

  if (checking) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #00FF66', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      fontFamily: 'sans-serif', color: '#fff',
      overflow: 'hidden', position: 'relative'
    }}>

      {/* Orbes déco */}
      <div style={{ position: 'absolute', top: '-200px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <Image
          src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
          alt="Fyndzz"
          width={130}
          height={36}
          style={{ objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link href="/login" style={{
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: '500',
            padding: '0.5rem 1.2rem',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', transition: 'all 0.2s'
          }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            background: '#00FF66', color: '#0A0040',
            textDecoration: 'none', fontSize: '0.9rem',
            fontWeight: '700', padding: '0.5rem 1.2rem',
            borderRadius: '8px'
          }}>
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: '900px', margin: '0 auto',
        padding: '5rem 2rem 3rem',
        textAlign: 'center'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,255,102,0.1)',
          border: '1px solid rgba(0,255,102,0.25)',
          borderRadius: '100px', padding: '0.35rem 1rem',
          fontSize: '0.75rem', fontWeight: '700',
          color: '#00FF66', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '2rem'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF66', animation: 'pulse 2s infinite' }} />
          Bêta publique · Paris 16ème
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: '800', lineHeight: '1.05',
          letterSpacing: '-0.03em', marginBottom: '1.5rem'
        }}>
          Fini de tourner en rond<br/>
          pour <span style={{ color: '#00FF66' }}>trouver une place.</span>
        </h1>

        <p style={{
          fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.75', maxWidth: '560px',
          margin: '0 auto 2.5rem', fontWeight: '300'
        }}>
          Fyndzz connecte des capteurs IoT aux conducteurs en temps réel.
          Localisez une place disponible en quelques secondes — sans stress, sans CO₂ gaspillé.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            background: '#00FF66', color: '#0A0040',
            textDecoration: 'none', padding: '0.9rem 2rem',
            borderRadius: '10px', fontWeight: '700',
            fontSize: '0.95rem', letterSpacing: '0.01em'
          }}>
            Créer un compte gratuit →
          </Link>
          <Link href="/login" style={{
            color: '#fff', textDecoration: 'none',
            padding: '0.9rem 2rem', borderRadius: '10px',
            fontWeight: '600', fontSize: '0.95rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            Se connecter
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        maxWidth: '800px', margin: '2rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '2rem'
        }}>
          {[
            { num: '80', label: 'Capteurs IoT' },
            { num: '16ème', label: 'Arr. pilote' },
            { num: '~8 min', label: 'Économisées / trajet' },
            { num: '−34%', label: 'CO₂ évité' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '800', color: '#00FF66', letterSpacing: '-0.02em' }}>{num}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '0.8rem' }}>
            Le concept
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Comment ça marche ?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { step: '01', icon: '📡', title: 'Capteurs temps réel', desc: 'Des capteurs IoT sous la chaussée transmettent l\'état de chaque place toutes les secondes.' },
            { step: '02', icon: '🧭', title: 'Guidage intelligent', desc: 'L\'algorithme trouve la place libre la plus proche de ta destination en distance réelle.' },
            { step: '03', icon: '🅿️', title: 'Tu te gares', desc: 'Navigation turn-by-turn directement jusqu\'à la place. Zéro stress.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '1.8rem',
              transition: 'border-color 0.3s'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#00FF66', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Étape {step}
              </div>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{icon}</div>
              <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        textAlign: 'center', padding: '4rem 2rem 6rem',
        maxWidth: '600px', margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Prêt à ne plus chercher ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Rejoins la communauté Fyndzz gratuitement.
        </p>
        <Link href="/register" style={{
          background: '#00FF66', color: '#0A0040',
          textDecoration: 'none', padding: '1rem 2.5rem',
          borderRadius: '10px', fontWeight: '700', fontSize: '1rem'
        }}>
          Rejoindre la bêta →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '1.5rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        <Image
          src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
          alt="Fyndzz"
          width={90}
          height={28}
          style={{ objectFit: 'contain' }}
        />
        <Link href="/legal" style={{ color: '#00FF66', textDecoration: 'none', fontSize: '0.8rem' }}>
          Mentions légales & CGU
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          © 2025 Fyndzz · Paris 🇫🇷
        </span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 600px) {
          nav { padding: 1rem; }
        }
        @media (max-width: 500px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}