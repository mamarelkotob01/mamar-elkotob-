# Clickers — Premium Arabic-First Digital Publishing Platform

## Overview
Clickers is a premium Arabic-first digital storytelling and publishing platform. Built as a React + Vite web app with full bilingual support (Arabic RTL / English LTR), cinematic dark aesthetic (deep purples + gold), and a complete mock data layer.

## Architecture

### Monorepo Structure
- `artifacts/clickers/` — Main web app (React + Vite)
- `artifacts/api-server/` — API server (currently separate, not yet used by clickers frontend)
- `artifacts/mockup-sandbox/` — Design sandbox for component prototyping

### Tech Stack
- **React 19 + Vite** with TypeScript
- **Tailwind CSS v4** with custom cinematic theme
- **Framer Motion** for all animations and transitions
- **Wouter** for client-side routing
- **react-icons** for social/UI icons
- **Google Fonts**: Tajawal, Cairo (Arabic), Cinzel, Cormorant Garamond, Inter (Latin)

## Design System

### Color Palette
- Background: `hsl(240 15% 4%)` — deep near-black
- Primary (Gold): `hsl(45 85% 52%)` — cinematic gold
- Accent (Purple): `hsl(270 55% 48%)` — deep purple
- Foreground: `hsl(45 20% 92%)` — warm off-white

### Typography
- Arabic text: Tajawal / Cairo
- Display/titles (Latin): Cinzel
- Body (Latin): Inter
- Editorial: Cormorant Garamond

## Features

### Pages
- **/** — Homepage with animated hero, category bar, featured books, worlds, offers, trailers, authors
- **/store** — Full book catalog with search, genre filter, format filter, sort
- **/worlds** — World cards grid
- **/worlds/:id** — World detail with lore, characters, reading order, trailer placeholder
- **/book/:id** — Book detail with cover, description, ratings, trailer, ambient music, reviews, recommendations
- **/authors** — Authors grid
- **/authors/:id** — Author profile with bio, books, social links
- **/offers** — Timed offers with countdown timer, promo codes
- **/media** — Trailers, music, and video content by type
- **/reader/:id** — Immersive reader with dark/light/golden themes, font size control, chapter navigation, bookmarks, TOC

### Internationalization
- Full Arabic/English bilingual support
- RTL/LTR switching via LanguageContext
- Persistent language preference in localStorage
- All UI text in `src/i18n/translations.ts`

### Data Layer (Mock)
All data is mock (no backend required):
- `src/services/mock/books.ts` — 12 books
- `src/services/mock/worlds.ts` — 3 worlds with characters
- `src/services/mock/authors.ts` — 6 authors
- `src/services/mock/offers.ts` — 4 offers
- `src/services/mock/media.ts` — 8 media items

## Development

### Running the app
```bash
pnpm --filter @workspace/clickers run dev
```
The app runs on port 24788 at `/`.

### Key Files
- `src/App.tsx` — Router and all route definitions
- `src/index.css` — Complete Tailwind theme with CSS variables
- `src/i18n/LanguageContext.tsx` — Language provider + useLanguage hook
- `src/components/Navbar.tsx` — Sticky, animated, bilingual navbar
- `src/components/Footer.tsx` — Full footer with newsletter + social links

## User Preferences
- Arabic is the default language
- Dark theme is permanent (the platform's identity)
- Cinematic gold-on-dark aesthetic is core to the brand
