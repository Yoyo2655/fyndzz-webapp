'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setShowSplash(true)
      setTimeout(() => setShowSplash(false), 2200)
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/map')
      else setChecking(false)
    })
  }, [])

  if (showSplash) return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(180deg, #160C6B 0%, #0d0a3e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeOut 0.4s ease 1.8s both'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '3px solid rgba(0,255,102,0.6)', animation: 'ring1 1.5s ease-out 0.2s both' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(0,255,102,0.3)', animation: 'ring2 1.5s ease-out 0.4s both' }} />
        <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px solid rgba(0,255,102,0.15)', animation: 'ring2 1.5s ease-out 0.6s both' }} />
        <div style={{ width: '110px', height: '110px', borderRadius: '28px', background: 'linear-gradient(135deg, #3D2CD5, #160C6B)', border: '2px solid rgba(0,255,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,255,102,0.2)', animation: 'logoIn 0.5s ease 0.1s both' }}>
          <img src="/Logo-RBG_Fyndzz.png" style={{ width: '70px', height: '70px', objectFit: 'contain' }} alt="Fyndzz" />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '15%', textAlign: 'center', animation: 'logoIn 0.5s ease 0.3s both' }}>
        <img src="/Titre-RBG_Fyndzz.png" style={{ height: '48px', objectFit: 'contain' }} alt="fyndzz" />
      </div>
      <style>{`
        @keyframes ring1 { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes ring2 { from{transform:scale(0.3);opacity:0} 50%{opacity:1} to{transform:scale(1.2);opacity:0} }
        @keyframes logoIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeOut { to{opacity:0;pointer-events:none} }
      `}</style>
    </div>
  )

  if (checking) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={130} height={36} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', padding: '0.5rem 1.2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
            Connexion
          </Link>
          <Link href="/register" style={{ background: '#00FF66', color: '#0A0040', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700', padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem 3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.25)', borderRadius: '100px', padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#00FF66', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF66', animation: 'pulse 2s infinite' }} />
          568 capteurs actifs en Île-de-France
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          Oubliez le stress du stationnement<br/>
           <span style={{ color: '#00FF66' }}>Find it !  Park it !</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', maxWidth: '560px', margin: '0 auto 2.5rem', fontWeight: '300' }}>
          Fyndzz© est une application mobile propulsée par l’IA qui aide les Fyndzzers – conducteurs utilisateurs de Fyndzz© – à trouver des places de stationnement disponibles dans la rue en temps réel. <br/>
          Grâce à des données intelligentes et à une technologie de capteurs nouvelle génération, Fyndzz© optimise la recherche de stationnement, réduit les embouteillages et améliore la mobilité urbaine. 
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#00FF66', color: '#0A0040', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem' }}>
            Créer un compte gratuit →
          </Link>
          <Link href="/login" style={{ color: '#fff', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            Se connecter
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem' }}>
          {[
            { num: '+500', label: 'Capteurs IoT actifs' },
            { num: 'Île-de-France', label: 'Zone couverte' },
            { num: '~8 min', label: 'Économisées / trajet' },
            { num: '−34%', label: 'CO₂ évité' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)', fontWeight: '800', color: '#00FF66', letterSpacing: '-0.02em' }}>{num}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '0.8rem' }}>Le concept</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>Comment ça marche ?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            {
              step: '01', icon: '📡',
              title: 'Capteurs temps réel',
              desc: 'Une flotte de capteurs installés en ville signale l\'occupation des places de stationnement en temps réel.'
            },
            {
              step: '02', icon: '🧭',
              title: 'Guidage intelligent',
              desc: 'À 10 minutes de votre destination, Fyndzz© active le mode parking et calcule l\'itinéraire optimal vers la place disponible la plus proche.'
            },
            {
              step: '03', icon: '🅿️',
              title: 'Vous vous garez',
              desc: 'Navigation GPS turn-by-turn jusqu\'à la place. Si une meilleure se libère en chemin, Fyndzz© vous redirige automatiquement. Zéro stress.'
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.8rem', transition: 'border-color 0.3s' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#00FF66', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Étape {step}</div>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{icon}</div>
              <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POURQUOI FYNDZZ */}
      <section style={{ maxWidth: '900px', margin: '0 auto 4rem', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00FF66', marginBottom: '0.8rem' }}>Pourquoi Fyndzz</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>Pas juste un GPS parking.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
          {[
            { icon: '⚡', title: 'Données vraiment temps réel', desc: 'Pas de données périmées. Chaque capteur met à jour l\'état de la place en direct, toutes les 30 secondes.' },
            { icon: '🔮', title: 'Anticipation automatique', desc: 'Fyndzz© active le mode parking 10 minutes avant votre arrivée — pas quand vous êtes déjà là à chercher.' },
            { icon: '🔄', title: 'Recalcul dynamique', desc: 'Votre place vient d\'être prise ? Fyndzz© trouve immédiatement la suivante et recalcule sans que vous ne touchiez à rien.' },
            { icon: '🌿', title: 'Moins de CO₂ et moins de temps perdu', desc: 'Fini les tours de pâtés de maisons : Fyndzz© vous fait gagner en moyenne 8 minutes par trajet ce qui représente 34% de CO2 économisé !' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Prêt à ne plus chercher ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Créez un compte gratuitement et accédez à la carte en temps réel.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#00FF66', color: '#0A0040', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '10px', fontWeight: '700', fontSize: '1rem' }}>
            Créer un compte gratuit →
          </Link>
          <Link href="/login" style={{ color: '#fff', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            Se connecter
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={90} height={28} style={{ objectFit: 'contain' }} />
        <Link href="/legal" style={{ color: '#00FF66', textDecoration: 'none', fontSize: '0.8rem' }}>
          Mentions légales & CGU
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>© 2026 Fyndzz · Paris 🇫🇷</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 600px) { nav { padding: 1rem; } }
        @media (max-width: 500px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}