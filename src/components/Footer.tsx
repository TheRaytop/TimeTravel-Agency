import { motion } from 'framer-motion';
import { Timer, Github, Twitter, Instagram, ArrowUp } from 'lucide-react';

const links = [
  { label: 'À propos', href: '#about' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Quiz', href: '#quiz' },
];

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Github, label: 'Github' },
];

export default function Footer() {
  const go = (h: string) => {
    if (h === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative px-8 pt-32 pb-16">
      {/* Divider */}
      <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-gold/15 to-transparent mb-20" />

      {/* Back to top */}
      <div className="flex justify-center mb-24">
        <motion.button
          onClick={() => go('#')}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/15 hover:text-gold transition-colors cursor-pointer"
          whileHover={{ scale: 1.1, y: -3 }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Top: centered brand */}
        <div className="text-center mb-20">
          <motion.button
            onClick={() => go('#')}
            className="inline-flex items-center gap-2.5 cursor-pointer group mb-8"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-cosmic/10 border border-gold/10 flex items-center justify-center">
              <Timer className="w-4 h-4 text-gold" />
            </div>
            <span className="font-display text-sm tracking-[0.15em] text-gold font-semibold">TIMETRAVEL</span>
          </motion.button>
          <p className="font-body text-white/15 text-sm leading-[1.8] max-w-sm mx-auto mb-6">
            La première agence certifiée de voyages temporels de luxe.
          </p>
          <p className="font-display text-sm text-white/10 italic tracking-wide">
            "Le passé n'attend que vous."
          </p>
        </div>

        {/* Nav + Social centered */}
        <div className="flex flex-col items-center gap-10 mb-20">
          <div className="flex items-center gap-8">
            {links.map(l => (
              <button key={l.href} onClick={() => go(l.href)} className="font-body text-sm text-white/15 hover:text-gold transition-colors cursor-pointer">
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            {socials.map(({ icon: I, label }) => (
              <motion.button
                key={label}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/12 hover:text-gold transition-all cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                aria-label={label}
              >
                <I className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent mb-10" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <p className="font-body text-[11px] text-white/10 tracking-wide">
            © 2025 TimeTravel Agency — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
