import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE = 'time';
const RESET_DELAY = 2000;

// ─── Star constellation shapes ───────────────────────────────

// Tour Eiffel (points normalisés 0-1)
const EIFFEL_STARS = [
  // Base gauche
  { x: 0.28, y: 0.95 }, { x: 0.30, y: 0.90 }, { x: 0.32, y: 0.85 },
  { x: 0.34, y: 0.78 }, { x: 0.36, y: 0.70 },
  // Base droite
  { x: 0.72, y: 0.95 }, { x: 0.70, y: 0.90 }, { x: 0.68, y: 0.85 },
  { x: 0.66, y: 0.78 }, { x: 0.64, y: 0.70 },
  // Convergence milieu
  { x: 0.38, y: 0.62 }, { x: 0.62, y: 0.62 },
  { x: 0.40, y: 0.55 }, { x: 0.60, y: 0.55 },
  // Tronc supérieur
  { x: 0.42, y: 0.48 }, { x: 0.58, y: 0.48 },
  { x: 0.44, y: 0.40 }, { x: 0.56, y: 0.40 },
  { x: 0.46, y: 0.32 }, { x: 0.54, y: 0.32 },
  // Sommet
  { x: 0.48, y: 0.24 }, { x: 0.52, y: 0.24 },
  { x: 0.50, y: 0.15 }, { x: 0.50, y: 0.10 },
  // Plateformes
  { x: 0.30, y: 0.70 }, { x: 0.70, y: 0.70 },
  { x: 0.35, y: 0.55 }, { x: 0.65, y: 0.55 },
  // Déco
  { x: 0.50, y: 0.62 }, { x: 0.50, y: 0.48 },
  { x: 0.25, y: 0.95 }, { x: 0.75, y: 0.95 },
];

// T-Rex (profil)
const TREX_STARS = [
  // Tête
  { x: 0.75, y: 0.20 }, { x: 0.80, y: 0.18 }, { x: 0.85, y: 0.20 },
  { x: 0.88, y: 0.24 }, { x: 0.85, y: 0.28 }, { x: 0.80, y: 0.30 },
  // Mâchoire
  { x: 0.90, y: 0.22 }, { x: 0.92, y: 0.26 }, { x: 0.88, y: 0.28 },
  // Oeil
  { x: 0.82, y: 0.21 },
  // Cou
  { x: 0.72, y: 0.25 }, { x: 0.68, y: 0.30 }, { x: 0.64, y: 0.35 },
  // Dos
  { x: 0.60, y: 0.38 }, { x: 0.55, y: 0.36 }, { x: 0.50, y: 0.35 },
  { x: 0.45, y: 0.36 }, { x: 0.40, y: 0.38 },
  // Queue
  { x: 0.35, y: 0.40 }, { x: 0.28, y: 0.42 }, { x: 0.20, y: 0.40 },
  { x: 0.14, y: 0.36 }, { x: 0.10, y: 0.30 },
  // Ventre
  { x: 0.60, y: 0.55 }, { x: 0.55, y: 0.58 }, { x: 0.50, y: 0.56 },
  { x: 0.45, y: 0.54 },
  // Pattes
  { x: 0.58, y: 0.65 }, { x: 0.56, y: 0.75 }, { x: 0.54, y: 0.85 },
  { x: 0.52, y: 0.90 }, { x: 0.48, y: 0.65 }, { x: 0.46, y: 0.75 },
  { x: 0.44, y: 0.85 }, { x: 0.42, y: 0.90 },
  // Petits bras
  { x: 0.66, y: 0.42 }, { x: 0.68, y: 0.46 },
];

// David de Michel-Ange (silhouette)
const DAVID_STARS = [
  // Tête
  { x: 0.52, y: 0.08 }, { x: 0.48, y: 0.08 }, { x: 0.50, y: 0.05 },
  { x: 0.54, y: 0.10 }, { x: 0.46, y: 0.10 },
  // Cou
  { x: 0.50, y: 0.14 },
  // Épaules
  { x: 0.40, y: 0.18 }, { x: 0.60, y: 0.18 },
  // Bras gauche (levé)
  { x: 0.38, y: 0.22 }, { x: 0.36, y: 0.16 }, { x: 0.35, y: 0.12 },
  // Bras droit
  { x: 0.62, y: 0.22 }, { x: 0.64, y: 0.28 }, { x: 0.62, y: 0.34 },
  // Torse
  { x: 0.48, y: 0.24 }, { x: 0.52, y: 0.24 },
  { x: 0.47, y: 0.32 }, { x: 0.53, y: 0.32 },
  // Hanches
  { x: 0.45, y: 0.42 }, { x: 0.55, y: 0.42 },
  { x: 0.50, y: 0.40 },
  // Jambe gauche
  { x: 0.46, y: 0.50 }, { x: 0.45, y: 0.58 }, { x: 0.44, y: 0.66 },
  { x: 0.44, y: 0.74 }, { x: 0.43, y: 0.82 }, { x: 0.42, y: 0.90 },
  { x: 0.40, y: 0.95 },
  // Jambe droite
  { x: 0.54, y: 0.50 }, { x: 0.56, y: 0.58 }, { x: 0.56, y: 0.66 },
  { x: 0.55, y: 0.74 }, { x: 0.55, y: 0.82 }, { x: 0.56, y: 0.90 },
  { x: 0.58, y: 0.95 },
];

interface Scene {
  stars: { x: number; y: number }[];
  title: string;
  subtitle: string;
  accent: string;
  emoji: string;
}

const SCENES: Scene[] = [
  {
    stars: EIFFEL_STARS,
    title: 'Paris 1889',
    subtitle: 'La Belle \u00c9poque',
    accent: '#D4AF37',
    emoji: '\ud83d\uddfc',
  },
  {
    stars: TREX_STARS,
    title: 'Cr\u00e9tac\u00e9',
    subtitle: "-65 millions d'ann\u00e9es",
    accent: '#00C896',
    emoji: '\ud83e\udd95',
  },
  {
    stars: DAVID_STARS,
    title: 'Florence 1504',
    subtitle: 'La Renaissance',
    accent: '#C41E3A',
    emoji: '\ud83c\udfa8',
  },
];

const TOTAL_STARS = 120;

function randomStars(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2.5,
    opacity: 0.2 + Math.random() * 0.5,
    twinkle: 2 + Math.random() * 4,
  }));
}

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'scene' | 'outro'>('intro');
  const bufferRef = useRef('');
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgStars = useRef(randomStars(TOTAL_STARS));

  const activate = useCallback(() => {
    setSceneIndex(0);
    setPhase('intro');
    setActive(true);
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (active) return;
      const key = e.key.toLowerCase();
      if (key.length !== 1) return;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      bufferRef.current += key;
      if (bufferRef.current.length > SEQUENCE.length) {
        bufferRef.current = bufferRef.current.slice(-SEQUENCE.length);
      }
      if (bufferRef.current === SEQUENCE) {
        bufferRef.current = '';
        activate();
        return;
      }
      resetTimerRef.current = setTimeout(() => { bufferRef.current = ''; }, RESET_DELAY);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [active, activate]);

  // Scene sequencer
  useEffect(() => {
    if (!active) return;
    let t: ReturnType<typeof setTimeout>;

    if (phase === 'intro') {
      t = setTimeout(() => setPhase('scene'), 2000);
    } else if (phase === 'scene') {
      t = setTimeout(() => {
        if (sceneIndex < SCENES.length - 1) {
          setSceneIndex(i => i + 1);
        } else {
          setPhase('outro');
        }
      }, 4000);
    } else if (phase === 'outro') {
      t = setTimeout(() => setActive(false), 3000);
    }

    return () => clearTimeout(t);
  }, [active, phase, sceneIndex]);

  const scene = SCENES[sceneIndex];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden"
          style={{ backgroundColor: '#030014' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {/* Background stars (always visible, twinkling) */}
          {bgStars.current.map((s, i) => (
            <motion.div
              key={`bg-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${s.x * 100}%`,
                top: `${s.y * 100}%`,
                width: s.size,
                height: s.size,
                backgroundColor: '#fff',
              }}
              animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
              transition={{ duration: s.twinkle, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* ─── INTRO PHASE ─── */}
          <AnimatePresence>
            {phase === 'intro' && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Flash */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.15, 1] }}
                />

                <motion.p
                  className="font-display text-2xl md:text-4xl tracking-[0.5em] text-white/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  TIMETRAVEL AGENCY
                </motion.p>
                <motion.p
                  className="font-body text-sm tracking-[0.3em] text-gold/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  PR\u00c9SENTE
                </motion.p>

                {/* Ligne dorée qui s'étend */}
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '300px', opacity: 1 }}
                  transition={{ delay: 1.0, duration: 1.0 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── SCENE PHASE ─── */}
          <AnimatePresence mode="wait">
            {phase === 'scene' && (
              <motion.div
                key={sceneIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Constellation stars */}
                {scene.stars.map((star, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${20 + star.x * 60}%`,
                      top: `${5 + star.y * 65}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.5, 1],
                      opacity: [0, 1, 0.9],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.04,
                      ease: 'easeOut',
                    }}
                  >
                    {/* Star glow */}
                    <div
                      className="w-2 h-2 md:w-3 md:h-3 rounded-full"
                      style={{
                        backgroundColor: scene.accent,
                        boxShadow: `0 0 8px ${scene.accent}, 0 0 20px ${scene.accent}60`,
                      }}
                    />
                  </motion.div>
                ))}

                {/* Connecting lines between nearby stars */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
                  {scene.stars.map((s1, i) =>
                    scene.stars.slice(i + 1).map((s2, j) => {
                      const dx = s1.x - s2.x;
                      const dy = s1.y - s2.y;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      if (dist > 0.12) return null;
                      return (
                        <motion.line
                          key={`line-${i}-${j}`}
                          x1={`${20 + s1.x * 60}%`}
                          y1={`${5 + s1.y * 65}%`}
                          x2={`${20 + s2.x * 60}%`}
                          y2={`${5 + s2.y * 65}%`}
                          stroke={scene.accent}
                          strokeWidth="1"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1, delay: 1.2 + (i + j) * 0.02 }}
                        />
                      );
                    })
                  )}
                </svg>

                {/* Scene title at bottom */}
                <motion.div
                  className="absolute bottom-16 md:bottom-24 left-0 right-0 flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <span className="text-4xl md:text-5xl">{scene.emoji}</span>
                  <h2
                    className="font-display text-3xl md:text-5xl font-bold tracking-wider"
                    style={{ color: scene.accent, textShadow: `0 0 30px ${scene.accent}50` }}
                  >
                    {scene.title}
                  </h2>
                  <p className="font-body text-sm md:text-base tracking-[0.25em] text-white/40">
                    {scene.subtitle}
                  </p>
                </motion.div>

                {/* Subtle particles around constellation */}
                {Array.from({ length: 15 }, (_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: scene.accent,
                      left: `${20 + Math.random() * 60}%`,
                      top: `${5 + Math.random() * 65}%`,
                    }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [0, 1.5, 0],
                      y: [0, -20 - Math.random() * 30],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: 1 + Math.random() * 2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── OUTRO PHASE ─── */}
          <AnimatePresence>
            {phase === 'outro' && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.p
                  className="font-display text-3xl md:text-5xl font-bold text-gold tracking-wider"
                  style={{ textShadow: '0 0 30px rgba(212,175,55,0.5)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Le pass\u00e9 n'attend que vous.
                </motion.p>
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: '250px' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <motion.p
                  className="font-body text-xs tracking-[0.4em] text-white/25"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  TIMETRAVEL AGENCY
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #030014 85%)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
