# TimeTravel Agency

> Webapp interactive de voyages temporels de luxe

[Voir le site en ligne](https://timetravel-agency-ten.vercel.app)

---

## Presentation

TimeTravel Agency est une webapp immersive presentant une agence fictive de voyages dans le temps. Le site propose trois destinations temporelles uniques, un chatbot intelligent, un quiz de recommandation et un systeme de reservation complet.

Projet realise dans le cadre du cours **M1/M2 Digital & IA** par **YAHIA Rayan**.

---

## Stack technique

| Technologie | Usage |
|---|---|
| **React 19** | Framework UI, composants, state management |
| **TypeScript** | Typage statique, fiabilite du code |
| **Tailwind CSS v4** | Styling utility-first, design responsive |
| **Framer Motion** | Animations fluides, transitions, micro-interactions |
| **Lucide React** | Icones SVG |
| **Vite 7** | Build tool, HMR |
| **Web Audio API** | Son d'ambiance generatif |
| **Vercel** | Deploiement et hebergement production |

---

## Fonctionnalites

- **Loading Screen** — Ecran de chargement anime
- **Particules** — Arriere-plan anime avec particules flottantes
- **Header** — Navigation fixe avec scroll spy et theme toggle
- **Hero** — Titre anime avec effet typewriter et CTA
- **A propos** — 3 compteurs animes (epoques, voyageurs, satisfaction)
- **Destinations** — 3 cards interactives avec prix et compteur de places
- **Galerie** — 12 cartes avec onglets filtres par epoque
- **Timeline** — Frise chronologique verticale des 3 epoques
- **Quiz** — Recommandation personnalisee en 4 questions
- **Reservation** — Formulaire multi-etapes (4 etapes)
- **Chatbot** — Agent conversationnel Chronos
- **Temoignages** — 6 avis de voyageurs avec etoiles
- **FAQ** — 8 questions en accordeon anime
- **Theme** — Mode sombre / clair avec toggle
- **Son ambiance** — Audio generatif via Web Audio API
- **Easter egg** — Taper "time" au clavier pour un effet warp
- **Page 404** — Page thematique "perdu dans le temps"

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/TheRaytop/TimeTravel-Agency.git
cd TimeTravel-Agency

# Installer les dependances
npm install

# Lancer en dev
npm run dev

# Build production
npm run build
```

---

## Deploiement

Le site est deploye sur **Vercel** :

https://timetravel-agency-ten.vercel.app

---

## Structure du projet

```
src/
  App.tsx
  main.tsx
  index.css
  components/
    LoadingScreen.tsx
    ParticleBackground.tsx
    Header.tsx
    ThemeToggle.tsx
    Hero.tsx
    About.tsx
    Destinations.tsx
    Gallery.tsx
    Timeline.tsx
    Quiz.tsx
    Booking.tsx
    Chatbot.tsx
    Testimonials.tsx
    FAQ.tsx
    Footer.tsx
    AmbientSound.tsx
    EasterEgg.tsx
    NotFound.tsx
```

---

## Auteur

**YAHIA Rayan** — M1/M2 Digital & IA
