import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Users, ShieldCheck } from 'lucide-react';

function Counter({ end, suffix = '', label, icon, color, delay = 0 }: {
  end: number; suffix?: string; label: string; icon: React.ReactNode; color: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let v = 0;
      const step = end / (2000 / 16);
      const iv = setInterval(() => {
        v += step;
        if (v >= end) { setCount(end); clearInterval(iv); }
        else setCount(Math.floor(v));
      }, 16);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, end, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="text-center"
    >
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8"
        style={{ background: `${color}10`, border: `1px solid ${color}18` }}
      >
        {icon}
      </div>
      <div className="font-display text-5xl md:text-6xl font-bold text-gold mb-4">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-sm text-white/30 tracking-wide">{label}</div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-20 md:mb-28" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 md:mb-36"
        >
          <span className="inline-block font-body text-[11px] tracking-[0.3em] uppercase text-gold/40 mb-10">
            À propos
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.3] mb-10">
            Pionniers du <span className="text-gold">voyage temporel</span>
          </h2>

          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-12" />

          <p className="font-body text-lg md:text-xl text-white/40 leading-[2] mb-8 max-w-lg mx-auto">
            TimeTravel Agency est la <span className="text-white/65">première agence certifiée</span> de voyages temporels de luxe.
            Notre technologie brevetée de distorsion spatio-temporelle vous permet d'explorer
            les époques les plus fascinantes de l'histoire humaine en toute sécurité.
          </p>

          <p className="font-body text-base text-white/25 leading-[2] max-w-lg mx-auto">
            Chaque expédition est encadrée par nos chrononautes experts,
            garantissant une immersion totale sans altérer le continuum temporel.
            Votre aventure commence ici.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-3xl mx-auto">
          <Counter end={3} label="Époques disponibles" icon={<Clock className="w-6 h-6 text-gold" />} color="#D4AF37" delay={0} />
          <Counter end={2847} label="Voyageurs satisfaits" icon={<Users className="w-6 h-6 text-electric" />} color="#00D4FF" delay={150} />
          <Counter end={100} suffix="%" label="De retours réussis" icon={<ShieldCheck className="w-6 h-6 text-emerald" />} color="#00C896" delay={300} />
        </div>
      </div>
    </section>
  );
}
