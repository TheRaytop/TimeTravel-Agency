"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = "time";
const RESET_DELAY = 2000;
const ANIMATION_DURATION = 3000;

const PARTICLE_COUNT = 40;
const RING_COUNT = 6;

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
}

interface Ring {
  id: number;
  delay: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: Math.random() * 360,
    distance: 300 + Math.random() * 700,
    size: 2 + Math.random() * 5,
    delay: Math.random() * 0.6,
    duration: 1.2 + Math.random() * 1.0,
  }));
}

function generateRings(): Ring[] {
  return Array.from({ length: RING_COUNT }, (_, i) => ({
    id: i,
    delay: i * 0.15,
  }));
}

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const bufferRef = useRef("");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesRef = useRef<Particle[]>(generateParticles());
  const ringsRef = useRef<Ring[]>(generateRings());

  const activate = useCallback(() => {
    particlesRef.current = generateParticles();
    ringsRef.current = generateRings();
    setActive(true);

    animationTimerRef.current = setTimeout(() => {
      setActive(false);
    }, ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (active) return;

      const key = e.key.toLowerCase();
      if (key.length !== 1) return;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      bufferRef.current += key;

      if (bufferRef.current.length > SEQUENCE.length) {
        bufferRef.current = bufferRef.current.slice(-SEQUENCE.length);
      }

      if (bufferRef.current === SEQUENCE) {
        bufferRef.current = "";
        activate();
        return;
      }

      resetTimerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, RESET_DELAY);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [active, activate]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden pointer-events-none"
          style={{ backgroundColor: "#030014" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Flash blanc */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "#ffffff" }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.1, 0.3, 1],
              ease: "easeOut",
            }}
          />

          {/* Cercles concentriques warp tunnel */}
          {ringsRef.current.map((ring) => (
            <motion.div
              key={`ring-${ring.id}`}
              className="absolute rounded-full"
              style={{
                border: "2px solid #D4AF37",
                width: 20,
                height: 20,
                boxShadow: "0 0 15px rgba(212,175,55,0.4), inset 0 0 15px rgba(212,175,55,0.1)",
              }}
              initial={{
                scale: 0,
                opacity: 0.9,
              }}
              animate={{
                scale: [0, 60],
                opacity: [0.9, 0],
              }}
              transition={{
                duration: 2.0,
                delay: ring.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Lignes radiales style tunnel warp */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute"
              style={{
                width: "2px",
                height: "100vh",
                background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
                transformOrigin: "center center",
                rotate: `${i * 30}deg`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                scaleY: [0, 1, 1],
              }}
              transition={{
                duration: 1.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Particules dorées */}
          {particlesRef.current.map((particle) => {
            const rad = (particle.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * particle.distance;
            const ty = Math.sin(rad) * particle.distance;

            return (
              <motion.div
                key={`particle-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: "#D4AF37",
                  boxShadow: `0 0 ${particle.size * 2}px #D4AF37, 0 0 ${particle.size * 4}px rgba(212,175,55,0.5)`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: tx,
                  y: ty,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: 0.3 + particle.delay,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {/* Halo central gold */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 3, 4],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.2,
              delay: 0.1,
              ease: "easeOut",
            }}
          />

          {/* Texte principal */}
          <motion.div
            className="absolute flex flex-col items-center gap-3 z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              scale: [0.5, 0.5, 1, 1.05, 1.1],
            }}
            transition={{
              duration: 2.8,
              times: [0, 0.15, 0.3, 0.8, 1],
              ease: "easeInOut",
            }}
          >
            <motion.p
              className="text-5xl md:text-7xl font-bold tracking-[0.25em] text-center select-none"
              style={{
                fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
                color: "#D4AF37",
                textShadow:
                  "0 0 20px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4), 0 0 100px rgba(212,175,55,0.2)",
              }}
            >
              VOYAGE TEMPOREL
            </motion.p>
            <motion.p
              className="text-2xl md:text-4xl font-light tracking-[0.5em] text-center select-none"
              style={{
                fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
                color: "#D4AF37",
                textShadow:
                  "0 0 15px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.3)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0, 0, 1, 1, 0],
                y: [10, 10, 0, 0, -5],
              }}
              transition={{
                duration: 2.8,
                times: [0, 0.2, 0.4, 0.8, 1],
                ease: "easeInOut",
              }}
            >
              ACTIV&Eacute;
            </motion.p>
          </motion.div>

          {/* Vignette sombre sur les bords */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, #030014 80%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
