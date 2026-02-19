import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

const questions = [
  { q: "Quel type d'expérience recherchez-vous ?", opts: [
    { label: 'Culturelle et artistique', emoji: '🎭', s: [2,0,1] as [number,number,number] },
    { label: 'Aventure et nature', emoji: '🌿', s: [0,2,0] as [number,number,number] },
    { label: 'Élégance et raffinement', emoji: '✨', s: [1,0,2] as [number,number,number] },
  ]},
  { q: 'Votre période préférée ?', opts: [
    { label: 'Histoire moderne (XIXe siècle)', emoji: '🏛️', s: [2,0,0] as [number,number,number] },
    { label: 'Temps anciens et origines', emoji: '🌋', s: [0,2,0] as [number,number,number] },
    { label: 'Renaissance et classicisme', emoji: '📜', s: [0,0,2] as [number,number,number] },
  ]},
  { q: 'Vous préférez :', opts: [
    { label: "L'effervescence urbaine", emoji: '🌃', s: [2,0,1] as [number,number,number] },
    { label: 'La nature sauvage', emoji: '🦎', s: [0,2,0] as [number,number,number] },
    { label: "L'art et l'architecture", emoji: '🏰', s: [1,0,2] as [number,number,number] },
  ]},
  { q: 'Votre activité idéale :', opts: [
    { label: 'Visiter des monuments', emoji: '🗼', s: [2,0,1] as [number,number,number] },
    { label: 'Observer la faune', emoji: '🦕', s: [0,2,0] as [number,number,number] },
    { label: 'Explorer des musées', emoji: '🎨', s: [1,0,2] as [number,number,number] },
  ]},
];

const results = [
  { emoji: '🗼', title: 'Paris 1889', sub: 'La Belle Époque', desc: "Vous êtes fait pour l'effervescence culturelle du Paris de 1889 ! L'Exposition Universelle, les cafés de Montmartre et l'inauguration de la Tour Eiffel vous attendent.", accent: '#D4AF37', rgb: '212,175,55' },
  { emoji: '🦕', title: 'Crétacé', sub: "L'Ère des Titans", desc: "L'aventure coule dans vos veines ! Direction le Crétacé pour observer les créatures les plus majestueuses ayant jamais foulé la Terre.", accent: '#00C896', rgb: '0,200,150' },
  { emoji: '🎨', title: 'Florence 1504', sub: 'La Renaissance', desc: "Votre sensibilité artistique vous destine à la Florence de la Renaissance. Léonard de Vinci, Michel-Ange et les Médicis n'attendent que vous.", accent: '#C41E3A', rgb: '196,30,58' },
];

export default function Quiz() {
  const [step, setStep] = useState(-1);
  const [scores, setScores] = useState([0,0,0]);
  const [sel, setSel] = useState<number|null>(null);

  const answer = useCallback((i: number) => {
    if (sel !== null) return;
    setSel(i);
    const ns = scores.map((s, j) => s + questions[step].opts[i].s[j]);
    setTimeout(() => { setScores(ns); setSel(null); setStep(p => p+1); }, 450);
  }, [step, scores, sel]);

  const res = () => { const m = Math.max(...scores); return results[scores.indexOf(m)]; };
  const reset = () => { setStep(-1); setScores([0,0,0]); setSel(null); };
  const pct = step >= 0 ? (step / questions.length) * 100 : 0;

  return (
    <section id="quiz" className="relative px-8">
      <div className="max-w-2xl mx-auto">
        {/* Divider */}
        <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-20 md:mb-28" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block font-body text-[11px] tracking-[0.3em] uppercase text-gold/40 mb-10">
            Recommandation
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
            Quelle époque est faite pour <span className="text-gold">vous</span> ?
          </h2>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden"
        >
          {/* Progress */}
          {step >= 0 && step < 4 && (
            <div className="mb-14">
              <div className="flex justify-between text-[11px] text-white/20 font-body mb-3 tracking-wide">
                <span>Question {step+1} sur {questions.length}</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #00D4FF, #7B2FBE)' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === -1 && (
              <motion.div key="i" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="text-center py-8">
                <div className="relative inline-block mb-12">
                  <Sparkles className="w-12 h-12 text-gold" />
                  <div className="absolute inset-0 blur-xl bg-gold/15 rounded-full" />
                </div>
                <h3 className="font-display text-xl md:text-2xl text-white mb-6">Trouvez votre destination idéale</h3>
                <p className="font-body text-white/25 mb-14 text-sm leading-[2] max-w-sm mx-auto">
                  Répondez à 4 questions rapides et découvrez quelle époque correspond le mieux à votre personnalité.
                </p>
                <motion.button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-body text-sm font-semibold tracking-wide cursor-pointer relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 text-void">Commencer le quiz</span>
                  <ArrowRight className="w-4 h-4 relative z-10 text-void" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold-light" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </motion.button>
              </motion.div>
            )}

            {/* QUESTIONS */}
            {step >= 0 && step < 4 && (
              <motion.div key={`q${step}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35 }}>
                <h3 className="font-display text-lg md:text-xl text-white text-center leading-relaxed mb-12">
                  {questions[step].q}
                </h3>
                <div className="flex flex-col gap-4 items-center">
                  {questions[step].opts.map((o, i) => (
                    <motion.button
                      key={i}
                      onClick={() => answer(i)}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`w-full max-w-lg mx-auto text-center px-7 py-5 rounded-2xl flex items-center gap-5 cursor-pointer transition-all group/o ${
                        sel === i ? 'bg-gold/10 border border-gold/25' : 'glass hover:bg-white/[0.03]'
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl flex-shrink-0">{o.emoji}</span>
                      <span className={`font-body text-sm leading-relaxed ${sel === i ? 'text-gold' : 'text-white/40 group-hover/o:text-white/60'} transition-colors`}>
                        {o.label}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 transition-all ${sel === i ? 'text-gold opacity-100' : 'opacity-0 group-hover/o:opacity-60 text-white/30'}`} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESULT */}
            {step === 4 && (
              <motion.div key="r" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }} className="text-center py-10 relative">
                {/* Burst */}
                {[...Array(16)].map((_, i) => {
                  const a = (i/16)*Math.PI*2, d = 70+Math.random()*50;
                  return <motion.div key={i} className="absolute left-1/2 top-1/3 w-1.5 h-1.5 rounded-full" style={{ background: res().accent }}
                    initial={{ x:0,y:0,opacity:1 }} animate={{ x:Math.cos(a)*d, y:Math.sin(a)*d, opacity:0 }}
                    transition={{ duration: 1, delay: i*0.02 }} />;
                })}

                <motion.div className="text-7xl mb-10 inline-block" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.7, type: 'spring', delay: 0.1 }}>
                  {res().emoji}
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="inline-block px-4 py-1.5 rounded-full text-[11px] font-body tracking-widest uppercase mb-6"
                  style={{ color: res().accent, border: `1px solid rgba(${res().rgb},0.2)`, background: `rgba(${res().rgb},0.06)` }}
                >
                  {res().sub}
                </motion.span>

                <motion.h3 className="font-display text-3xl font-bold text-white mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  {res().title}
                </motion.h3>

                <motion.p className="font-body text-white/35 leading-[2] max-w-md mx-auto text-sm mb-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  {res().desc}
                </motion.p>

                <motion.button onClick={reset} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass text-white/35 hover:text-gold font-body text-sm transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Recommencer
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
