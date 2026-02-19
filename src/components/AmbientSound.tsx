import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    gainRef.current = gain;

    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 800;
    gain.connect(masterFilter);
    masterFilter.connect(ctx.destination);

    // Deep drone
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 55;
    drone.connect(gain);
    drone.start();
    nodesRef.current.push(drone);

    // Pad chord
    [110, 164.81, 220].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.4;
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      nodesRef.current.push(osc);

      // Slow LFO on frequency for movement
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + Math.random() * 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      nodesRef.current.push(lfo);
    });
  }, []);

  const toggle = useCallback(() => {
    setShowHint(false);
    if (!playing) {
      startAudio();
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
      if (gainRef.current) {
        gainRef.current.gain.cancelScheduledValues(ctxRef.current!.currentTime);
        gainRef.current.gain.setTargetAtTime(0.03, ctxRef.current!.currentTime, 0.5);
      }
    } else {
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.3);
      }
    }
    setPlaying(!playing);
  }, [playing, startAudio]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      <motion.button
        onClick={toggle}
        className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: playing ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
          border: playing ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {playing ? (
          <Volume2 className="w-4 h-4 text-gold" />
        ) : (
          <VolumeX className="w-4 h-4 text-white/30" />
        )}
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-body text-[11px] text-white/20 whitespace-nowrap"
          >
            Activer l'ambiance sonore
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
