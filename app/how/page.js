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

export default function HowPage() {
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
              <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 16 }}>Comment ça marche</div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                De votre destination à la place libre, en trois temps.
              </h1>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 18, color: 'rgba(255,255,255,0.8)' }}>
                Pas de magie, pas de données périmées. Un réseau de capteurs physiques, une IA qui calcule, et un guidage qui s'adapte en direct.
              </p>
            </div>
          </div>
        </section>

        {/* ===== ÉTAPE 1 — DÉTECTION ===== */}
        <section style={{ padding: '40px 0' }}>
          <StepHeader num="01" title="On détecte" color={C.pViolet} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 24 }} className="fz-split">
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Des capteurs physiques, pas du crowdsourcing</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Nos capteurs IoT sont installés directement sur la voirie. Chacun surveille une ou plusieurs places et remonte leur état, libre ou occupée, en continu.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                {['Mise à jour toutes les 10s', 'Réseau 500+ capteurs', 'Île-de-France'].map(t => (
                  <span key={t} style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, background: 'rgba(0,255,102,0.12)', border: '1px solid rgba(0,255,102,0.25)', color: C.green }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Pourquoi pas du GPS ou du satellite ?</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Les données satellite sont souvent datées de plusieurs minutes. Le crowdsourcing dépend du nombre d'utilisateurs. Nos capteurs physiques, eux, ne mentent pas : une place est libre ou elle ne l'est pas, en temps réel.
              </p>
            </div>
          </div>
        </section>

        <PhotoSection
          variant="framed"
          eyebrow="La technologie"
          title="Petit capteur, grande précision."
          text="Installé en hauteur, chaque capteur utilise une combinaison de technologies (caméra, radar) boostée à l'IA pour détecter l'occupation d'une place avec une fiabilité maximale de jour comme de nuit, par tous les temps."
          src="/photos/sensor-tech.jpg"
          alt="Capteur de stationnement Fyndzz"
        />

        {/* ===== ÉTAPE 2 — CALCUL ===== */}
        <section style={{ padding: '40px 0' }}>
          <StepHeader num="02" title="On calcule" color={C.pMagenta} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 24 }} className="fz-split">
            <div style={{ background: `linear-gradient(150deg, ${C.pMagenta}, ${C.pViolet})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Activation automatique</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.9 }}>
                Vous entrez votre destination et roulez normalement. À environ <strong>7 minutes de l'arrivée</strong>, Fyndzz active automatiquement le mode parking et commence à scanner les places disponibles autour de votre destination.
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Distance routière réelle</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Fyndzz ne vous envoie pas vers "la place la plus proche à vol d'oiseau". L'algorithme calcule la <strong style={{ color: C.green }}>distance routière réelle</strong> : sens uniques, interdictions de tourner, tout est pris en compte pour trouver la place véritablement la plus rapide d'accès.
              </p>
            </div>
          </div>
        </section>

        <PhotoSection
          variant="bleed"
          reverse
          eyebrow="L'intelligence"
          title="La bonne place, pas la plus proche sur la carte."
          text="Une place à 200m à vol d'oiseau peut être à 8 minutes en voiture si elle est séparée par un sens interdit. Notre algorithme de routage utilise les vraies routes, les vrais sens de circulation, pour vous guider vers la place réellement la plus rapide."
          src="/photos/city-street.jpg"
          alt="Rues parisiennes avec sens de circulation"
        />

        {/* ===== ÉTAPE 3 — GUIDAGE ===== */}
        <section style={{ padding: '40px 0' }}>
          <StepHeader num="03" title="On vous guide" color={C.pOrange} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 24 }} className="fz-split">
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Navigation turn-by-turn</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Comme un GPS classique, Fyndzz vous guide pas à pas jusqu'à la place sélectionnée. Vous n'avez rien à chercher des yeux — suivez les instructions, la place est là.
              </p>
            </div>
            <div style={{ background: `linear-gradient(150deg, ${C.pOrange}, ${C.pMagenta})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 34 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 12 }}>Recalcul dynamique</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.92 }}>
                Pendant que vous roulez, les capteurs continuent de remonter les données. Si votre place est prise avant que vous n'arriviez, ou si une <strong>meilleure place se libère</strong> en chemin — Fyndzz recalcule et vous redirige automatiquement. Zéro stress.
              </p>
            </div>
          </div>
        </section>

        {/* ===== À L'ARRIVÉE ===== */}
        <section style={{ padding: '20px 0 50px' }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pIndigo}, ${C.navy})`, borderRadius: 26, padding: 50, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,255,102,0.1)', filter: 'blur(60px)', bottom: -80, left: -40, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }} className="fz-split">
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.green, marginBottom: 14 }}>À l'arrivée</div>
                <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>Garé. Et voilà ce que vous avez gagné.</h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                  Une fois garé, Fyndzz vous montre le temps et le CO₂ économisés par rapport à une recherche classique. Et vous gagnez des <strong style={{ color: C.green }}>Spotzz Points (SPTZ)</strong> à chaque trajet.
                </p>
                <Link href="/sptz" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4, color: C.green, marginTop: 18 }}>
                  Découvrir le programme SPTZ →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { n: '~8 min', l: 'gagnées en moyenne' },
                  { n: '−34%', l: 'de CO₂ par trajet' },
                  { n: '0,50€', l: 'économisés / trajet' },
                  { n: '+10 SPTZ', l: 'par trajet complété' },
                ].map(({ n, l }) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.3rem', color: C.green }}>{n}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ RAPIDE ===== */}
        <section style={{ padding: '0 0 50px' }} id="faq">
          <SecHead tag="Questions fréquentes" title="On vous dit tout." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: "Est-ce que ça marche partout en France ?", a: "Pour l'instant, notre réseau de capteurs couvre l'Île-de-France. On s'étend quartier par quartier pour garantir une fiabilité maximale avant chaque extension." },
              { q: "C'est gratuit ?", a: "L'inscription et l'accès à la carte sont gratuits. Le stationnement lui-même reste payant selon les tarifs de la ville — Fyndzz vous aide juste à trouver la place, pas à éviter l'horodateur." },
              { q: "Comment les capteurs sont-ils alimentés ?", a: "Nos capteurs sont conçus pour fonctionner de manière autonome avec une batterie longue durée et une connexion réseau basse consommation (LoRaWAN / NB-IoT)." },
              { q: "Et si la place est prise avant que j'arrive ?", a: "C'est là que le recalcul dynamique entre en jeu. Les capteurs détectent le changement en temps réel, et Fyndzz vous redirige automatiquement vers la prochaine place disponible." },
              { q: "Quelle différence avec Waze ou Google Maps ?", a: "Waze et Google Maps vous guident vers une destination, pas vers une place de parking. Fyndzz ajoute une couche de données temps réel sur le stationnement grâce à des capteurs physiques — pas du crowdsourcing." },
            ].map(({ q, a }, i) => (
              <details key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                <summary style={{ padding: '18px 24px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q}
                  <span style={{ color: C.green, fontSize: '1.2rem', flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 24px 18px', fontSize: '0.92rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ paddingBottom: 40 }}>
          <div style={{ background: `linear-gradient(150deg, ${C.pViolet}, ${C.pIndigo})`, borderRadius: 30, padding: 64, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="fz-pad">
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,255,102,0.12)', filter: 'blur(70px)', top: -120, right: -80, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, position: 'relative' }}>Convaincu ?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '16px auto 28px', maxWidth: 440, position: 'relative' }}>Créez un compte et trouvez votre prochaine place en moins de 3 minutes.</p>
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

function StepHeader({ num, title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>{num}</div>
      <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h2>
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
      details summary::-webkit-details-marker { display: none; }
      details[open] summary span { transform: rotate(45deg); }
      details summary span { transition: transform 0.2s; }
      @media (max-width: 860px) {
        .fz-split { grid-template-columns: 1fr !important; }
        .fz-split-img { order: 1 !important; min-height: 240px !important; }
        .fz-overlay-text { max-width: 100% !important; text-align: left !important; margin-left: 0 !important; padding: 32px !important; }
        .fz-pad { padding: 34px !important; }
      }
      @media (max-width: 600px) {
        .fz-lnk { display: none !important; }
        nav { padding: 1rem !important; }
      }
    `}</style>
  )
}