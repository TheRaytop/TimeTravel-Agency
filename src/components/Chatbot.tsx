import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const patterns: { keywords: string[]; response: string }[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou', 'bonsoir'],
    response:
      "Bonjour et bienvenue chez TimeTravel Agency ! ✨ Je suis Chronos, votre assistant temporel personnel. Comment puis-je vous aider aujourd'hui ?\n\nN'hésitez pas à me poser des questions sur nos destinations, nos tarifs ou la sécurité de nos voyages.",
  },
  {
    keywords: ['paris', '1889', 'belle époque', 'eiffel', 'montmartre'],
    response:
      "Paris 1889, un choix magnifique ! ✨\n\nVous assisterez à l'inauguration de la Tour Eiffel lors de l'Exposition Universelle.\n\n🗼 Au programme :\n• Promenades dans le Paris de Gustave Eiffel\n• Dégustation dans les cafés de Montmartre\n• Spectacles au Moulin Rouge\n• Costume d'époque sur mesure inclus\n\nLe voyage inclut un guide chrononaute francophone expert du XIXe siècle.",
  },
  {
    keywords: ['dinosaure', 'crétacé', 'dino', 'titan', 't-rex', 'jurassique', 'extinction'],
    response:
      "L'Ère des Titans — notre destination la plus spectaculaire ! 🦕\n\nVous observerez les dinosaures dans leur habitat naturel, 65 millions d'années avant notre ère.\n\n🌿 Points forts :\n• Observation de T-Rex, Tricératops et Ptérodactyles\n• Camp de base sécurisé en forêt primitive\n• Bouclier temporel individuel permanent\n• Équipement d'exploration fourni\n\n⚠️ Expédition encadrée par 3 chrononautes experts minimum.",
  },
  {
    keywords: ['florence', 'renaissance', '1504', 'vinci', 'léonard', 'michel-ange', 'david', 'médicis'],
    response:
      "Florence 1504, le berceau de la Renaissance ! 🎨\n\n✨ Expériences uniques :\n• Rencontre avec Léonard de Vinci dans son atelier\n• Assister à la création du David par Michel-Ange\n• Dîner au Palais des Médicis\n• Visite des plus grandes galeries de l'époque\n\nUn interprète temporel italien vous accompagne durant tout le séjour. Costume Renaissance sur mesure inclus.",
  },
  {
    keywords: ['prix', 'tarif', 'coût', 'combien', 'cher', 'budget', 'argent'],
    response:
      "Voici nos tarifs par destination :\n\n🗼 Paris 1889 — à partir de 12 500 €/voyageur\n🦕 Crétacé — à partir de 18 900 €/voyageur\n🎨 Florence 1504 — à partir de 14 200 €/voyageur\n\n✅ Chaque forfait inclut :\n• Transport temporel aller-retour\n• Équipement et costumes d'époque\n• Guide chrononaute dédié\n• Assurance retour garanti\n• Hébergement sur place\n\nDes options premium sont disponibles sur demande.",
  },
  {
    keywords: ['réserver', 'réservation', 'booking', 'inscription', 'inscrire'],
    response:
      "Pour réserver, c'est simple ! 📋\n\n1️⃣ Explorez nos destinations sur le site\n2️⃣ Cliquez sur celle qui vous intéresse\n3️⃣ Un conseiller temporel vous contacte sous 24h\n4️⃣ Acompte de 30% à la réservation\n5️⃣ Solde 7 jours avant le départ\n\nVous pouvez aussi passer notre quiz de recommandation pour trouver la destination parfaite !",
  },
  {
    keywords: ['sécurité', 'danger', 'risque', 'sûr', 'dangereux', 'safe', 'proteg'],
    response:
      "La sécurité est notre priorité absolue ! 🛡️\n\n• Bouclier temporel individuel haute fréquence\n• Chrononautes formés pendant 3 ans minimum\n• Taux de retour : 100% (2 847 voyages)\n• Zéro incident depuis la création\n• Technologie anti-paradoxe brevetée\n• Extraction d'urgence instantanée\n\nVous êtes en sécurité à chaque instant de votre voyage. C'est notre engagement.",
  },
  {
    keywords: ['bagage', 'valise', 'emporter', 'affaire', 'préparer', 'preparation'],
    response:
      "Excellente question ! 🧳\n\nVous n'avez presque rien à emporter :\n\n✅ Autorisé : médicaments personnels\n❌ Interdit : appareils électroniques modernes\n\nNous fournissons TOUT :\n• Costumes d'époque sur mesure\n• Équipement d'exploration\n• Kit de survie temporelle\n• Traducteur neuronal\n\nUne séance de préparation de 2h est incluse avant le départ.",
  },
  {
    keywords: ['durée', 'temps', 'long', 'jours', 'combien de temps', 'semaine'],
    response:
      "La durée standard est de 3 à 7 jours sur place. ⏳\n\nMais voici le meilleur :\nGrâce à notre technologie, vous revenez exactement au moment de votre départ.\n\n🤯 Concrètement : partez 7 jours au Crétacé et revenez comme si seulement quelques secondes s'étaient écoulées dans le présent !\n\nAucun impact sur votre vie quotidienne.",
  },
  {
    keywords: ['retour', 'revenir', 'garantie', 'garanti', 'coincé', 'bloqué'],
    response:
      "Le retour est garanti à 100% ! ✅\n\nNotre système de rappel temporel est infaillible :\n\n• Retour automatique en fin de séjour\n• Bouton d'extraction d'urgence individuel\n• Balise de localisation temporelle permanente\n• Double système de secours\n\n2 847 voyages réalisés. 2 847 retours réussis. Aucune exception.",
  },
  {
    keywords: ['choisir', 'conseiller', 'hésit', 'recommand', 'quel', 'laquelle', 'aide'],
    response:
      "Je vous recommande notre quiz de recommandation ! 🎯\n\nIl est disponible juste au-dessus sur la page — en 4 questions, il détermine quelle époque correspond le mieux à votre personnalité.\n\nSinon, dites-moi :\n• 🗼 Culture et gastronomie → Paris 1889\n• 🦕 Aventure et nature → Crétacé\n• 🎨 Art et élégance → Florence 1504\n\nQu'est-ce qui vous attire le plus ?",
  },
  {
    keywords: ['merci', 'super', 'génial', 'cool', 'top', 'parfait', 'excellent'],
    response: "Avec grand plaisir ! 😊\n\nN'hésitez pas si d'autres questions vous viennent. Je suis disponible 24h/24 à travers toutes les époques.\n\nLe passé n'attend que vous ! ✨",
  },
  {
    keywords: ['qui es', 'chronos', 'robot', 'ia', 'intelligence'],
    response:
      "Je suis Chronos, l'assistant IA de TimeTravel Agency ! 🕰️\n\nJe suis spécialisé dans le conseil en voyages temporels. Je connais chaque époque, chaque destination et chaque détail de nos services.\n\nMa mission : vous aider à trouver le voyage parfait et répondre à toutes vos questions. Que souhaitez-vous savoir ?",
  },
];

function getResponse(input: string): string {
  const lower = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  for (const p of patterns) {
    if (
      p.keywords.some((kw) =>
        lower.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
      )
    ) {
      return p.response;
    }
  }
  return "Merci pour votre question ! 🕰️\n\nJe suis spécialisé dans les voyages temporels. Voici ce que je peux vous aider avec :\n\n• 🗼🦕🎨 Détails sur nos 3 destinations\n• 💰 Tarifs et réservations\n• 🛡️ Sécurité et garanties\n• 🧳 Préparation du voyage\n• ⏳ Durée et retour\n\nN'hésitez pas à me poser une question plus précise !";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bienvenue chez TimeTravel Agency ! ✨\n\nJe suis Chronos, votre assistant temporel. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userInput);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: response, sender: 'bot', time: getTime() },
      ]);
    }, 800 + Math.random() * 1200);
  };

  const quickActions = [
    { label: 'Destinations', value: 'Quelles sont vos destinations ?' },
    { label: 'Prix', value: 'Quels sont vos tarifs ?' },
    { label: 'Sécurité', value: 'Est-ce que le voyage est sûr ?' },
  ];

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #7B2FBE)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div key="m" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[540px] max-h-[75vh] rounded-3xl flex flex-col overflow-hidden"
            style={{
              background: 'rgba(6, 2, 30, 0.9)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-cosmic/[0.03]" />
              <div className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(123,47,190,0.2))' }}>
                <span className="text-base">🕰️</span>
              </div>
              <div className="relative">
                <div className="font-display text-sm text-white font-semibold tracking-wide">Chronos</div>
                <div className="text-[11px] text-emerald font-body flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_6px_rgba(0,200,150,0.5)]" />
                  Assistant TimeTravel
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-gold/30 ml-auto relative" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 text-[13px] font-body leading-[1.7] ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/10 text-white/85 rounded-2xl rounded-br-lg'
                        : 'rounded-2xl rounded-bl-lg text-white/60'
                    }`}
                    style={
                      msg.sender === 'bot'
                        ? { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }
                        : undefined
                    }
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 ${
                        msg.sender === 'user' ? 'text-gold/30 text-right' : 'text-white/15'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gold/40"
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick actions on first message */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 pt-2 justify-center"
                >
                  {quickActions.map((qa) => (
                    <button
                      key={qa.label}
                      onClick={() => {
                        setInput(qa.value);
                        setTimeout(() => {
                          const userMsg: Message = {
                            id: Date.now(),
                            text: qa.value,
                            sender: 'user',
                            time: getTime(),
                          };
                          setMessages((prev) => [...prev, userMsg]);
                          setInput('');
                          setIsTyping(true);
                          setTimeout(() => {
                            const response = getResponse(qa.value);
                            setIsTyping(false);
                            setMessages((prev) => [
                              ...prev,
                              { id: Date.now() + 1, text: response, sender: 'bot', time: getTime() },
                            ]);
                          }, 800 + Math.random() * 800);
                        }, 100);
                      }}
                      className="px-3 py-1.5 rounded-full text-[11px] font-body text-gold/60 hover:text-gold hover:bg-gold/5 transition-all cursor-pointer"
                      style={{ border: '1px solid rgba(212,175,55,0.15)' }}
                    >
                      {qa.label}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.04]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez-moi vos questions..."
                  className="flex-1 bg-white/[0.03] border border-white/[0.04] rounded-full px-4 py-2.5 text-[13px] font-body text-white/80 placeholder:text-white/15 focus:outline-none focus:border-gold/20 transition-all"
                />
                <motion.button
                  type="submit"
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                  style={{
                    background: input.trim()
                      ? 'linear-gradient(135deg, #D4AF37, #FFD700)'
                      : 'rgba(255,255,255,0.03)',
                    border: input.trim() ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  }}
                  whileHover={input.trim() ? { scale: 1.1 } : {}}
                  whileTap={input.trim() ? { scale: 0.9 } : {}}
                >
                  <Send className={`w-3.5 h-3.5 ${input.trim() ? 'text-void' : 'text-white/20'}`} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
