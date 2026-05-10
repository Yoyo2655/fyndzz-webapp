'use client'

import { useState } from 'react'
import { posthog } from '@/lib/posthog'

export default function InstallPWA() {
  const [activeTab, setActiveTab] = useState('android')

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: "'DM Sans', sans-serif", color: '#fff', overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .orb-1 {
          position: absolute; top: -200px; right: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: rgba(0,255,102,0.05); filter: blur(80px); pointer-events: none;
        }
        .orb-2 {
          position: absolute; bottom: -100px; left: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(61,44,213,0.3); filter: blur(60px); pointer-events: none;
        }
        .pwa-nav {
          display: flex; align-items: center; justify-content: center;
          padding: 1.4rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative; z-index: 10;
        }
        .pwa-nav img { height: 36px; object-fit: contain; }
        .pwa-content {
          position: relative; z-index: 1;
          max-width: 760px; margin: 0 auto;
          padding: 4rem 2rem 5rem;
        }
        .pwa-hero { text-align: center; margin-bottom: 3rem; }
        .pwa-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(0,255,102,0.1); border: 1px solid rgba(0,255,102,0.25);
          border-radius: 100px; padding: 0.35rem 1rem;
          font-size: 0.75rem; font-weight: 700; color: #00FF66;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2rem;
        }
        .pwa-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00FF66; animation: pwaPulse 2s infinite;
        }
        @keyframes pwaPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .pwa-hero h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.03em; margin-bottom: 1.5rem;
        }
        .pwa-hero h1 span { color: #00FF66; }
        .pwa-hero p {
          font-size: 1.05rem; color: rgba(255,255,255,0.6);
          line-height: 1.75; max-width: 520px;
          margin: 0 auto; font-weight: 300;
        }
        .pwa-tabs {
          display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;
        }
        .pwa-tab {
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          padding: 0.9rem 2.5rem; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 600;
          transition: all 0.2s; background: transparent; color: #fff;
        }
        .pwa-tab.active { background: #00FF66; color: #0A0040; border-color: #00FF66; font-weight: 700; }
        .pwa-tab:not(.active):hover { background: rgba(255,255,255,0.08); }
        .pwa-tab svg { width: 20px; height: 20px; flex-shrink: 0; }
        .pwa-steps { display: flex; flex-direction: column; gap: 1rem; }
        .pwa-step {
          display: flex; gap: 1.5rem; align-items: flex-start;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 1.8rem; transition: border-color 0.3s;
        }
        .pwa-step:hover { border-color: rgba(0,255,102,0.25); }
        .pwa-step-num {
          flex-shrink: 0; font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem; font-weight: 700; color: #00FF66;
          letter-spacing: 0.1em; text-transform: uppercase; padding-top: 3px; min-width: 32px;
        }
        .pwa-step-body { flex: 1; min-width: 0; }
        .pwa-step-title { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; color: #fff; }
        .pwa-step-desc { font-size: 0.88rem; color: rgba(255,255,255,0.55); line-height: 1.6; }
        .pwa-step-desc strong { color: rgba(255,255,255,0.9); font-weight: 600; }
        .pwa-pill {
          display: inline-block; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
          padding: 1px 7px; font-size: 0.82rem; font-weight: 600;
          color: rgba(255,255,255,0.85); white-space: nowrap;
        }
        .pwa-tip {
          display: flex; gap: 1rem; align-items: flex-start;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 1.5rem 1.8rem; margin-top: 1rem;
          font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6;
        }
        .pwa-tip-icon { font-size: 1.5rem; flex-shrink: 0; }
        .pwa-tip strong { color: #00FF66; font-weight: 600; }
        .pwa-cta-wrap { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2.5rem; }
        .pwa-cta {
          background: #00FF66; color: #0A0040; text-decoration: none;
          padding: 0.9rem 2rem; border-radius: 10px;
          font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s;
        }
        .pwa-cta:hover { opacity: 0.9; }
        .pwa-footer {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 2rem; display: flex; flex-direction: column;
          align-items: center; gap: 1.5rem; position: relative; z-index: 1;
        }
        .pwa-footer-logo img { height: 28px; object-fit: contain; opacity: 0.8; }
        .pwa-footer-social { display: flex; gap: 0.8rem; align-items: center; }
        .pwa-social-btn {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: background 0.2s;
        }
        .pwa-social-btn:hover { background: rgba(255,255,255,0.15); }
        .pwa-social-btn svg { width: 18px; height: 18px; }
        .pwa-footer-bottom { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; justify-content: center; }
        .pwa-footer-bottom a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.8rem; transition: color 0.2s; }
        .pwa-footer-bottom a:hover { color: #00FF66; }
        .pwa-footer-bottom span { font-size: 0.8rem; color: rgba(255,255,255,0.25); }
        @media (max-width: 600px) {
          .pwa-content { padding: 2.5rem 1rem 4rem; }
          .pwa-tabs { gap: 0.5rem; }
          .pwa-tab { padding: 0.7rem 1.2rem; font-size: 0.85rem; }
          .pwa-footer { padding: 1.5rem 1rem; }
          .pwa-footer-bottom { gap: 1rem; }
        }
      `}</style>

      <div className="orb-1"></div>
      <div className="orb-2"></div>

      <nav className="pwa-nav">
        <img src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" />
      </nav>

      <div className="pwa-content">

        <div className="pwa-hero">
          <div className="pwa-badge">
            <span className="pwa-badge-dot"></span>
            Gratuit · Sans store · 2 minutes
          </div>
          <h1>Installez <span>Fyndzz</span><br/>sur votre téléphone</h1>
          <p>Accédez à Fyndzz comme une vraie application — directement depuis votre écran d&apos;accueil, sans passer par un store.</p>
        </div>

        <div className="pwa-tabs">
          <button className={`pwa-tab${activeTab === 'android' ? ' active' : ''}`} onClick={() => setActiveTab('android')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-9.046 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM3.61 8.094l-1.86-3.22a.5.5 0 0 1 .87-.5l1.88 3.26A11.07 11.07 0 0 1 12 6c2.78 0 5.3.97 7.5 2.634l1.88-3.26a.5.5 0 0 1 .87.5l-1.86 3.22A10.96 10.96 0 0 1 23 15H1a10.96 10.96 0 0 1 2.61-6.906z"/></svg>
            Android
          </button>
          <button className={`pwa-tab${activeTab === 'iphone' ? ' active' : ''}`} onClick={() => setActiveTab('iphone')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            iPhone
          </button>
        </div>

        {activeTab === 'android' && (
          <div>
            <div className="pwa-steps">
              <div className="pwa-step">
                <div className="pwa-step-num">01</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Ouvrez Chrome sur votre Android</div>
                  <div className="pwa-step-desc">Assurez-vous d&apos;utiliser <strong>Google Chrome</strong> — c&apos;est le seul navigateur qui supporte l&apos;installation PWA sur Android.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">02</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Accédez à l&apos;application</div>
                  <div className="pwa-step-desc">Tapez <strong>fyndzz.vercel.app</strong> dans la barre d&apos;adresse et attendez que la page se charge complètement.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">03</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Appuyez sur le menu ⋮</div>
                  <div className="pwa-step-desc">Touchez les <strong>3 points verticaux</strong> en haut à droite de Chrome pour ouvrir le menu options.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">04</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Ajouter à l&apos;écran d&apos;accueil</div>
                  <div className="pwa-step-desc">Appuyez sur <span className="pwa-pill">Ajouter à l&apos;écran d&apos;accueil</span> ou <span className="pwa-pill">Installer l&apos;application</span>. Une popup apparaît — confirmez en appuyant sur <strong>Installer</strong>.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">05</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">C&apos;est prêt ! 🎉</div>
                  <div className="pwa-step-desc">L&apos;icône <strong>Fyndzz</strong> apparaît sur votre écran d&apos;accueil. L&apos;app s&apos;ouvre en plein écran comme une vraie application native.</div>
                </div>
              </div>
            </div>
            <div className="pwa-tip">
              <div className="pwa-tip-icon">💡</div>
              <div><strong>Astuce</strong> — Sur certains Android, une bannière <span className="pwa-pill">Installer Fyndzz</span> apparaît directement en bas de l&apos;écran dès votre première visite. Appuyez dessus pour installer encore plus vite !</div>
            </div>
            <div className="pwa-cta-wrap">
              <a href="https://fyndzz.vercel.app" className="pwa-cta" onClick={() => posthog.capture('pwa_cta_clicked', { platform: activeTab })}>Ouvrir Fyndzz dans Chrome →</a>
            </div>
          </div>
        )}

        {activeTab === 'iphone' && (
          <div>
            <div className="pwa-steps">
              <div className="pwa-step">
                <div className="pwa-step-num">01</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Ouvrez Safari sur votre iPhone</div>
                  <div className="pwa-step-desc">L&apos;installation PWA sur iPhone fonctionne <strong>uniquement avec Safari</strong>. Chrome et Firefox ne permettent pas cette fonctionnalité sur iOS.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">02</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Accédez à l&apos;application</div>
                  <div className="pwa-step-desc">Tapez <strong>fyndzz.vercel.app</strong> dans la barre d&apos;adresse de Safari et attendez le chargement complet.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">03</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Appuyez sur Partager ⬆️</div>
                  <div className="pwa-step-desc">Touchez l&apos;icône <span className="pwa-pill">⬆️ Partager</span> en bas au centre de Safari — la flèche vers le haut dans un carré.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">04</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">Sur l&apos;écran d&apos;accueil</div>
                  <div className="pwa-step-desc">Faites défiler vers le bas et appuyez sur <span className="pwa-pill">Sur l&apos;écran d&apos;accueil</span>. Vérifiez que le nom est bien <strong>&quot;Fyndzz&quot;</strong> puis confirmez avec <strong>Ajouter</strong>.</div>
                </div>
              </div>
              <div className="pwa-step">
                <div className="pwa-step-num">05</div>
                <div className="pwa-step-body">
                  <div className="pwa-step-title">C&apos;est prêt ! 🎉</div>
                  <div className="pwa-step-desc">L&apos;icône <strong>Fyndzz</strong> apparaît sur votre écran d&apos;accueil. Elle se lance en plein écran, sans la barre Safari.</div>
                </div>
              </div>
            </div>
            <div className="pwa-tip">
              <div className="pwa-tip-icon">💡</div>
              <div><strong>iOS 16.4+</strong> — Sur les versions récentes d&apos;iOS, les notifications push sont supportées. Acceptez la demande d&apos;autorisation lors du premier lancement pour recevoir les alertes de places disponibles.</div>
            </div>
            <div className="pwa-cta-wrap">
              <a href="https://fyndzz.vercel.app" className="pwa-cta" onClick={() => posthog.capture('pwa_cta_clicked', { platform: activeTab })}>Ouvrir Fyndzz dans Safari →</a>
            </div>
          </div>
        )}

      </div>

      <footer className="pwa-footer">
        <div className="pwa-footer-logo">
          <img src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" />
        </div>
        <div className="pwa-footer-social">
          <a href="https://fyndzz.vercel.app" target="_blank" rel="noopener noreferrer" className="pwa-social-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/fyndzz.ai/" target="_blank" rel="noopener noreferrer" className="pwa-social-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/fyndzz" target="_blank" rel="noopener noreferrer" className="pwa-social-btn">
            <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
        <div className="pwa-footer-bottom">
          <a href="/legal">Mentions légales & CGU</a>
          <span>·</span>
          <span>© 2026 Fyndzz · Paris 🇫🇷</span>
        </div>
      </footer>

    </div>
  )
}