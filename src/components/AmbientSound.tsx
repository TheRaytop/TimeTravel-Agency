import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

function createReverb(ctx: AudioContext, duration = 3, decay = 2): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * duration;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buffer;
}

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    masterGainRef.current = master;

    const reverb = createReverb(ctx, 4, 1.8);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.3;

    const dry = ctx.createGain();
    dry.gain.value = 0.7;

    master.connect(dry);
    dry.connect(ctx.destination);
    master.connect(reverbGain);
    reverbGain.connect(reverb);
    reverb.connect(ctx.destination);

    // --- 1. Filtered noise (cosmic wind) ---
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(ctx, 4);
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.012;

    // Slow sweep on the filter
    const noiseLfo = ctx.createOscillator();
    noiseLfo.frequency.value = 0.03;
    const noiseLfoGain = ctx.createGain();
    noiseLfoGain.gain.value = 200;
    noiseLfo.connect(noiseLfoGain);
    noiseLfoGain.connect(noiseFilter.frequency);
    noiseLfo.start();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();

    nodesRef.current.push(noiseSource, noiseLfo);

    // --- 2. Deep sub drone (barely audible pulse) ---
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 40;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.025;

    const subLfo = ctx.createOscillator();
    subLfo.frequency.value = 0.08;
    const subLfoGain = ctx.createGain();
    subLfoGain.gain.value = 0.015;
    subLfo.connect(subLfoGain);
    subLfoGain.connect(subGain.gain);
    subLfo.start();

    sub.connect(subGain);
    subGain.connect(master);
    sub.start();
    nodesRef.current.push(sub, subLfo);

    // --- 3. Ethereal pad (3 detuned voices with slow breathing) ---
    const padNotes = [
      { freq: 130.81, detune: -8 },   // C3
      { freq: 196.00, detune: 5 },    // G3
      { freq: 261.63, detune: -3 },   // C4
      { freq: 329.63, detune: 7 },    // E4
    ];

    padNotes.forEach(({ freq, detune }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.008;

      // Slow amplitude breathing
      const ampLfo = ctx.createOscillator();
      ampLfo.frequency.value = 0.04 + Math.random() * 0.06;
      const ampLfoGain = ctx.createGain();
      ampLfoGain.gain.value = 0.005;
      ampLfo.connect(ampLfoGain);
      ampLfoGain.connect(oscGain.gain);
      ampLfo.start();

      // Very slow pitch drift
      const pitchLfo = ctx.createOscillator();
      pitchLfo.frequency.value = 0.02 + Math.random() * 0.03;
      const pitchLfoGain = ctx.createGain();
      pitchLfoGain.gain.value = 1.5;
      pitchLfo.connect(pitchLfoGain);
      pitchLfoGain.connect(osc.frequency);
      pitchLfo.start();

      // Lowpass per voice
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600 + Math.random() * 400;
      filter.Q.value = 0.7;

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(master);
      osc.start();
      nodesRef.current.push(osc, ampLfo, pitchLfo);
    });

    // --- 4. Occasional shimmer (random high harmonic pings) ---
    const shimmerInterval = setInterval(() => {
      if (!ctxRef.current || masterGainRef.current?.gain.value === 0) return;
      const now = ctx.currentTime;
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 800 + Math.random() * 2000;

      const shimmerGain = ctx.createGain();
      shimmerGain.gain.setValueAtTime(0, now);
      shimmerGain.gain.linearRampToValueAtTime(0.006, now + 0.3);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 3);

      const shimmerFilter = ctx.createBiquadFilter();
      shimmerFilter.type = 'bandpass';
      shimmerFilter.frequency.value = shimmer.frequency.value;
      shimmerFilter.Q.value = 8;

      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1;

      shimmer.connect(shimmerFilter);
      shimmerFilter.connect(shimmerGain);
      shimmerGain.connect(pan);
      pan.connect(master);
      shimmer.start(now);
      shimmer.stop(now + 3.5);
    }, 3000 + Math.random() * 5000);

    nodesRef.current.push({ stop: () => clearInterval(shimmerInterval) } as unknown as AudioNode);

  }, []);

  const toggle = useCallback(() => {
    setShowHint(false);
    if (!playing) {
      startAudio();
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
      if (masterGainRef.current && ctxRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
        masterGainRef.current.gain.setTargetAtTime(1, ctxRef.current.currentTime, 1.5);
      }
    } else {
      if (masterGainRef.current && ctxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.8);
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
