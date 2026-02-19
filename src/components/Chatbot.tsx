import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const SYSTEM_PROMPT = `Tu es Chronos, l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.

Ton role : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionne d'histoire
- Toujours enthousiaste sans etre trop familier
- Expert en voyage temporel (fictif mais credible)
- Tu utilises des emojis avec parcimonie pour rester elegant

Tu connais parfaitement ces 3 destinations :

1. PARIS 1889 (Belle Epoque) - 12 500 euros/voyageur
   - Inauguration de la Tour Eiffel, Exposition Universelle
   - Promenades dans le Paris de Gustave Eiffel
   - Degustation dans les cafes de Montmartre
   - Spectacles au Moulin Rouge
   - Costume d'epoque sur mesure inclus
   - Guide chrononaute francophone expert du XIXe siecle

2. CRETACE -65 MILLIONS D'ANNEES - 18 900 euros/voyageur
   - Observation de T-Rex, Triceratops et Pterodactyles
   - Camp de base securise en foret primitive
   - Bouclier temporel individuel permanent
   - Equipement d'exploration fourni
   - Expedition encadree par 3 chrononautes experts minimum
   - Notre destination la plus spectaculaire

3. FLORENCE 1504 (Renaissance) - 14 200 euros/voyageur
   - Rencontre avec Leonard de Vinci dans son atelier
   - Assister a la creation du David par Michel-Ange
   - Diner au Palais des Medicis
   - Visite des plus grandes galeries de l'epoque
   - Interprete temporel italien inclus
   - Costume Renaissance sur mesure inclus

Informations generales :
- Duree standard : 3 a 7 jours sur place
- Grace a la technologie, le voyageur revient au moment exact de son depart
- Taux de retour : 100% (2 847 voyages realises, zero incident)
- Bouclier temporel individuel haute frequence
- Chrononautes formes pendant 3 ans minimum
- Technologie anti-paradoxe brevetee
- Extraction d'urgence instantanee disponible
- Bagages : medicaments personnels autorises, appareils electroniques modernes interdits
- Tout est fourni : costumes, equipement, kit de survie temporelle, traducteur neuronal
- Seance de preparation de 2h incluse avant chaque depart
- Acompte de 30% a la reservation, solde 7 jours avant le depart

Tu peux suggerer des destinations selon les interets du client :
- Culture et gastronomie -> Paris 1889
- Aventure et nature -> Cretace
- Art et elegance -> Florence 1504

Reponds toujours en francais. Sois concis (max 150 mots par reponse) mais informatif.
Si on te pose des questions hors sujet, ramene poliment la conversation aux voyages temporels.`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

async function callGroqAPI(messages: GroqMessage[]): Promise<string> {
  if (!GROQ_API_KEY) {
    return getFallbackResponse(messages[messages.length - 1].content);
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      console.error('Groq API error:', res.status);
      return getFallbackResponse(messages[messages.length - 1].content);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || getFallbackResponse('');
  } catch (err) {
    console.error('Groq API error:', err);
    return getFallbackResponse(messages[messages.length - 1].content);
  }
}

// Fallback pattern matching si pas de cle API
const patterns: { keywords: string[]; response: string }[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou', 'bonsoir'],
    response:
      "Bonjour et bienvenue chez TimeTravel Agency ! \u2728 Je suis Chronos, votre assistant temporel personnel. Comment puis-je vous aider aujourd'hui ?\n\nN'h\u00e9sitez pas \u00e0 me poser des questions sur nos destinations, nos tarifs ou la s\u00e9curit\u00e9 de nos voyages.",
  },
  {
    keywords: ['paris', '1889', 'belle \u00e9poque', 'eiffel', 'montmartre'],
    response:
      "Paris 1889, un choix magnifique ! \u2728\n\nVous assisterez \u00e0 l'inauguration de la Tour Eiffel lors de l'Exposition Universelle.\n\n\ud83d\uddfc Au programme :\n\u2022 Promenades dans le Paris de Gustave Eiffel\n\u2022 D\u00e9gustation dans les caf\u00e9s de Montmartre\n\u2022 Spectacles au Moulin Rouge\n\u2022 Costume d'\u00e9poque sur mesure inclus\n\n\u00c0 partir de 12 500 \u20ac/voyageur.",
  },
  {
    keywords: ['dinosaure', 'cr\u00e9tac\u00e9', 'dino', 'titan', 't-rex', 'jurassique', 'extinction'],
    response:
      "L'\u00c8re des Titans \u2014 notre destination la plus spectaculaire ! \ud83e\udd95\n\nObservez les dinosaures dans leur habitat naturel, 65 millions d'ann\u00e9es avant notre \u00e8re.\n\n\u2022 T-Rex, Tric\u00e9ratops et Pt\u00e9rodactyles\n\u2022 Camp de base s\u00e9curis\u00e9\n\u2022 Bouclier temporel individuel\n\n\u00c0 partir de 18 900 \u20ac/voyageur.",
  },
  {
    keywords: ['florence', 'renaissance', '1504', 'vinci', 'l\u00e9onard', 'michel-ange', 'david', 'm\u00e9dicis'],
    response:
      "Florence 1504, le berceau de la Renaissance ! \ud83c\udfa8\n\n\u2022 Rencontre avec L\u00e9onard de Vinci\n\u2022 Cr\u00e9ation du David par Michel-Ange\n\u2022 D\u00eener au Palais des M\u00e9dicis\n\u2022 Costume Renaissance inclus\n\n\u00c0 partir de 14 200 \u20ac/voyageur.",
  },
  {
    keywords: ['prix', 'tarif', 'co\u00fbt', 'combien', 'cher', 'budget', 'argent'],
    response:
      "Nos tarifs :\n\n\ud83d\uddfc Paris 1889 \u2014 12 500 \u20ac/voyageur\n\ud83e\udd95 Cr\u00e9tac\u00e9 \u2014 18 900 \u20ac/voyageur\n\ud83c\udfa8 Florence 1504 \u2014 14 200 \u20ac/voyageur\n\nChaque forfait inclut : transport temporel, costumes, guide, assurance retour et h\u00e9bergement.",
  },
  {
    keywords: ['s\u00e9curit\u00e9', 'danger', 'risque', 's\u00fbr', 'dangereux', 'safe', 'proteg'],
    response:
      "La s\u00e9curit\u00e9 est notre priorit\u00e9 ! \ud83d\udee1\ufe0f\n\n\u2022 Bouclier temporel individuel\n\u2022 Taux de retour : 100% (2 847 voyages)\n\u2022 Z\u00e9ro incident\n\u2022 Technologie anti-paradoxe brevet\u00e9e\n\u2022 Extraction d'urgence instantan\u00e9e",
  },
  {
    keywords: ['merci', 'super', 'g\u00e9nial', 'cool', 'top', 'parfait'],
    response: "Avec grand plaisir ! \ud83d\ude0a N'h\u00e9sitez pas si d'autres questions vous viennent. Le pass\u00e9 n'attend que vous ! \u2728",
  },
];

function getFallbackResponse(input: string): string {
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
  return "Merci pour votre question ! \ud83d\udd70\ufe0f\n\nJe peux vous renseigner sur :\n\u2022 Nos 3 destinations (Paris, Cr\u00e9tac\u00e9, Florence)\n\u2022 Tarifs et r\u00e9servations\n\u2022 S\u00e9curit\u00e9 et garanties\n\u2022 Pr\u00e9paration du voyage\n\nQue souhaitez-vous savoir ?";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bienvenue chez TimeTravel Agency ! \u2728\n\nJe suis Chronos, votre assistant temporel propuls\u00e9 par IA. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      time: getTime(),
    },
  ]);
  const [chatHistory, setChatHistory] = useState<GroqMessage[]>([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: "Bienvenue chez TimeTravel Agency ! Je suis Chronos, votre assistant temporel. Comment puis-je vous aider aujourd'hui ?" },
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

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const newHistory: GroqMessage[] = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);

    const response = await callGroqAPI(newHistory);

    setChatHistory([...newHistory, { role: 'assistant', content: response }]);
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: response, sender: 'bot', time: getTime() },
    ]);
  };

  const quickActions = [
    { label: 'Destinations', value: 'Quelles sont vos destinations ?' },
    { label: 'Prix', value: 'Quels sont vos tarifs ?' },
    { label: 'S\u00e9curit\u00e9', value: 'Est-ce que le voyage est s\u00fbr ?' },
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
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div className="relative">
                <div className="font-display text-sm text-white font-semibold tracking-wide flex items-center gap-2">
                  Chronos
                  {GROQ_API_KEY && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20 font-body">IA</span>}
                </div>
                <div className="text-[11px] text-emerald font-body flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_6px_rgba(0,200,150,0.5)]" />
                  {GROQ_API_KEY ? 'Propuls\u00e9 par Llama 3.3' : 'Assistant TimeTravel'}
                </div>
              </div>
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
                      onClick={() => handleSend(qa.value)}
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
                  placeholder="Posez-moi vos questions sur les voyages temporels..."
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
