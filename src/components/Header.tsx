import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const links = [
  { label: 'À propos', href: '#about' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Quiz', href: '#quiz' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      for (const id of ['quiz', 'destinations', 'about']) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 200 && r.bottom > 200) { setActive(id); return; }
        }
      }
      if (window.scrollY < 300) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className={`transition-all duration-500 ${scrolled ? 'pt-0' : 'pt-3 md:pt-5'}`}>
          <div className={`mx-auto transition-all duration-500 ${
            scrolled
              ? 'max-w-full bg-[rgba(3,0,20,0.7)] backdrop-blur-[50px] border-b border-white/[0.03]'
              : 'max-w-4xl mx-4 md:mx-auto rounded-2xl bg-[rgba(255,255,255,0.02)] backdrop-blur-[30px] border border-white/[0.04]'
          }`}>
            <div className="flex items-center justify-between h-14 px-6">
              {/* Logo */}
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 cursor-pointer group"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold/20 to-cosmic/10 border border-gold/10 flex items-center justify-center">
                  <Timer className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="font-display text-xs tracking-[0.15em] text-gold font-semibold hidden sm:block">
                  TIMETRAVEL
                </span>
              </motion.button>

              {/* Desktop */}
              <nav className="hidden md:flex items-center gap-8">
                {links.map(l => (
                  <button
                    key={l.href}
                    onClick={() => go(l.href)}
                    className={`font-body text-[13px] tracking-wide transition-colors cursor-pointer ${
                      active === l.href.slice(1) ? 'text-gold' : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}

                <ThemeToggle />

                <div className="w-px h-4 bg-white/[0.06]" />

                <button
                  onClick={() => go('#destinations')}
                  className="flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-gold to-gold-light cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                >
                  <Sparkles className="w-3 h-3 text-void" />
                  <span className="font-body text-[12px] font-semibold text-void tracking-wide">Réserver</span>
                </button>
              </nav>

              {/* Mobile */}
              <button
                className="md:hidden w-9 h-9 rounded-lg glass flex items-center justify-center text-white/50 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] md:hidden flex flex-col items-center justify-center gap-10"
            style={{ background: 'rgba(3,0,20,0.97)', backdropFilter: 'blur(40px)' }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => go(l.href)}
                className="font-display text-2xl text-white/50 hover:text-gold tracking-widest cursor-pointer"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => go('#destinations')}
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-void font-display font-semibold tracking-wider cursor-pointer"
            >
              Réserver
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
