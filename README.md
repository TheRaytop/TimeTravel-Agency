# TimeTravel Agency

> Webapp interactive de voyages temporels de luxe

**[Voir le site en ligne](https://timetravel-agency-ten.vercel.app)**

---

## Presentation du projet

TimeTravel Agency est une webapp immersive presentant une agence fictive de voyages dans le temps. Le site propose trois destinations temporelles uniques (Paris 1889, Cretace -65M, Florence 1504), un chatbot IA conversationnel, un quiz de recommandation personnalisee et un systeme de reservation complet.

Projet realise dans le cadre du cours **M1/M2 Digital & IA** par **YAHIA Rayan**.

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| React | 19 | Framework UI, composants, state management |
| TypeScript | 5.x | Typage statique, fiabilite du code |
| Tailwind CSS | v4 | Styling utility-first, design responsive |
| Framer Motion | 12 | Animations fluides, transitions, micro-interactions |
| Vite | 7 | Build tool, HMR |
| Groq API | Llama 3.3 70B | Agent conversationnel IA |
| Web Audio API | Native | Son d'ambiance generatif |
| Vercel | Cloud | Deploiement et hebergement production |
| Lucide React | - | Icones SVG coherentes |

---

## Fonctionnalites (17 composants)

| Feature | Description | Fichier |
|---|---|---|
| Loading Screen | Ecran de chargement anime | `LoadingScreen.tsx` |
| Particules | Arriere-plan anime avec particules flottantes | `ParticleBackground.tsx` |
| Header | Navigation fixe avec scroll spy | `Header.tsx` |
| Hero | Titre anime avec effet typewriter et CTA | `Hero.tsx` |
| A propos | 3 compteurs animes (epoques, voyageurs, satisfaction) | `About.tsx` |
| Destinations | 3 cards interactives avec prix et compteur de places | `Destinations.tsx` |
| Galerie | 12 cartes avec onglets filtres par epoque | `Gallery.tsx` |
| Timeline | Frise chronologique verticale des 3 epoques | `Timeline.tsx` |
| Quiz | Recommandation personnalisee en 4 questions | `Quiz.tsx` |
| Reservation | Formulaire multi-etapes (4 etapes) | `Booking.tsx` |
| Chatbot IA | Agent conversationnel Chronos (Groq + Llama 3.3) | `Chatbot.tsx` |
| Temoignages | 6 avis de voyageurs avec etoiles | `Testimonials.tsx` |
| FAQ | 8 questions en accordeon anime | `FAQ.tsx` |
| Son ambiance | Audio generatif via Web Audio API | `AmbientSound.tsx` |
| Easter egg | Taper "time" au clavier pour un effet warp | `EasterEgg.tsx` |
| Page 404 | Page thematique "perdu dans le temps" | `NotFound.tsx` |
| Footer | Liens et credits | `Footer.tsx` |

---

## Fonctionnalites IA

### Agent conversationnel — Chronos

Le chatbot Chronos est propulse par **Groq API** avec le modele **Llama 3.3 70B**. Il repond en temps reel a n'importe quelle question des visiteurs.

**Capacites :**
- Repond sur les 3 destinations (details, activites, ambiance)
- Informe sur les tarifs (12 500 EUR / 18 900 EUR / 14 200 EUR)
- Conseille selon les interets du visiteur
- Explique la securite, les garanties, les bagages, la duree
- Garde le contexte de la conversation (historique)
- Fallback automatique sur pattern matching si l'API est indisponible

**Personnalite configuree :**
- Professionnel mais chaleureux
- Passionne d'histoire
- Expert en voyage temporel (fictif mais credible)
- Repond en francais, concis (max 150 mots)

### Quiz de recommandation

Systeme de scoring sur 4 questions. Chaque reponse attribue des points aux 3 destinations. La destination avec le meilleur score est recommandee avec une explication personnalisee.

---

## Prompts utilises

### Prompt systeme du chatbot Chronos

```
Tu es Chronos, l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.

Ton role : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionne d'histoire
- Toujours enthousiaste sans etre trop familier
- Expert en voyage temporel (fictif mais credible)

Tu connais parfaitement :
- Paris 1889 (Belle Epoque, Tour Eiffel, Exposition Universelle) - 12 500 EUR
- Cretace -65M (dinosaures, nature prehistorique) - 18 900 EUR
- Florence 1504 (Renaissance, art, Michel-Ange) - 14 200 EUR

Informations : duree 3-7 jours, retour garanti 100%, 2847 voyages realises,
bouclier temporel, technologie anti-paradoxe, extraction d'urgence.

Reponds toujours en francais. Sois concis mais informatif.
```

### Prompts de generation (Claude Code)

Les composants ont ete generes iterativement avec **Claude Code (Opus 4.6)** via des prompts comme :

- _"Cree un composant Gallery avec 12 cartes filtrees par onglets (Paris, Cretace, Florence), animations Framer Motion whileInView, design glass morphism"_
- _"Cree un formulaire de reservation multi-etapes (4 etapes : destination, details, infos, confirmation) avec validation et animation de confettis"_
- _"Integre un chatbot IA connecte a l'API Groq avec le modele Llama 3.3, personnalite d'expert en voyages temporels, historique de conversation"_
- _"Cree une frise chronologique verticale avec 3 evenements, scroll-animated line, alternance gauche/droite sur desktop"_

Chaque composant a ete teste, debugge et integre iterativement.

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/TheRaytop/TimeTravel-Agency.git
cd TimeTravel-Agency

# Installer les dependances
npm install

# Configurer la cle API Groq (gratuit sur https://console.groq.com)
# Creer un fichier .env a la racine :
echo "VITE_GROQ_API_KEY=votre_cle_ici" > .env

# Lancer en dev
npm run dev

# Build production
npm run build
```

---

## Deploiement

Le site est deploye sur **Vercel** avec deploiement automatique :

- **URL** : https://timetravel-agency-ten.vercel.app
- **Build** : `npm run build` (TypeScript + Vite)
- **CDN** : mondial, HTTPS automatique
- **Variable d'environnement** : `VITE_GROQ_API_KEY` configuree sur Vercel

---

## Structure du projet

```
src/
  App.tsx                    -- Point d'entree, layout principal
  main.tsx                   -- Bootstrap React
  index.css                  -- Styles globaux, Tailwind, animations
  components/
    LoadingScreen.tsx         -- Ecran de chargement
    ParticleBackground.tsx    -- Particules flottantes
    Header.tsx                -- Navigation fixe + scroll spy
    Hero.tsx                  -- Section hero + typewriter
    About.tsx                 -- A propos + compteurs
    Destinations.tsx          -- 3 cartes destinations
    Gallery.tsx               -- Galerie filtree 12 cartes
    Timeline.tsx              -- Frise chronologique
    Quiz.tsx                  -- Quiz recommandation
    Booking.tsx               -- Formulaire reservation
    Chatbot.tsx               -- Agent IA Chronos (Groq)
    Testimonials.tsx          -- Temoignages voyageurs
    FAQ.tsx                   -- Accordeon FAQ
    Footer.tsx                -- Pied de page
    AmbientSound.tsx          -- Son generatif
    EasterEgg.tsx             -- Easter egg clavier
    NotFound.tsx              -- Page 404
```

---

## Credits et transparence

### Outils IA utilises

| Outil | Modele | Usage |
|---|---|---|
| **Claude Code** | Claude Opus 4.6 (Anthropic) | Generation du code, debugging, architecture, deploiement |
| **Groq API** | Llama 3.3 70B (Meta) | Agent conversationnel en production |

### Librairies open source

- [React](https://react.dev) — Framework UI
- [Framer Motion](https://motion.dev) — Animations
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Lucide](https://lucide.dev) — Icones
- [Vite](https://vite.dev) — Build tool

### Assets

- Polices : Cinzel (display), DM Sans (body) via Google Fonts
- Visuels : generes en CSS pur (gradients, ombres, glow effects)
- Icones : Lucide React (SVG)

---

## Reflexion sur le processus

### Approche vibe coding

Le projet a ete developpe en **vibe coding** avec Claude Code : description en langage naturel des fonctionnalites souhaitees, generation iterative du code, tests et ajustements en temps reel.

### Points forts de l'approche IA

- **Rapidite** : 17 composants generes et integres en une session
- **Qualite** : TypeScript strict, animations fluides, code structure
- **Coherence** : design system maintenu sur tout le site (palette gold/void/cosmic)
- **Debugging** : identification rapide des bugs CSS (ex: conflit Tailwind v4 cascade layers)

### Limites rencontrees

- **CSS Cascade Layers** : Tailwind v4 utilise `@layer utilities`, un reset CSS non-layer (`* { margin: 0 }`) cassait `mx-auto`. Resolution : suppression du reset redondant (le preflight de Tailwind suffit)
- **TypeScript + Framer Motion** : les types `ease` necessitent des casts explicites (`as const`, tuples)
- **Emojis + python-docx** : les caracteres hors BMP (emojis) ne sont pas supportes par lxml. Resolution : remplacement par des symboles Unicode BMP

### Ce que j'ai appris

- Le vibe coding permet de prototyper tres rapidement mais necessite de comprendre le code genere pour debugger efficacement
- L'integration d'une API IA (Groq) dans un frontend React est simple et ajoute une vraie valeur au projet
- La coherence du design (palette, typographie, espacement) est essentielle pour un rendu professionnel

---

## Auteur

**YAHIA Rayan** — M1/M2 Digital & IA — 2026
