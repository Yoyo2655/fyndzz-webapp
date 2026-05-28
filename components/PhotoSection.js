'use client'

import Image from 'next/image'
import Link from 'next/link'

/* ============================================================
   PhotoSection — section photo + texte réutilisable
   ------------------------------------------------------------
   Dépose tes photos dans /public/ (ex: /public/photos/driver.jpg)
   puis renseigne `src`. Photos libres de droits conseillées
   (tes shootings, Unsplash, Pexels).

   PROPS :
   - variant : 'framed' | 'bleed' | 'overlay'
       framed  → photo dans un cadre arrondi (style Waze)
       bleed   → photo bord à bord, immersive
       overlay → photo en fond plein largeur, texte par-dessus
   - reverse : true => photo à droite (sinon à gauche)
   - eyebrow, title, text : contenu
   - cta : { label, href } (optionnel)
   - src, alt : image
   - accent : couleur d'accent (eyebrow + lien)
   ============================================================ */

const GREEN = '#00FF66'
const INK = '#0A0040'

export default function PhotoSection({
  variant = 'framed',
  reverse = false,
  eyebrow,
  title,
  text,
  cta,
  src,
  alt = '',
  accent = GREEN,
}) {
  /* ---------- VARIANT : OVERLAY (photo fond + texte dessus) ---------- */
  if (variant === 'overlay') {
    return (
      <section style={{ padding: '24px 0' }}>
        <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* PHOTO */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 860px) 100vw, 1180px"
            style={{ objectFit: 'cover', zIndex: 0 }}
          />
          {/* voile dégradé pour lisibilité */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `linear-gradient(${reverse ? '270deg' : '90deg'}, rgba(13,10,62,0.92) 0%, rgba(13,10,62,0.75) 45%, rgba(13,10,62,0.15) 100%)` }} />
          {/* TEXTE */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 520, padding: '48px', marginLeft: reverse ? 'auto' : 0, textAlign: reverse ? 'right' : 'left' }} className="fz-overlay-text">
            <Content eyebrow={eyebrow} title={title} text={text} cta={cta} accent={accent} alignReverse={reverse} />
          </div>
        </div>
      </section>
    )
  }

  /* ---------- VARIANT : BLEED (photo bord à bord) ---------- */
  if (variant === 'bleed') {
    return (
      <section style={{ padding: '24px 0' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 26, overflow: 'hidden', minHeight: 440, border: '1px solid rgba(255,255,255,0.1)' }}
          className="fz-split"
        >
          {/* PHOTO */}
          <div style={{ position: 'relative', minHeight: 280, order: reverse ? 2 : 1 }} className="fz-split-img">
            <Image src={src} alt={alt} fill sizes="(max-width: 860px) 100vw, 590px" style={{ objectFit: 'cover' }} />
          </div>
          {/* TEXTE */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', background: 'rgba(255,255,255,0.04)', order: reverse ? 1 : 2 }}>
            <Content eyebrow={eyebrow} title={title} text={text} cta={cta} accent={accent} />
          </div>
        </div>
      </section>
    )
  }

  /* ---------- VARIANT : FRAMED (cadre arrondi, style Waze) ---------- */
  return (
    <section style={{ padding: '24px 0' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}
        className="fz-split"
      >
        {/* PHOTO */}
        <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', order: reverse ? 2 : 1 }} className="fz-split-img">
          <Image src={src} alt={alt} fill sizes="(max-width: 860px) 100vw, 560px" style={{ objectFit: 'cover' }} />
        </div>
        {/* TEXTE */}
        <div style={{ padding: '12px 8px', order: reverse ? 1 : 2 }}>
          <Content eyebrow={eyebrow} title={title} text={text} cta={cta} accent={accent} />
        </div>
      </div>
    </section>
  )
}

/* ---------- bloc texte commun ---------- */
function Content({ eyebrow, title, text, cta, accent, alignReverse }) {
  return (
    <>
      {eyebrow && (
        <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
        {title}
      </h2>
      <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', marginBottom: cta ? 26 : 0 }}>
        {text}
      </p>
      {cta && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: alignReverse ? 'flex-end' : 'flex-start' }}>
          <Link href={cta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GREEN, color: INK, fontWeight: 700, borderRadius: 10, padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}>
            {cta.label}
          </Link>
        </div>
      )}
    </>
  )
}