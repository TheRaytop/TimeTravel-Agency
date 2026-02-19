import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

// Pentatonic scale notes — always sounds pleasant (like Minecraft C418)
const NOTES = [
  261.63, 293.66, 329.63, 392.00, 440.00,  // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.00,  // C5 D5 E5 G5 A5
  130.81, 146.83, 164.81, 196.00, 220.00,  // C3 D3 E3 G3 A3
];

function createReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * 3.5;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

function playNote(ctx: AudioContext, dest: AudioNode, freq: number) {
  const now = ctx.currentTime;

  // Main tone (soft piano-like)
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  // Second harmonic for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;

  const gain = ctx.createGain();
  const gain2 = ctx.createGain();

  // Piano-like envelope: quick attack, slow decay
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.03, now + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.015, now + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  // Gentle stereo pan
  const pan = ctx.createStereoPanner();
  pan.pan.value = Math.random() * 1.4 - 0.7;

  osc.connect(gain);
  osc2.connect(gain2);
  gain.connect(pan);
  gain2.connect(pan);
  pan.connect(dest);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 3.5);
  osc2.stop(now + 2);
}

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const scheduleNext = useCallback(() => {
    if (!activeRef.current || !ctxRef.current || !masterGainRef.current) return;

    playNote(ctxRef.current, masterGainRef.current, NOTES[Math.floor(Math.random() * NOTES.length)]);

    // Sometimes play a second note for a chord
    if (Math.random() > 0.5) {
      setTimeout(() => {
        if (!activeRef.current || !ctxRef.current || !masterGainRef.current) return;
        playNote(ctxRef.current, masterGainRef.current, NOTES[Math.floor(Math.random() * NOTES.length)]);
      }, 200 + Math.random() * 400);
    }

    // Random delay between notes (like Minecraft — slow, peaceful)
    const delay = 1500 + Math.random() * 3000;
    intervalRef.current = setTimeout(() => scheduleNext(), delay);
  }, []);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    masterGainRef.current = master;

    const reverb = createReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.5;

    const dry = ctx.createGain();
    dry.gain.value = 0.6;

    // Soft lowpass to keep everything mellow
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    filter.Q.value = 0.5;

    master.connect(filter);
    filter.connect(dry);
    dry.connect(ctx.destination);
    filter.connect(reverbGain);
    reverbGain.connect(reverb);
    reverb.connect(ctx.destination);
  }, []);

  const toggle = useCallback(() => {
    setShowHint(false);
    if (!playing) {
      startAudio();
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
      if (masterGainRef.current && ctxRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
        masterGainRef.current.gain.setTargetAtTime(1, ctxRef.current.currentTime, 0.5);
      }
      activeRef.current = true;
      scheduleNext();
    } else {
      activeRef.current = false;
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (masterGainRef.current && ctxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5);
      }
    }
    setPlaying(!playing);
  }, [playing, startAudio, scheduleNext]);

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
