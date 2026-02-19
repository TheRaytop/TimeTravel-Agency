import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Dest {
  emoji: string; title: string; era: string; sub: string; desc: string;
  tags: string[]; price: string; accent: string; rgb: string; spots: number;
  bookingId: string;
}

const dests: Dest[] = [
  {
    emoji: '🗼', title: 'Paris 1889', era: 'La Belle Époque', sub: 'Exposition Universelle',
    desc: "Assistez à l'inauguration de la Tour Eiffel lors de l'Exposition Universelle. Promenez-vous dans le Paris de Gustave Eiffel, savourez les cafés de Montmartre et vivez l'effervescence d'une époque révolutionnaire.",
    tags: ['Culture', 'Architecture', 'Gastronomie'], price: '12 500', accent: '#D4AF37', rgb: '212,175,55', spots: 7, bookingId: 'paris-1889',
  },
  {
    emoji: '🦕', title: 'Crétacé', era: "L'Ère des Titans", sub: "-65 millions d'années",
    desc: "Observez les dinosaures dans leur habitat naturel avant la grande extinction. Une expédition encadrée au cœur de forêts primitives luxuriantes, entre T-Rex majestueux et Tricératops paisibles.",
    tags: ['Aventure', 'Nature', 'Exploration'], price: '18 900', accent: '#00C896', rgb: '0,200,150', spots: 3, bookingId: 'cretace',
  },
  {
    emoji: '🎨', title: 'Florence 1504', era: 'La Renaissance', sub: 'Apogée artistique',
    desc: "Rencontrez Léonard de Vinci et Michel-Ange à l'apogée de la Renaissance italienne. Visitez les ateliers des plus grands maîtres, admirez la création du David et flânez dans les palais des Médicis.",
    tags: ['Art', 'Histoire', 'Élégance'], price: '14 200', accent: '#C41E3A', rgb: '196,30,58', spots: 12, bookingId: 'florence-1504',
  },
];

function Card({ d, i }: { d: Dest; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.15 }}
      className="group"
    >
      <div className="relative glass rounded-3xl overflow-hidden cursor-pointer h-full hover:border-white/[0.08] transition-all duration-500 flex flex-col">
        {/* Top accent line */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }} />

        <div className="px-12 md:px-16 lg:px-20 py-20 md:py-24 lg:py-28 text-center flex flex-col items-center justify-center">
          {/* Emoji */}
          <div className="text-8xl mb-12">
            {d.emoji}
          </div>

          {/* Spots left */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body tracking-wide mb-10 ${
              d.spots <= 5 ? 'animate-pulse' : ''
            }`}
            style={{
              color: d.spots <= 5 ? '#ff6b6b' : d.accent,
              background: d.spots <= 5 ? 'rgba(255,107,107,0.08)' : `rgba(${d.rgb},0.06)`,
              border: `1px solid ${d.spots <= 5 ? 'rgba(255,107,107,0.2)' : `rgba(${d.rgb},0.15)`}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.spots <= 5 ? '#ff6b6b' : d.accent, boxShadow: `0 0 6px ${d.spots <= 5 ? 'rgba(255,107,107,0.5)' : `rgba(${d.rgb},0.5)`}` }} />
            {d.spots <= 5 ? `Plus que ${d.spots} places !` : `${d.spots} places restantes`}
          </div>

          {/* Era + sub */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <span
              className="px-5 py-2.5 rounded-full text-xs font-body tracking-widest uppercase"
              style={{ color: d.accent, border: `1px solid rgba(${d.rgb},0.2)`, background: `rgba(${d.rgb},0.06)` }}
            >
              {d.era}
            </span>
            <span className="text-xs text-white/20 font-body">{d.sub}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-10">{d.title}</h3>

          {/* Desc */}
          <p className="font-body text-base text-white/30 leading-[2.2] mb-14 group-hover:text-white/40 transition-colors duration-500 max-w-md mx-auto">
            {d.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-14">
            {d.tags.map(t => (
              <span key={t} className="px-5 py-2.5 rounded-full text-xs font-body text-white/25 tracking-wide bg-white/[0.02] border border-white/[0.04]">
                {t}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex flex-col items-center pt-12 border-t border-white/[0.04] w-full">
            <span className="text-xs text-white/20 font-body tracking-wide block mb-3">À partir de</span>
            <div className="font-display text-3xl font-bold mb-8" style={{ color: d.accent }}>
              {d.price} € <span className="text-sm text-white/20 font-body font-normal">/voyageur</span>
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('select-destination', { detail: d.bookingId }));
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-110"
              style={{ background: `rgba(${d.rgb},0.08)`, border: `1px solid rgba(${d.rgb},0.15)` }}
            >
              <ArrowRight className="w-5 h-5" style={{ color: d.accent }} />
            </button>
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: d.accent }} />
      </div>
    </motion.div>
  );
}

export default function Destinations() {
  return (
    <section id="destinations" className="relative px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-24 md:mb-36" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 md:mb-36"
        >
          <span className="inline-block font-body text-[11px] tracking-[0.3em] uppercase text-gold/40 mb-12">
            Nos destinations
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-10">
            Choisissez votre <span className="text-gold">époque</span>
          </h2>
          <p className="font-body text-white/25 max-w-lg mx-auto text-base leading-[2]">
            Trois destinations extraordinaires vous attendent. Chaque voyage est une expérience unique et inoubliable.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 place-items-center">
          {dests.map((d, i) => <Card key={d.title} d={d} i={i} />)}
        </div>
      </div>
    </section>
  );
}
