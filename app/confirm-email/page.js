import Link from 'next/link'
import Image from 'next/image'

export default function ConfirmEmailPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>

        <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={160} height={44} style={{ objectFit: 'contain', margin: '0 auto 2rem' }} />

        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📧</div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
          Vérifiez votre boîte mail
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Un email de confirmation vous a été envoyé. Cliquez sur le lien dans l'email pour activer votre compte et accéder à Fyndzz.
        </p>

        <div style={{ background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '14px', padding: '1rem 1.2rem', marginBottom: '2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
          💡 Pensez à vérifier vos spams si vous ne voyez pas l'email.
        </div>

        <Link href="/login" style={{ display: 'inline-block', padding: '0.9rem 2rem', background: '#00FF66', color: '#0A0040', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>
          J'ai confirmé mon email →
        </Link>

        <div style={{ marginTop: '1rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  )
}