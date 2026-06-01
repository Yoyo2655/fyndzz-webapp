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

export default function CitiesPage() {
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
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 16 }}>Villes & collectivités</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Reprenez le contrôle de votre stationnement.
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, color: 'rgba(255,255,255,0.8)' }}>
                Fyndzz Solutions donne aux collectivités une vision temps réel de l'occupation des places sur leur territoire. Moins de congestion, moins de pollution, des décisions basées sur la donnée.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.green, color: C.ink, fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}>Planifier une démo →</Link>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>Nous contacter</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LE PROBLÈME POUR LES VILLES ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Le constat" title="Le stationnement, angle mort des politiques de mobilité." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { big: '30%', t: 'du trafic en recherche', d: "Des véhicules qui tournent en rond génèrent congestion, pollution et frustration — sans que la ville n'ait de visibilité dessus." },
              { big: '0', t: 'donnée exploitable', d: "Les villes n'ont aucune vision en temps réel de l'occupation réelle de leurs places de stationnement en voirie." },
              { big: '?', t: 'places sous-utilisées', d: "Sans données, impossible de savoir quelles zones sont saturées et lesquelles ont des places disponibles en permanence." },
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
          variant="overlay"
          eyebrow="La solution"
          title="Des capteurs dans la rue, un dashboard à la mairie."
          text="Fyndzz déploie un réseau de capteurs IoT sur la voirie de votre commune. Chaque place remonte son état — libre ou occupée — en temps réel. Vous visualisez tout depuis le dashboard Fyndzz Solutions."
          src="/photos/city-street.jpg"
          alt="Rue urbaine équipée de capteurs"
        />

        {/* ===== FYNDZZ SOLUTIONS ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Fyndzz Solutions" title="Votre dashboard de stationnement." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="fz-split">
            {[
              { t: 'Carte temps réel', d: "Visualisez l'état d'occupation de chaque place, rue par rue, quartier par quartier, en temps réel." },
              { t: 'Analytics & rapports', d: "Taux d'occupation par zone, heures de pointe, durées moyennes de stationnement. Des données pour piloter." },
              { t: 'Gestion des équipes', d: "Accès par rôle (admin, opérateur, contrôle). Invitez vos équipes et attribuez les droits." },
              { t: 'Alertes & notifications', d: "Soyez alerté en temps réel des anomalies : occupation anormale, capteur hors ligne, zone saturée." },
            ].map(({ t, d }) => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 26 }}>
                <div style={{ width: 40, height: 4, borderRadius: 4, background: C.green, marginBottom: 16 }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>{t}</h4>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHOTO 2 ===== */}
        <PhotoSection
          variant="framed"
          reverse
          eyebrow="Le déploiement"
          title="Clé en main, quartier par quartier."
          text="Fyndzz gère l'installation, la maintenance et la connectivité des capteurs. Vous n'avez besoin que d'un navigateur pour accéder au dashboard. Déploiement progressif : on commence par un quartier pilote, on étend sur résultats."
          src="/photos/sensor-tech.jpg"
          alt="Installation d'un capteur Fyndzz"
        />

        {/* ===== BÉNÉFICES ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Les bénéfices" title="Ce que Fyndzz change pour votre ville." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { icon: '🚗', t: 'Moins de trafic', d: "Les conducteurs trouvent leur place plus vite : moins de véhicules en circulation inutile." },
              { icon: '🌿', t: 'Moins de pollution', d: "Réduction directe des émissions de CO₂ liées à la recherche de stationnement." },
              { icon: '📊', t: 'Des décisions éclairées', d: "Les données d'occupation alimentent vos choix d'urbanisme et de politique de mobilité." },
            ].map(({ icon, t, d }) => (
              <div key={t} style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{icon}</div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>{t}</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.55, opacity: 0.85 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== COMMENT ÇA SE PASSE ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Comment ça se passe" title="Du premier contact au déploiement." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { num: '01', t: 'Prise de contact', d: 'On échange sur vos besoins, vos zones prioritaires, et le périmètre du pilote.', color: C.pViolet },
              { num: '02', t: 'Quartier pilote', d: 'Déploiement d\'un réseau de capteurs sur une zone définie ensemble. Résultats sous 4 semaines.', color: C.pMagenta },
              { num: '03', t: 'Analyse & résultats', d: 'Premiers dashboards, premiers insights. Validation de la valeur avant extension.', color: C.pOrange },
              { num: '04', t: 'Extension', d: 'Déploiement progressif sur l\'ensemble du territoire, à votre rythme.', color: C.green },
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28 }}>
                <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: s.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '1rem', color: s.color === C.green ? C.ink : '#fff' }}>{s.num}</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>{s.t}</h4>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Prêt à rendre votre stationnement intelligent ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '16px auto 28px', maxWidth: 480, position: 'relative' }}>Contactez-nous pour planifier une démo ou discuter d'un pilote sur votre commune.</p>
            <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.green, color: C.ink, fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none' }}>Planifier une démo →</Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>Nous contacter</Link>
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