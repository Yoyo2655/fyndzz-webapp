'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      fontFamily: 'sans-serif', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
    }}>
      {/* Orbes déco */}
      <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,255,102,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '480px' }}>
        <Image
          src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
          alt="Fyndzz"
          width={140}
          height={40}
          style={{ objectFit: 'contain', display: 'block', margin: '0 auto 2.5rem' }}
        />

        {/* 404 stylisé */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)',
          fontWeight: '800', lineHeight: '1',
          letterSpacing: '-0.05em',
          background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          404
        </div>

        {/* Parking pin animé */}
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', animation: 'bounce 2s ease-in-out infinite' }}>
          🅿️
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
          Cette place n'existe pas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          La page que tu cherches s'est peut-être garée ailleurs.<br/>
          Retourne à la carte, on va t'en trouver une autre.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{
            padding: '0.85rem 1.8rem',
            background: '#00FF66', color: '#0A0040',
            borderRadius: '10px', textDecoration: 'none',
            fontWeight: '700', fontSize: '0.95rem'
          }}>
            Accueil →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}