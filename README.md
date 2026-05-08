# 🅿️ Fyndzz — Smart Parking App

> **Oubliez le stress du stationnement. Find it! Park it!**

Fyndzz est une application mobile-first propulsée par l'IoT qui aide les conducteurs à trouver des places de stationnement disponibles en temps réel. Grâce à des capteurs intelligents et une navigation GPS style Waze, Fyndzz optimise la recherche de stationnement, réduit les embouteillages et améliore la mobilité urbaine.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://fyndzz.vercel.app)
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
- **💳 Paiement Stripe** — Forfaits de stationnement intégrés
- **📱 PWA + Android** — Installable comme app native via Capacitor
- **🔔 Push Notifications** — Firebase Cloud Messaging (Android)

---

## 🚀 Getting Started

### Prérequis
- Node.js 18+
- Compte Supabase
- Compte Stripe (mode test)
- Compte Spotify Developer (optionnel)
- Compte Firebase (optionnel, pour push notifications)

### Installation

```bash
# Cloner le repo
git clone https://github.com/Yoyo2655/fyndzz-webapp.git
cd fyndzz

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Lancer en développement
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
NEXT_PUBLIC_APP_URL=https://fyndzz.vercel.app

# Spotify (optionnel)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://fyndzz.vercel.app/spotify-callback

# Admin Dashboard
ADMIN_PASSWORD=your_secure_admin_password
```

---

## 🗄️ Base de données

### Setup Supabase

Exécuter dans le SQL Editor Supabase :

```sql
-- Capteurs IoT
-- Importer sensors_final.sql (568 capteurs Île-de-France)

-- Simulation automatique des capteurs
select cron.schedule('fluctuate-sensors', '30 seconds', 'select fluctuate_sensors()');

-- Colonnes optionnelles
alter table profiles add column if not exists recent_destinations jsonb default '[]';
alter table profiles add column if not exists show_fuel boolean default false;
alter table profiles add column if not exists show_elec boolean default false;
alter table profiles add column if not exists show_sensors boolean default true;
alter table profiles add column if not exists fcm_token text;
```

---

## 📱 App Mobile (Capacitor)

```bash
# Synchroniser
npx cap sync

# Ouvrir Android Studio
npx cap open android

# Ouvrir Xcode (Mac uniquement)
npx cap open ios
```

L'app pointe directement vers `https://fyndzz.vercel.app` — les mises à jour du code web sont automatiquement reflétées sans rebuild APK.

---

## 🛠️ Stack

| Technologie | Usage |
|-------------|-------|
| Next.js 16 | Framework React (App Router) |
| Supabase | BDD PostgreSQL + Auth + Realtime |
| MapLibre GL JS | Rendu cartographique |
| OSRM | Calcul d'itinéraires |
| Nominatim | Géocodage |
| Stripe | Paiements |
| Capacitor | App mobile native |
| Firebase | Push notifications |
| Spotify API | Contrôle musique |
| Vercel | Déploiement |
| next-pwa | PWA |

---

## 📁 Structure

```
fyndzz/
├── app/              # Pages Next.js (App Router)
├── components/       # Composants réutilisables
├── lib/              # Utilitaires (supabase, osrm, spotify)
├── public/           # Assets statiques (logos, images)
├── assets/           # Assets Capacitor (icônes app)
├── android/          # Projet Android (gitignored)
└── ios/              # Projet iOS (gitignored)
```

---

## ⚠️ Points importants

- **`avoid_tolls`** : Ne jamais activer — OSRM public retourne erreur 400 avec `exclude=toll`
- **Spotify** : Nécessite Spotify Premium pour le contrôle de lecture
- **Admin** : Accessible via `/admin` avec le mot de passe configuré dans `ADMIN_PASSWORD`
- **RLS** : Le dashboard admin utilise `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement

---

## 🌐 Liens

- **App** : https://fyndzz.vercel.app
- **Instagram** : https://www.instagram.com/fyndzz.ai/
- **LinkedIn** : https://www.linkedin.com/company/fyndzz

---

## 📄 Licence

© 2026 Fyndzz · Paris 🇫🇷 · Tous droits réservés