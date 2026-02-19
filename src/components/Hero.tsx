import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const words = ['Voyagez', 'à', 'travers', 'le', 'temps'];

export default function Hero() {
  const sub = "Explorez les époques les plus fascinantes de l'histoire";
  const [typed, setTyped] = useState('');
  const [showSub, setShowSub] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setShow(true), 2400);
    const b = setTimeout(() => setShowSub(true), 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  useEffect(() => {
    if (!showSub) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= sub.length) { setTyped(sub.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [showSub]);

  const scrollDown = () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Simple background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(123,47,190,0.08),transparent_55%)] blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_55%)] blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[11px] font-body tracking-[0.2em] text-gold/50 uppercase bg-gold/[0.03] border border-gold/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40 shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            Agence de voyage temporel
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.25] mb-12">
          {words.map((w, i) => (
            <span key={i}>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.14, duration: 0.6 }}
                className="inline-block text-gold"
              >
                {w}
              </motion.span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </h1>

        {/* Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={show ? { scaleX: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-12"
        />

        {/* Subtitle */}
        <div className="min-h-[28px] mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showSub ? 1 : 0 }}
            className="font-body text-base md:text-lg text-white/30 italic tracking-wide leading-relaxed"
          >
            {typed}
            {showSub && typed.length < sub.length && <span className="cursor-blink" />}
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showSub ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.7 }}
        >
          <button
            onClick={scrollDown}
            className="relative group px-10 py-4 rounded-full font-display font-semibold text-sm md:text-base tracking-wider cursor-pointer overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.3)]"
          >
            <span className="relative z-10 text-void">Découvrir nos destinations</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold-light via-[#fff5c0] to-gold-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        onClick={scrollDown}
      >
        <span className="text-[10px] text-white/15 tracking-[0.3em] uppercase font-body">Explorer</span>
        <ChevronDown className="w-4 h-4 text-gold/25" />
      </motion.div>
    </section>
  );
}
