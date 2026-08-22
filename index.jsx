import { useState, useEffect, useRef } from "react";
import {
  Flame, Search, Plus, X, ThumbsUp, Trophy, Clock, Video, ChevronDown,
  Check, Copy, LogOut, Award, Users, Calendar, Star, Zap, Sun, Moon,
  MessageSquare, TrendingUp, CalendarClock
} from "lucide-react";

// ============================================================
// DATA — swap for real API calls once backend is wired up
// ============================================================

const TAGS = ["React", "Python", "WebDev", "DSA", "System Design"];

const initialQuestions = [
  { id: 1, author: "Riya Sharma", initials: "RS", time: "2h ago", tag: "React",
    title: "Why does my useEffect run twice in dev mode?",
    desc: "Component fetches user data on mount but the network call fires twice locally, only once in production. Is this expected with StrictMode?",
    upvotes: 12, solved: false },
  { id: 2, author: "Kabir Mehta", initials: "KM", time: "4h ago", tag: "Python",
    title: "Best way to handle circular imports in a Flask app?",
    desc: "Splitting models across files and running into ImportError loops as the app grows past a few blueprints.",
    upvotes: 8, solved: false },
  { id: 3, author: "Ananya Iyer", initials: "AI", time: "6h ago", tag: "DSA",
    title: "When should I reach for a trie over a hashmap?",
    desc: "Working through a prefix-search problem and unsure which structure actually scales better past a few thousand entries.",
    upvotes: 15, solved: true },
  { id: 4, author: "Dev Patel", initials: "DP", time: "1d ago", tag: "WebDev",
    title: "CORS error only in production, works fine locally",
    desc: "Preflight requests fail on Vercel but pass on localhost with the exact same headers configured on the server.",
    upvotes: 6, solved: false },
  { id: 5, author: "Sara Khan", initials: "SK", time: "1d ago", tag: "System Design",
    title: "How do you shard a leaderboard table at scale?",
    desc: "Building something similar to this platform actually — the cred_points table is growing fast and rank queries are slowing down.",
    upvotes: 9, solved: false },
];

const leaderboardBase = [
  { id: "u1", name: "Meera Nair", initials: "MN", cred: 2840, badges: ["Top Mentor", "Bug Hunter"] },
  { id: "u2", name: "Arjun Rao", initials: "AR", cred: 2510, badges: ["Top Mentor"] },
  { id: "u3", name: "Priya Das", initials: "PD", cred: 2205, badges: ["Bug Hunter", "Streak x30"] },
  { id: "u4", name: "Vikram Singh", initials: "VS", cred: 1870, badges: ["Rising Star"] },
  { id: "u5", name: "Neha Gupta", initials: "NG", cred: 1640, badges: [] },
];

const taList = [
  { id: "t1", name: "Ravi Kulkarni", initials: "RK", expertise: ["React", "System Design"], online: true, slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  { id: "t2", name: "Ananya Bose", initials: "AB", expertise: ["Python", "DSA"], online: true, slots: ["11:00 AM", "3:00 PM"] },
  { id: "t3", name: "Karan Malhotra", initials: "KM", expertise: ["WebDev", "DevOps"], online: false, slots: ["9:00 AM (tomorrow)"] },
];

const peerList = [
  { id: "p1", name: "Ishaan Verma", initials: "IV", expertise: ["React", "WebDev"], cred: 1420, slots: ["1:00 PM", "5:00 PM"] },
  { id: "p2", name: "Tara Bhatt", initials: "TB", expertise: ["Python"], cred: 980, slots: ["12:00 PM"] },
  { id: "p3", name: "Yusuf Ali", initials: "YA", expertise: ["DSA", "System Design"], cred: 1105, slots: ["6:00 PM", "7:30 PM"] },
];

const genLink = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 14; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `meet.campfirecred.com/${s.slice(0, 4)}-${s.slice(4, 9)}`;
};

// Parses "arya.26bcs10491@sst.scaler.com" -> { name, studentId }
const parseSstEmail = (email) => {
  const match = email.trim().match(/^([a-z]+)\.(\d{2})bcs(\d+)@sst\.scaler\.com$/i);
  if (!match) return null;
  const [, rawName, year, roll] = match;
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  const initials = name.slice(0, 2).toUpperCase();
  return { name, initials, studentId: `${year}BCS${roll}`.toUpperCase() };
};

// ============================================================
// Theme tokens — computed once, threaded through as props
// ============================================================
const getTheme = (dark) => ({
  dark,
  appBg: dark ? "bg-slate-950" : "bg-slate-50",
  navBg: dark ? "bg-slate-900/90" : "bg-white/90",
  navBorder: dark ? "border-slate-800" : "border-slate-200",
  cardBg: dark ? "bg-slate-900" : "bg-white",
  cardBorder: dark ? "border-slate-800" : "border-slate-200",
  cardHover: dark ? "hover:border-indigo-700" : "hover:border-indigo-200",
  pillBg: dark ? "bg-slate-800" : "bg-slate-100",
  pillActive: dark ? "bg-slate-700 text-white" : "bg-white text-indigo-700 shadow-sm",
  pillInactive: dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800",
  inputBg: dark ? "bg-slate-800" : "bg-white",
  inputBorder: dark ? "border-slate-700" : "border-slate-300",
  textPrimary: dark ? "text-white" : "text-slate-900",
  textSecondary: dark ? "text-slate-300" : "text-slate-700",
  textMuted: dark ? "text-slate-400" : "text-slate-500",
  textFaint: dark ? "text-slate-500" : "text-slate-400",
  hoverBg: dark ? "hover:bg-slate-800" : "hover:bg-slate-100",
  divider: dark ? "border-slate-800" : "border-slate-100",
  tagBg: dark ? "bg-blue-950 text-blue-300" : "bg-blue-50 text-blue-700",
  chipBg: dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500",
});

// ============================================================
// Navbar.jsx  (auth + profile summary + theme toggle)
// ============================================================
function Navbar({ user, onLogin, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, emailRef, loginPulse }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const parsed = parseSstEmail(email);
    if (!parsed) {
      setError("Format: name.YYbcsRollNo@sst.scaler.com");
      return;
    }
    onLogin({ ...parsed, email: email.trim().toLowerCase(), cred: 320, badges: ["Newcomer"] });
    setError("");
  };

  const navTabs = [
    { id: "feed", label: "Q&A Feed" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "schedule", label: "Office Hours" },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur ${theme.navBg} border-b ${theme.navBorder}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className={`font-display text-lg font-bold tracking-tight ${theme.textPrimary}`}>CampfireCred</span>
        </div>

        {user && (
          <nav className={`hidden md:flex items-center gap-1 rounded-full p-1 ${theme.pillBg}`}>
            {navTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === t.id ? theme.pillActive : theme.pillInactive
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {!user ? (
            <>
              <div className="hidden sm:flex flex-col">
                <input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="arya.26bcs10491@sst.scaler.com"
                  className={`border rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} ${loginPulse ? "ring-2 ring-indigo-400" : ""}`}
                />
                {error && <span className="text-xs text-rose-500 mt-1">{error}</span>}
              </div>
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.2 5.6-6 7.2l6.4 5.4C39.5 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
                Sign in
              </button>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/40 rounded-full px-3 py-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-mono text-sm font-semibold text-amber-500">{user.cred}</span>
                <span className="text-xs text-amber-500/80">Cred</span>
              </div>
              <button onClick={onOpenProfile} className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold group-hover:ring-2 group-hover:ring-indigo-300 transition-all">
                  {user.initials}
                </div>
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className={`text-sm font-medium ${theme.textPrimary}`}>{user.name}</span>
                  <span className={`text-xs ${theme.textFaint}`}>{user.studentId}</span>
                </div>
              </button>
              <button onClick={onLogout} className={`p-2 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}>
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className={`p-2 rounded-lg border transition-colors ${theme.inputBorder} ${theme.hoverBg}`}
          >
            {dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {user && (
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {navTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeTab === t.id ? "bg-indigo-600 text-white" : theme.chipBg
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

// ============================================================
// Hero.jsx — the "front main page" shown when logged out
// ============================================================
function Hero({ theme, dark, emailRef, setLoginPulse }) {
  const [counts, setCounts] = useState({ questions: 0, cred: 0, mentors: 0 });
  const [previewTab, setPreviewTab] = useState("ask");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const targets = { questions: 1284, cred: 96500, mentors: 42 };
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts({
        questions: Math.round(targets.questions * eased),
        cred: Math.round(targets.cred * eased),
        mentors: Math.round(targets.mentors * eased),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const focusLogin = () => {
    emailRef.current?.focus();
    setLoginPulse(true);
    setTimeout(() => setLoginPulse(false), 1200);
  };

  const previews = {
    ask: {
      icon: MessageSquare,
      label: "Ask & Earn",
      body: (
        <div className="space-y-2.5">
          <div className={`flex items-center gap-2 text-xs ${theme.textFaint}`}>
            <span className={`px-2 py-0.5 rounded-full ${theme.tagBg}`}>#React</span>
            <span>2h ago</span>
          </div>
          <p className={`text-sm font-medium ${theme.textPrimary}`}>Why does my useEffect run twice in dev mode?</p>
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-1 text-xs ${theme.textMuted}`}><ThumbsUp className="h-3 w-3" /> 12</span>
            <span className="flex items-center gap-1 text-xs font-medium bg-amber-400 text-slate-900 px-2.5 py-1 rounded-lg">
              <Zap className="h-3 w-3" /> Solve & Earn +50
            </span>
          </div>
        </div>
      ),
    },
    compete: {
      icon: TrendingUp,
      label: "Compete",
      body: (
        <div className="space-y-2">
          {[["Meera Nair", 2840, 1], ["Arjun Rao", 2510, 2], ["You", 320, 18]].map(([n, c, r]) => (
            <div key={n} className="flex items-center gap-2.5">
              <span className={`w-4 text-xs font-mono ${r <= 2 ? "text-amber-500" : theme.textFaint}`}>{r}</span>
              <div className="h-6 w-6 rounded-full bg-slate-600 text-white text-xs flex items-center justify-center shrink-0">{n[0]}</div>
              <span className={`text-sm flex-1 ${theme.textSecondary}`}>{n}</span>
              <span className={`font-mono text-xs font-semibold ${theme.textPrimary}`}>{c}</span>
            </div>
          ))}
        </div>
      ),
    },
    book: {
      icon: CalendarClock,
      label: "Book Sessions",
      body: (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-slate-600 text-white text-xs flex items-center justify-center">RK</div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className={`text-sm font-medium ${theme.textPrimary}`}>Ravi Kulkarni</div>
              <div className={`text-xs ${theme.textFaint}`}>React · System Design</div>
            </div>
          </div>
          <div className={`flex items-center justify-between text-xs border rounded-lg px-2.5 py-2 ${theme.cardBorder}`}>
            <span className={theme.textMuted}>Today, 2:00 PM</span>
            <span className="text-indigo-500 font-medium">Request →</span>
          </div>
        </div>
      ),
    },
  };

  const Active = previews[previewTab];

  return (
    <div className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 ${dark ? "bg-indigo-900" : "bg-indigo-200"}`} />
        <div className={`absolute -top-20 right-0 h-80 w-80 rounded-full blur-3xl opacity-30 ${dark ? "bg-amber-900" : "bg-amber-100"}`} />
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="ember"
            style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-6 ${theme.cardBorder} ${theme.textMuted}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live at SST Scaler right now
        </div>

        <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight ${theme.textPrimary}`}>
          Ask a question.<br className="hidden sm:block" /> Earn your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-500">Cred.</span>
        </h1>
        <p className={`mt-5 max-w-xl mx-auto leading-relaxed ${theme.textMuted}`}>
          CampfireCred connects SST students with mentors and each other — solve a peer's problem,
          climb the leaderboard, and book office hours, all in one place.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={focusLogin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            Sign in with your SST email
          </button>
        </div>
        <p className={`text-xs mt-3 ${theme.textFaint}`}>
          Format: <span className="font-mono">name.YYbcsRollNo@sst.scaler.com</span>
        </p>

        {/* animated stat counters */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${theme.textPrimary}`}>{counts.questions.toLocaleString()}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Questions solved</div>
          </div>
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${theme.textPrimary}`}>{counts.cred.toLocaleString()}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Cred awarded</div>
          </div>
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${theme.textPrimary}`}>{counts.mentors}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Active mentors</div>
          </div>
        </div>

        {/* interactive feature preview */}
        <div className={`mt-16 mx-auto max-w-md rounded-2xl border ${theme.cardBorder} ${theme.cardBg} shadow-xl text-left overflow-hidden`}>
          <div className={`flex border-b ${theme.divider}`}>
            {Object.entries(previews).map(([key, p]) => {
              const Icon = p.icon;
              return (
                <button
                  key={key}
                  onClick={() => setPreviewTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-3 transition-colors ${
                    previewTab === key ? "text-indigo-500 border-b-2 border-indigo-500" : `${theme.textFaint} border-b-2 border-transparent`
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {p.label}
                </button>
              );
            })}
          </div>
          <div className="p-5 min-h-32">{Active.body}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QAFeed.jsx
// ============================================================
function QAFeed({ questions, setQuestions, user, setUser, onCredAwarded, upvoted, setUpvoted, theme }) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [showAsk, setShowAsk] = useState(false);
  const [form, setForm] = useState({ title: "", tag: "React", desc: "" });

  const toggleTag = (tag) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const filtered = questions.filter((q) => {
    const matchesSearch = (q.title + q.desc).toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTags.length === 0 || activeTags.includes(q.tag);
    return matchesSearch && matchesTag;
  });

  const toggleUpvote = (id) => {
    setUpvoted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + (upvoted.has(id) ? -1 : 1) } : q))
    );
  };

  const solveQuestion = (id) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, solved: true } : q)));
    setUser((prev) => ({ ...prev, cred: prev.cred + 50 }));
    onCredAwarded(id);
  };

  const submitQuestion = () => {
    if (!form.title.trim()) return;
    const newQ = {
      id: Date.now(),
      author: user.name,
      initials: user.initials,
      time: "just now",
      tag: form.tag,
      title: form.title,
      desc: form.desc || "No additional details provided.",
      upvotes: 0,
      solved: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
    setForm({ title: "", tag: "React", desc: "" });
    setShowAsk(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textFaint}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
        </div>
        <button
          onClick={() => setShowAsk(true)}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Ask a Question
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeTags.includes(tag)
                ? "bg-indigo-600 border-indigo-600 text-white"
                : `${theme.cardBg} ${theme.inputBorder} ${theme.textSecondary} hover:border-indigo-300`
            }`}
          >
            #{tag.replace(" ", "")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className={`text-center py-12 text-sm rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textFaint}`}>
            No questions match your filters yet.
          </div>
        )}
        {filtered.map((q) => (
          <div key={q.id} className={`rounded-xl border p-5 transition-all hover:shadow-sm ${theme.cardBg} ${theme.cardBorder} ${theme.cardHover}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {q.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${theme.textPrimary}`}>{q.author}</span>
                    <span className={`text-xs flex items-center gap-1 ${theme.textFaint}`}><Clock className="h-3 w-3" />{q.time}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{q.tag.replace(" ", "")}</span>
                    {q.solved && (
                      <span className="text-xs font-medium bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" /> Solved
                      </span>
                    )}
                  </div>
                  <h3 className={`font-display font-semibold mt-1.5 ${theme.textPrimary}`}>{q.title}</h3>
                  <p className={`text-sm mt-1 leading-relaxed ${theme.textMuted}`}>{q.desc}</p>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between mt-4 pt-4 border-t ${theme.divider}`}>
              <button
                onClick={() => toggleUpvote(q.id)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  upvoted.has(q.id) ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-500" : `${theme.inputBorder} ${theme.textMuted} hover:border-slate-400`
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> {q.upvotes}
              </button>

              {!q.solved ? (
                <button
                  onClick={() => solveQuestion(q.id)}
                  className="flex items-center gap-1.5 text-sm font-medium bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" /> Solve & Earn +50 Cred
                </button>
              ) : (
                <span className={`text-xs italic ${theme.textFaint}`}>Accepted solution</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAsk && (
        <Modal title="Ask a Question" onClose={() => setShowAsk(false)} theme={theme}>
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Be specific — what are you stuck on?"
                className={`w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Tag</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={`w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              >
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Details</label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={4}
                placeholder="Add context — what have you tried already?"
                className={`w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>
            <button
              onClick={submitQuestion}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Post Question
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// Leaderboard.jsx
// ============================================================
function Leaderboard({ user, compact, theme }) {
  const merged = [...leaderboardBase, { id: "me", name: user.name, initials: user.initials, cred: user.cred, badges: user.badges }]
    .sort((a, b) => b.cred - a.cred);

  return (
    <div className={`rounded-xl border ${compact ? "p-4" : "p-5"} ${theme.cardBg} ${theme.cardBorder}`}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-4 w-4 text-amber-500" />
        <h3 className={`font-display font-semibold ${theme.textPrimary}`}>Top Contributors</h3>
      </div>
      <div className="space-y-1">
        {merged.map((entry, i) => {
          const isMe = entry.id === "me";
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-lg ${isMe ? "bg-indigo-500/10 border border-indigo-500/30" : ""}`}
            >
              <span className={`w-5 text-sm font-mono font-semibold ${i < 3 ? "text-amber-500" : theme.textFaint}`}>{i + 1}</span>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${isMe ? "bg-indigo-600" : "bg-slate-600"}`}>
                {entry.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-medium truncate ${theme.textPrimary}`}>{entry.name}{isMe && <span className="text-indigo-500"> (you)</span>}</div>
                {entry.badges.length > 0 && (
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {entry.badges.map((b) => (
                      <span key={b} className={`text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${theme.chipBg}`}>
                        <Star className="h-2.5 w-2.5" />{b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={`font-mono text-sm font-semibold shrink-0 ${theme.textSecondary}`}>{entry.cred}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Scheduler.jsx
// ============================================================
function Scheduler({ user, theme }) {
  const [tab, setTab] = useState("ta");
  const [selected, setSelected] = useState({});
  const [modalInfo, setModalInfo] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [copied, setCopied] = useState(false);

  const list = tab === "ta" ? taList : peerList;

  const requestMeeting = (person) => {
    const slot = selected[person.id] || person.slots[0];
    setModalInfo({ person, slot });
  };

  const confirmMeeting = () => {
    setConfirmed({ ...modalInfo, link: genLink() });
    setModalInfo(null);
  };

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className={`inline-flex rounded-full p-1 ${theme.pillBg}`}>
        <button
          onClick={() => setTab("ta")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === "ta" ? theme.pillActive : theme.pillInactive}`}
        >
          Book TA Office Hours
        </button>
        <button
          onClick={() => setTab("peer")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === "peer" ? theme.pillActive : theme.pillInactive}`}
        >
          Peer-to-Peer Session
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-xl border p-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-semibold">
                  {p.initials}
                </div>
                {"online" in p && (
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 ${theme.cardBg} ${p.online ? "bg-emerald-500" : "bg-slate-400"}`} />
                )}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-medium ${theme.textPrimary}`}>{p.name}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {p.expertise.map((e) => (
                    <span key={e} className={`text-xs px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{e.replace(" ", "")}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selected[p.id] || p.slots[0]}
                  onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })}
                  className={`w-full appearance-none border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
                >
                  {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className={`h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${theme.textFaint}`} />
              </div>
              <button
                onClick={() => requestMeeting(p)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shrink-0"
              >
                Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalInfo && (
        <Modal title="Confirm meeting request" onClose={() => setModalInfo(null)} theme={theme}>
          <div className="space-y-4 text-sm">
            <p className={theme.textMuted}>
              You're requesting a session with <span className={`font-medium ${theme.textPrimary}`}>{modalInfo.person.name}</span> at{" "}
              <span className={`font-medium ${theme.textPrimary}`}>{modalInfo.slot}</span>.
            </p>
            <div className={`rounded-lg p-3 flex items-center gap-2 ${theme.pillBg} ${theme.textMuted}`}>
              <Users className="h-4 w-4" /> Booked as {user.name} ({user.studentId})
            </div>
            <button
              onClick={confirmMeeting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Confirm & Generate Link
            </button>
          </div>
        </Modal>
      )}

      {confirmed && (
        <Modal title="Meeting confirmed" onClose={() => setConfirmed(null)} theme={theme}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 rounded-lg p-3">
              <Check className="h-4 w-4" /> Session locked in with {confirmed.person.name} at {confirmed.slot}
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Join link</label>
              <div className="mt-1 flex items-center gap-2">
                <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 font-mono text-xs truncate ${theme.inputBorder} ${theme.textSecondary}`}>
                  <Video className={`h-3.5 w-3.5 shrink-0 ${theme.textFaint}`} /> {confirmed.link}
                </div>
                <button onClick={copyLink} className={`border rounded-lg p-2 ${theme.inputBorder} ${theme.hoverBg}`}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className={`h-4 w-4 ${theme.textMuted}`} />}
                </button>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-xs ${theme.textFaint}`}>
              <Calendar className="h-3.5 w-3.5" /> Added to your calendar automatically
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// ProfileModal.jsx
// ============================================================
function ProfileModal({ user, onClose, theme }) {
  return (
    <Modal title="Your Profile" onClose={onClose} theme={theme}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
          {user.initials}
        </div>
        <div>
          <div className={`font-display font-semibold ${theme.textPrimary}`}>{user.name}</div>
          <div className={`text-sm ${theme.textFaint}`}>{user.email}</div>
          <div className={`text-xs mt-0.5 font-mono ${theme.textMuted}`}>Student ID: {user.studentId}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 text-center">
          <div className="font-mono text-xl font-bold text-amber-500">{user.cred}</div>
          <div className="text-xs text-amber-500/80 mt-0.5">Total Cred</div>
        </div>
        <div className={`rounded-lg p-3 text-center border ${theme.pillBg} ${theme.cardBorder}`}>
          <div className={`font-mono text-xl font-bold ${theme.textPrimary}`}>{user.badges.length}</div>
          <div className={`text-xs mt-0.5 ${theme.textMuted}`}>Badges Earned</div>
        </div>
      </div>
      <div className="mt-4">
        <div className={`text-xs font-medium mb-2 ${theme.textMuted}`}>Badges</div>
        <div className="flex flex-wrap gap-2">
          {user.badges.map((b) => (
            <span key={b} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full">
              <Award className="h-3 w-3" />{b}
            </span>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// Shared modal shell
// ============================================================
function Modal({ title, onClose, children, theme }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4">
      <div className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 shadow-xl ${theme.cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-semibold ${theme.textPrimary}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}>
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// pages/index.jsx — main assembly page
// ============================================================
export default function CampfireCredApp() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [showProfile, setShowProfile] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvoted, setUpvoted] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [loginPulse, setLoginPulse] = useState(false);
  const emailRef = useRef(null);

  const theme = getTheme(dark);

  const handleCredAwarded = () => {
    setToast("+50 Cred Awarded");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.appBg}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        body { font-family: 'Inter', sans-serif; }

        .ember {
          position: absolute;
          bottom: -10px;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: radial-gradient(circle, #fbbf24, #f59e0b);
          opacity: 0;
          animation-name: rise;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }
        @keyframes rise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(-420px) translateX(18px); opacity: 0; }
        }
      `}</style>

      <Navbar
        user={user}
        onLogin={setUser}
        onLogout={() => setUser(null)}
        onOpenProfile={() => setShowProfile(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        dark={dark}
        setDark={setDark}
        emailRef={emailRef}
        loginPulse={loginPulse}
      />

      {!user ? (
        <Hero theme={theme} dark={dark} emailRef={emailRef} setLoginPulse={setLoginPulse} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === "feed" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QAFeed
                  questions={questions}
                  setQuestions={setQuestions}
                  user={user}
                  setUser={setUser}
                  onCredAwarded={handleCredAwarded}
                  upvoted={upvoted}
                  setUpvoted={setUpvoted}
                  theme={theme}
                />
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <Leaderboard user={user} compact theme={theme} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="max-w-xl">
              <Leaderboard user={user} theme={theme} />
            </div>
          )}

          {activeTab === "schedule" && <Scheduler user={user} theme={theme} />}
        </main>
      )}

      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} theme={theme} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
          <Flame className="h-4 w-4 text-amber-400" /> {toast}
        </div>
      )}
    </div>
  );
}
