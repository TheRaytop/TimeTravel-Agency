import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 3,
}));

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030014]">
      {/* Particules flottantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.15, 0.6, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Halo lumineux central */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      {/* Contenu principal */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* 404 */}
        <motion.h1
          className="text-gold font-display text-9xl font-bold tracking-wider select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          404
        </motion.h1>

        {/* Sablier animé */}
        <motion.span
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ⏳
        </motion.span>

        {/* Titre */}
        <motion.h2
          className="font-display text-2xl font-semibold text-white/90 sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Perdu dans le continuum temporel...
        </motion.h2>

        {/* Sous-titre */}
        <motion.p
          className="font-body max-w-md text-base text-white/50 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Il semblerait que cette page n'existe dans aucune
          époque connue.
        </motion.p>

        {/* Bouton retour */}
        <motion.button
          onClick={() => {
            window.location.href = "/";
          }}
          className="font-body mt-4 cursor-pointer rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4D98C] px-8 py-3 text-sm font-semibold tracking-wide text-[#030014] shadow-[0_0_24px_rgba(212,175,55,0.3)] transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(212,175,55,0.5)] sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Retourner au présent
        </motion.button>
      </motion.div>
    </div>
  );
}
