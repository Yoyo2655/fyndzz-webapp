'use client'

import Link from 'next/link'
import PhotoSection from '@/components/PhotoSection'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const C = {
  violet: '#3D2CD5', navy: '#160C6B', navyDeep: '#0d0a3e',
  green: '#00FF66', ink: '#0A0040',
  pOrange: '#FF914D', pViolet: '#4A3AAA', pIndigo: '#2A1A8A', pMagenta: '#8814CE',
}

export default function BusinessPage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO ===== */}
        <section style={{ padding: '32px 0' }}>
          <div style={{ borderRadius: 26, padding: 56, position: 'relative', overflow: 'hidden', background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(0,255,102,0.1)', filter: 'blur(70px)', top: -100, right: -60, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', maxWidth: 720 }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', opacity: 0.9, marginBottom: 16 }}>Investisseurs</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                L'infrastructure de stationnement de demain se construit aujourd'hui.
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, opacity: 0.9 }}>
                Fyndzz déploie un réseau de capteurs IoT pour rendre le stationnement urbain visible en temps réel. Un marché massif, une donnée inexistante, une infrastructure scalable.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: C.ink, fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}>Demander le deck →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LE PROBLÈME / L'OPPORTUNITÉ ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="L'opportunité" title="Un problème massif, encore sans solution." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { big: '30%', t: 'du trafic urbain', d: 'est composé de véhicules qui ne se déplacent pas : ils cherchent une place.' },
              { big: '~20 min', t: 'perdues par trajet', d: "Le temps moyen qu'un conducteur passe à chercher du stationnement en zone dense." },
              { big: '0', t: "solutions données temps réel", d: "Aucune infrastructure existante ne fournit l'état réel des places de stationnement en rue." },
            ].map(({ big, t, d }) => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 30 }}>
                <div style={{ fontWeight: 800, fontSize: '2.4rem', color: C.green, letterSpacing: '-0.02em' }}>{big}</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '8px 0 6px' }}>{t}</h4>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 1 ===== */}
        <PhotoSection
          variant="bleed"
          eyebrow="La donnée manquante"
          title="Le stationnement est le dernier angle mort de la mobilité."
          text="On sait en temps réel où est chaque bus, chaque vélo, chaque trottinette. Mais personne ne sait où sont les places de parking libres. Fyndzz comble ce vide avec un réseau de capteurs physiques."
          src="/photos/aerial-traffic.jpg"
          alt="Vue aérienne du trafic urbain"
        />

        {/* ===== NOTRE MODÈLE ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Le modèle" title="Deux sources de revenus, un réseau de données." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="fz-split">
            <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 14 }}>B2C · Conducteurs</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Fyndzz App</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.85 }}>
                Application mobile pour les conducteurs. Guidage temps réel vers les places libres. Modèle freemium avec fonctionnalités premium (navigation avancée, réservation, intégrations).
              </p>
            </div>
            <div style={{ background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 14 }}>B2B · Villes</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Fyndzz Solutions</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.85 }}>
                Dashboard SaaS pour les collectivités. Données d'occupation, analytics, pilotage de la politique de stationnement. Facturation en licence annuelle.
              </p>
            </div>
          </div>
        </section>

        {/* ===== TRACTION ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Traction" title="Où on en est." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="fz-stats">
            {[
              { n: 'Une équipe', l: 'réunie autour d\'une même mission' },
              { n: 'Île-de-France', l: 'Zone de lancement prévue' },
              { n: 'MVP live', l: 'App en production' },
              { n: 'Dashboard', l: 'SaaS B2B opérationnel' },
            ].map(({ n, l }) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 24, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: C.green }}>{n}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 2 ===== */}
        <PhotoSection
          variant="framed"
          reverse
          eyebrow="L'avantage compétitif"
          title="Des capteurs physiques, pas du crowdsourcing."
          text="Contrairement aux solutions basées sur les données GPS ou communautaires, Fyndzz s'appuie sur un réseau hardware propriétaire. Chaque capteur remonte une donnée fiable, toutes les 10 secondes, indépendamment du nombre d'utilisateurs."
          src="/photos/sensor-tech.jpg"
          alt="Capteur de stationnement Fyndzz"
        />

        {/* ===== ROADMAP ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Roadmap" title="La vision à 3 ans." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { phase: 'Phase 1', period: '2025-2026', title: 'Île-de-France', desc: 'Déploiement du réseau de capteurs, lancement de l\'app grand public et du dashboard municipal.', color: C.pViolet },
              { phase: 'Phase 2', period: '2026-2027', title: 'Expansion nationale', desc: 'Extension aux grandes métropoles françaises (Lyon, Marseille, Bordeaux, Lille). Partenariats municipaux.', color: C.pMagenta },
              { phase: 'Phase 3', period: '2027-2028', title: 'Expansion européenne', desc: 'Déploiement dans les capitales européennes. Ouverture API pour intégrations tierces (GPS, assureurs, constructeurs).', color: C.pOrange },
            ].map(r => (
              <div key={r.phase} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28 }}>
                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 14, background: r.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>{r.phase.split(' ')[1]}</div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{r.period}</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>{r.title}</h4>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Intéressé par Fyndzz ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '16px auto 28px', maxWidth: 480, position: 'relative' }}>Demandez le deck investisseur et découvrez notre vision, nos chiffres et notre roadmap en détail.</p>
            <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: C.ink, fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none' }}>Demander le deck →</Link>
              <Link href="/about-us" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>Découvrir l'entreprise</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <GlobalStyle />
    </div>
  )
}

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
      @media (max-width: 860px) {
        .fz-3 { grid-template-columns: 1fr !important; }
        .fz-split { grid-template-columns: 1fr !important; }
        .fz-split-img { order: 1 !important; min-height: 240px !important; }
        .fz-overlay-text { max-width: 100% !important; text-align: left !important; margin-left: 0 !important; padding: 32px !important; }
        .fz-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .fz-pad { padding: 34px !important; }
      }
      @media (max-width: 600px) {
        .fz-lnk { display: none !important; }
        nav { padding: 1rem !important; }
      }
    `}</style>
  )
}