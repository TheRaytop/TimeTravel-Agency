"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Donnees de la frise                                                */
/* ------------------------------------------------------------------ */

interface TimelineEvent {
  year: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  colorClass: string;
  dotBg: string;
  glowClass: string;
}

const events: TimelineEvent[] = [
  {
    year: "-65 000 000",
    title: "Cretace",
    emoji: "\uD83E\uDD95",
    description:
      "Revivez l\u2019ere des titans. Parcourez des forets prehistoriques luxuriantes et observez les derniers dinosaures dans leur habitat naturel, bien avant l\u2019aube de l\u2019humanite.",
    color: "#00C896",
    colorClass: "text-[#00C896]",
    dotBg: "bg-[#00C896]",
    glowClass: "shadow-[0_0_24px_rgba(0,200,150,0.35)]",
  },
  {
    year: "1504",
    title: "Florence Renaissance",
    emoji: "\uD83C\uDFA8",
    description:
      "Plongez au c\u0153ur de la Renaissance italienne. Croisez Leonard de Vinci dans son atelier, flanez dans les rues de Florence et assistez a la naissance des plus grands chefs-d\u2019\u0153uvre de l\u2019histoire de l\u2019art.",
    color: "#C41E3A",
    colorClass: "text-[#C41E3A]",
    dotBg: "bg-[#C41E3A]",
    glowClass: "shadow-[0_0_24px_rgba(196,30,58,0.35)]",
  },
  {
    year: "1889",
    title: "Paris Belle Epoque",
    emoji: "\uD83D\uDDFC",
    description:
      "Decouvrez le Paris de l\u2019Exposition universelle. Admirez la Tour Eiffel a peine inauguree, savourez un cafe au Moulin Rouge et laissez-vous emporter par l\u2019effervescence de la Ville Lumiere.",
    color: "#D4AF37",
    colorClass: "text-[#D4AF37]",
    dotBg: "bg-[#D4AF37]",
    glowClass: "shadow-[0_0_24px_rgba(212,175,55,0.35)]",
  },
];

/* ------------------------------------------------------------------ */
/*  Variantes Framer Motion                                            */
/* ------------------------------------------------------------------ */

const cardVariants = (fromLeft: boolean) => ({
  hidden: {
    opacity: 0,
    x: fromLeft ? -80 : 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven progress pour la ligne centrale */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-[#030014] py-24 md:py-36 overflow-hidden">
      {/* ----- Divider decoratif ----- */}
      <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-20 md:mb-28" />

      {/* ----- En-tete ----- */}
      <div className="text-center mb-20 md:mb-28 px-4">
        <span className="inline-block font-body text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 mb-4">
          Chronologie
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">
          Voyagez a travers les ages
        </h2>
      </div>

      {/* ----- Frise ----- */}
      <div ref={containerRef} className="relative max-w-4xl mx-auto px-4">
        {/* Ligne verticale centrale (desktop) / gauche (mobile) */}
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-px">
          {/* Fond attenue */}
          <div className="absolute inset-0 bg-[#D4AF37]/10" />
          {/* Progression animee */}
          <motion.div
            className="absolute top-0 left-0 w-full origin-top bg-gradient-to-b from-[#D4AF37]/60 via-[#D4AF37]/30 to-transparent"
            style={{ scaleY: lineScaleY, height: "100%" }}
          />
        </div>

        {/* Evenements */}
        <div className="relative flex flex-col gap-20 md:gap-28">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={event.year}
                className="relative grid grid-cols-[48px_1fr] md:grid-cols-[1fr_48px_1fr] items-start"
              >
                {/* ---------- DESKTOP : carte gauche ou spacer ---------- */}
                <div className="hidden md:block">
                  {isLeft ? (
                    <motion.div
                      variants={cardVariants(true)}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                    >
                      <EventCard event={event} align="right" />
                    </motion.div>
                  ) : (
                    <span />
                  )}
                </div>

                {/* ---------- Dot central ---------- */}
                <div className="flex justify-center pt-2 z-10">
                  <motion.div
                    variants={dotVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className={`w-4 h-4 rounded-full ${event.dotBg} ${event.glowClass} ring-4 ring-[#030014]`}
                  />
                </div>

                {/* ---------- DESKTOP : carte droite ou spacer ---------- */}
                <div className="hidden md:block">
                  {!isLeft ? (
                    <motion.div
                      variants={cardVariants(false)}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                    >
                      <EventCard event={event} align="left" />
                    </motion.div>
                  ) : (
                    <span />
                  )}
                </div>

                {/* ---------- MOBILE : carte toujours a droite ---------- */}
                <div className="block md:hidden">
                  <motion.div
                    variants={cardVariants(false)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <EventCard event={event} align="left" />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sous-composant : carte d'evenement                                 */
/* ------------------------------------------------------------------ */

interface EventCardProps {
  event: TimelineEvent;
  /** "left" = texte aligne a gauche, "right" = texte aligne a droite */
  align: "left" | "right";
}

function EventCard({ event, align }: EventCardProps) {
  const isRight = align === "right";

  return (
    <div
      className={`glass rounded-2xl p-6 md:p-8 border border-white/5 ${
        isRight ? "text-right" : "text-left"
      }`}
    >
      {/* Annee */}
      <span
        className={`inline-block font-display text-sm tracking-widest ${event.colorClass} mb-2`}
      >
        {event.year}
      </span>

      {/* Titre + emoji */}
      <h3
        className={`font-display text-xl md:text-2xl text-white mb-3 flex items-center gap-3 ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        {isRight && <span className="text-2xl">{event.emoji}</span>}
        {event.title}
        {!isRight && <span className="text-2xl">{event.emoji}</span>}
      </h3>

      {/* Description */}
      <p className="font-body text-sm md:text-base leading-relaxed text-white/60">
        {event.description}
      </p>

      {/* Barre decorative basse */}
      <div
        className={`mt-5 h-px w-16 ${isRight ? "ml-auto" : ""}`}
        style={{
          background: `linear-gradient(to right, ${
            isRight ? "transparent" : event.color
          }, ${isRight ? event.color : "transparent"})`,
        }}
      />
    </div>
  );
}
