# CLAUDE.md — Guide pour Claude sur le projet Fyndzz

Ce fichier explique à Claude tout ce qu'il faut savoir pour travailler efficacement sur le projet Fyndzz.

---

## Contexte du projet

Fyndzz est une app web/mobile de stationnement intelligent IoT développée par Yoyo (Yoni ATTAL). Claude joue le rôle d'advisor technique full-stack et implémente directement le code.

**Repo** : github.com/Yoyo2655/fyndzz-webapp  
**Prod** : https://fyndzz.fr  
**Local** : C:\YONI\Centrale\Fyndzz\webapp\fyndzz  

---

## Stack — Ne jamais changer sans accord

- **Next.js 16** App Router, JavaScript (pas TypeScript sauf capacitor.config.ts)
- **Supabase** pour tout (auth, BDD, realtime)
- **MapLibre GL JS** pour la carte (PAS Leaflet, PAS Google Maps)
- **OSRM public** pour le routage (router.project-osrm.org)
- **Nominatim** pour le géocodage
- **Tailwind CSS** pour le styling (classes utilitaires)
- **Capacitor** pour l'app mobile (pointe vers fyndzz.fr via server.url)
- **PostHog** pour les analytics (EU cloud, autocapture désactivé)

---

## Règles absolues — Ne jamais enfreindre

### 1. OSRM
```js
// ❌ JAMAIS — provoque erreur 400 sur OSRM public
excludes.push('toll')
// ✅ OK
excludes.push('motorway')
```

### 2. Variables d'environnement sensibles
```env
# ❌ JAMAIS NEXT_PUBLIC_ pour les secrets
NEXT_PUBLIC_ADMIN_PASSWORD=xxx
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=xxx

# ✅ Côté serveur uniquement
ADMIN_PASSWORD=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
SPOTIFY_CLIENT_SECRET=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

### 3. Next.js config
```js
// ❌ JAMAIS — désactive les API routes
const nextConfig = { output: 'export' }
```

### 4. Supabase RLS
- Client normal → RLS appliqué (user voit seulement ses données)
- Admin/serveur → `SUPABASE_SERVICE_ROLE_KEY` dans API route uniquement
- Ne JAMAIS exposer `SUPABASE_SERVICE_ROLE_KEY` côté client

### 5. Stripe
- `amount_cents` → TOUJOURS recalculé côté serveur, jamais faire confiance au client
- Webhook signé avec `STRIPE_WEBHOOK_SECRET`

### 6. Spotify
- Premium requis pour `/me/player` → afficher message si 403
- Token stocké dans localStorage (pas Supabase)

### 7. Admin
- `/api/admin/data` → vérifie `x-admin-token` header côté serveur
- `/api/admin/auth` → rate limiting 5 tentatives / 15 min
- Jamais de logs de secrets

---

## Architecture des composants clés

### Map.js
- Initialisé une seule fois via `if (mapInstanceRef.current) return`
- `loadFuelStations` définie DANS le useEffect (closure)
- `fitBounds` commenté intentionnellement
- `show_sensors` vérifié à chaque update

### Variables globales window.__fyndzz_*
```js
window.__fyndzz_settings    // { gps_voice, units, avoid_tolls, avoid_highways, show_fuel, show_elec, show_sensors }
window.__fyndzz_favs        // [{label, name, lat, lng}]
window.__fyndzz_recents     // [{name, lat, lng}] max 4
window.__fyndzz_sensors     // array capteurs
window.__fyndzz_userpos     // {lat, lng}
window.__fyndzz_destination // {lat, lng}
window.__fyndzz_map         // instance MapLibre
window.__fyndzz_search_trigger()
window.__fyndzz_clear_route()
window.__fyndzz_reload_stations()
window.__fyndzz_reload_sensors()
window.__fyndzz_move_to(lat, lng)
window.__fyndzz_go_to_station(lat, lng)
```

### lib/sptz.js — Fonctions SPTZ
```js
addSPTZ(userId, amount, reason)     // Ajouter des points + check badges + streak
spendSPTZ(userId, rewardId)         // Dépenser des points
getLevel(total)                     // { name, color }
getNextLevel(total)                 // { name, threshold } | null
getUnlockedBadges(total)            // array badges débloqués
getNextBadge(total)                 // prochain badge | null
REWARDS                             // array des récompenses disponibles
```

### lib/posthog.js
```js
// autocapture: false — TOUJOURS garder ainsi
// Sinon explose la limite 1M events/mois
export const initPostHog = () => {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    autocapture: false,
    capture_pageview: false, // géré manuellement dans PostHogProvider
  })
}
```

---

## Colonnes Supabase — À vérifier si manquantes

```sql
alter table profiles add column if not exists show_fuel boolean default false;
alter table profiles add column if not exists show_elec boolean default false;
alter table profiles add column if not exists show_sensors boolean default true;
alter table profiles add column if not exists recent_destinations jsonb default '[]';
alter table profiles add column if not exists fcm_token text;
alter table profiles add column if not exists sptz_total integer default 0;
alter table profiles add column if not exists sptz_balance integer default 0;
alter table profiles add column if not exists sptz_streak integer default 0;
alter table profiles add column if not exists sptz_last_trip date;
alter table profiles add column if not exists sptz_badges jsonb default '[]';
alter table profiles add column if not exists sptz_profile_bonus boolean default false;
```

**⚠️ Ne jamais inclure `recent_destinations` dans un select sans vérifier que la colonne existe.**

---

## Patterns courants

### Charger le profil complet dans map/page.js
```js
const { data: profile } = await supabase
  .from('profiles')
  .select('first_name, last_name, gps_voice, units, fav_home, fav_home_lat, fav_home_lng, fav_work, fav_work_lat, fav_work_lng, fav_3_name, fav_3_lat, fav_3_lng, fav_4_name, fav_4_lat, fav_4_lng, fav_5_name, fav_5_lat, fav_5_lng, avoid_tolls, avoid_highways, show_fuel, show_elec, show_sensors, recent_destinations')
  .eq('id', data.user.id)
  .single()
```

### Ajouter des SPTZ après paiement
```js
import { addSPTZ } from '@/lib/sptz'
// Dans payment/success/page.js
const multiplier = activeEnergy === 'Électrique' ? 2 : 1
const result = await addSPTZ(user.id, 10 * multiplier, '🅿️ Trajet complété')
// result = { newTotal, newBadges, streakBonus }
```

### Appel API admin sécurisé
```js
// Côté client (admin/page.js)
const res = await fetch('/api/admin/data', {
  headers: { 'x-admin-token': password }
})

// Côté serveur (api/admin/data/route.js)
const adminToken = req.headers.get('x-admin-token')
if (adminToken !== process.env.ADMIN_PASSWORD) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Recalcul montant Stripe côté serveur
```js
// api/stripe/route.js — TOUJOURS recalculer, jamais faire confiance au client
const FORFAITS = { 30: 120, 60: 200, 120: 350, 240: 600 }
const safeCents = mode === 'fixed'
  ? FORFAITS[duration_minutes] || 120
  : Math.round(duration_minutes * 4)
```

### PostHog event
```js
import { posthog } from '@/lib/posthog'
posthog.capture('event_name', { prop1: value1, prop2: value2 })
```

---

## Design — Règles de style

```js
// Gradient brand
const BRAND_GRADIENT = "bg-gradient-to-b from-[#160C6B] to-[#3D2CD5]"
// ou inline :
background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)'

// Couleurs
#160C6B  // Navy fond
#3D2CD5  // Violet
#00FF66  // Vert accent
#FF4D6D  // Rouge erreur
#FFB800  // Orange/amber
```

---

## Capacitor

```ts
const config: CapacitorConfig = {
  appId: 'com.fyndzz.app',
  appName: 'Fyndzz',
  webDir: 'out',
  server: { url: 'https://fyndzz.fr', cleartext: true },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, backgroundColor: '#160C6B', showSpinner: false },
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
    Geolocation: { permissions: ['location'] }
  }
}
```

Grâce à `server.url`, les modifs Next.js sont auto-reflétées sans rebuild APK.

---

## Ce qui ne marche pas / Limitations connues

| Feature | Status | Raison |
|---------|--------|--------|
| Éviter les péages | ❌ | OSRM public → erreur 400 |
| Spotify sans Premium | ❌ | API → 403 |
| Données parking mairies | ❌ | Pas d'API publique |
| Simulation GPS prod | ⚠️ Dev only | NODE_ENV check |
| Parrainage SPTZ | 🔄 À implémenter | Pas encore fait |

---

## Historique des sessions de développement

### Session 1 (30 avril 2026)
- Setup Next.js + Supabase + MapLibre + Stripe
- Auth (register 3 étapes, login, profil, sécurité)
- 80 capteurs IoT Paris 16ème + simulation pg_cron
- Navigation GPS style Waze + instructions vocales
- Paiement Stripe (forfaits + à la minute)
- PWA (manifest + service worker + splash screen)
- Page profil (4 onglets)
- 404 custom, mentions légales

### Session 2 (8 mai 2026)
- Fix bug nearest sensor (haversine → OSRM /table)
- Stations essence + bornes électriques
- Settings complets (favoris, toggles, unités)
- 488 nouveaux capteurs (568 total IDF)
- Fix mot de passe oublié / reset
- Spotify integration
- Landing page redesign + SEO/OG
- Admin dashboard
- Historique destinations récentes (max 4)
- App mobile Capacitor (Android)
- Firebase push notifications setup
- Réseaux sociaux footer

### Session 3 (10 mai 2026)
- Système SPTZ complet (lib/sptz.js + onglet payment + success page + profile)
- Page install-pwa (/install-pwa)
- Analytics PostHog (13 events custom, autocapture off)
- Webhook Stripe (/api/stripe/webhook)
- Sécurité renforcée (rate limiting, token admin header, montant recalculé serveur, security headers)
- QR Code install-pwa (à générer)
- MAJ CONTEXT.md + README.md + CLAUDE.md + LICENSE