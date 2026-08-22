import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Star,
  Flame,
  Calendar,
  Clock,
  X,
  Check,
  MessageSquare,
  ChevronRight,
  Send,
  Users,
  History,
  GraduationCap,
  Inbox,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Mail,
  Lock,
  LogOut,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  FONTS + GLOBAL FX                                                  */
/* ------------------------------------------------------------------ */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');
    .font-display { font-family: 'Sora', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    @keyframes popIn {
      0% { transform: scale(0.85); opacity: 0; }
      60% { transform: scale(1.03); opacity: 1; }
      100% { transform: scale(1); }
    }
    .animate-popIn { animation: popIn 0.35s cubic-bezier(.2,.9,.3,1.2) both; }

    @keyframes slideUp {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slideUp { animation: slideUp 0.3s ease-out both; }

    @keyframes checkPop {
      0% { transform: scale(0); }
      70% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
    .animate-checkPop { animation: checkPop 0.5s cubic-bezier(.2,.9,.3,1.4) both; }

    @keyframes flicker {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.08) rotate(-3deg); opacity: 0.9; }
    }
    .animate-flicker { animation: flicker 2.2s ease-in-out infinite; transform-origin: 50% 85%; }

    @keyframes rise {
      from { transform: translateY(6px) scale(0.6); opacity: 0.9; }
      to { transform: translateY(-26px) scale(0.2); opacity: 0; }
    }
    .spark { position: absolute; width: 3px; height: 3px; border-radius: 999px; background: #C8FF4D; animation: rise 1.1s ease-out forwards; }

    @keyframes flipDigit {
      0% { transform: rotateX(-90deg); opacity: 0; }
      60% { transform: rotateX(12deg); opacity: 1; }
      100% { transform: rotateX(0deg); }
    }
    .animate-flipDigit { animation: flipDigit 0.5s cubic-bezier(.2,.8,.3,1) both; display: inline-block; transform-style: preserve-3d; }

    @keyframes drift {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(28px,-18px) scale(1.06); }
      66% { transform: translate(-18px,14px) scale(0.96); }
    }
    .animate-drift { animation: drift 15s ease-in-out infinite; }
    .animate-drift-alt { animation: drift 20s ease-in-out infinite reverse; }

    @keyframes shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

    .glow-ring-lime { box-shadow: 0 0 0 3px #12152A, 0 0 0 5px #C8FF4D, 0 6px 18px rgba(200,255,77,0.20); }
    .glow-ring-violet { box-shadow: 0 0 0 3px #12152A, 0 0 0 5px #7C5CFF; }

    .text-queue-gradient {
      background: linear-gradient(90deg, #7C5CFF 0%, #A78BFA 45%, #C8FF4D 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-glow-dark {
      background:
        radial-gradient(560px 280px at 12% 0%, rgba(124,92,255,0.20), transparent 60%),
        radial-gradient(380px 220px at 88% 10%, rgba(200,255,77,0.10), transparent 60%);
    }

    .board-grid {
      background-image: radial-gradient(circle, rgba(124,92,255,0.16) 1px, transparent 1px);
      background-size: 22px 22px;
    }

    .ticket-notch {
      background:
        radial-gradient(circle 10px at 0px 50%, transparent 10px, #14172E 10.5px),
        radial-gradient(circle 10px at 100% 50%, transparent 10px, #14172E 10.5px);
    }
    .perf-line {
      background-image: linear-gradient(to bottom, rgba(124,92,255,0.4) 55%, transparent 45%);
      background-size: 2px 12px;
      background-repeat: repeat-y;
    }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #383D66; border-radius: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }

    @media (prefers-reduced-motion: reduce) {
      .animate-popIn, .animate-slideUp, .animate-checkPop, .animate-flicker, .animate-flipDigit, .animate-drift, .animate-drift-alt, .animate-shake, .spark { animation: none; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  AUTH                                                                */
/* ------------------------------------------------------------------ */
function validateLogin(rawEmail, password) {
  const email = rawEmail.trim().toLowerCase();

  if (email === "arpit_ta@gmail.com" && password === "123") {
    return { role: "ta", name: "Arpit", email, taId: "ta-0" };
  }

  if (email.endsWith("@sst.scaler.com") && password === "123") {
    const localPart = email.split("@")[0];
    const namePart = localPart.split(".")[0].split(/[0-9]/)[0] || "Student";
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return { role: "student", name, email };
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  SEED DATA                                                          */
/* ------------------------------------------------------------------ */
const SUBJECTS = [
  "All",
  "Web Dev 101",
  "Introduction to Computer Programing",
  "Maths",
];

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-violet-600 to-indigo-800",
  "bg-gradient-to-br from-fuchsia-600 to-violet-800",
  "bg-gradient-to-br from-violet-500 to-blue-800",
  "bg-gradient-to-br from-indigo-500 to-violet-800",
  "bg-gradient-to-br from-violet-700 to-slate-900",
];

const seedTAs = [
  {
    id: "ta-0",
    name: "Arpit",
    subject: "Web Dev 101",
    bio: "Runs the queue board for Web Dev 101 — happy to debug your build, review a PR, or rubber-duck an idea.",
    ratingsSum: 46,
    ratingsCount: 10,
    totalSessions: 52,
    upvotes: 30,
  },
  {
    id: "ta-1",
    name: "Priya Raman",
    subject: "Web Dev 101",
    bio: "3rd-year CS major who loves untangling flexbox layouts and gnarly DOM bugs. Big fan of whiteboard walkthroughs.",
    ratingsSum: 47,
    ratingsCount: 10,
    totalSessions: 58,
    upvotes: 34,
  },
  {
    id: "ta-2",
    name: "Marcus Webb",
    subject: "Maths",
    bio: "Explains derivatives and integration tricks with real-world examples. Patient with first-time proof writers.",
    ratingsSum: 44,
    ratingsCount: 11,
    totalSessions: 51,
    upvotes: 29,
  },
  {
    id: "ta-3",
    name: "Sofia Almeida",
    subject: "Introduction to Computer Programing",
    bio: "Loops-and-logic first approach — traces every variable so code finally clicks. Keeps a running meme deck.",
    ratingsSum: 49,
    ratingsCount: 10,
    totalSessions: 63,
    upvotes: 41,
  },
  {
    id: "ta-4",
    name: "Daniel Kim",
    subject: "Maths",
    bio: "Thinks in geometry, not just formulas. Great for building intuition before the symbolic grind.",
    ratingsSum: 38,
    ratingsCount: 9,
    totalSessions: 40,
    upvotes: 18,
  },
  {
    id: "ta-5",
    name: "Amara Johnson",
    subject: "Introduction to Computer Programing",
    bio: "Former TA-of-the-year. Turns loops and conditionals into something you'll actually remember on exam day.",
    ratingsSum: 46,
    ratingsCount: 10,
    totalSessions: 55,
    upvotes: 37,
  },
  {
    id: "ta-6",
    name: "Yusuf Demir",
    subject: "Web Dev 101",
    bio: "Builds tiny live demos in every session so HTML, CSS, and JS theory has somewhere to land.",
    ratingsSum: 36,
    ratingsCount: 9,
    totalSessions: 33,
    upvotes: 15,
  },
  {
    id: "ta-7",
    name: "Grace Lin",
    subject: "Maths",
    bio: "Makes proofs and probability less terrifying using sports and campus dining-hall data sets.",
    ratingsSum: 41,
    ratingsCount: 10,
    totalSessions: 46,
    upvotes: 24,
  },
  {
    id: "ta-8",
    name: "Ben Okafor",
    subject: "Introduction to Computer Programing",
    bio: "Loves Big-O intuition pumps and tracing simple functions line by line for first-time coders.",
    ratingsSum: 45,
    ratingsCount: 10,
    totalSessions: 49,
    upvotes: 26,
  },
];

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const prettyDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

let ticketCounter = 4111;

const seedBookings = [
  {
    id: "bk-0",
    taId: "ta-0",
    date: addDays(1),
    time: "4:00 PM",
    topic: "Review a pull request before the submission deadline",
    status: "upcoming",
    ticket: "OH-4110",
  },
  {
    id: "bk-1",
    taId: "ta-1",
    date: addDays(2),
    time: "2:00 PM",
    topic: "Help debugging a broken CSS flexbox layout on my portfolio page",
    status: "upcoming",
    ticket: "OH-4098",
  },
  {
    id: "bk-2",
    taId: "ta-5",
    date: addDays(-3),
    time: "10:30 AM",
    topic: "Walk through why my for-loop isn't updating the counter variable",
    status: "past",
    ticket: "OH-4071",
    feedback: null,
  },
  {
    id: "bk-3",
    taId: "ta-7",
    date: addDays(-9),
    time: "4:00 PM",
    topic: "Walkthrough of derivatives for the midterm",
    status: "past",
    ticket: "OH-4033",
    feedback: { stars: 5, text: "Explained limits better than 3 weeks of lecture." },
  },
];

const seedChats = [
  {
    id: "chat-0",
    taId: "ta-0",
    student: "Neha S.",
    messages: [
      { from: "student", text: "Hey, sent a request for tomorrow — is 2:30 still open?" },
      { from: "ta", text: "Yep, see you then!" },
    ],
  },
  {
    id: "chat-1",
    taId: "ta-1",
    student: "Jordan P.",
    messages: [
      { from: "ta", text: "Hey! Saw your booking — feel free to send your code snippet ahead of time." },
      { from: "student", text: "Will do, thank you!" },
    ],
  },
  {
    id: "chat-2",
    taId: "ta-3",
    student: "Riley T.",
    messages: [
      { from: "ta", text: "Your assignment questions are answered in the pinned doc, let me know if it's still unclear." },
    ],
  },
  {
    id: "chat-3",
    taId: "ta-7",
    student: "Sam K.",
    messages: [
      { from: "student", text: "Quick one before our session — is the probability worksheet required reading?" },
      { from: "ta", text: "Not required, but it'll make Thursday's session click faster." },
    ],
  },
];

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM",
];

const seedRequests = [
  {
    id: "req-0a",
    taId: "ta-0",
    student: "Neha S.",
    date: addDays(2),
    time: "2:30 PM",
    topic: "My React state isn't updating after a fetch call — need a second pair of eyes",
  },
  {
    id: "req-0b",
    taId: "ta-0",
    student: "Kabir J.",
    date: addDays(3),
    time: "11:00 AM",
    topic: "Getting a CORS error connecting the frontend to the backend API",
  },
  {
    id: "req-1",
    taId: "ta-1",
    student: "Jordan P.",
    date: addDays(3),
    time: "1:30 PM",
    topic: "Need help getting a responsive nav bar working on mobile",
  },
  {
    id: "req-2",
    taId: "ta-1",
    student: "Casey M.",
    date: addDays(4),
    time: "10:00 AM",
    topic: "Portfolio site won't deploy — getting a build error",
  },
  {
    id: "req-3",
    taId: "ta-3",
    student: "Riley T.",
    date: addDays(2),
    time: "3:00 PM",
    topic: "Confused about while loops vs for loops in the homework",
  },
  {
    id: "req-4",
    taId: "ta-7",
    student: "Sam K.",
    date: addDays(5),
    time: "11:00 AM",
    topic: "Stuck on a probability word problem, set 6 question 4",
  },
];

const seedTAFeedback = [
  { id: "fb-0", taId: "ta-0", student: "Wei L.", stars: 5, text: "Caught a bug I'd been stuck on for hours.", date: addDays(-2) },
  { id: "fb-1", taId: "ta-1", student: "Morgan W.", stars: 5, text: "Fixed my flexbox bug in five minutes flat.", date: addDays(-6) },
  { id: "fb-2", taId: "ta-1", student: "Alex R.", stars: 4, text: "Really clear, would've liked a bit more time.", date: addDays(-11) },
  { id: "fb-3", taId: "ta-3", student: "Priya D.", stars: 5, text: "Finally understand loops. Great whiteboard energy.", date: addDays(-4) },
  { id: "fb-4", taId: "ta-5", student: "Noah B.", stars: 5, text: "Patient and thorough, walked through every line.", date: addDays(-8) },
  { id: "fb-5", taId: "ta-7", student: "Grace O.", stars: 4, text: "Good session, examples were a little rushed.", date: addDays(-13) },
];

const buildDefaultAvailability = (tas) =>
  Object.fromEntries(
    tas.map((t, i) => [t.id, TIME_SLOTS.filter((_, si) => (si + i) % 4 !== 0)])
  );

/* ------------------------------------------------------------------ */
/*  SIGNATURE ELEMENT — SPLIT-FLAP QUEUE BOARD                         */
/* ------------------------------------------------------------------ */
function FlipUnit({ char }) {
  return (
    <span key={char} className="animate-flipDigit inline-flex items-center justify-center min-w-[0.65ch] tabular-nums">
      {char}
    </span>
  );
}

function FlipBoard({ value, size = "text-2xl", className = "" }) {
  const chars = String(value).split("");
  return (
    <span className={`font-mono font-semibold text-lime-300 tracking-wider inline-flex ${size} ${className}`}>
      {chars.map((c, i) => (
        <FlipUnit key={`${i}-${c}`} char={c} />
      ))}
    </span>
  );
}

function LiveDot({ color = "#C8FF4D" }) {
  return (
    <span className="relative inline-flex w-2 h-2 shrink-0">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: color }} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN                                                               */
/* ------------------------------------------------------------------ */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [demoTicket, setDemoTicket] = useState(4102);

  useEffect(() => {
    const t = setInterval(() => setDemoTicket((n) => (n >= 4199 ? 4100 : n + 1)), 1800);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const result = validateLogin(email, password);
    if (!result) {
      setError("That email and password combination isn't on the board. Double-check and try again.");
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setError("");
    onLogin(result);
  };

  return (
    <div className="min-h-screen bg-[#0A0C16] board-grid flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <FontImport />
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-lime-400/10 blur-3xl animate-drift-alt" />

      <div className="animate-popIn relative w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-[#262B4A] shadow-2xl shadow-black/50">
        {/* Left hero panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#0F1226] p-8 relative hero-glow-dark">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <Flame size={17} className="text-lime-300 fill-lime-300 animate-flicker" />
              </div>
              <div className="leading-tight">
                <span className="font-display font-semibold text-white text-[15px] block">QueueFire</span>
                <span className="text-[10px] font-mono text-violet-300/70 tracking-wide -mt-0.5 block">
                  OFFICE HOURS, LIVE ON THE BOARD
                </span>
              </div>
            </div>

            <h1 className="font-display font-semibold text-3xl text-white leading-[1.15] mt-10 max-w-xs">
              Every question <span className="text-queue-gradient">gets a seat</span> in line.
            </h1>
            <p className="text-sm font-body text-violet-200/60 mt-3 max-w-xs">
              One board for every open request, every reply, every session — updated live.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-[10px] font-mono text-violet-300/60 tracking-widest mb-2 flex items-center gap-1.5">
              <LiveDot /> NEXT TICKET
            </p>
            <FlipBoard value={`OH-${demoTicket}`} size="text-4xl" />
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-[#12152A] p-7 sm:p-9 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <Flame size={15} className="text-lime-300 fill-lime-300" />
            </div>
            <span className="font-display font-semibold text-white text-[15px]">QueueFire</span>
          </div>

          <p className="text-[11px] font-mono text-violet-400 tracking-widest mb-1.5">SIGN IN</p>
          <h2 className="font-display font-semibold text-white text-xl mb-6">Welcome back to the board</h2>

          <div className={`flex flex-col gap-4 ${shake ? "animate-shake" : ""}`}>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-body font-semibold text-violet-200/70 mb-1.5">
                <Mail size={13} className="text-violet-400" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                placeholder="you@example.com"
                className="w-full bg-[#0E1122] border border-[#262B4A] rounded-xl px-3.5 py-2.5 text-sm font-body text-white placeholder:text-[#5B5F7D] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-body font-semibold text-violet-200/70 mb-1.5">
                <Lock size={13} className="text-violet-400" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                placeholder="••••••••"
                className="w-full bg-[#0E1122] border border-[#262B4A] rounded-xl px-3.5 py-2.5 text-sm font-body text-white placeholder:text-[#5B5F7D] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs font-body text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-1 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-body font-semibold text-sm hover:from-violet-500 hover:to-violet-400 active:scale-[0.99] transition-all shadow-lg shadow-violet-900/40 flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12152A]"
            >
              Enter the board
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-[#1D2138]">
            <p className="text-[10px] font-mono text-[#5B5F7D] tracking-wide leading-relaxed">
              STUDENTS SIGN IN WITH A @sst.scaler.com EMAIL · TAs USE THEIR ASSIGNED QUEUE ACCOUNT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL PRESENTATIONAL PIECES                                        */
/* ------------------------------------------------------------------ */
function StarRating({ value, size = 16, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const display = interactive ? hover || value : value;
  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange && onChange(n)}
          className={interactive ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-sm" : ""}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={
              n <= Math.round(display)
                ? "fill-violet-400 text-violet-400 transition-colors"
                : "fill-transparent text-[#3A3E63] transition-colors"
            }
          />
        </button>
      ))}
    </div>
  );
}

function SubjectPill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-body font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
        active
          ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-900/40"
          : "bg-[#12152A] text-[#A7AAC5] border-[#262B4A] hover:border-violet-400/50 hover:text-violet-300"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  TA CARD                                                             */
/* ------------------------------------------------------------------ */
function TACard({ ta, isMostChosen, onUpvote, upvoted, onBook, colorIdx }) {
  const avg = ta.ratingsCount ? ta.ratingsSum / ta.ratingsCount : 0;
  const [sparks, setSparks] = useState([]);

  const handleCred = () => {
    if (!upvoted) {
      const id = Date.now();
      setSparks((s) => [...s, { id, x: 40 + Math.random() * 20 - 10 }, { id: id + 1, x: 55 + Math.random() * 20 - 10 }]);
      window.setTimeout(() => setSparks((s) => s.filter((sp) => sp.id !== id && sp.id !== id + 1)), 1100);
    }
    onUpvote(ta.id);
  };

  return (
    <div
      className={`animate-slideUp group relative bg-[#12152A] rounded-2xl border p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-all duration-200 ${
        isMostChosen
          ? "border-lime-400/30 hover:shadow-[0_10px_28px_rgba(200,255,77,0.10)]"
          : "border-[#262B4A] hover:shadow-[0_8px_24px_rgba(124,92,255,0.12)] hover:border-violet-500/40"
      }`}
    >
      {isMostChosen && (
        <div className="absolute -top-3 right-4 flex items-center gap-1 bg-gradient-to-r from-lime-400 to-lime-300 text-[#0A0C16] text-[11px] font-mono font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-md shadow-lime-900/20">
          <Flame size={12} className="fill-[#0A0C16] animate-flicker" />
          MOST CHOSEN
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-xl ${AVATAR_GRADIENTS[colorIdx % AVATAR_GRADIENTS.length]} text-white font-display font-semibold flex items-center justify-center text-base ${
              isMostChosen ? "glow-ring-lime" : "ring-2 ring-[#1D2138]"
            }`}
          >
            {initials(ta.name)}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-white text-[15px] truncate">{ta.name}</h3>
          <p className="text-xs font-body text-violet-300 font-medium truncate">{ta.subject}</p>
        </div>
      </div>

      <p className="text-sm font-body text-[#9296B4] leading-relaxed line-clamp-3">{ta.bio}</p>

      <div className="flex items-center justify-between text-xs font-mono text-[#8B8FB0] pt-1 border-t border-[#1D2138]">
        <div className="flex items-center gap-1.5">
          <StarRating value={avg} size={13} />
          <span className="text-[#C9CBE0] font-medium">{avg.toFixed(1)}</span>
        </div>
        <span>{ta.totalSessions} sessions</span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleCred}
          aria-pressed={upvoted}
          aria-label={`Give cred to ${ta.name}`}
          className={`relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
            upvoted
              ? "bg-lime-400/10 border-lime-400/40 text-lime-300"
              : "bg-[#0E1122] border-[#262B4A] text-[#8B8FB0] hover:border-lime-400/40 hover:text-lime-300"
          }`}
        >
          {sparks.map((s) => (
            <span key={s.id} className="spark" style={{ left: `${s.x}%`, bottom: "60%" }} />
          ))}
          <Flame size={14} className={upvoted ? "fill-lime-300 text-lime-300" : ""} />
          {ta.upvotes} cred
        </button>
        <button
          onClick={() => onBook(ta)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-semibold bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.98] transition-all shadow-sm shadow-violet-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#12152A]"
        >
          Book meeting
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BOOKING MODAL                                                       */
/* ------------------------------------------------------------------ */
function BookingModal({ ta, onClose, onConfirm }) {
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(null);
  const [topic, setTopic] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const dateOptions = useMemo(() => Array.from({ length: 6 }, (_, i) => addDays(i)), []);

  const canSubmit = date && time && topic.trim().length > 0;

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!canSubmit) return;
    const ticket = `OH-${ticketCounter++}`;
    const booking = {
      id: `bk-${Date.now()}`,
      taId: ta.id,
      date,
      time,
      topic: topic.trim(),
      status: "upcoming",
      ticket,
    };
    onConfirm(booking);
    setConfirmed(booking);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-popIn w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-[#12152A] border border-[#262B4A] rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        {!confirmed ? (
          <>
            <div className="sticky top-0 bg-[#12152A] flex items-center justify-between px-5 py-4 border-b border-[#1D2138]">
              <div>
                <p className="text-[11px] font-mono text-violet-400 tracking-wide">BOOK A SESSION</p>
                <h2 className="font-display font-semibold text-white text-lg">{ta.name}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-[#6E7295] hover:text-white hover:bg-[#1D2138] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#A7AAC5] mb-2">
                  <Calendar size={14} className="text-violet-400" /> Pick a date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dateOptions.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDate(d)}
                      className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-sm font-body transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                        date === d
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-[#0E1122] border-[#262B4A] text-[#A7AAC5] hover:border-violet-400/50"
                      }`}
                    >
                      <span className="text-[10px] font-mono opacity-80">
                        {new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="font-semibold">{new Date(d + "T00:00:00").getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#A7AAC5] mb-2">
                  <Clock size={14} className="text-violet-400" /> Pick a time slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-2 py-2 rounded-lg border text-xs font-mono font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                        time === t
                          ? "bg-violet-500/10 border-violet-500 text-violet-300"
                          : "bg-[#0E1122] border-[#262B4A] text-[#8B8FB0] hover:border-violet-400/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#A7AAC5] mb-2">
                  <MessageSquare size={14} className="text-violet-400" /> What do you need help with?
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  placeholder="e.g. Stuck on recursion in problem set 4, question 3"
                  className="w-full text-sm font-body rounded-xl border border-[#262B4A] bg-[#0E1122] px-3.5 py-2.5 text-white placeholder:text-[#5B5F7D] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-3 rounded-xl bg-violet-600 text-white font-body font-semibold text-sm hover:bg-violet-500 disabled:bg-[#1D2138] disabled:text-[#4B4F72] active:scale-[0.99] transition-all shadow-sm shadow-violet-900/40 disabled:shadow-none"
              >
                Confirm booking
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className="animate-checkPop relative w-16 h-16 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center shadow-lg shadow-lime-900/30">
              <Check size={26} className="text-[#0A0C16]" strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-lg">You're on the board</h3>
              <p className="text-sm font-body text-[#8B8FB0] mt-1">Your queue pass is ready — check My Activity anytime.</p>
            </div>

            {/* Signature ticket / queue-pass element */}
            <div className="w-full ticket-notch rounded-xl overflow-hidden border border-[#262B4A] text-left relative">
              <div className="absolute -top-4 -right-3 w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center rotate-12 shadow-md shadow-violet-900/40 border-2 border-[#14172E]">
                <Flame size={16} className="text-lime-300 fill-lime-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-violet-400 tracking-widest">QUEUE PASS</span>
                  <FlipBoard value={`#${confirmed.ticket}`} size="text-xs" />
                </div>
                <p className="font-display font-semibold text-white mt-1">{ta.name}</p>
                <p className="text-xs font-body text-[#8B8FB0]">{ta.subject}</p>
              </div>
              <div className="relative px-4">
                <div className="perf-line h-0.5" />
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-mono text-[#5B5F7D]">DATE</p>
                  <p className="text-sm font-body font-medium text-[#C9CBE0]">{prettyDate(confirmed.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#5B5F7D]">TIME</p>
                  <p className="text-sm font-body font-medium text-[#C9CBE0]">{confirmed.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-mono text-[#5B5F7D]">TOPIC</p>
                  <p className="text-sm font-body text-[#C9CBE0]">{confirmed.topic}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-violet-500/10 text-violet-300 font-body font-semibold text-sm hover:bg-violet-500/20 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STUDENT DASHBOARD                                                   */
/* ------------------------------------------------------------------ */
function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
        <Icon size={20} className="text-violet-400" />
      </div>
      <p className="font-body font-medium text-[#C9CBE0] text-sm">{title}</p>
      <p className="font-body text-[#6E7295] text-xs mt-1">{subtitle}</p>
    </div>
  );
}

function UpcomingRow({ booking, ta }) {
  return (
    <div className="animate-slideUp flex items-center gap-3 bg-[#12152A] border border-[#262B4A] rounded-xl p-4">
      <div className={`shrink-0 w-10 h-10 rounded-lg ${AVATAR_GRADIENTS[0]} text-white font-display font-semibold flex items-center justify-center text-sm`}>
        {initials(ta.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-[#E7E6F5] text-sm truncate">{ta.name}</p>
        <p className="text-xs font-body text-[#6E7295] truncate">{booking.topic}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-mono text-violet-300 font-medium">{prettyDate(booking.date)}</p>
        <p className="text-[11px] font-mono text-[#5B5F7D]">{booking.time}</p>
      </div>
    </div>
  );
}

function PastRow({ booking, ta, onSubmitFeedback }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");

  const submit = () => {
    if (stars === 0) return;
    onSubmitFeedback(booking.id, ta.id, { stars, text: text.trim() });
    setOpen(false);
  };

  return (
    <div className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-lg ${AVATAR_GRADIENTS[1]} text-white font-display font-semibold flex items-center justify-center text-sm`}>
          {initials(ta.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body font-semibold text-[#E7E6F5] text-sm truncate">{ta.name}</p>
          <p className="text-xs font-body text-[#6E7295] truncate">{booking.topic}</p>
        </div>
        <p className="text-xs font-mono text-[#5B5F7D] shrink-0">{prettyDate(booking.date)}</p>
      </div>

      {booking.feedback ? (
        <div className="mt-3 pt-3 border-t border-[#1D2138] flex items-start gap-2">
          <StarRating value={booking.feedback.stars} size={13} />
          {booking.feedback.text && (
            <p className="text-xs font-body text-[#8B8FB0] italic flex-1">"{booking.feedback.text}"</p>
          )}
        </div>
      ) : open ? (
        <div className="mt-3 pt-3 border-t border-[#1D2138] flex flex-col gap-2.5">
          <StarRating value={stars} interactive size={20} onChange={setStars} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="How did the session go? (optional)"
            className="w-full text-xs font-body rounded-lg border border-[#262B4A] bg-[#0E1122] px-3 py-2 text-white placeholder:text-[#5B5F7D] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={stars === 0}
              className="text-xs font-body font-semibold bg-violet-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-violet-500 disabled:bg-[#1D2138] disabled:text-[#4B4F72] transition-colors"
            >
              Submit feedback
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs font-body font-medium text-[#6E7295] px-3 py-1.5 rounded-lg hover:bg-[#1D2138]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 pt-3 border-t border-[#1D2138] w-full text-left text-xs font-body font-semibold text-violet-300 hover:text-violet-200"
        >
          Rate this session →
        </button>
      )}
    </div>
  );
}

function ChatThread({ chat, ta, onSend }) {
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    onSend(chat.id, draft.trim(), "student");
    setDraft("");
  };
  return (
    <div className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg ${AVATAR_GRADIENTS[2]} text-white font-display font-semibold flex items-center justify-center text-xs`}>
          {initials(ta.name)}
        </div>
        <p className="font-body font-semibold text-[#E7E6F5] text-sm">{ta.name}</p>
      </div>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
        {chat.messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] text-xs font-body px-3 py-2 rounded-xl ${
              m.from === "student"
                ? "bg-violet-600 text-white self-end rounded-br-sm"
                : "bg-[#0E1122] text-[#C9CBE0] self-start rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-[#1D2138]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Send a message…"
          className="flex-1 text-xs font-body rounded-lg border border-[#262B4A] bg-[#0E1122] text-white placeholder:text-[#5B5F7D] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={send}
          aria-label="Send"
          className="shrink-0 w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function Dashboard({ tas, bookings, chats, onSubmitFeedback, onSendChat }) {
  const [tab, setTab] = useState("upcoming");
  const taById = useMemo(() => Object.fromEntries(tas.map((t) => [t.id, t])), [tas]);

  const upcoming = bookings.filter((b) => b.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const past = bookings.filter((b) => b.status === "past").sort((a, b) => b.date.localeCompare(a.date));

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length, icon: Calendar },
    { id: "past", label: "Past Meetings", count: past.length, icon: History },
    { id: "chats", label: "Recent Chats", count: chats.length, icon: MessageSquare },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="font-display font-semibold text-2xl text-white mb-1">My Activity &amp; History</h2>
      <p className="text-sm font-body text-[#6E7295] mb-5">Everything you've booked, attended, and chatted about.</p>

      <div className="flex gap-1.5 bg-[#12152A] border border-[#262B4A] rounded-xl p-1 mb-5 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-body font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 whitespace-nowrap ${
              tab === t.id ? "bg-violet-600 text-white" : "text-[#8B8FB0] hover:text-[#C9CBE0]"
            }`}
          >
            <t.icon size={14} className={tab === t.id ? "text-white" : "text-[#6E7295]"} />
            {t.label}
            <span className={`ml-0.5 text-[11px] font-mono ${tab === t.id ? "text-violet-200" : "text-[#5B5F7D]"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "upcoming" &&
        (upcoming.length ? (
          <div className="flex flex-col gap-2.5">
            {upcoming.map((b) => (
              <UpcomingRow key={b.id} booking={b} ta={taById[b.taId]} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} title="No upcoming sessions" subtitle="Book time with a TA from the directory to see it here." />
        ))}

      {tab === "past" &&
        (past.length ? (
          <div className="flex flex-col gap-2.5">
            {past.map((b) => (
              <PastRow key={b.id} booking={b} ta={taById[b.taId]} onSubmitFeedback={onSubmitFeedback} />
            ))}
          </div>
        ) : (
          <EmptyState icon={History} title="No past meetings yet" subtitle="Completed sessions will show up here for feedback." />
        ))}

      {tab === "chats" &&
        (chats.length ? (
          <div className="flex flex-col gap-2.5">
            {chats.map((c) => (
              <ChatThread key={c.id} chat={c} ta={taById[c.taId]} onSend={onSendChat} />
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="No recent chats" subtitle="Messages with TAs will appear here." />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TA PORTAL                                                           */
/* ------------------------------------------------------------------ */
function RequestRow({ req, onAccept, onDecline }) {
  return (
    <div className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-violet-500/10 text-violet-300 font-display font-semibold text-xs flex items-center justify-center shrink-0">
        {initials(req.student)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-[#E7E6F5] text-sm">{req.student}</p>
        <p className="text-xs font-body text-[#6E7295] truncate">{req.topic}</p>
        <p className="text-[11px] font-mono text-violet-300 mt-0.5">
          {prettyDate(req.date)} · {req.time}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onDecline(req.id)}
          aria-label="Decline request"
          className="w-8 h-8 rounded-lg border border-[#262B4A] text-[#6E7295] hover:text-rose-400 hover:border-rose-400/40 flex items-center justify-center transition-colors"
        >
          <XCircle size={16} />
        </button>
        <button
          onClick={() => onAccept(req.id)}
          aria-label="Accept request"
          className="w-8 h-8 rounded-lg bg-violet-600 text-white hover:bg-violet-500 flex items-center justify-center transition-colors shadow-sm shadow-violet-900/40"
        >
          <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  );
}

function AvailabilityGrid({ slots, onToggle }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {TIME_SLOTS.map((t) => {
        const active = slots.includes(t);
        return (
          <button
            key={t}
            onClick={() => onToggle(t)}
            className={`px-2 py-2.5 rounded-lg border text-xs font-mono font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
              active
                ? "bg-violet-500/10 border-violet-400/50 text-violet-300"
                : "bg-[#0E1122] border-[#262B4A] text-[#4B4F72] line-through hover:text-[#6E7295]"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function FeedbackRow({ fb }) {
  return (
    <div className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-body font-semibold text-[#E7E6F5] text-sm">{fb.student}</p>
        <span className="text-[11px] font-mono text-[#5B5F7D]">{prettyDate(fb.date)}</span>
      </div>
      <div className="mt-1.5">
        <StarRating value={fb.stars} size={13} />
      </div>
      {fb.text && <p className="text-xs font-body text-[#8B8FB0] italic mt-2">"{fb.text}"</p>}
    </div>
  );
}

function TAChatThread({ chat, onSend }) {
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    onSend(chat.id, draft.trim(), "ta");
    setDraft("");
  };
  return (
    <div className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-300 font-display font-semibold flex items-center justify-center text-xs">
          {initials(chat.student)}
        </div>
        <p className="font-body font-semibold text-[#E7E6F5] text-sm">{chat.student}</p>
      </div>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
        {chat.messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] text-xs font-body px-3 py-2 rounded-xl ${
              m.from === "ta"
                ? "bg-violet-600 text-white self-end rounded-br-sm"
                : "bg-[#0E1122] text-[#C9CBE0] self-start rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-[#1D2138]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Reply…"
          className="flex-1 text-xs font-body rounded-lg border border-[#262B4A] bg-[#0E1122] text-white placeholder:text-[#5B5F7D] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={send}
          aria-label="Send"
          className="shrink-0 w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function TAPortal({ ta, taIndex, bookings, requests, chats, feedback, availability, onAccept, onDecline, onToggleSlot, onSendChat }) {
  const [tab, setTab] = useState("requests");
  const avg = ta.ratingsCount ? ta.ratingsSum / ta.ratingsCount : 0;

  const myRequests = requests.filter((r) => r.taId === ta.id);
  const myUpcoming = bookings.filter((b) => b.taId === ta.id && b.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const myChats = chats.filter((c) => c.taId === ta.id);
  const myFeedback = feedback.filter((f) => f.taId === ta.id).sort((a, b) => b.date.localeCompare(a.date));
  const mySlots = availability[ta.id] || [];

  const tabs = [
    { id: "requests", label: "Requests", count: myRequests.length, icon: Inbox },
    { id: "messages", label: "Messages", count: myChats.length, icon: MessageSquare },
    { id: "upcoming", label: "Upcoming", count: myUpcoming.length, icon: Calendar },
    { id: "availability", label: "Availability", count: mySlots.length, icon: SlidersHorizontal },
    { id: "feedback", label: "Feedback", count: myFeedback.length, icon: Star },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="font-display font-semibold text-2xl text-white mb-1">Request Queue</h2>
      <p className="text-sm font-body text-[#6E7295] mb-5">Requests, messages, and sessions from your students, all in one place.</p>

      {/* Profile summary */}
      <div className="hero-glow-dark rounded-2xl border border-[#262B4A] bg-[#0F1226] p-5 mb-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${AVATAR_GRADIENTS[taIndex >= 0 ? taIndex % AVATAR_GRADIENTS.length : 0]} text-white font-display font-semibold flex items-center justify-center text-lg ring-2 ring-[#1D2138] shadow-sm`}>
          {initials(ta.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-lg truncate">{ta.name}</h3>
          <p className="text-xs font-body text-violet-300 font-medium">{ta.subject}</p>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-right">
          <div>
            <p className="flex items-center justify-end gap-1 text-sm font-mono font-medium text-[#C9CBE0]">
              <Flame size={13} className="text-lime-300 fill-lime-300" /> {ta.upvotes}
            </p>
            <p className="text-[10px] font-body text-[#6E7295]">cred</p>
          </div>
          <div>
            <p className="flex items-center justify-end gap-1 text-sm font-mono font-medium text-[#C9CBE0]">
              <Star size={13} className="text-violet-400 fill-violet-400" /> {avg.toFixed(1)}
            </p>
            <p className="text-[10px] font-body text-[#6E7295]">rating</p>
          </div>
          <div>
            <p className="text-sm font-mono font-medium text-[#C9CBE0]">{ta.totalSessions}</p>
            <p className="text-[10px] font-body text-[#6E7295]">sessions</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 bg-[#12152A] border border-[#262B4A] rounded-xl p-1 mb-5 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-body font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 whitespace-nowrap ${
              tab === t.id ? "bg-violet-600 text-white" : "text-[#8B8FB0] hover:text-[#C9CBE0]"
            }`}
          >
            <t.icon size={14} className={tab === t.id ? "text-white" : "text-[#6E7295]"} />
            {t.label}
            <span className={`ml-0.5 text-[11px] font-mono ${tab === t.id ? "text-violet-200" : "text-[#5B5F7D]"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "requests" &&
        (myRequests.length ? (
          <div className="flex flex-col gap-2.5">
            {myRequests.map((r) => (
              <RequestRow key={r.id} req={r} onAccept={onAccept} onDecline={onDecline} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Inbox} title="No pending requests" subtitle="New booking requests from students will land here." />
        ))}

      {tab === "messages" &&
        (myChats.length ? (
          <div className="flex flex-col gap-2.5">
            {myChats.map((c) => (
              <TAChatThread key={c.id} chat={c} onSend={onSendChat} />
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="No messages yet" subtitle="Conversations with students will show up here." />
        ))}

      {tab === "upcoming" &&
        (myUpcoming.length ? (
          <div className="flex flex-col gap-2.5">
            {myUpcoming.map((b) => (
              <div key={b.id} className="animate-slideUp bg-[#12152A] border border-[#262B4A] rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-300 flex items-center justify-center shrink-0">
                  <Calendar size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-body text-[#C9CBE0] truncate">{b.topic}</p>
                  <p className="text-[11px] font-mono text-[#5B5F7D]">#{b.ticket}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-violet-300 font-medium">{prettyDate(b.date)}</p>
                  <p className="text-[11px] font-mono text-[#5B5F7D]">{b.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} title="No upcoming sessions" subtitle="Accepted requests and student bookings show up here." />
        ))}

      {tab === "availability" && (
        <div>
          <p className="text-xs font-body text-[#6E7295] mb-3">
            Tap a slot to open or close it up for booking. Crossed-out slots are hidden from students.
          </p>
          <AvailabilityGrid slots={mySlots} onToggle={(slot) => onToggleSlot(ta.id, slot)} />
        </div>
      )}

      {tab === "feedback" &&
        (myFeedback.length ? (
          <div className="flex flex-col gap-2.5">
            {myFeedback.map((f) => (
              <FeedbackRow key={f.id} fb={f} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Star} title="No feedback yet" subtitle="Ratings and comments from students will appear here." />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const [tas, setTas] = useState(seedTAs);
  const [bookings, setBookings] = useState(seedBookings);
  const [chats, setChats] = useState(seedChats);
  const [upvoted, setUpvoted] = useState({});
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [modalTA, setModalTA] = useState(null);
  const [view, setView] = useState("hub"); // 'hub' | 'dashboard' — student only
  const [toast, setToast] = useState(null);
  const [auth, setAuth] = useState(null); // { role: 'student' | 'ta', name, email, taId? }

  const [requests, setRequests] = useState(seedRequests);
  const [feedback, setFeedback] = useState(seedTAFeedback);
  const [availability, setAvailability] = useState(() => buildDefaultAvailability(seedTAs));

  const mostChosenId = useMemo(() => {
    if (!tas.length) return null;
    return tas.reduce((best, t) => {
      const score = t.upvotes + t.totalSessions;
      const bestScore = best.upvotes + best.totalSessions;
      return score > bestScore ? t : best;
    }).id;
  }, [tas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tas.filter((t) => {
      const matchesSubject = subject === "All" || t.subject === subject;
      const matchesQuery =
        !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      return matchesSubject && matchesQuery;
    });
  }, [tas, query, subject]);

  const handleUpvote = useCallback((id) => {
    setUpvoted((prev) => {
      const already = prev[id];
      setTas((ts) => ts.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + (already ? -1 : 1) } : t)));
      return { ...prev, [id]: !already };
    });
  }, []);

  const handleConfirmBooking = useCallback((booking) => {
    setBookings((prev) => [...prev, booking]);
    setTas((ts) => ts.map((t) => (t.id === booking.taId ? { ...t, totalSessions: t.totalSessions + 1 } : t)));
    setToast(`Session booked with ${modalTA?.name.split(" ")[0]}`);
    window.clearTimeout(handleConfirmBooking._t);
    handleConfirmBooking._t = window.setTimeout(() => setToast(null), 2600);
  }, [modalTA]);

  const handleSubmitFeedback = useCallback((bookingId, taId, feedbackEntry) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, feedback: feedbackEntry } : b)));
    setTas((ts) =>
      ts.map((t) =>
        t.id === taId ? { ...t, ratingsSum: t.ratingsSum + feedbackEntry.stars, ratingsCount: t.ratingsCount + 1 } : t
      )
    );
  }, []);

  const handleSendChat = useCallback((chatId, text, sender = "student") => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, { from: sender, text }] } : c))
    );
  }, []);

  const handleAcceptRequest = useCallback((reqId) => {
    setRequests((prev) => {
      const req = prev.find((r) => r.id === reqId);
      if (!req) return prev;
      const ticket = `OH-${ticketCounter++}`;
      setBookings((bs) => [
        ...bs,
        {
          id: `bk-${Date.now()}`,
          taId: req.taId,
          date: req.date,
          time: req.time,
          topic: req.topic,
          status: "upcoming",
          ticket,
        },
      ]);
      setTas((ts) => ts.map((t) => (t.id === req.taId ? { ...t, totalSessions: t.totalSessions + 1 } : t)));
      return prev.filter((r) => r.id !== reqId);
    });
  }, []);

  const handleDeclineRequest = useCallback((reqId) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  }, []);

  const handleToggleSlot = useCallback((taId, slot) => {
    setAvailability((prev) => {
      const current = prev[taId] || [];
      const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...prev, [taId]: next };
    });
  }, []);

  const handleLogin = useCallback((result) => {
    setAuth(result);
    setView("hub");
  }, []);

  const handleLogout = useCallback(() => {
    setAuth(null);
  }, []);

  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  const myTa = auth.role === "ta" ? tas.find((t) => t.id === auth.taId) : null;
  const myTaIndex = auth.role === "ta" ? tas.findIndex((t) => t.id === auth.taId) : -1;
  const pendingForMe = auth.role === "ta" ? requests.filter((r) => r.taId === auth.taId).length : 0;

  return (
    <div className="font-body min-h-screen bg-[#0A0C16] board-grid text-[#C9CBE0]">
      <FontImport />

      {/* Nav */}
      <header className="sticky top-0 z-30 bg-[#0A0C16]/90 backdrop-blur border-b border-[#1D2138]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-sm shadow-violet-900/40">
              <Flame size={16} className="text-lime-300 fill-lime-300" />
            </div>
            <div className="leading-tight hidden xs:block">
              <span className="font-display font-semibold text-white text-[15px] block">QueueFire</span>
              <span className="hidden sm:block text-[10px] font-mono text-violet-300/60 tracking-wide -mt-0.5">
                OFFICE HOURS, LIVE ON THE BOARD
              </span>
            </div>
          </div>

          {auth.role === "student" ? (
            <nav className="flex items-center gap-1 bg-[#12152A] border border-[#262B4A] rounded-xl p-1">
              <button
                onClick={() => setView("hub")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  view === "hub" ? "bg-violet-600 text-white" : "text-[#8B8FB0] hover:text-[#C9CBE0]"
                }`}
              >
                Find a TA
              </button>
              <button
                onClick={() => setView("dashboard")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  view === "dashboard" ? "bg-violet-600 text-white" : "text-[#8B8FB0] hover:text-[#C9CBE0]"
                }`}
              >
                My Activity
                {bookings.filter((b) => b.status === "upcoming").length > 0 && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-lime-400 align-middle" />
                )}
              </button>
            </nav>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-[#12152A] border border-[#262B4A] rounded-xl px-3 py-1.5">
              <LiveDot />
              <span className="text-[10px] font-mono text-violet-300/70 tracking-widest">QUEUE</span>
              <FlipBoard value={String(pendingForMe).padStart(2, "0")} size="text-sm" />
            </div>
          )}

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-body font-semibold text-white">{auth.name}</p>
              <p className="text-[10px] font-mono text-violet-400 flex items-center justify-end gap-1">
                {auth.role === "ta" && <GraduationCap size={11} />}
                {auth.role === "ta" ? "TA" : "STUDENT"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="w-9 h-9 rounded-lg border border-[#262B4A] text-[#8B8FB0] hover:text-rose-400 hover:border-rose-400/40 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {auth.role === "student" ? (
        view === "hub" ? (
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="hero-glow-dark rounded-3xl px-5 sm:px-8 py-8 sm:py-10 mb-8 border border-[#262B4A] bg-[#0F1226] relative overflow-hidden">
              <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-violet-600/20 blur-3xl animate-drift" />
              <p className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-lime-300 tracking-widest mb-3">
                <LiveDot /> LIVE QUEUE
              </p>
              <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white leading-[1.1] max-w-xl">
                Get in line, earn your <span className="text-queue-gradient">cred</span>.
              </h1>
              <p className="text-sm sm:text-[15px] font-body text-[#9296B4] mt-3 max-w-md">
                Book real time with a TA, give cred to the ones who help you most, and keep the whole
                board moving.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-5 border-t border-[#1D2138]">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-violet-400" />
                  <span className="text-sm font-mono text-[#C9CBE0] font-medium">{tas.length}</span>
                  <span className="text-xs font-body text-[#6E7295]">TAs online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={15} className="text-lime-300 fill-lime-300" />
                  <span className="text-sm font-mono text-[#C9CBE0] font-medium">
                    {tas.reduce((sum, t) => sum + t.upvotes, 0)}
                  </span>
                  <span className="text-xs font-body text-[#6E7295]">cred given</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-violet-400" />
                  <span className="text-sm font-mono text-[#C9CBE0] font-medium">
                    {tas.reduce((sum, t) => sum + t.totalSessions, 0)}
                  </span>
                  <span className="text-xs font-body text-[#6E7295]">sessions logged</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B5F7D]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or subject…"
                className="w-full bg-[#12152A] border border-[#262B4A] rounded-xl pl-10 pr-4 py-3 text-sm font-body text-white placeholder:text-[#5B5F7D] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
              {SUBJECTS.map((s) => (
                <SubjectPill key={s} active={subject === s} onClick={() => setSubject(s)}>
                  {s}
                </SubjectPill>
              ))}
            </div>

            {/* Grid */}
            {filtered.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((ta, i) => (
                  <TACard
                    key={ta.id}
                    ta={ta}
                    colorIdx={i}
                    isMostChosen={ta.id === mostChosenId}
                    upvoted={!!upvoted[ta.id]}
                    onUpvote={handleUpvote}
                    onBook={setModalTA}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon={Search} title="No TAs match your search" subtitle="Try a different name, subject, or filter." />
            )}
          </main>
        ) : (
          <Dashboard
            tas={tas}
            bookings={bookings}
            chats={chats}
            onSubmitFeedback={handleSubmitFeedback}
            onSendChat={handleSendChat}
          />
        )
      ) : myTa ? (
        <TAPortal
          ta={myTa}
          taIndex={myTaIndex}
          bookings={bookings}
          requests={requests}
          chats={chats}
          feedback={feedback}
          availability={availability}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
          onToggleSlot={handleToggleSlot}
          onSendChat={handleSendChat}
        />
      ) : null}

      {modalTA && (
        <BookingModal ta={modalTA} onClose={() => setModalTA(null)} onConfirm={handleConfirmBooking} />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slideUp bg-[#12152A] border border-[#262B4A] text-white text-sm font-body font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-black/40 flex items-center gap-2">
          <Flame size={15} className="text-lime-300 fill-lime-300" />
          {toast}
        </div>
      )}
    </div>
  );
}
