import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Comment fonctionne le voyage temporel ?',
    answer:
      "Notre technologie brevetée de distorsion spatio-temporelle crée un corridor quantique stabilisé entre deux points dans le temps. Vous êtes enveloppé dans une bulle chrono-protectrice qui vous transporte instantanément à l'époque choisie. Le processus est totalement indolore — vous ressentirez tout au plus un léger picotement et une brève sensation de vertige, comparable à un ascenseur très rapide.",
  },
  {
    question: 'Est-ce dangereux ?',
    answer:
      "La sécurité est notre priorité absolue. Chaque voyage est supervisé par nos chrononautes certifiés et notre IA de surveillance temporelle en temps réel. Nos capsules sont équipées d'un système de rapatriement d'urgence qui vous ramène instantanément au présent en cas d'anomalie. En plus de 2 800 expéditions, nous affichons un taux de retour réussi de 100 %.",
  },
  {
    question: 'Que dois-je emporter ?',
    answer:
      "Absolument rien. Nous fournissons l'intégralité de l'équipement nécessaire : vêtements d'époque confectionnés sur mesure, traducteur neural universel, kit de survie temporelle et provisions adaptées. Vos effets personnels sont conservés en sécurité dans nos coffres quantiques pendant toute la durée de votre voyage. Nous vous demandons simplement de ne transporter aucun objet technologique moderne.",
  },
  {
    question: 'Combien de temps dure un voyage ?',
    answer:
      "C'est la magie du voyage temporel : vous choisissez la durée de votre séjour dans le passé — de quelques heures à plusieurs semaines — tout en ne vous absentant que quelques secondes dans le présent. Votre patron ne remarquera même pas votre absence. Nos formules vont de l'excursion express (4 heures sur place) au séjour immersif (jusqu'à 21 jours).",
  },
  {
    question: 'Puis-je modifier le passé ?',
    answer:
      "Strictement interdit. Notre bulle chrono-protectrice vous maintient en mode « observateur actif » : vous pouvez interagir avec votre environnement de manière superficielle, mais toute action susceptible d'altérer le continuum temporel est automatiquement neutralisée par notre système de stabilisation paradoxale. Les lois du Conseil Temporel International sont très claires à ce sujet.",
  },
  {
    question: "Y a-t-il une limite d'âge ?",
    answer:
      "Nos voyages sont accessibles dès 16 ans avec autorisation parentale et sans limite d'âge supérieure, sous réserve d'un certificat médical validé par notre équipe. Notre plus jeune voyageuse avait 16 ans (Renaissance italienne) et notre doyen 94 ans (Paris 1889). La bulle chrono-protectrice s'adapte à chaque métabolisme pour garantir un confort optimal.",
  },
  {
    question: 'Comment se passe le retour ?',
    answer:
      "Le retour est aussi fluide que le départ. À l'heure convenue — ou sur simple activation de votre bracelet de rapatriement — le corridor quantique se rouvre et vous ramène exactement à votre point de départ, à la seconde près. Une légère désorientation temporelle est normale pendant les premières minutes. Notre équipe vous accueille avec une boisson chaude et un débriefing personnalisé.",
  },
  {
    question: 'Puis-je voyager en groupe ?',
    answer:
      "Absolument. Nos capsules de voyage accueillent jusqu'à 8 personnes simultanément, idéal pour les familles, les couples ou les groupes d'amis. Nous proposons également des formules entreprise pour du team-building temporel — rien ne soude une équipe comme survivre ensemble au Crétacé. Des tarifs dégressifs s'appliquent à partir de 4 voyageurs.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative px-6 md:px-12">
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
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-10">
            Questions <span className="text-gold">fréquentes</span>
          </h2>
          <p className="font-body text-white/25 max-w-lg mx-auto text-base leading-[2]">
            Tout ce que vous devez savoir avant de traverser le temps.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <div className="glass rounded-2xl overflow-hidden">
                {/* Question button */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left cursor-pointer group"
                >
                  <span className="font-body text-[15px] text-white/70 group-hover:text-white/90 transition-colors duration-300 pr-6">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-gold/50" />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-7 pt-0">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent mb-6" />
                        <p className="font-body text-sm text-white/30 leading-[2]">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
