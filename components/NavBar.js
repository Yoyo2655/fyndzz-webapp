'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GREEN = '#00FF66'
const INK = '#0A0040'

const LINKS = [
  { href: '/company', label: "L'entreprise" },
  { href: '/history', label: 'A propos de nous' },
  {
    label: 'Solutions',
    children: [
      { href: '/cities', label: 'Villes & mairies', sub: 'Pilotez le stationnement urbain' },
      { href: '/business', label: 'Investisseurs', sub: 'Découvrez la vision et la roadmap' },
    ],
  },
]

export default function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <style>{`
        /* === Desktop nav links === */
        .fz-nav-link {
          font-size: 0.9rem; font-weight: 600;
          color: rgba(255,255,255,0.7);
          padding: 0.45rem 1rem; border-radius: 8px;
          background: transparent;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .fz-nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .fz-nav-link.active { background: rgba(255,255,255,0.15); color: #fff; font-weight: 700; }

        /* === Desktop dropdown === */
        .fz-dropdown { position: relative; }
        .fz-dropdown-trigger {
          font-size: 0.9rem; font-weight: 600;
          color: rgba(255,255,255,0.7);
          padding: 0.45rem 1rem; border-radius: 8px;
          background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: background 0.2s, color 0.2s; font-family: inherit;
        }
        .fz-dropdown-trigger:hover,
        .fz-dropdown:hover .fz-dropdown-trigger { background: rgba(255,255,255,0.1); color: #fff; }
        .fz-dropdown-trigger.active { background: rgba(255,255,255,0.15); color: #fff; font-weight: 700; }
        .fz-dropdown-trigger .arrow { font-size: 0.6rem; transition: transform 0.2s; }
        .fz-dropdown:hover .fz-dropdown-trigger .arrow { transform: rotate(180deg); }
        .fz-dropdown-menu {
          position: absolute; top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(6px);
          min-width: 260px;
          background: rgba(13,10,62,0.95); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 14px;
          padding: 8px; opacity: 0; visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .fz-dropdown:hover .fz-dropdown-menu {
          opacity: 1; visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .fz-dropdown-item {
          display: block; padding: 12px 16px; border-radius: 10px;
          text-decoration: none; color: #fff; transition: background 0.15s;
        }
        .fz-dropdown-item:hover { background: rgba(255,255,255,0.08); }
        .fz-dropdown-item .dd-label { font-weight: 700; font-size: 0.92rem; margin-bottom: 2px; }
        .fz-dropdown-item .dd-sub { font-size: 0.78rem; color: rgba(255,255,255,0.45); }

        /* === Hamburger button === */
        .fz-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          width: 40px; height: 40px; padding: 8px;
          flex-direction: column; justify-content: center; align-items: center; gap: 5px;
        }
        .fz-hamburger span {
          display: block; width: 22px; height: 2px; background: #fff;
          border-radius: 2px; transition: transform 0.3s, opacity 0.3s;
        }
        .fz-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .fz-hamburger.open span:nth-child(2) { opacity: 0; }
        .fz-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* === Mobile overlay === */
        .fz-mobile-menu {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(13,10,62,0.98); backdrop-filter: blur(20px);
          display: flex; flex-direction: column;
          padding: 80px 32px 40px;
          opacity: 0; visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          overflow-y: auto;
        }
        .fz-mobile-menu.open { opacity: 1; visibility: visible; }
        .fz-mobile-link {
          display: block; padding: 16px 0;
          font-size: 1.2rem; font-weight: 700; color: #fff;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: color 0.2s;
        }
        .fz-mobile-link:hover { color: ${GREEN}; }
        .fz-mobile-link.active { color: ${GREEN}; }
        .fz-mobile-sub {
          display: block; padding: 12px 0 12px 20px;
          font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .fz-mobile-sub:hover { color: #fff; }
        .fz-mobile-sub .sub-hint {
          font-size: 0.78rem; color: rgba(255,255,255,0.35); font-weight: 400;
        }
        .fz-mobile-section {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          padding: 20px 0 8px; border: none;
        }
        .fz-mobile-cta {
          display: flex; flex-direction: column; gap: 12px;
          margin-top: auto; padding-top: 30px;
        }

        /* === Responsive === */
        @media (max-width: 768px) {
          .fz-desktop-links { display: none !important; }
          .fz-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Mobile overlay menu */}
      <div className={`fz-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {LINKS.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <div className="fz-mobile-section">{item.label}</div>
                {item.children.map(c => (
                  <Link key={c.href} href={c.href} className="fz-mobile-sub" onClick={() => setMobileOpen(false)}>
                    {c.label}
                    <div className="sub-hint">{c.sub}</div>
                  </Link>
                ))}
              </div>
            )
          }
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} className={`fz-mobile-link${active ? ' active' : ''}`} onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          )
        })}
        <div className="fz-mobile-cta">
          <Link href="/login" onClick={() => setMobileOpen(false)} style={{ textAlign: 'center', color: '#fff', fontSize: '1rem', fontWeight: 600, padding: '14px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, textDecoration: 'none' }}>
            Connexion
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)} style={{ textAlign: 'center', background: GREEN, color: INK, fontSize: '1rem', fontWeight: 700, padding: '14px', borderRadius: 10, textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </div>
      </div>

      <nav style={{ position: 'relative', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', maxWidth: 1180, margin: '0 auto' }}>
        <Link href="/">
          <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={130} height={36} style={{ objectFit: 'contain', height: 'auto' }} />
        </Link>

        {/* Desktop links */}
        <div className="fz-desktop-links" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {LINKS.map((item) => {
            if (item.children) {
              const childActive = item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
              return (
                <div key={item.label} className="fz-dropdown">
                  <button className={`fz-dropdown-trigger${childActive ? ' active' : ''}`}>
                    {item.label} <span className="arrow">▼</span>
                  </button>
                  <div className="fz-dropdown-menu">
                    {item.children.map(c => (
                      <Link key={c.href} href={c.href} className="fz-dropdown-item">
                        <div className="dd-label">{c.label}</div>
                        <div className="dd-sub">{c.sub}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} className={`fz-nav-link${active ? ' active' : ''}`}>
                {item.label}
              </Link>
            )
          })}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '0 8px' }} />
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1.2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, textDecoration: 'none' }}>
            Connexion
          </Link>
          <Link href="/register" style={{ background: GREEN, color: INK, fontSize: '0.9rem', fontWeight: 700, padding: '0.5rem 1.2rem', borderRadius: 8, textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button className={`fz-hamburger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
    </>
  )
}