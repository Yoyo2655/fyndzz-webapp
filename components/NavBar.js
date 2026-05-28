'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GREEN = '#00FF66'
const INK = '#0A0040'

const LINKS = [
  { href: '/company', label: "L'entreprise" },
  { href: '/history', label: 'Notre histoire' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', maxWidth: 1180, margin: '0 auto' }}>
      <Link href="/">
        <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={130} height={36} style={{ objectFit: 'contain' }} />
      </Link>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="fz-lnk"
              style={{ fontSize: '0.9rem', fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.7)' }}
            >
              {label}
            </Link>
          )
        })}
        <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1.2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}>
          Connexion
        </Link>
        <Link href="/register" style={{ background: GREEN, color: INK, fontSize: '0.9rem', fontWeight: 700, padding: '0.5rem 1.2rem', borderRadius: 8 }}>
          S'inscrire
        </Link>
      </div>
    </nav>
  )
}