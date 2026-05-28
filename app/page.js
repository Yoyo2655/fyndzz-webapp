'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhotoSection from '@/components/PhotoSection'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/* ============================================================
   PALETTE FYNDZZ
   FOND (inchangé)   : violet #3D2CD5 → navy #160C6B
   ACCENT (inchangé) : green #00FF66 · ink #0A0040
   PASTILLES (fournies) :
     orange  #FF914D
     violet  #4A3AAA
     indigo  #2A1A8A
     magenta #8814CE
   ============================================================ */
const C = {
  violet: '#3D2CD5', navy: '#160C6B', navyDeep: '#0d0a3e',
  green: '#00FF66', ink: '#0A0040',
  pOrange: '#FF914D', pViolet: '#4A3AAA', pIndigo: '#2A1A8A', pMagenta: '#8814CE',
}

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeOut 0.4s ease 1.8s both' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '3px solid rgba(0,255,102,0.6)', animation: 'ring1 1.5s ease-out 0.2s both' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(0,255,102,0.3)', animation: 'ring2 1.5s ease-out 0.4s both' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(0,255,102,0.15)', animation: 'ring2 1.5s ease-out 0.6s both' }} />
        <div style={{ width: 110, height: 110, borderRadius: 28, background: `linear-gradient(135deg, ${C.violet}, ${C.navy})`, border: '2px solid rgba(0,255,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,255,102,0.2)', animation: 'logoIn 0.5s ease 0.1s both' }}>
          <img src="/Logo-RBG_Fyndzz.png" style={{ width: 70, height: 70, objectFit: 'contain' }} alt="Fyndzz" />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '15%', textAlign: 'center', animation: 'logoIn 0.5s ease 0.3s both' }}>
        <img src="/Titre-RBG_Fyndzz.png" style={{ height: 48, objectFit: 'contain' }} alt="fyndzz" />
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
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: `3px solid ${C.green}`, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* orbes déco (comme ton code d'origine) */}
      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO MOSAIC ===== */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, padding: '32px 0' }} className="fz-mosaic">
          {/* gros bloc indigo profond */}
          <div style={{ ...blockBase, background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', opacity: 0.85, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: C.green }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, animation: 'pulse 2s infinite' }} />
              568 capteurs actifs en Île-de-France
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.02em' }}>
              Oubliez le stress du stationnement.
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.55, marginTop: 14, maxWidth: '90%', opacity: 0.85 }}>
              Fyndzz vous guide en temps réel vers une place libre dans la rue. <strong style={{ color: C.green }}>Find it. Park it.</strong>
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link href="/register" style={{ ...btn, background: C.green, color: C.ink }}>Créer un compte gratuit →</Link>
              <Link href="/login" style={{ ...btn, background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>Se connecter</Link>
            </div>
          </div>

          {/* 2 mini blocs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ ...miniBase, background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})`, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Find it.</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.88 }}>Des capteurs détectent les places libres en direct, rue par rue.</p>
              <Link href="#how" style={{ marginTop: 16, fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4, color: C.green }}>Comment ça marche →</Link>
            </div>
            <div style={{ ...miniBase, background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Park it.</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.92 }}>Navigation jusqu'à la place. Une meilleure se libère ? On recalcule.</p>
              <Link href="/register" style={{ marginTop: 16, fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4, color: '#fff' }}>Voir la carte →</Link>
            </div>
          </div>
        </section>

        {/* ===== STATS (glass, comme ton code) ===== */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '10px 0 40px' }} className="fz-stats">
          {[
            { n: '+500', l: 'Capteurs IoT actifs' },
            { n: 'Île-de-France', l: 'Zone couverte' },
            { n: '~8 min', l: 'Économisées / trajet' },
            { n: '−34%', l: 'CO₂ évité' },
          ].map(({ n, l }) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 24, textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.7rem', color: C.green, letterSpacing: '-0.02em' }}>{n}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </section>

        {/* ===== PHOTO 1 — cadre arrondi ===== */}
        <PhotoSection
          variant="framed"
          eyebrow="Au volant"
          title="Pensé pour la vraie vie en ville."
          text="Vous indiquez votre destination, Fyndzz s'occupe du reste. Pas de regard furtif à droite à gauche ni d'yeux rivés sur l'écran à chercher où se trouve la place: un guidage clair qui vous mène à l'emplacement, pendant que vous gardez les mains sur le volant."
          src="/photos/driver.jpg"
          alt="Conducteur utilisant Fyndzz au volant"
        />

        {/* ===== HOW ===== */}
        <section id="how" style={{ padding: '50px 0' }}>
          <SecHead tag="Le concept" title="Comment ça marche ?" sub="Trois étapes, zéro tour de pâté de maisons." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { step: 'ÉTAPE 01', t: 'Capteurs temps réel', d: "Une flotte de capteurs signale l'occupation des places en direct, toutes les 30 secondes.", bg: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})` },
              { step: 'ÉTAPE 02', t: 'Guidage intelligent', d: 'À 10 min de votre destination, Fyndzz active le mode parking et calcule la place la plus proche.', bg: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})` },
              { step: 'ÉTAPE 03', t: 'Vous vous garez', d: 'Navigation turn-by-turn. Une place mieux placée se libère ? On vous redirige tout seul.', bg: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})` },
            ].map(({ step, t, d, bg }) => (
              <div key={step} style={{ borderRadius: 22, padding: 34, color: '#fff', minHeight: 230, background: bg, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontWeight: 800, opacity: 0.6, fontSize: '0.8rem', letterSpacing: '0.1em', color: C.green }}>{step}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '18px 0 8px' }}>{t}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.55, opacity: 0.9 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 2 — bord à bord, photo à droite ===== */}
        <PhotoSection
          variant="bleed"
          reverse
          eyebrow="Le réseau"
          title="Une couche de capteurs posée sur la ville."
          text="Plus de 500 capteurs déployés en Île-de-France remontent l'état des places en continu. Une donnée réelle, vivante, qui se met à jour pendant que vous roulez."
          src="/photos/city-street.jpg"
          alt="Rue parisienne avec stationnement"
        />

        {/* ===== WHY (glass) ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Pourquoi Fyndzz" title="Pas juste un GPS parking." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="fz-2">
            {[
              { t: 'Vraiment temps réel', d: "Pas de données périmées. Chaque capteur met à jour l'état de la place toutes les 30 s." },
              { t: 'Anticipation automatique', d: "Le mode parking s'active 10 min avant l'arrivée — pas une fois sur place à galérer." },
              { t: 'Recalcul dynamique', d: "Votre place vient d'être prise ? Fyndzz trouve la suivante sans que vous touchiez à rien." },
              { t: 'Moins de CO₂', d: '8 minutes gagnées en moyenne par trajet, soit ~34% de CO₂ économisé.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 26 }}>
                <div style={{ width: 40, height: 4, borderRadius: 4, background: C.green, marginBottom: 16 }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>{t}</h4>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 3 — fond plein largeur, texte par-dessus ===== */}
        <PhotoSection
          variant="overlay"
          eyebrow="L'impact"
          title="Moins de tours. Moins de CO₂."
          text="Chaque trajet sans chercher, c'est ~8 minutes gagnées et 34% de CO₂ en moins. Multiplié par des milliers de conducteurs, c'est une ville qui respire."
          cta={{ label: 'Rejoindre les Fyndzzers →', href: '/register' }}
          src="/photos/aerial-traffic.jpg"
          alt="Vue aérienne de la circulation urbaine"
        />

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <CtaBig title="Prêt à ne plus chercher ?" sub="Créez un compte gratuitement et accédez à la carte en temps réel.">
            <Link href="/register" style={{ ...btn, background: C.green, color: C.ink, padding: '14px 30px', fontSize: '1rem' }}>Créer un compte gratuit →</Link>
          </CtaBig>
        </section>
      </main>

      <Footer />
      <GlobalStyle />
    </div>
  )
}

/* ============================================================
   COMPOSANTS PARTAGÉS
   ============================================================ */


function SecHead({ tag, title, sub }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 44px' }}>
      <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green }}>{tag}</span>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 12, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', marginTop: 14, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  )
}

function CtaBig({ title, sub, children }) {
  return (
    <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>{title}</h2>
      <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '16px auto 28px', maxWidth: 440, position: 'relative' }}>{sub}</p>
      <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>{children}</div>
    </div>
  )
}


function GlobalStyle() {
  return (
    <style>{`
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @media (max-width: 860px) {
        .fz-mosaic { grid-template-columns: 1fr !important; }
        .fz-3, .fz-2 { grid-template-columns: 1fr !important; }
        .fz-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .fz-pad { padding: 34px !important; }
        .fz-split { grid-template-columns: 1fr !important; }
        .fz-split-img { order: 1 !important; min-height: 240px !important; }
        .fz-overlay-text { max-width: 100% !important; text-align: left !important; margin-left: 0 !important; padding: 32px !important; }
      }
      @media (max-width: 600px) {
        .fz-lnk { display: none !important; }
        nav { padding: 1rem !important; }
      }
    `}</style>
  )
}

const blockBase = { borderRadius: 26, padding: 42, position: 'relative', overflow: 'hidden' }
const miniBase = { flex: 1, borderRadius: 26, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }
const btn = { display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, borderRadius: 10, padding: '11px 20px', fontSize: '0.9rem', textDecoration: 'none' }