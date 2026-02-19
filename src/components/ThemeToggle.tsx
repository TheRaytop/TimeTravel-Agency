import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <motion.button
      onClick={() => setDark(!dark)}
      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
      style={{
        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(212,175,55,0.12)',
        border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(212,175,55,0.2)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {dark ? (
          <Moon className="w-3.5 h-3.5 text-white/50" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-gold" />
        )}
      </motion.div>
    </motion.button>
  );
}
