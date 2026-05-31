'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const C = {
  violet: '#3D2CD5', navy: '#160C6B', navyDeep: '#0d0a3e',
  green: '#00FF66', ink: '#0A0040',
  pOrange: '#FF914D', pViolet: '#4A3AAA', pIndigo: '#2A1A8A', pMagenta: '#8814CE',
}

const BADGES = [
  { sptz: 250, icon: '🅿️', name: 'Rookie' },
  { sptz: 500, icon: '⚡', name: 'Chargé' },
  { sptz: 750, icon: '🔥', name: 'En feu' },
  { sptz: 1000, icon: '🎯', name: 'Précis' },
  { sptz: 1250, icon: '🚀', name: 'Lancé' },
  { sptz: 1500, icon: '💎', name: 'Diamant' },
  { sptz: 1750, icon: '🌟', name: 'Étoile' },
  { sptz: 2000, icon: '👑', name: 'Roi du parking' },
  { sptz: 2500, icon: '🏆', name: 'Champion' },
  { sptz: 5000, icon: '🦁', name: 'Légende' },
]

const TIERS = [
  { name: 'Fyndzzer', range: '0 – 499', color: 'rgba(255,255,255,0.5)' },
  { name: 'Fyndzzer Pro', range: '500 – 1 999', color: C.green },
  { name: 'Fyndzzer Expert', range: '2 000 – 4 999', color: C.pOrange },
  { name: 'Fyndzzer Elite', range: '5 000+', color: C.pMagenta },
]

const REWARDS = [
  { cost: 500, label: '-10% sur le prochain paiement' },
  { cost: 1000, label: '30 min de stationnement offert' },
  { cost: 2500, label: '1h de stationnement offert' },
  { cost: 5000, label: '2h de stationnement offert' },
  { cost: 7500, label: '3h de stationnement offert' },
]

const GAINS = [
  { action: 'Trajet complété', pts: '+10 SPTZ', note: '×2 si véhicule électrique' },
  { action: 'Streak 7 jours', pts: '+50 SPTZ', note: 'Bonus hebdomadaire' },
  { action: 'Profil complété', pts: '+25 SPTZ', note: 'Une seule fois' },
  { action: 'Inviter un ami', pts: '+100 SPTZ', note: 'Par ami inscrit' },
]

export default function SptzPage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO ===== */}
        <section style={{ padding: '32px 0' }}>
          <div style={{ borderRadius: 26, padding: 56, position: 'relative', overflow: 'hidden', background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})`, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(0,255,102,0.1)', filter: 'blur(70px)', top: -100, right: -60, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 16 }}>Programme de fidélité</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Spotzz Points <span style={{ color: C.green }}>(SPTZ)</span>
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '18px auto 0' }}>
                Chaque trajet vous rapproche d'une récompense. Garez-vous, accumulez des points, grimpez les paliers et débloquez des avantages exclusifs.
              </p>
            </div>
          </div>
        </section>

        {/* ===== COMMENT GAGNER ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Gagner des points" title="Chaque action compte." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="fz-stats">
            {GAINS.map(g => (
              <div key={g.action} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: C.green, marginBottom: 8 }}>{g.pts}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{g.action}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{g.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PALIERS ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Les paliers" title="Affirmez votre progression." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="fz-stats">
            {TIERS.map((t, i) => (
              <div key={t.name} style={{ background: i === TIERS.length - 1 ? `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})` : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: t.color, marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t.range} SPTZ</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BATTLE PASS BADGES ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Road to Legend" title="Collectionnez les badges." />
          <div style={{ background: `linear-gradient(150deg, ${C.pIndigo}, ${C.navy})`, borderRadius: 26, padding: '40px 30px', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {BADGES.map((b, i) => (
                <div key={b.sptz} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', fontSize: '1.6rem', margin: '0 auto 8px' }}>
                      {b.icon}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.72rem', color: C.green }}>{b.sptz}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{b.name}</div>
                  </div>
                  {i < BADGES.length - 1 && (
                    <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.12)', margin: '0 4px', marginBottom: 28 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== RÉCOMPENSES ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Récompenses" title="Et débloquez des avantages exclusifs !" sub="Échangez vos SPTZ contre des réductions et du stationnement gratuit." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {REWARDS.map(r => (
              <div key={r.cost} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.green, minWidth: 80 }}>{r.cost.toLocaleString()}</div>
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>{r.label}</div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,255,102,0.12)', border: '1px solid rgba(0,255,102,0.25)', color: C.green }}>SPTZ</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Prêt à accumuler vos premiers SPTZ ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '16px auto 28px', maxWidth: 440, position: 'relative' }}>Inscrivez-vous, garez-vous, et commencez à gagner dès le premier trajet.</p>
            <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.green, color: C.ink, fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none' }}>Créer un compte gratuit →</Link>
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
        .fz-stats { grid-template-columns: repeat(2, 1fr) !important; }
        .fz-pad { padding: 34px !important; }
        .fz-split { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 600px) {
        .fz-lnk { display: none !important; }
        nav { padding: 1rem !important; }
      }
    `}</style>
  )
}