import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Destinations from './components/Destinations';
import Gallery from './components/Gallery';
import Timeline from './components/Timeline';
import Quiz from './components/Quiz';
import Booking from './components/Booking';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AmbientSound from './components/AmbientSound';
import EasterEgg from './components/EasterEgg';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-void">
      <div className="noise" />

      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => {}} />}
      </AnimatePresence>

      {!loading && (
        <>
          <ParticleBackground />
          <Header />

          <main className="relative z-10">
            <Hero />

            <div className="h-32 md:h-48" />

            <About />

            <div className="h-32 md:h-48" />

            <Destinations />

            <div className="h-32 md:h-48" />

            <Gallery />

            <div className="h-32 md:h-48" />

            <Timeline />

            <div className="h-32 md:h-48" />

            <Quiz />

            <div className="h-32 md:h-48" />

            <Booking />

            <div className="h-32 md:h-48" />

            <Testimonials />

            <div className="h-32 md:h-48" />

            <FAQ />

            <div className="h-24 md:h-40" />
          </main>

          <Footer />
          <Chatbot />
          <AmbientSound />
          <EasterEgg />
        </>
      )}
    </div>
  );
}
