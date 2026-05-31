'use client'

import Link from 'next/link'
import PhotoSection from '@/components/PhotoSection'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/* ============================================================
   PALETTE FYNDZZ — identique à la landing
   FOND : #3D2CD5 → #160C6B · ACCENT : #00FF66
   PASTILLES : #FF914D · #4A3AAA · #2A1A8A · #8814CE
   ============================================================ */
const C = {
  violet: '#3D2CD5', navy: '#160C6B', navyDeep: '#0d0a3e',
  green: '#00FF66', ink: '#0A0040',
  pOrange: '#FF914D', pViolet: '#4A3AAA', pIndigo: '#2A1A8A', pMagenta: '#8814CE',
}

export default function CompanyPage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO MOSAIC ===== */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, padding: '32px 0' }} className="fz-mosaic">
          <div style={{ ...blockBase, background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, border: '1px solid rgba(255,255,255,0.1)' }}>
            
            <h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.02em' }}>
              Moins de voitures qui tournent, ça ne ferait de mal à personne.
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.55, marginTop: 14, maxWidth: '90%', opacity: 0.92 }}>
              Fyndzz construit l'infrastructure de stationnement intelligente des villes. Notre mission : rendre chaque place visible, en temps réel.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link href="/history" style={{ ...btn, background: C.green , color: C.ink }}>Découvrir notre histoire</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ ...miniBase, background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Notre vision</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.88 }}>Une ville où personne ne perd 20 minutes à chercher une place pour se garer. Pour une ville qui respire enfin.</p>
            </div>
            <div style={{ ...miniBase, background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})`, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Notre méthode</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.9 }}>Des capteurs réels + de l'IA. Quartier par quartier, ville par ville.</p>
            </div>
          </div>
        </section>

        {/* ===== STORY ===== */}
        <section id="story" style={{ padding: '20px 0' }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pIndigo}, ${C.navy})`, borderRadius: 26, padding: 60, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, maxWidth: 760, margin: '0 auto', letterSpacing: '-0.02em' }}>
              Parce que chercher une place ne devrait plus exister.
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 600, margin: '18px auto 0', color: 'rgba(255,255,255,0.7)' }}>
              Fyndzz est né d'un constat simple : jusqu'à 30% du trafic urbain ne se déplace pas, il cherche. On a décidé de rendre l'invisible visible — une place libre, au bon moment, au bon endroit.
            </p>
            <Link href="/history" style={{ ...btn, background: C.green, color: C.ink, marginTop: 26 }}>Lire notre histoire</Link>
          </div>
        </section>

        {/* ===== PHOTO 1 — bord à bord ===== */}
        <PhotoSection
          variant="bleed"
          eyebrow="Notre origine"
          title="Tout a commencé par une rue, et trop de voitures qui tournent."
          text="On a regardé nos villes : des conducteurs qui cherchent, du temps perdu, des émissions inutiles. Fyndzz est notre réponse — rendre chaque place visible, en temps réel."
          src="/photos/founders-street.jpg"
          alt="L'équipe Fyndzz dans la rue"
        />

        {/* ===== IMPACT ===== */}
        <section id="impact" style={{ padding: '50px 0' }}>
          <SecHead tag="Notre impact" title="Des chiffres qui comptent." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { big: '+500', t: 'capteurs déployés', d: 'Un réseau réel en Île-de-France, en expansion continue.' },
              { big: '−34%', t: 'de CO₂ par trajet', d: "Moins de tours, c'est moins d'émissions et de congestion." },
              { big: '~8 min', t: 'gagnées / trajet', d: 'Du temps rendu aux conducteurs, chaque jour.' },
            ].map(({ big, t, d }) => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 30 }}>
                <div style={{ fontWeight: 800, fontSize: '2.4rem', color: C.green, letterSpacing: '-0.02em' }}>{big}</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '8px 0 6px' }}>{t}</h4>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 2 — cadre arrondi, photo à droite ===== */}
        <PhotoSection
          variant="framed"
          reverse
          eyebrow="Notre techno"
          title="Du capteur physique à la place trouvée."
          text="Des capteurs nouvelle génération installés dans la rue, une IA qui calcule la place réellement la plus proche par distance routière, et un guidage qui s'adapte en direct. Tout l'invisible, rendu utile."
          src="/photos/sensor-tech.jpg"
          alt="Capteur de stationnement Fyndzz"
        />

        {/* ===== AUDIENCES ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Pour qui" title="Une donnée, plusieurs bénéficiaires." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { t: 'Conducteurs', d: 'Trouvez-vous une place sans stress, et réduisez votre empreinte à chaque trajet.', cta: "Télécharger l'app →", href: '/install-pwa', bg: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})` },
              { t: 'Villes & mairies', d: 'Fluidifiez le trafic et pilotez la mobilité avec une donnée de stationnement temps réel.', cta: 'Nous contacter →', href: '/contact', bg: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})` },
              { t: 'Investisseurs', d: 'Une infrastructure de mobilité scalable, ville par ville. Découvrez la vision.', cta: 'Demander le deck →', href: '/contact', bg: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})` },
            ].map(({ t, d, cta, href, bg }) => (
              <div key={t} style={{ borderRadius: 22, padding: 34, minHeight: 260, display: 'flex', flexDirection: 'column', background: bg, color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '10px 0' }}>{t}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.55, flex: 1, opacity: 0.9 }}>{d}</p>
                <Link href={href} style={{ fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4, marginTop: 14, color: C.green }}>{cta}</Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TEAM ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="L'équipe" title="Les Fyndzzers derrière Fyndzz." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="fz-team">
            {[
              { name: 'Prénom Nom', role: 'CEO & Co-fondateur' },
              { name: 'Prénom Nom', role: 'CTO & Co-fondateur' },
              { name: 'Prénom Nom', role: 'Head of Hardware' },
              { name: 'Prénom Nom', role: 'Head of Growth' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', textAlign: 'center', paddingBottom: 18 }}>
                {/* Remplace par <Image src="/team/xxx.jpg" .../> */}
                <div style={{ aspectRatio: '1', background: `linear-gradient(135deg, ${C.pViolet}, ${C.pIndigo})`, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>photo</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '14px 0 2px' }}>{m.name}</h4>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{m.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 3 — fond plein largeur, texte par-dessus ===== */}
        <PhotoSection
          variant="overlay"
          reverse
          eyebrow="Notre ambition"
          title="Une ville, puis dix, puis toutes."
          text="On commence par l'Île-de-France, quartier par quartier, avec une fiabilité maximale. Demain, partout où chercher une place fait perdre du temps."
          src="/photos/city-skyline.jpg"
          alt="Skyline urbain"
        />

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Prêt à prendre la route ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '16px auto 28px', maxWidth: 440, position: 'relative' }}>Rejoignez les Fyndzzers et accédez à la carte en temps réel.</p>
            <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ ...btn, background: C.green, color: C.ink, padding: '14px 30px', fontSize: '1rem' }}>Créer un compte gratuit →</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <GlobalStyle />
    </div>
  )
}

/* ============================================================
   COMPOSANTS PARTAGÉS — identiques à la landing
   (idéalement à extraire dans /components)
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


function GlobalStyle() {
  return (
    <style>{`
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @media (max-width: 860px) {
        .fz-mosaic { grid-template-columns: 1fr !important; }
        .fz-3 { grid-template-columns: 1fr !important; }
        .fz-team { grid-template-columns: repeat(2, 1fr) !important; }
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