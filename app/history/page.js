'use client'

import Link from 'next/link'
import PhotoSection from '@/components/PhotoSection'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

/* ============================================================
   PALETTE FYNDZZ — identique landing/company
   FOND : #3D2CD5 → #160C6B · ACCENT : #00FF66
   PASTILLES : #FF914D · #4A3AAA · #2A1A8A · #8814CE
   ============================================================ */
const C = {
  violet: '#3D2CD5', navy: '#160C6B', navyDeep: '#0d0a3e',
  green: '#00FF66', ink: '#0A0040',
  pOrange: '#FF914D', pViolet: '#4A3AAA', pIndigo: '#2A1A8A', pMagenta: '#8814CE',
}

/* Jalons de la timeline — remplace les dates [À DÉFINIR] */
const MILESTONES = [
  { date: 'Février 2024', t: 'Le déclic', d: "Coincés à tourner pour se garer, on réalise que le problème n'est pas le manque de places — c'est leur invisibilité.", color: C.pOrange },
  { date: 'Mars 2026', t: 'L\'équipe s\'agrandit', d: 'L’équipe se renforce et réunit désormais 6 collaborateurs mobilisés autour d’une même ambition : construire la solution.', color: C.pMagenta },
  { date: '[À DÉFINIR]', t: 'Le premier capteur', d: 'Premier prototype sur le terrain. Une place, un capteur, une preuve que ça marche.', color: C.pViolet },
  { date: '[À DÉFINIR]', t: 'Le pilote 16ᵉ', d: 'Déploiement d\'un réseau réel dans le 16ᵉ arrondissement de Paris.', color: C.pIndigo },
  { date: 'Aujourd\'hui', t: '+500 capteurs', d: 'Un réseau vivant en Île-de-France, en expansion continue.', color: C.green },
]

export default function HistoryPage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO ===== */}
        <section style={{ padding: '32px 0' }}>
          <div style={{ borderRadius: 26, padding: 56, position: 'relative', overflow: 'hidden', background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(0,255,102,0.1)', filter: 'blur(70px)', top: -100, right: -60, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', maxWidth: 720 }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 16 }}>Notre histoire</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Au départ, comme vous, on en avait assez de perdre du temps à chercher une place.
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, color: 'rgba(255,255,255,0.8)' }}>
                Fyndzz n'est pas né dans un bureau. Il est né dans le trafic, un soir, à tourner en rond pour trouver une place qui n'existait pas.
              </p>
            </div>
          </div>
        </section>

        {/* ===== RÉCIT : LE DÉCLIC ===== */}
        <PhotoSection
          variant="bleed"
          eyebrow="Le déclic"
          title="Le problème, ce n'est pas le manque de places."
          text="C'est qu'on ne les voit pas. En France, 30% des conducteurs qui circulent en ville cherchent simplement à se garer. Une place se libère à 50 mètres, mais personne ne le sait. On a voulu rendre cet invisible visible."
          src="/photos/history-traffic.jpg"
          alt="Voiture cherchant une place dans le trafic"
        />

        {/* ===== RÉCIT : LA RENCONTRE ===== */}
        <PhotoSection
          variant="framed"
          reverse
          eyebrow="La rencontre"
          title="Une équipe, une conviction commune."
          text="Portés par une même obsession, nos collaborateurs travaillent à résoudre le problème du stationnement en l’attaquant à sa racine."          src="/photos/history-founders.jpg"
          alt="Les fondateurs de Fyndzz"
        />

        {/* ===== RÉCIT : LE PREMIER CAPTEUR ===== */}
        <PhotoSection
          variant="overlay"
          eyebrow="Le premier prototype"
          title="Une place. Un capteur. Une preuve."
          text="Le premier capteur posé sur le bitume a confirmé l'intuition : on peut savoir, en temps réel, si une place est libre. Le reste n'était plus qu'une question d'échelle."
          src="/photos/history-sensor.jpg"
          alt="Premier capteur Fyndzz installé"
        />

        {/* ===== TIMELINE VISUELLE ===== */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 50px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green }}>Le parcours</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, marginTop: 12, letterSpacing: '-0.02em' }}>D'une place à un réseau.</h2>
          </div>

          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            {/* ligne verticale */}
            <div style={{ position: 'absolute', left: 19, top: 8, bottom: 8, width: 2, background: 'rgba(255,255,255,0.12)' }} className="fz-tl-line" />

            {MILESTONES.map((m, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', gap: 24, paddingBottom: i === MILESTONES.length - 1 ? 0 : 36 }}>
                {/* pastille */}
                <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: m.color, display: 'grid', placeItems: 'center', fontWeight: 800, color: m.color === C.green ? C.ink : '#fff', fontSize: '0.85rem', boxShadow: `0 0 0 6px ${C.navy}` }}>
                    {i + 1}
                  </div>
                </div>
                {/* carte */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 24 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: m.color === C.green ? C.green : 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{m.date}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>{m.t}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.65)' }}>{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MISSION ===== */}
        <section style={{ padding: '0 0 40px' }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, borderRadius: 30, padding: 60, textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', bottom: -140, left: -80, pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9, marginBottom: 16, color: C.green }}>Notre mission</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 800, maxWidth: 760, margin: '0 auto', letterSpacing: '-0.02em' }}>
                Rendre chaque place visible, pour que personne ne perde plus son temps à chercher.
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 560, margin: '18px auto 28px', opacity: 0.92 }}>
                Moins de tours, moins de CO₂, plus de ville. C'est ce qui nous fait avancer, capteur après capteur, quartier après quartier.
              </p>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.green, color: C.ink, fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none' }}>
                Rejoindre les Fyndzzers →
              </Link>
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
   COMPOSANTS PARTAGÉS — identiques aux autres pages
   (idéalement à extraire dans /components)
   ============================================================ */



function GlobalStyle() {
  return (
    <style>{`
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @media (max-width: 860px) {
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