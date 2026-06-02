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

export default function PartnersPage() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.violet} 0%, ${C.navy} 100%)`, color: '#fff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,255,102,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(61,44,213,0.3)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <NavBar />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ===== HERO ===== */}
        <section style={{ padding: '32px 0' }}>
          <div style={{ borderRadius: 26, padding: 56, position: 'relative', overflow: 'hidden', background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pOrange})`, border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(0,255,102,0.1)', filter: 'blur(70px)', top: -100, right: -60, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', maxWidth: 720 }}>
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', opacity: 0.9, marginBottom: 16 }}>Entreprises & artisans</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Vos clients cherchent une place. Guidez-les jusqu'à votre porte.
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, opacity: 0.92 }}>
                Référencez votre commerce sur Fyndzz et rendez-le visible aux conducteurs qui se garent à proximité. Transformez le stationnement en trafic en point de vente.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: C.ink, fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}>Devenir partenaire →</Link>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>En savoir plus</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LE CONSTAT ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Le constat" title="Le parking décide souvent de l'achat." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { big: '63%', t: 'des consommateurs', d: "choisissent un commerce plutôt qu'un autre en fonction de la facilité à se garer à proximité." },
              { big: '~20 min', t: 'perdues à chercher', d: "C'est du temps que vos clients ne passent pas chez vous. Et une chance sur deux qu'ils abandonnent." },
              { big: '30%', t: 'de trafic inutile', d: "Des voitures qui tournent devant votre vitrine sans jamais s'arrêter — faute de place visible." },
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
          eyebrow="Le principe"
          title="Soyez visible là où vos clients se garent."
          text="Quand un conducteur cherche une place près de votre adresse, votre commerce apparaît sur la carte Fyndzz. Un point de contact naturel, au moment précis où il arrive dans le quartier."
          src="/photos/city-street.jpg"
          alt="Commerce en bord de rue"
        />

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section style={{ padding: '50px 0' }}>
          <SecHead tag="Comment ça marche" title="Simple, rapide, efficace." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { num: '01', t: 'Vous vous inscrivez', d: 'Créez votre fiche partenaire en quelques minutes : nom, adresse, catégorie, horaires, description.', color: C.pViolet },
              { num: '02', t: 'Vous apparaissez sur la carte', d: "Votre commerce s'affiche sur la carte Fyndzz quand un conducteur se gare à proximité de votre adresse.", color: C.pMagenta },
              { num: '03', t: 'Vos clients vous trouvent', d: "Le conducteur voit votre fiche avec les infos essentielles : nom, distance à pied depuis la place, catégorie.", color: C.pOrange },
              { num: '04', t: 'Vous mesurez l\'impact', d: "Accédez à vos statistiques : nombre d'affichages, clics, itinéraires piétons générés vers votre commerce.", color: C.green },
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

        {/* ===== POURQUOI FYNDZZ ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Vos avantages" title="Plus qu'un annuaire. Un outil de trafic." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="fz-split">
            {[
              { t: 'Visibilité contextuelle', d: "Vous n'apparaissez pas au milieu de milliers de résultats. Vous apparaissez au bon moment, quand le client est déjà dans votre quartier." },
              { t: 'Zéro effort technique', d: "Pas d'app à développer, pas de matériel à installer. Vous créez votre fiche, on s'occupe du reste." },
              { t: 'Trafic piéton mesuré', d: "Chaque itinéraire piéton généré depuis la place vers votre commerce est tracké. Vous savez combien de gens sont venus." },
              { t: 'Idéal commerces de proximité', d: "Restaurants, boulangeries, coiffeurs, garages, cabinets — tout commerce qui dépend du trafic local et du stationnement." },
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
          eyebrow="Cas d'usage"
          title="Idéal pour les commerces de quartier."
          text="Un restaurant, une boulangerie, un garage, un cabinet médical — tout professionnel qui dépend du passage et du stationnement à proximité. Vos clients se garent, vous apparaissez."
          src="/photos/driver.jpg"
          alt="Conducteur garé près d'un commerce"
        />

        {/* ===== TARIFS ===== */}
        <section style={{ padding: '0 0 50px' }}>
          <SecHead tag="Tarifs" title="Des offres adaptées à votre taille." sub="Lancement en cours — les premiers partenaires bénéficient de conditions privilégiées." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="fz-3">
            {[
              { name: 'Essentiel', price: 'Gratuit', desc: 'Fiche commerce de base, visibilité sur la carte, catégorie et horaires.', features: ['Fiche sur la carte', 'Catégorie & horaires', 'Stats basiques'], bg: 'rgba(255,255,255,0.04)' },
              { name: 'Pro', price: 'Bientôt', desc: 'Fiche enrichie, photos, promotions, analytics détaillées.', features: ['Tout Essentiel', 'Photos & description', 'Promotions ciblées', 'Analytics détaillées'], bg: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})` },
              { name: 'Premium', price: 'Sur mesure', desc: 'Mise en avant prioritaire, campagnes push, accompagnement dédié.', features: ['Tout Pro', 'Mise en avant prioritaire', 'Notifications push', 'Accompagnement dédié'], bg: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})` },
            ].map(p => (
              <div key={p.name} style={{ background: p.bg, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }}>{p.price}</div>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: 18 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
                      <span style={{ color: C.green, fontSize: '0.9rem' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{ display: 'block', textAlign: 'center', marginTop: 22, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '11px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Nous contacter
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pOrange})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Prêt à attirer plus de clients ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '16px auto 28px', maxWidth: 480, position: 'relative' }}>Rejoignez les premiers partenaires Fyndzz et profitez de conditions de lancement exclusives.</p>
            <div style={{ position: 'relative', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: C.ink, fontWeight: 700, borderRadius: 10, padding: '14px 30px', fontSize: '1rem', textDecoration: 'none' }}>Devenir partenaire →</Link>
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