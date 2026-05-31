'use client'

import Image from 'next/image'
import Link from 'next/link'

const footLink = { color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem' }
const sep = { color: 'rgba(255,255,255,0.15)' }

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

      <Link href="/">
        <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={110} height={30} style={{ objectFit: 'contain' }} />
      </Link>

      {/* Réseaux sociaux */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

        <a href="https://fyndzz.fr" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,102,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </a>

        <a href="https://www.instagram.com/fyndzz.ai/" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,53,132,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>

        <a href="https://www.linkedin.com/company/fyndzz" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,102,194,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>

      </div>

      {/* Bas du footer */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/company" style={{ color: '#00ff66', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>L'entreprise</Link>
        <span style={sep}>·</span>
        <Link href="/history" style={{ color: '#00ff66', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>Notre histoire</Link>
        <span style={sep}>·</span>  
        <Link href="/how#faq" style={{ color: '#00ff66', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>FAQ</Link>
        <span style={sep}>·</span>
        <Link href="/contact" style={{ color: '#00ff66', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>Nous contacter</Link>
        <span style={sep}>·</span>
        <Link href="/legal" style={{ color: '#00ff66', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}>Mentions légales & CGU</Link>
        <span style={sep}>·</span>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>© 2024-2026 Fyndzz · Paris 🇫🇷</span>
      </div>

    </footer>
  )
}