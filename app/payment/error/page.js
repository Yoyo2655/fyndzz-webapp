'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PaymentErrorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      fontFamily: 'sans-serif', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,77,109,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '480px' }}>
        <Link href="/">
          <Image
            src="/Logo-et-Titre-paysage-RBG_Fyndzz.png"
            alt="Fyndzz" width={140} height={40}
            style={{ objectFit: 'contain', display: 'block', margin: '0 auto 2.5rem' }}
          />
        </Link>

        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'shake 0.5s ease' }}>❌</div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
          Paiement échoué
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '0.8rem' }}>
          Votre paiement n'a pas pu être traité. Aucun montant n'a été débité de votre compte.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          Causes possibles : carte refusée, fonds insuffisants, délai de session expiré. Vérifiez vos informations et réessayez.
        </p>

        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/payment" style={{
            padding: '0.85rem 1.8rem',
            background: '#00FF66', color: '#0A0040',
            borderRadius: '10px', textDecoration: 'none',
            fontWeight: '700', fontSize: '0.95rem'
          }}>
            Réessayer →
          </Link>
          <Link href="/map" style={{
            padding: '0.85rem 1.8rem',
            background: 'transparent', color: '#fff',
            borderRadius: '10px', textDecoration: 'none',
            fontWeight: '600', fontSize: '0.95rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            Retour à la carte
          </Link>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          Un problème persistant ? <a href="mailto:hello@fyndzz.io" style={{ color: '#00FF66', textDecoration: 'none' }}>Contactez-nous</a>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-8px)}
          75%{transform:translateX(8px)}
        }
      `}</style>
    </div>
  )
}