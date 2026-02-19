import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */

interface Destination {
  id: string;
  label: string;
  emoji: string;
  description: string;
  price: number;
}

interface BookingDetails {
  departureDate: string;
  duration: number;
  travelers: number;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

/* ─────────────────────────── Data ──────────────────────────── */

const DESTINATIONS: Destination[] = [
  {
    id: "paris-1889",
    label: "Paris 1889",
    emoji: "\uD83D\uDDFC",
    description:
      "Assistez \u00e0 l\u2019inauguration de la Tour Eiffel lors de l\u2019Exposition universelle.",
    price: 12_500,
  },
  {
    id: "cretace",
    label: "Cr\u00e9tac\u00e9",
    emoji: "\uD83E\uDD95",
    description:
      "Explorez la Terre il y a 66\u00a0millions d\u2019ann\u00e9es parmi les dinosaures.",
    price: 18_900,
  },
  {
    id: "florence-1504",
    label: "Florence 1504",
    emoji: "\uD83C\uDFA8",
    description:
      "D\u00e9couvrez l\u2019atelier de Michel-Ange et la Renaissance italienne.",
    price: 14_200,
  },
];

const DURATION_OPTIONS = [3, 5, 7] as const;

const STEP_LABELS = ["Destination", "D\u00e9tails", "Informations", "Confirmation"];

/* ──────────────────────── Helpers ──────────────────────────── */

function formatPrice(value: number): string {
  return value.toLocaleString("fr-FR") + "\u00a0\u20ac";
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.6,
    duration: Math.random() * 1.5 + 1.5,
    rotation: Math.random() * 360,
  }));
}

/* ──────────────────────── Sub-components ───────────────────── */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEP_LABELS.map((label, i) => {
        const isCompleted = i < step;
        const isCurrent = i === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            {/* Cercle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-body font-semibold
                  transition-colors duration-300
                  ${
                    isCompleted
                      ? "bg-[#D4AF37] border-[#D4AF37] text-[#030014]"
                      : isCurrent
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-white/20 text-white/30"
                  }
                `}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span
                className={`text-xs font-body whitespace-nowrap ${
                  isCompleted || isCurrent ? "text-[#D4AF37]" : "text-white/30"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Trait entre les cercles */}
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 h-px mx-3 mt-[-1.25rem] relative overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#D4AF37]"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DestinationStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {DESTINATIONS.map((dest) => {
        const isActive = selected === dest.id;
        return (
          <motion.button
            key={dest.id}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(dest.id)}
            className={`
              relative flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 cursor-pointer
              ${
                isActive
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_30px_rgba(212,175,55,.15)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }
            `}
          >
            <span className="text-4xl mb-3">{dest.emoji}</span>
            <h3 className="font-display text-lg text-white mb-1">{dest.label}</h3>
            <p className="text-white/50 text-sm font-body leading-relaxed mb-4">
              {dest.description}
            </p>
            <span className="font-display text-[#D4AF37] text-lg font-semibold">
              {formatPrice(dest.price)}
            </span>
            {isActive && (
              <motion.div
                layoutId="dest-check"
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center"
              >
                <Check className="w-3.5 h-3.5 text-[#030014]" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function DetailsStep({
  details,
  onChange,
}: {
  details: BookingDetails;
  onChange: (d: BookingDetails) => void;
}) {
  const adjustTravelers = (delta: number) => {
    const next = Math.min(6, Math.max(1, details.travelers + delta));
    onChange({ ...details, travelers: next });
  };

  return (
    <div className="space-y-6">
      {/* Date de d\u00e9part */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-body mb-2">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          Date de d\u00e9part
        </label>
        <input
          type="date"
          value={details.departureDate}
          onChange={(e) => onChange({ ...details, departureDate: e.target.value })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white font-body
                     focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors
                     [color-scheme:dark]"
        />
      </div>

      {/* Dur\u00e9e */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-body mb-2">
          <MapPin className="w-4 h-4 text-[#D4AF37]" />
          Dur\u00e9e du voyage
        </label>
        <select
          value={details.duration}
          onChange={(e) => onChange({ ...details, duration: Number(e.target.value) })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white font-body
                     focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors
                     appearance-none cursor-pointer"
        >
          {DURATION_OPTIONS.map((d) => (
            <option key={d} value={d} className="bg-[#0a0a2e] text-white">
              {d} jours
            </option>
          ))}
        </select>
      </div>

      {/* Voyageurs */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-body mb-2">
          <Users className="w-4 h-4 text-[#D4AF37]" />
          Nombre de voyageurs
        </label>
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => adjustTravelers(-1)}
            disabled={details.travelers <= 1}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.05] text-white text-xl
                       flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed
                       hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            &minus;
          </motion.button>
          <span className="text-2xl font-display text-white w-8 text-center">
            {details.travelers}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => adjustTravelers(1)}
            disabled={details.travelers >= 6}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.05] text-white text-xl
                       flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed
                       hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            +
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function InfoStep({
  info,
  onChange,
}: {
  info: PersonalInfo;
  onChange: (i: PersonalInfo) => void;
}) {
  const fields: {
    key: keyof PersonalInfo;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
  }[] = [
    { key: "lastName", label: "Nom", type: "text", placeholder: "Dupont", autoComplete: "family-name" },
    { key: "firstName", label: "Pr\u00e9nom", type: "text", placeholder: "Jean", autoComplete: "given-name" },
    { key: "email", label: "Email", type: "email", placeholder: "jean.dupont@email.com", autoComplete: "email" },
    { key: "phone", label: "T\u00e9l\u00e9phone", type: "tel", placeholder: "+33 6 12 34 56 78", autoComplete: "tel" },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.key === "email" || f.key === "phone" ? "sm:col-span-2" : ""}>
          <label className="text-white/70 text-sm font-body mb-2 block">{f.label}</label>
          <input
            type={f.type}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            value={info[f.key]}
            onChange={(e) => onChange({ ...info, [f.key]: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white font-body
                       placeholder:text-white/20
                       focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
          />
        </div>
      ))}
    </div>
  );
}

function ConfirmationStep({
  destination,
  details,
  info,
  totalPrice,
}: {
  destination: Destination;
  details: BookingDetails;
  info: PersonalInfo;
  totalPrice: number;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Destination", value: `${destination.emoji} ${destination.label}` },
    {
      label: "Date de d\u00e9part",
      value: new Date(details.departureDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    { label: "Dur\u00e9e", value: `${details.duration} jours` },
    { label: "Voyageurs", value: `${details.travelers}` },
    { label: "Voyageur principal", value: `${info.firstName} ${info.lastName}` },
    { label: "Email", value: info.email },
    { label: "T\u00e9l\u00e9phone", value: info.phone },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex justify-between items-center px-5 py-3.5 ${
              i < rows.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <span className="text-white/50 text-sm font-body">{r.label}</span>
            <span className="text-white font-body text-sm font-medium">{r.value}</span>
          </div>
        ))}
      </div>

      {/* Prix */}
      <div className="flex items-center justify-between rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-6 py-4">
        <span className="text-white/70 font-body">Prix total</span>
        <span className="text-[#D4AF37] text-2xl font-display font-bold">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <p className="text-white/30 text-xs font-body text-center">
        Prix unitaire {formatPrice(destination.price)} &times; {details.travelers} voyageur
        {details.travelers > 1 ? "s" : ""}
      </p>
    </div>
  );
}

function SuccessScreen() {
  const [particles] = useState<Particle[]>(() => generateParticles(50));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-12 relative overflow-hidden"
    >
      {/* Particules dor\u00e9es */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, #D4AF37, #B8860B)`,
              rotate: p.rotation,
            }}
            initial={{ top: "-5%", opacity: 1 }}
            animate={{
              top: `${60 + Math.random() * 40}%`,
              opacity: [1, 1, 0],
              rotate: p.rotation + 360,
              scale: [1, 1.3, 0.6],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Check anim\u00e9 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-[#D4AF37] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,.35)]"
      >
        <Check className="w-10 h-10 text-[#030014]" strokeWidth={3} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-3xl text-white mb-3"
      >
        Votre voyage est confirm&eacute;&nbsp;!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="text-white/50 font-body max-w-md"
      >
        Un email de confirmation vous sera envoy&eacute; sous peu.
        Pr&eacute;parez vos bagages pour un voyage extraordinaire&nbsp;!
      </motion.p>
    </motion.div>
  );
}

/* ──────────────────────── Main Component ───────────────────── */

export default function Booking() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>({
    departureDate: "",
    duration: 3,
    travelers: 1,
  });
  const [info, setInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  /* ── Validation par \u00e9tape ── */

  const isStepValid = useCallback((): boolean => {
    switch (step) {
      case 0:
        return selectedDest !== null;
      case 1:
        return details.departureDate !== "";
      case 2: {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          info.firstName.trim() !== "" &&
          info.lastName.trim() !== "" &&
          emailRegex.test(info.email) &&
          info.phone.trim() !== ""
        );
      }
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, selectedDest, details, info]);

  const destination = DESTINATIONS.find((d) => d.id === selectedDest) ?? null;
  const totalPrice = destination ? destination.price * details.travelers : 0;

  /* ── Navigation ── */

  const goNext = () => {
    if (step === 3) {
      setConfirmed(true);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  /* ── Animation variants ── */

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  /* ── Rendu ── */

  return (
    <section className="relative py-24 px-4" style={{ backgroundColor: "#030014" }}>
      <div className="max-w-2xl mx-auto">
        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        </div>

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#D4AF37] text-sm font-body tracking-widest uppercase mb-3">
            R&eacute;servation
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white">
            R&eacute;servez votre voyage
          </h2>
        </div>

        {/* ── Carte glass ── */}
        <div className="glass rounded-3xl p-8 sm:p-10">
          {confirmed ? (
            <SuccessScreen />
          ) : (
            <>
              {/* Barre de progression */}
              <ProgressBar step={step} />

              {/* Contenu de l'\u00e9tape */}
              <div className="relative overflow-hidden min-h-[320px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {step === 0 && (
                      <DestinationStep
                        selected={selectedDest}
                        onSelect={setSelectedDest}
                      />
                    )}
                    {step === 1 && (
                      <DetailsStep details={details} onChange={setDetails} />
                    )}
                    {step === 2 && <InfoStep info={info} onChange={setInfo} />}
                    {step === 3 && destination && (
                      <ConfirmationStep
                        destination={destination}
                        details={details}
                        info={info}
                        totalPrice={totalPrice}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-10">
                {step > 0 ? (
                  <motion.button
                    type="button"
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goPrev}
                    className="flex items-center gap-2 text-white/60 hover:text-white font-body transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Pr&eacute;c&eacute;dent
                  </motion.button>
                ) : (
                  <div />
                )}

                <motion.button
                  type="button"
                  whileHover={isStepValid() ? { scale: 1.03 } : {}}
                  whileTap={isStepValid() ? { scale: 0.97 } : {}}
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className={`
                    flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm transition-all duration-300 cursor-pointer
                    ${
                      isStepValid()
                        ? "bg-[#D4AF37] text-[#030014] hover:shadow-[0_0_30px_rgba(212,175,55,.3)]"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                    }
                  `}
                >
                  {step === 3 ? (
                    <>
                      Confirmer la r&eacute;servation
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
