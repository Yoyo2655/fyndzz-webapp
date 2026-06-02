# 🅿️ Fyndzz — Smart Parking App

> **Oubliez le stress du stationnement. Find it! Park it!**

Fyndzz est une application mobile-first propulsée par l'IoT qui aide les conducteurs à trouver des places de stationnement disponibles en temps réel. Grâce à des capteurs intelligents et une navigation GPS style Waze, Fyndzz optimise la recherche de stationnement, réduit les embouteillages et améliore la mobilité urbaine.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://fyndzz.fr)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)

---

## 🌟 Features

- **🗺️ Carte temps réel** — MapLibre GL JS avec 568 capteurs IoT sur toute l'Île-de-France
- **🧭 Navigation GPS** — Guidage turn-by-turn style Waze avec instructions vocales
- **🤖 Mode parking intelligent** — Activation automatique à 10 min de la destination
- **🔄 Recalcul dynamique** — Redirige si une meilleure place se libère
- **⛽ Stations & bornes** — Prix carburants en temps réel + bornes électriques
- **🎵 Spotify** — Contrôle de la musique depuis la carte (Premium requis)
- **💳 Paiement Stripe** — Forfaits de stationnement intégrés + webhook
- **⚡ Spotzz Points (SPTZ)** — Système de fidélité style battle pass
- **📱 PWA + Android** — Installable comme app native via Capacitor
- **🔔 Push Notifications** — Firebase Cloud Messaging (Android)
- **📊 Analytics** — PostHog (events custom, RGPD EU)

---

## 🚀 Getting Started

### Prérequis
- Node.js 18+
- Compte Supabase
- Compte Stripe (mode test)
- Compte Spotify Developer (optionnel)
- Compte Firebase (optionnel)
- Compte PostHog EU (optionnel)

### Installation

```bash
git clone https://github.com/Yoyo2655/fyndzz-webapp.git
cd fyndzz
npm install
cp .env.example .env.local
# Éditer .env.local avec vos clés
npm run dev
```

### Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://fyndzz.fr

# Spotify (optionnel)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://fyndzz.fr/spotify-callback

# Admin Dashboard
ADMIN_PASSWORD=your_secure_admin_password

# PostHog (optionnel)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

---

## 🗄️ Base de données

### Setup Supabase

```sql
-- Capteurs IoT (importer sensors_final.sql)
select cron.schedule('fluctuate-sensors', '30 seconds', 'select fluctuate_sensors()');

-- Colonnes profiles
alter table profiles add column if not exists recent_destinations jsonb default '[]';
alter table profiles add column if not exists show_fuel boolean default false;
alter table profiles add column if not exists show_elec boolean default false;
alter table profiles add column if not exists show_sensors boolean default true;
alter table profiles add column if not exists fcm_token text;
alter table profiles add column if not exists sptz_total integer default 0;
alter table profiles add column if not exists sptz_balance integer default 0;
alter table profiles add column if not exists sptz_streak integer default 0;
alter table profiles add column if not exists sptz_last_trip date;
alter table profiles add column if not exists sptz_badges jsonb default '[]';
alter table profiles add column if not exists sptz_profile_bonus boolean default false;

-- Tables SPTZ
create table if not exists sptz_transactions (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, amount integer not null, reason text not null, created_at timestamptz default now());
create table if not exists sptz_rewards (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, reward_type text not null, cost integer not null, status text default 'pending', created_at timestamptz default now());

alter table sptz_transactions enable row level security;
alter table sptz_rewards enable row level security;
```

---

## ⚡ Spotzz Points (SPTZ)

Système de fidélité style battle pass :

| Action | Points |
|--------|--------|
| Trajet complété | 10 SPTZ |
| Véhicule électrique | ×2 |
| Streak 7 jours | +50 SPTZ |
| Profil complété | 25 SPTZ |

**Paliers :** Fyndzzer → Pro (500) → Expert (2000) → Elite (5000)

**Badges tous les 250 SPTZ :** 🅿️ ⚡ 🔥 🎯 🚀 💎 🌟 👑 🏆 🦁

---

## 📱 App Mobile (Capacitor)

```bash
npx cap sync
npx cap open android  # Android Studio
npx cap open ios      # Xcode (Mac uniquement)
```

L'app pointe vers `https://fyndzz.fr` — mises à jour automatiques sans rebuild APK.

---

## 🛡️ Sécurité

- Auth admin avec token côté serveur + rate limiting
- Montants Stripe recalculés côté serveur
- RLS Supabase sur toutes les tables
- Security headers HTTP (X-Frame-Options, X-Content-Type-Options...)
- Webhook Stripe signé avec `STRIPE_WEBHOOK_SECRET`
- **Email** : Resend (noreply@fyndzz.fr, EU)

---

## 🛠️ Stack

| Technologie | Usage |
|-------------|-------|
| Next.js 16 | Framework React (App Router) |
| Supabase | BDD PostgreSQL + Auth + Realtime |
| MapLibre GL JS | Rendu cartographique |
| OSRM | Calcul d'itinéraires |
| Nominatim | Géocodage |
| Stripe | Paiements + Webhook |
| Capacitor | App mobile native |
| Firebase | Push notifications |
| Spotify API | Contrôle musique |
| PostHog | Analytics |
| Vercel | Déploiement |
| next-pwa | PWA |

---

## ⚠️ Points importants

- **`avoid_tolls`** : Ne jamais activer — OSRM public retourne erreur 400
- **Spotify** : Nécessite Spotify Premium pour le contrôle de lecture
- **Admin** : `/admin` protégé par `ADMIN_PASSWORD` (jamais NEXT_PUBLIC_)
- **RLS** : `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement

---

## 🌐 Liens

- **App** : https://fyndzz.fr
- **Install PWA** : https://fyndzz.fr/install-pwa
- **Instagram** : https://www.instagram.com/fyndzz.ai/
- **LinkedIn** : https://www.linkedin.com/about-us/fyndzz

---

## 📄 Licence

© 2026 Fyndzz · Paris 🇫🇷 · Tous droits réservés — voir [LICENSE](./LICENSE)