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
- **Analytics** : PostHog (events custom, autocapture désactivé)

### Backend & Infrastructure
- **BDD + Auth** : Supabase (PostgreSQL + Realtime + Auth)
- **Géocodage** : Nominatim (OpenStreetMap)
- **Routage GPS** : OSRM (router.project-osrm.org)
- **Paiements** : Stripe (mode test + webhook)
- **Déploiement** : Vercel (CI/CD automatique sur push)
- **PWA** : next-pwa (service worker + manifest)
- **App Mobile** : Capacitor (Android/iOS wrapper)
- **Push Notifications** : Firebase Cloud Messaging (FCM)
- **Musique** : Spotify Web API (contrôle lecture, Premium requis)

### URLs
- **Production** : https://fyndzz.fr
- **Repo** : github.com/Yoyo2655/fyndzz-webapp
- **Local** : C:\YONI\Centrale\Fyndzz\webapp\fyndzz
- **Admin** : https://fyndzz.fr/admin

---

## Architecture des fichiers

```
fyndzz/
├── app/
│   ├── page.js                    ← Landing page + splash screen PWA
│   ├── login/page.js
│   ├── register/page.js
│   ├── map/page.js                ← Page principale carte + GPS (CORE)
│   ├── profile/page.js            ← Profil (4 onglets) + bonus SPTZ
│   ├── payment/page.js            ← Paiement Stripe + onglet SPTZ
│   ├── payment/success/page.js    ← Succès + SPTZ gagnés + badges
│   ├── payment/error/page.js
│   ├── settings/page.js
│   ├── legal/page.js
│   ├── admin/page.js              ← Dashboard admin
│   ├── install-pwa/page.js        ← Guide installation PWA Android/iPhone
│   ├── forgot-password/page.js
│   ├── reset-password/page.js
│   ├── spotify-callback/page.js
│   ├── not-found.js
│   ├── manifest.js
│   ├── layout.js                  ← Layout global + OG + PostHogProvider
│   └── api/
│       ├── stripe/route.js        ← Session Stripe (montant recalculé serveur)
│       ├── stripe/webhook/route.js ← Webhook → mise à jour base
│       ├── admin/auth/route.js    ← Auth admin + rate limiting
│       ├── admin/data/route.js    ← Données admin (service role + token header)
│       └── spotify/token/route.js
├── components/
│   ├── Map.js
│   ├── SpotifyPlayer.js
│   ├── SimulateGPS.js             ← Dev only
│   ├── PostHogProvider.js
│   └── ProtectedRoute.js
├── lib/
│   ├── supabase.js
│   ├── osrm.js
│   ├── spotify.js
│   ├── posthog.js                 ← autocapture: false
│   └── sptz.js                    ← addSPTZ, spendSPTZ, getLevel, REWARDS
├── assets/                        ← Icônes Capacitor
├── public/                        ← Logos, og-image.png
├── android/                       ← gitignored
├── ios/                           ← gitignored
├── capacitor.config.ts
├── next.config.mjs                ← Security headers
└── .env.local
```

---

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://fyndzz.fr
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://fyndzz.fr/spotify-callback
ADMIN_PASSWORD=...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
RESEND_API_KEY=re_...
```

---

## Base de données Supabase

### Table `profiles` — colonnes clés
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
alter table profiles add column if not exists onboarding_done boolean default false;
```

### Table `sensors` — 568 capteurs IDF
- Simulation pg_cron toutes les 30s via `fluctuate_sensors()`
- Realtime WebSocket activé

### Tables SPTZ (avec RLS)
```sql
create table sptz_transactions (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, amount integer not null, reason text not null, created_at timestamptz default now());
create table sptz_rewards (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, reward_type text not null, cost integer not null, status text default 'pending', created_at timestamptz default now());
```

---

## Système SPTZ (Spotzz Points)

**Gains :**
- Trajet complété → 10 SPTZ (×2 si véhicule électrique)
- Streak 7 jours → +50 SPTZ bonus
- Profil complété → 25 SPTZ (une seule fois, flag `sptz_profile_bonus`)

**Paliers :** Fyndzzer → Pro (500) → Expert (2000) → Elite (5000)

**Battle Pass — badge tous les 250 SPTZ :**
250🅿️ 500⚡ 750🔥 1000🎯 1250🚀 1500💎 1750🌟 2000👑 2500🏆 5000🦁

**Récompenses :** 500→-10% / 1000→30min / 2500→1h / 5000→2h / 7500→3h

**Intégration :**
- `payment/success/page.js` → `addSPTZ` après paiement
- `profile/page.js` → bonus profil complété dans `saveInfos`
- `payment/page.js` → onglet SPTZ (solde, badges, récompenses, historique)

---

## Analytics PostHog

**Config :** autocapture désactivé, EU cloud, ~15 events/session

**Events custom :** `app_opened`, `search_destination`, `route_found`, `navigation_started`, `navigation_cancelled`, `navigation_completed`, `sidebar_opened`, `favorite_used`, `settings_saved`, `payment_initiated`, `payment_completed`, `sptz_reward_claimed`, `pwa_cta_clicked`

---

## Sécurité

- `/api/admin/data` — token `x-admin-token` vérifié côté serveur
- `/api/admin/auth` — rate limiting 5 tentatives / 15 min
- `amount_cents` — recalculé côté serveur (jamais confiance client)
- Logs de secrets supprimés
- Security headers dans `next.config.mjs`
- RLS Supabase sur toutes les tables sensibles

---

## Points d'attention / Règles absolues

1. **`avoid_tolls`** → JAMAIS activer (OSRM 400)
2. **`output: 'export'`** → JAMAIS (désactive API routes)
3. **`SUPABASE_SERVICE_ROLE_KEY`** → jamais NEXT_PUBLIC_
4. **`ADMIN_PASSWORD`** → jamais NEXT_PUBLIC_
5. **`fitBounds`** → commenté intentionnellement dans Map.js
6. **Spotify** → Premium requis pour `/me/player`

---

## Réseaux sociaux
- Instagram : https://www.instagram.com/fyndzz.ai/
- LinkedIn : https://www.linkedin.com/about-us/fyndzz
- Website : https://fyndzz.fr