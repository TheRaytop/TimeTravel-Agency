import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="text-6xl mb-12"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⏳
      </motion.div>

      <h1 className="font-display text-lg tracking-[0.3em] text-gold mb-6 text-center">TIMETRAVEL AGENCY</h1>

      <div className="w-40 h-[2px] bg-white/[0.04] rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold via-electric to-cosmic"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      <motion.p
        className="text-white/15 text-[10px] font-body tracking-[0.2em] text-center"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        INITIALISATION DU PORTAIL
      </motion.p>
    </motion.div>
  );
}
