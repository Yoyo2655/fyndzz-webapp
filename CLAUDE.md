# CLAUDE.md — Guide pour Claude sur le projet Fyndzz

Ce fichier explique à Claude tout ce qu'il faut savoir pour travailler efficacement sur le projet Fyndzz.

---

## Contexte du projet

Fyndzz est une app web/mobile de stationnement intelligent IoT développée par Yoyo (Yoni ATTAL). Claude joue le rôle d'advisor technique full-stack et implémente directement le code.

**Repo** : github.com/Yoyo2655/fyndzz-webapp  
**Prod** : https://fyndzz.vercel.app  
**Local** : C:\YONI\Centrale\Fyndzz\webapp\fyndzz  

---

## Stack — Ne jamais changer sans accord

- **Next.js 16** App Router, JavaScript (pas TypeScript sauf capacitor.config.ts)
- **Supabase** pour tout (auth, BDD, realtime)
- **MapLibre GL JS** pour la carte (PAS Leaflet, PAS Google Maps)
- **OSRM public** pour le routage (router.project-osrm.org)
- **Nominatim** pour le géocodage
- **Tailwind CSS** pour le styling (classes utilitaires)
- **Capacitor** pour l'app mobile (pointe vers fyndzz.vercel.app via server.url)

---

## Règles absolues — Ne jamais enfreindre

### 1. OSRM
```js
// ❌ JAMAIS — provoque erreur 400 sur OSRM public
excludes.push('toll')

// ✅ OK — supporté par OSRM public
excludes.push('motorway')
```

### 2. Variables d'environnement sensibles
```env
# ❌ JAMAIS préfixer avec NEXT_PUBLIC_ pour les secrets
NEXT_PUBLIC_ADMIN_PASSWORD=xxx  # exposé côté client !

# ✅ Toujours côté serveur uniquement
ADMIN_PASSWORD=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
SPOTIFY_CLIENT_SECRET=xxx
```

### 3. Next.js config
```js
// ❌ JAMAIS ajouter — désactive les API routes
const nextConfig = { output: 'export' }

// ✅ Garder la config actuelle
const nextConfig = { /* sans output: 'export' */ }
```

### 4. Supabase RLS
- Le client Supabase normal (`@/lib/supabase`) ne peut lire que les données de l'utilisateur connecté (RLS)
- Pour l'admin ou les opérations serveur, utiliser `SUPABASE_SERVICE_ROLE_KEY` dans une API route
- Ne JAMAIS exposer `SUPABASE_SERVICE_ROLE_KEY` côté client

### 5. Spotify
- L'API `/me/player` nécessite Spotify Premium
- Toujours afficher un message clair si 403 (pas Premium)
- Token stocké dans localStorage (pas Supabase)

---

## Architecture des composants clés

### Map.js
Le composant le plus complexe. Points importants :
- Initialisé une seule fois via `if (mapInstanceRef.current) return`
- `loadFuelStations` est définie DANS le useEffect (closure)
- Les fonctions `window.__fyndzz_*` sont exposées pour communication inter-composants
- `fitBounds` est commenté/désactivé intentionnellement (la carte ne bouge pas au calcul de trajet)
- `show_sensors` vérifié à chaque update dans le useEffect des capteurs

### Variables globales window.__fyndzz_*
Communication entre Map.js (isolé via dynamic import) et page.js :
```js
window.__fyndzz_settings    // settings utilisateur chargés depuis Supabase
window.__fyndzz_favs        // array des favoris [{label, name, lat, lng}]
window.__fyndzz_recents     // array destinations récentes (max 4)
window.__fyndzz_sensors     // array capteurs actuels
window.__fyndzz_userpos     // {lat, lng} position GPS actuelle
window.__fyndzz_destination // {lat, lng} destination sélectionnée
window.__fyndzz_map         // instance MapLibre
// Fonctions
window.__fyndzz_search_trigger()
window.__fyndzz_clear_route()
window.__fyndzz_reload_stations()
window.__fyndzz_reload_sensors()
window.__fyndzz_move_to(lat, lng)
window.__fyndzz_go_to_station(lat, lng)
```

### lib/osrm.js
```js
// getRoute — toujours avec try/catch et vérification res.ok
export async function getRoute(from, to) {
  // Récupère settings depuis window.__fyndzz_settings
  // Seul avoid_highways (motorway) est supporté, PAS avoid_tolls
  // Retourne null si erreur (jamais throw)
}

// getNearestFree — pré-filtre haversine puis OSRM /table
export async function getNearestFree(sensors, destination) {
  // Top 5 par distance vol d'oiseau
  // Puis distance réelle via OSRM /table
  // Retourne le capteur avec la distance route la plus courte
}
```

---

## Colonnes Supabase — État actuel

### Table `profiles` — colonnes non standard à vérifier
Ces colonnes ont été ajoutées progressivement et peuvent manquer sur certains environnements :

```sql
-- À exécuter si besoin
alter table profiles add column if not exists show_fuel boolean default false;
alter table profiles add column if not exists show_elec boolean default false;
alter table profiles add column if not exists show_sensors boolean default true;
alter table profiles add column if not exists recent_destinations jsonb default '[]';
alter table profiles add column if not exists fcm_token text;
```

**Ne jamais** inclure `recent_destinations` dans un select sans avoir vérifié que la colonne existe — ça provoque une erreur qui fait planter tout le chargement du profil.

---

## Patterns courants

### Charger le profil dans map/page.js
```js
const { data: profile } = await supabase
  .from('profiles')
  .select('first_name, last_name, gps_voice, units, fav_home, fav_home_lat, fav_home_lng, fav_work, fav_work_lat, fav_work_lng, fav_3_name, fav_3_lat, fav_3_lng, fav_4_name, fav_4_lat, fav_4_lng, fav_5_name, fav_5_lat, fav_5_lng, avoid_tolls, avoid_highways, show_fuel, show_elec, show_sensors, recent_destinations')
  .eq('id', data.user.id)
  .single()
```

### Mettre à jour window.__fyndzz_settings après save
```js
window.__fyndzz_settings = {
  ...window.__fyndzz_settings,
  show_fuel: settings.show_fuel,
  show_elec: settings.show_elec,
  show_sensors: settings.show_sensors,
  // ... autres settings
}
window.__fyndzz_reload_stations?.()
window.__fyndzz_reload_sensors?.()
```

### Toggle component réutilisable
```jsx
const Toggle = ({ value, onChange }) => (
  <button
    onClick={onChange}
    className={`w-14 h-7 rounded-full transition-all duration-300 relative ${value ? 'bg-[#00FF66]' : 'bg-white/20'}`}
  >
    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-8' : 'left-1'}`} />
  </button>
)
```

---

## Design — Règles de style

### Gradient brand (toujours utiliser BRAND_GRADIENT)
```js
const BRAND_GRADIENT = "bg-gradient-to-b from-[#160C6B] to-[#3D2CD5]"
// ou en CSS inline :
background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)'
```

### Couleurs
```
Navy fond : #160C6B
Violet : #3D2CD5
Vert accent : #00FF66
Rouge erreur : #FF4D6D
Orange : #FFB800
```

### Cards style (sidebar/settings)
```jsx
<div className="bg-white/08 border border-white/10 rounded-2xl p-4">
```

### Sections titres (settings)
```jsx
<h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
  Titre Section
</h2>
```

---

## Capacitor — Config actuelle

```ts
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.fyndzz.app',
  appName: 'Fyndzz',
  webDir: 'out',
  server: {
    url: 'https://fyndzz.vercel.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#160C6B',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
}
```

**Important** : Grâce à `server.url`, les modifications du code Next.js sont automatiquement reflétées dans l'app Android sans rebuild APK. Un rebuild n'est nécessaire que pour les changements natifs (permissions, plugins, icônes).

---

## Admin Dashboard

- URL : `/admin`
- Mot de passe : variable `ADMIN_PASSWORD` (serveur uniquement, jamais NEXT_PUBLIC_)
- Vérifié via `/api/admin/auth` (POST)
- Données via `/api/admin/data` (GET) avec service_role key
- Session stockée dans `sessionStorage` (clé : `fyndzz_admin`)

---

## Ce qui ne marche pas / Limitations connues

| Feature | Status | Raison |
|---------|--------|--------|
| Éviter les péages | ❌ Désactivé | OSRM public → erreur 400 |
| Spotify sans Premium | ❌ Impossible | API Spotify nécessite Premium |
| Données parking mairies | ❌ Pas d'API publique | Nécessite contrats B2B |
| Simulation GPS prod | ⚠️ Dev only | SimulateGPS.js wrappé dans NODE_ENV |
| Webhook Stripe | 🔄 À implémenter | Pas encore fait |

---

## Workflow de développement

1. Coder en local (`npm run dev`)
2. Tester sur `localhost:3000`
3. `git add . && git commit -m "..." && git push`
4. Vercel déploie automatiquement
5. L'app Android se met à jour automatiquement (server.url)

---

## Historique des sessions de développement

### Session 1 (30 avril 2026)
- Setup initial Next.js + Supabase + MapLibre + Stripe
- Auth (register 3 étapes, login, profil, sécurité)
- 80 capteurs IoT Paris 16ème + simulation pg_cron
- Navigation GPS style Waze
- Paiement Stripe (forfaits)
- PWA (manifest + service worker + splash screen)
- Page profil (4 onglets : infos, véhicules, stats, sécurité)
- ProtectedRoute côté client
- 404 custom, mentions légales

### Session 2 (8 mai 2026)
- Fix bug nearest sensor (haversine → OSRM /table)
- Stations essence + bornes électriques (API gouvernementale)
- Settings complets (favoris, toggles, unités)
- Extension capteurs 488 nouveaux (Île-de-France complète = 568 total)
- Fix mot de passe oublié / reset password
- Spotify integration (sidebar)
- Landing page redesign
- SEO / Open Graph tags
- Admin dashboard (/admin)
- Historique destinations récentes (max 4)
- App mobile Capacitor (Android)
- Firebase push notifications setup
- Réseaux sociaux dans le footer