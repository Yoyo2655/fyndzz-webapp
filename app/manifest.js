export default function manifest() {
  return {
    name: 'Fyndzz — Find it, Park it',
    short_name: 'Fyndzz',
    description: 'Trouvez une place de stationnement disponible en temps réel',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#160C6B',
    theme_color: '#3D2CD5',
    icons: [
      {
        src: '/Logo_Fyndzz.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/Logo_Fyndzz.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['navigation', 'travel', 'utilities'],
    lang: 'fr',
  }
}