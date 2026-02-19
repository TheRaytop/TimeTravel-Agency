import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  destination: string;
  rating: number;
  text: string;
  avatar: string;
  accent: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Élise Fontaine',
    destination: 'Paris 1889',
    rating: 5,
    text: "Voir la Tour Eiffel s'illuminer pour la première fois a été le moment le plus magique de ma vie. Les croissants de Montmartre avaient un goût que plus personne ne connaît aujourd'hui. Une expérience absolument transcendante.",
    avatar: '👩‍🎨',
    accent: '#D4AF37',
  },
  {
    name: 'Dr. Hugo Lemaire',
    destination: 'Crétacé · -65M années',
    rating: 5,
    text: "En tant que paléontologue, observer un Tyrannosaure en chair et en os à 200 mètres de distance a bouleversé tout ce que je croyais savoir. L'équipe de chrononautes était d'un professionnalisme irréprochable.",
    avatar: '🧑‍🔬',
    accent: '#00C896',
  },
  {
    name: 'Sofia Marchetti',
    destination: 'Florence 1504',
    rating: 5,
    text: "J'ai regardé Michel-Ange travailler sur le David. Ses mains, la lumière de l'atelier, l'odeur du marbre… Aucun musée ne pourra jamais reproduire cette émotion. Merci TimeTravel Agency, mille fois merci.",
    avatar: '👩‍💼',
    accent: '#C41E3A',
  },
  {
    name: 'Antoine Dubois',
    destination: 'Paris 1889',
    rating: 4,
    text: "L'Exposition Universelle dépassait tout ce que j'avais imaginé. Se perdre dans les pavillons du monde entier, croiser Gustave Eiffel en personne… On m'avait prévenu que je voudrais y retourner. C'est vrai.",
    avatar: '🧔',
    accent: '#D4AF37',
  },
  {
    name: 'Camille Renard',
    destination: 'Crétacé · -65M années',
    rating: 5,
    text: "Les enfants en rêvaient depuis des années. Voir leurs yeux quand le premier Brachiosaure est apparu entre les arbres… Je n'ai pas les mots. Le protocole de sécurité est exemplaire, on se sent protégé à chaque instant.",
    avatar: '👩‍👧',
    accent: '#00C896',
  },
  {
    name: 'Raphaël de Saint-Exupéry',
    destination: 'Florence 1504',
    rating: 5,
    text: "Flâner dans les ruelles de Florence à l'apogée de la Renaissance, sentir l'énergie créatrice qui habitait chaque atelier, chaque palazzo… J'ai compris pourquoi on appelle ça un âge d'or. Un voyage qui change à jamais le regard.",
    avatar: '🎩',
    accent: '#7B2FBE',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold' : 'text-white/10'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className="group"
    >
      <div className="relative glass rounded-3xl overflow-hidden h-full hover:border-white/[0.08] transition-all duration-500 flex flex-col">
        {/* Top accent line */}
        <div
          className="h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${t.accent}40, transparent)` }}
        />

        <div className="px-10 md:px-12 py-14 md:py-16 flex flex-col h-full">
          {/* Stars */}
          <div className="mb-8">
            <StarRating rating={t.rating} />
          </div>

          {/* Quote */}
          <p className="font-body text-sm text-white/35 leading-[2.2] mb-10 flex-1 group-hover:text-white/45 transition-colors duration-500">
            "{t.text}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-5 pt-8 border-t border-white/[0.04]">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-2xl shrink-0">
              {t.avatar}
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-white/80 mb-1">{t.name}</div>
              <div className="font-body text-xs tracking-wide" style={{ color: `${t.accent}90` }}>
                {t.destination}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative px-6 md:px-12">
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
          <span className="inline-block font-body text-[11px] tracking-[0.3em] uppercase text-gold/40 mb-12">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-10">
            Ce que disent nos <span className="text-gold">voyageurs</span>
          </h2>
          <p className="font-body text-white/25 max-w-lg mx-auto text-base leading-[2]">
            Plus de 2 800 explorateurs temporels nous ont fait confiance.
            Découvrez leurs récits extraordinaires.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
