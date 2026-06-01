'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GREEN = '#00FF66'
const INK = '#0A0040'

const LINKS = [
  { href: '/company', label: "L'entreprise" },
  { href: '/history', label: 'A propos de nous' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .fz-nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          padding: 0.45rem 1rem;
          border-radius: 8px;
          background: transparent;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .fz-nav-link:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .fz-nav-link.active {
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-weight: 700;
        }
      `}</style>
      <nav style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', maxWidth: 1180, margin: '0 auto' }}>
        <Link href="/">
          <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={130} height={36} style={{ objectFit: 'contain', height: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`fz-nav-link${active ? ' active' : ''} fz-lnk`}
              >
                {label}
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
      </nav>
    </>
  )
}