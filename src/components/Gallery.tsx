"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Destination = "paris" | "cretace" | "florence";

interface GalleryCard {
  emoji: string;
  title: string;
  gradient: string;
  glow: string;
}

const TABS: { key: Destination; label: string }[] = [
  { key: "paris", label: "Paris 1889" },
  { key: "cretace", label: "Crétacé" },
  { key: "florence", label: "Florence 1504" },
];

const CARDS: Record<Destination, GalleryCard[]> = {
  paris: [
    {
      emoji: "🗼",
      title: "Tour Eiffel illuminée",
      gradient: "from-gold/20 via-amber-900/10 to-transparent",
      glow: "shadow-gold/20",
    },
    {
      emoji: "🎭",
      title: "Moulin Rouge",
      gradient: "from-red-900/20 via-gold/10 to-transparent",
      glow: "shadow-red-500/20",
    },
    {
      emoji: "☕",
      title: "Café de Montmartre",
      gradient: "from-amber-800/20 via-gold/10 to-transparent",
      glow: "shadow-amber-500/20",
    },
    {
      emoji: "🎪",
      title: "Exposition Universelle",
      gradient: "from-gold/20 via-yellow-700/10 to-transparent",
      glow: "shadow-yellow-500/20",
    },
  ],
  cretace: [
    {
      emoji: "🦕",
      title: "Vallée des Diplodocus",
      gradient: "from-emerald/20 via-green-900/10 to-transparent",
      glow: "shadow-emerald/20",
    },
    {
      emoji: "🌋",
      title: "Plaines volcaniques",
      gradient: "from-orange-700/20 via-red-900/10 to-transparent",
      glow: "shadow-orange-500/20",
    },
    {
      emoji: "🌿",
      title: "Forêt primitive",
      gradient: "from-green-800/20 via-emerald/10 to-transparent",
      glow: "shadow-green-500/20",
    },
    {
      emoji: "🦖",
      title: "Face au T-Rex",
      gradient: "from-red-800/20 via-emerald/10 to-transparent",
      glow: "shadow-red-600/20",
    },
  ],
  florence: [
    {
      emoji: "🎨",
      title: "Atelier de Vinci",
      gradient: "from-renaissance/20 via-amber-900/10 to-transparent",
      glow: "shadow-renaissance/20",
    },
    {
      emoji: "🏛️",
      title: "Palais des Médicis",
      gradient: "from-gold/20 via-renaissance/10 to-transparent",
      glow: "shadow-gold/20",
    },
    {
      emoji: "⛪",
      title: "Cathédrale Santa Maria",
      gradient: "from-amber-700/20 via-renaissance/10 to-transparent",
      glow: "shadow-amber-600/20",
    },
    {
      emoji: "🖼️",
      title: "Galerie des Offices",
      gradient: "from-renaissance/20 via-gold/10 to-transparent",
      glow: "shadow-renaissance/20",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Gallery() {
  const [active, setActive] = useState<Destination>("paris");

  return (
    <section className="relative py-24 md:py-32 bg-[#030014]">
      {/* ---- Divider ---- */}
      <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-20 md:mb-28" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ---- Header ---- */}
        <div className="text-center mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-[0.3em] text-gold/70 mb-4">
            Galerie
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white">
            Aperçu de vos destinations
          </h2>
        </div>

        {/* ---- Tabs ---- */}
        <div className="flex justify-center gap-3 mb-12">
          {TABS.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`
                  relative font-body text-sm px-5 py-2 rounded-full transition-colors duration-300
                  ${
                    isActive
                      ? "text-gold bg-gold/10"
                      : "text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                {tab.label}

                {/* Gold underline indicator */}
                {isActive && (
                  <motion.span
                    layoutId="gallery-tab-underline"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ---- Grid ---- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {CARDS[active].map((card, i) => (
              <motion.div
                key={`${active}-${i}`}
                variants={cardVariants}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className={`
                  group relative glass rounded-2xl overflow-hidden
                  cursor-pointer transition-shadow duration-500
                  hover:shadow-lg hover:${card.glow}
                `}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Hover glow ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-gold/20 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center py-14 px-6 text-center">
                  <span className="text-6xl mb-5 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                    {card.emoji}
                  </span>
                  <h3 className="font-display text-lg text-white/90 group-hover:text-white transition-colors duration-300">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
