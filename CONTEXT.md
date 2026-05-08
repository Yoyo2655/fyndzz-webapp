# CONTEXT.md — Fyndzz Project Context

## Vue d'ensemble
Fyndzz est une application mobile-first de stationnement intelligent basée sur des capteurs IoT. Elle aide les conducteurs ("Fyndzzers") à trouver des places de stationnement disponibles en temps réel via une interface GPS style Waze.

---

## Stack Technique

### Frontend
- **Framework** : Next.js 16 (App Router, JavaScript)
- **Styling** : Tailwind CSS + styles inline
- **Icônes** : Lucide React
- **Carte** : MapLibre GL JS (style CartoDB Voyager)
- **Images** : Next/Image

### Backend & Infrastructure
- **BDD + Auth** : Supabase (PostgreSQL + Realtime + Auth)
- **Géocodage** : Nominatim (OpenStreetMap)
- **Routage GPS** : OSRM (router.project-osrm.org)
- **Paiements** : Stripe (mode test)
- **Déploiement** : Vercel (CI/CD automatique sur push)
- **PWA** : next-pwa (service worker + manifest)
- **App Mobile** : Capacitor (Android/iOS wrapper)
- **Push Notifications** : Firebase Cloud Messaging (FCM)
- **Musique** : Spotify Web API (contrôle lecture, Premium requis)

### URLs
- **Production** : https://fyndzz.vercel.app
- **Repo** : github.com/Yoyo2655/fyndzz-webapp
- **Local** : C:\YONI\Centrale\Fyndzz\webapp\fyndzz
- **Admin** : https://fyndzz.vercel.app/admin

---

## Architecture des fichiers

```
fyndzz/
├── app/
│   ├── page.js                    ← Landing page + splash screen PWA
│   ├── login/page.js              ← Connexion + lien mot de passe oublié
│   ├── register/page.js           ← Inscription 3 étapes
│   ├── map/page.js                ← Page principale carte + GPS (CORE)
│   ├── profile/page.js            ← Profil utilisateur (4 onglets)
│   ├── payment/page.js            ← Paiement Stripe
│   ├── payment/success/page.js    ← Succès paiement
│   ├── payment/error/page.js      ← Erreur paiement
│   ├── settings/page.js           ← Paramètres utilisateur
│   ├── legal/page.js              ← Mentions légales + CGU + RGPD
│   ├── admin/page.js              ← Dashboard admin (protégé par mdp)
│   ├── forgot-password/page.js    ← Mot de passe oublié
│   ├── reset-password/page.js     ← Réinitialisation mot de passe
│   ├── spotify-callback/page.js   ← Callback OAuth Spotify
│   ├── not-found.js               ← Page 404 custom
│   ├── manifest.js                ← PWA manifest
│   ├── layout.js                  ← Layout global + metadata OG
│   └── api/
│       ├── stripe/route.js        ← Création session Stripe
│       ├── admin/auth/route.js    ← Auth admin (mdp serveur)
│       ├── admin/data/route.js    ← Données admin (service role)
│       └── spotify/token/route.js ← OAuth token Spotify
├── components/
│   ├── Map.js                     ← MapLibre GL + GPS + stations + capteurs
│   ├── SpotifyPlayer.js           ← Contrôle Spotify dans sidebar
│   ├── SimulateGPS.js             ← Simulation GPS (dev only)
│   └── ProtectedRoute.js          ← Protection routes côté client
├── lib/
│   ├── supabase.js                ← Client Supabase
│   ├── osrm.js                    ← getRoute + getNearestFree
│   └── spotify.js                 ← getSpotifyAuthUrl + getValidToken + spotifyAPI
├── assets/                        ← Assets Capacitor (icônes + splash)
│   ├── icon.png
│   ├── icon-foreground.png
│   ├── icon-background.png
│   ├── splash.png
│   └── splash-dark.png
├── public/                        ← Assets statiques
│   ├── Logo_Fyndzz.png
│   ├── Logo-RBG_Fyndzz.png
│   ├── Logo-blue-RBG_Fyndzz.png
│   ├── Logo-et-Titre-paysage-RBG_Fyndzz.png
│   ├── Titre-RBG_Fyndzz.png
│   └── og-image.png               ← Image Open Graph (1200x630)
├── android/                       ← Capacitor Android (gitignored)
├── ios/                           ← Capacitor iOS (gitignored)
├── capacitor.config.ts            ← Config Capacitor
├── next.config.mjs                ← Config Next.js + next-pwa
└── .env.local                     ← Variables d'environnement locales
```

---

## Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        ← Pour l'admin (côté serveur uniquement)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://fyndzz.vercel.app

# Spotify
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://fyndzz.vercel.app/spotify-callback

# Admin
ADMIN_PASSWORD=...                   ← Ne jamais préfixer avec NEXT_PUBLIC_
```

---

## Base de données Supabase

### Table `profiles`
Colonnes principales :
- `id` (uuid, FK auth.users)
- `first_name`, `last_name`, `full_name`, `email`, `phone`
- `address`, `postal_code`, `city`, `country`
- `plate`, `vehicle_brand`, `vehicle_model`, `vehicle_year`, `vehicle_color`, `vehicle_energy`
- `vehicle2_*` à `vehicle4_*` (même structure × 4)
- `default_vehicle`, `active_vehicle` (int 1-4)
- `total_trips`, `total_minutes_saved`, `total_co2_saved_g`
- `fav_home`, `fav_home_lat`, `fav_home_lng`
- `fav_work`, `fav_work_lat`, `fav_work_lng`
- `fav_3_name/lat/lng`, `fav_4_name/lat/lng`, `fav_5_name/lat/lng`
- `gps_voice` (bool), `units` (km/mi)
- `avoid_tolls` (bool — NE PAS ACTIVER, OSRM ne supporte pas)
- `avoid_highways` (bool)
- `show_fuel` (bool), `show_elec` (bool), `show_sensors` (bool)
- `recent_destinations` (jsonb, array de {name, lat, lng}, max 4)
- `fcm_token` (text — token Firebase pour push notifications)
- `created_at`

### Table `sensors`
- `id` (uuid)
- `lat`, `lng` (float)
- `street` (text)
- `is_free` (bool)
- `updated_at`

**568 capteurs** répartis sur toute l'Île-de-France :
- 80 capteurs Paris 16ème (zone pilote originale)
- 488 capteurs dans d'autres zones IDF

**Simulation automatique** via pg_cron toutes les 30s :
```sql
select cron.schedule('fluctuate-sensors', '30 seconds', 'select fluctuate_sensors()');
```

**Realtime activé** — les changements sont diffusés en temps réel via WebSocket.

### Table `payments`
- `id`, `user_id`, `sensor_id`
- `amount_cents`, `duration_minutes`, `mode`, `status`
- `stripe_session_id`, `street`
- `created_at`, `ended_at`

---

## Fonctionnalités implémentées

### Carte (Map.js)
- MapLibre GL JS avec style CartoDB Voyager
- Géolocalisation GPS avec `watchPosition`
- Flèche utilisateur violette/verte qui tourne selon la direction
- Marker destination pin vert avec "P"
- Route double couche (contour blanc + violet)
- Capteurs : cercles verts/rouges via GeoJSON source (masquables)
- Vue inclinée 55° + rotation carte en mode navigation
- Pause recentrage si l'utilisateur interagit (5s timeout)
- Stations essence ⛽ (jaune) et bornes électriques ⚡ (violet)
  - Données : API gouvernementale prix-des-carburants
  - Popup avec prix + bouton "Y aller"
  - Chargement au moveend (zoom > 13 seulement)
- `fitBounds` désactivé (la carte ne bouge pas au calcul de trajet)

**Fonctions globales exposées :**
- `window.__fyndzz_move_to(lat, lng)` — déplace le marker user
- `window.__fyndzz_clear_route()` — efface tracé + marker destination
- `window.__fyndzz_recenter()` — recentre la carte
- `window.__fyndzz_map` — instance MapLibre
- `window.__fyndzz_search_trigger()` — déclenche la navigation
- `window.__fyndzz_sensors` — sync capteurs
- `window.__fyndzz_userpos` — position courante {lat, lng}
- `window.__fyndzz_reload_stations()` — recharge stations
- `window.__fyndzz_reload_sensors()` — recharge capteurs selon setting
- `window.__fyndzz_go_to_station(lat, lng)` — nav vers station
- `window.__fyndzz_settings` — settings globaux
- `window.__fyndzz_favs` — favoris chargés
- `window.__fyndzz_recents` — destinations récentes (max 4)

### Navigation GPS (map/page.js)
- Barre de recherche avec autocomplétion Nominatim (debounce 600ms, min 4 chars)
- Affichage des favoris au focus (barre vide)
- Affichage des destinations récentes (max 4, sauvegardées en base)
- Panneau "Route trouvée" : mins, distance voiture, CO₂, prix, bouton Y ALLER
- Mode navigation overlay style Waze :
  - Bandeau haut : icône direction + instruction + distance + étape X/Y
  - Barre progression verte
  - Panneau bas : stats + destination
- Instructions vocales (Web Speech API, fr-FR, désactivable)
- Avancement automatique étapes (< 30m du waypoint)
- Formatage distances selon unité (km/mi)
- Bouton planner A→B
- Bouton recentrer flottant

### Logique de routage OSRM (lib/osrm.js)
- `getRoute(from, to)` — calcule itinéraire avec gestion erreurs
- `getNearestFree(sensors, destination)` — trouve la place libre la plus proche
  - Pré-filtre par distance haversine (top 5)
  - Calcule distance réelle via OSRM /table endpoint
- **IMPORTANT** : `exclude=toll` non supporté par OSRM public → erreur 400
- Seul `exclude=motorway` est supporté

### Paiement Stripe
- Forfaits : 30min (1.20€), 1h (2€), 2h (3.50€), 4h (6€)
- À la minute : 0.04€/min
- Redirection vers `/payment/success` ou `/payment/error`
- Email automatique via Stripe dashboard

### Paramètres (settings/page.js)
- 5 favoris (Maison, Travail, +3) avec recherche Nominatim inline
- Toggle voix GPS
- Toggle unités km/mi
- Toggle éviter péages (⚠️ bug OSRM — ne pas activer)
- Toggle éviter autoroutes
- Toggle stations essence
- Toggle bornes électriques
- Toggle capteurs de stationnement
- Section Spotify : connecter/déconnecter compte
- Sauvegardé en base + `window.__fyndzz_settings` mis à jour

### Authentification
- Email + password (Supabase Auth)
- Register 3 étapes, login, profil, sécurité
- ProtectedRoute côté client
- Mot de passe oublié : `/forgot-password` → email → `/reset-password`
- **Supabase URL Config** :
  - Site URL : https://fyndzz.vercel.app
  - Redirect URLs : https://fyndzz.vercel.app/reset-password + http://localhost:3000/reset-password

### Admin Dashboard (/admin)
- Protection par mot de passe côté serveur (variable `ADMIN_PASSWORD`)
- Données via service_role pour bypasser RLS
- 4 onglets : Vue d'ensemble, Utilisateurs, Capteurs, Paiements
- KPIs : inscrits, nouveaux 7j, capteurs libres, revenus
- Tables : derniers utilisateurs, derniers paiements
- Graphiques d'occupation par rue

### PWA
- `app/manifest.js`
- `next-pwa` dans `next.config.mjs`
- Splash screen au chargement (anneaux verts animés + logo)
- Installable sur iOS et Android

### App Mobile (Capacitor)
- Package : `com.fyndzz.app`
- Pointe vers `https://fyndzz.vercel.app` via `server.url`
- Avantage : mises à jour code web automatiques sans rebuild APK
- Firebase Cloud Messaging pour push notifications
- Permissions : INTERNET, ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, POST_NOTIFICATIONS

### SEO / Open Graph
- Metadata dans `app/layout.js`
- Image OG : `og-image.png` (1200x630px)
- Twitter Card large image
- Locale fr_FR

### Spotify Integration
- Scopes : user-read-playback-state, user-modify-playback-state, user-read-currently-playing
- OAuth flow : /settings → Spotify → /spotify-callback → token stocké localStorage
- Contrôles : play/pause, skip, volume
- ⚠️ **Spotify Premium requis** pour le contrôle de lecture
- Player affiché dans la sidebar de la carte

---

## Design System

### Couleurs
- Navy : `#160C6B`
- Bleu/Violet : `#3D2CD5`
- Vert accent : `#00FF66`
- Rouge : `#FF4D6D`
- Orange : `#FFB800`
- Blanc : `#FFFFFF`

### Typographie
- Syne (titres, bold)
- DM Sans (texte courant)
- Fallback : sans-serif

### Gradient brand
```css
background: linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%);
```

---

## Points d'attention / Bugs connus

1. **`avoid_tolls` = true → erreur OSRM 400** — OSRM public ne supporte pas `exclude=toll`. Toujours garder `avoid_tolls: false`.
2. **Spotify Premium requis** — sans Premium, l'API `/me/player` retourne 403.
3. **`recent_destinations` dans le select** — si la colonne n'existe pas → erreur. Toujours vérifier via SQL : `alter table profiles add column if not exists recent_destinations jsonb default '[]'`.
4. **RLS Supabase** — le dashboard admin utilise le service_role key pour bypasser les RLS, jamais exposé côté client.
5. **`output: 'export'` Next.js** — NE PAS ajouter dans `next.config.mjs` car ça désactive les API routes.

---

## Réseaux sociaux
- Instagram : https://www.instagram.com/fyndzz.ai/
- LinkedIn : https://www.linkedin.com/company/fyndzz
- Website : https://fyndzz.vercel.app