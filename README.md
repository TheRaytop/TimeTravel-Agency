# TimeTravel Agency

> Webapp interactive de voyages temporels de luxe

**[Voir le site en ligne](https://timetravel-agency-ten.vercel.app)**

---

## Présentation du projet

TimeTravel Agency est une webapp immersive présentant une agence fictive de voyages dans le temps. Le site propose trois destinations temporelles uniques (Paris 1889, Crétacé -65M, Florence 1504), un chatbot IA conversationnel, un quiz de recommandation personnalisée et un système de réservation complet.

Projet réalisé dans le cadre du cours **M1/M2 Digital & IA** par **YAHIA Rayan**.

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| React | 19 | Framework UI, composants, state management |
| TypeScript | 5.x | Typage statique, fiabilité du code |
| Tailwind CSS | v4 | Styling utility-first, design responsive |
| Framer Motion | 12 | Animations fluides, transitions, micro-interactions |
| Vite | 7 | Build tool, HMR |
| Groq API | Llama 3.3 70B | Agent conversationnel IA |
| Web Audio API | Native | Son d'ambiance génératif |
| Vercel | Cloud | Déploiement et hébergement production |
| Lucide React | - | Icônes SVG cohérentes |

---

## Fonctionnalités (17 composants)

| Feature | Description | Fichier |
|---|---|---|
| Loading Screen | Écran de chargement animé | `LoadingScreen.tsx` |
| Particules | Arrière-plan animé avec particules flottantes | `ParticleBackground.tsx` |
| Header | Navigation fixe avec scroll spy | `Header.tsx` |
| Hero | Titre animé avec effet typewriter et CTA | `Hero.tsx` |
| À propos | 3 compteurs animés (époques, voyageurs, satisfaction) | `About.tsx` |
| Destinations | 3 cards interactives avec prix et compteur de places | `Destinations.tsx` |
| Galerie | 12 cartes avec onglets filtrés par époque | `Gallery.tsx` |
| Timeline | Frise chronologique verticale des 3 époques | `Timeline.tsx` |
| Quiz | Recommandation personnalisée en 4 questions | `Quiz.tsx` |
| Réservation | Formulaire multi-étapes (4 étapes) | `Booking.tsx` |
| Chatbot IA | Agent conversationnel Chronos (Groq + Llama 3.3) | `Chatbot.tsx` |
| Témoignages | 6 avis de voyageurs avec étoiles | `Testimonials.tsx` |
| FAQ | 8 questions en accordéon animé | `FAQ.tsx` |
| Son ambiance | Audio génératif via Web Audio API | `AmbientSound.tsx` |
| Easter egg | Taper "time" au clavier pour un effet warp | `EasterEgg.tsx` |
| Page 404 | Page thématique "perdu dans le temps" | `NotFound.tsx` |
| Footer | Liens et crédits | `Footer.tsx` |

---

## Fonctionnalités IA

### Agent conversationnel — Chronos

Le chatbot Chronos est propulsé par **Groq API** avec le modèle **Llama 3.3 70B**. Il répond en temps réel à n'importe quelle question des visiteurs.

**Capacités :**
- Répond sur les 3 destinations (détails, activités, ambiance)
- Informe sur les tarifs (12 500 € / 18 900 € / 14 200 €)
- Conseille selon les intérêts du visiteur
- Explique la sécurité, les garanties, les bagages, la durée
- Garde le contexte de la conversation (historique)
- Fallback automatique sur pattern matching si l'API est indisponible

**Personnalité configurée :**
- Professionnel mais chaleureux
- Passionné d'histoire
- Expert en voyage temporel (fictif mais crédible)
- Répond en français, concis (max 150 mots)

### Quiz de recommandation

Système de scoring sur 4 questions. Chaque réponse attribue des points aux 3 destinations. La destination avec le meilleur score est recommandée avec une explication personnalisée.

---

## Prompts utilisés

### Prompt système du chatbot Chronos

```
Tu es Chronos, l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.

Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionné d'histoire
- Toujours enthousiaste sans être trop familier
- Expert en voyage temporel (fictif mais crédible)

Tu connais parfaitement :
- Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle) - 12 500 €
- Crétacé -65M (dinosaures, nature préhistorique) - 18 900 €
- Florence 1504 (Renaissance, art, Michel-Ange) - 14 200 €

Informations : durée 3-7 jours, retour garanti 100%, 2847 voyages réalisés,
bouclier temporel, technologie anti-paradoxe, extraction d'urgence.

Réponds toujours en français. Sois concis mais informatif.
```

### Prompts de génération (Claude Code)

Les composants ont été générés itérativement avec **Claude Code (Opus 4.6)** via des prompts comme :

- _"Crée un composant Gallery avec 12 cartes filtrées par onglets (Paris, Crétacé, Florence), animations Framer Motion whileInView, design glass morphism"_
- _"Crée un formulaire de réservation multi-étapes (4 étapes : destination, détails, infos, confirmation) avec validation et animation de confettis"_
- _"Intègre un chatbot IA connecté à l'API Groq avec le modèle Llama 3.3, personnalité d'expert en voyages temporels, historique de conversation"_
- _"Crée une frise chronologique verticale avec 3 événements, scroll-animated line, alternance gauche/droite sur desktop"_

Chaque composant a été testé, débuggé et intégré itérativement.

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/TheRaytop/TimeTravel-Agency.git
cd TimeTravel-Agency

# Installer les dépendances
npm install

# Configurer la clé API Groq (gratuit sur https://console.groq.com)
# Créer un fichier .env à la racine :
echo "VITE_GROQ_API_KEY=votre_cle_ici" > .env

# Lancer en dev
npm run dev

# Build production
npm run build
```

---

## Déploiement

Le site est déployé sur **Vercel** avec déploiement automatique :

- **URL** : https://timetravel-agency-ten.vercel.app
- **Build** : `npm run build` (TypeScript + Vite)
- **CDN** : mondial, HTTPS automatique
- **Variable d'environnement** : `VITE_GROQ_API_KEY` configurée sur Vercel

---

## Structure du projet

```
src/
  App.tsx                    — Point d'entrée, layout principal
  main.tsx                   — Bootstrap React
  index.css                  — Styles globaux, Tailwind, animations
  components/
    LoadingScreen.tsx         — Écran de chargement
    ParticleBackground.tsx    — Particules flottantes
    Header.tsx                — Navigation fixe + scroll spy
    Hero.tsx                  — Section hero + typewriter
    About.tsx                 — À propos + compteurs
    Destinations.tsx          — 3 cartes destinations
    Gallery.tsx               — Galerie filtrée 12 cartes
    Timeline.tsx              — Frise chronologique
    Quiz.tsx                  — Quiz recommandation
    Booking.tsx               — Formulaire réservation
    Chatbot.tsx               — Agent IA Chronos (Groq)
    Testimonials.tsx          — Témoignages voyageurs
    FAQ.tsx                   — Accordéon FAQ
    Footer.tsx                — Pied de page
    AmbientSound.tsx          — Son génératif
    EasterEgg.tsx             — Easter egg clavier
    NotFound.tsx              — Page 404
```

---

## Crédits et transparence

### Outils IA utilisés

| Outil | Modèle | Usage |
|---|---|---|
| **Claude Code** | Claude Opus 4.6 (Anthropic) | Génération du code, debugging, architecture, déploiement |
| **Groq API** | Llama 3.3 70B (Meta) | Agent conversationnel en production |

### Librairies open source

- [React](https://react.dev) — Framework UI
- [Framer Motion](https://motion.dev) — Animations
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Lucide](https://lucide.dev) — Icônes
- [Vite](https://vite.dev) — Build tool

### Assets

- Polices : Cinzel (display), DM Sans (body) via Google Fonts
- Visuels : générés en CSS pur (gradients, ombres, glow effects)
- Icônes : Lucide React (SVG)

---

## Réflexion sur le processus

### Approche vibe coding

Le projet a été développé en **vibe coding** avec Claude Code : description en langage naturel des fonctionnalités souhaitées, génération itérative du code, tests et ajustements en temps réel.

### Points forts de l'approche IA

- **Rapidité** : 17 composants générés et intégrés en une session
- **Qualité** : TypeScript strict, animations fluides, code structuré
- **Cohérence** : design system maintenu sur tout le site (palette gold/void/cosmic)
- **Debugging** : identification rapide des bugs CSS (ex: conflit Tailwind v4 cascade layers)

### Limites rencontrées

- **CSS Cascade Layers** : Tailwind v4 utilise `@layer utilities`, un reset CSS non-layered (`* { margin: 0 }`) cassait `mx-auto`. Résolution : suppression du reset redondant (le preflight de Tailwind suffit)
- **TypeScript + Framer Motion** : les types `ease` nécessitent des casts explicites (`as const`, tuples)
- **Emojis + python-docx** : les caractères hors BMP (emojis) ne sont pas supportés par lxml. Résolution : remplacement par des symboles Unicode BMP

### Ce que j'ai appris

- Le vibe coding permet de prototyper très rapidement mais nécessite de comprendre le code généré pour débugger efficacement
- L'intégration d'une API IA (Groq) dans un frontend React est simple et ajoute une vraie valeur au projet
- La cohérence du design (palette, typographie, espacement) est essentielle pour un rendu professionnel

---

## Auteur

**YAHIA Rayan** — M1/M2 Digital & IA — 2026
