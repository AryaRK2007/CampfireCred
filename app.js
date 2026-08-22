const { useState, useEffect, useRef } = React;

const TAGS = ["React", "Python", "WebDev", "DSA", "System Design"];

const initialQuestions = [
  { id: 1, author: "Riya Sharma", initials: "RS", time: "2h ago", tag: "React", title: "Why does my useEffect run twice in dev mode?", desc: "Component fetches user data on mount but the network call fires twice locally, only once in production. Is this expected with StrictMode?", upvotes: 12, solved: false },
  { id: 2, author: "Kabir Mehta", initials: "KM", time: "4h ago", tag: "Python", title: "Best way to handle circular imports in a Flask app?", desc: "Splitting models across files and running into ImportError loops as the app grows past a few blueprints.", upvotes: 8, solved: false },
  { id: 3, author: "Ananya Iyer", initials: "AI", time: "6h ago", tag: "DSA", title: "When should I reach for a trie over a hashmap?", desc: "Working through a prefix-search problem and unsure which structure actually scales better past a few thousand entries.", upvotes: 15, solved: true },
  { id: 4, author: "Dev Patel", initials: "DP", time: "1d ago", tag: "WebDev", title: "CORS error only in production, works fine locally", desc: "Preflight requests fail on Vercel but pass on localhost with the exact same headers configured on the server.", upvotes: 6, solved: false },
  { id: 5, author: "Sara Khan", initials: "SK", time: "1d ago", tag: "System Design", title: "How do you shard a leaderboard table at scale?", desc: "Building something similar to this platform actually — the cred_points table is growing fast and rank queries are slowing down.", upvotes: 9, solved: false },
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

const getTheme = (dark) => ({
  dark,
  appBg: dark ? "bg-slate-950" : "bg-slate-50",
  navBg: dark ? "bg-slate-900/90" : "bg-white/90",
  navBorder: dark ? "border-slate-800" : "border-slate-200",
  cardBg: dark ? "bg-slate-900" : "bg-white",
  cardBorder: dark ? "border-slate-800" : "border-slate-200",
  cardHover: dark ? "hover:border-amber-500/50" : "hover:border-indigo-200",
  pillBg: dark ? "bg-slate-800" : "bg-slate-100",
  pillActive: dark ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" : "bg-white text-indigo-700 shadow-sm font-semibold",
  pillInactive: dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800",
  inputBg: dark ? "bg-slate-800" : "bg-white",
  inputBorder: dark ? "border-slate-700" : "border-slate-300",
  textPrimary: dark ? "text-white" : "text-slate-900",
  textSecondary: dark ? "text-slate-300" : "text-slate-700",
  textMuted: dark ? "text-slate-400" : "text-slate-500",
  textFaint: dark ? "text-slate-500" : "text-slate-400",
  hoverBg: dark ? "hover:bg-slate-800" : "hover:bg-slate-100",
  divider: dark ? "border-slate-800" : "border-slate-100",
  tagBg: dark ? "bg-amber-950/60 text-amber-300 border border-amber-800/40" : "bg-blue-50 text-blue-700",
  chipBg: dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500",
});

function Icon({ name, className = "h-4 w-4", strokeWidth = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<i data-lucide="${name}" class="${className}" stroke-width="${strokeWidth}"></i>`;
      lucide.createIcons({ attrs: { class: className, 'stroke-width': strokeWidth }, nameAttr: 'data-lucide' });
    }
  }, [name, className, strokeWidth]);
  return <span ref={ref} className="inline-flex items-center justify-center" />;
}

function Navbar({ user, onLogin, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, goHome }) {
  const handleGoogleSignIn = () => {
    onLogin({
      name: "Arya Ravindra Koshti",
      email: "arya.26bcs10491@sst.scaler.com",
      studentId: "26BCS10491",
      initials: "AK",
      cred: 450,
      badges: ["Early Adopter", "Campfire Spark"]
    });
  };

  const navTabs = [
    { id: "feed", label: "Q&A Feed", icon: "message-square" },
    { id: "ta_hours", label: "TA Meeting Scheduling", icon: "user-check" },
    { id: "peer_hours", label: "Peer-to-Peer Scheduling", icon: "users" },
    { id: "leaderboard", label: "Credits & Leaderboard", icon: "trophy" },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur ${theme.navBg} border-b ${theme.navBorder}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button onClick={goHome} className="flex items-center gap-2 shrink-0 group text-left">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Icon name="flame" className="h-5 w-5 text-amber-100 animate-pulse" strokeWidth={2.5} />
          </div>
          <span className={`font-display text-lg font-bold tracking-tight ${theme.textPrimary}`}>CampfireCred</span>
        </button>

        {user && (
          <nav className={`hidden lg:flex items-center gap-1 rounded-full p-1 border ${theme.cardBorder} ${theme.pillBg}`}>
            {navTabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 ${activeTab === t.id ? theme.pillActive : theme.pillInactive}`}>
                <Icon name={t.icon} className="h-3.5 w-3.5" />{t.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <button onClick={handleGoogleSignIn} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md border border-slate-700">
              <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.2 5.6-6 7.2l6.4 5.4C39.5 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
              Sign in with Google
            </button>
          ) : (
            <>
              <button onClick={() => setActiveTab("leaderboard")} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 rounded-full px-3 py-1">
                <Icon name="flame" className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-amber-500">{user.cred}</span>
                <span className="text-[10px] text-amber-500/80 uppercase">Cred</span>
              </button>
              <button onClick={onOpenProfile} className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                {user.initials}
              </button>
              <button onClick={onLogout} className={`p-2 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}>
                <Icon name="log-out" className="h-4 w-4" />
              </button>
            </>
          )}
          <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode" className={`p-2 rounded-lg border ${theme.inputBorder} ${theme.hoverBg}`}>
            {dark ? <Icon name="sun" className="h-4 w-4 text-amber-400" /> : <Icon name="moon" className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Modal({ title, onClose, children, theme }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-sm">
      <div className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-bold ${theme.textPrimary}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}><Icon name="x" className="h-4.5 w-4.5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProfileModal({ user, onClose, theme }) {
  return (
    <Modal title="Student Profile" onClose={onClose} theme={theme}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">{user.initials}</div>
        <div>
          <div className={`font-display font-bold ${theme.textPrimary}`}>{user.name}</div>
          <div className={`text-xs ${theme.textFaint}`}>{user.email}</div>
          <div className={`text-xs mt-0.5 font-mono text-amber-500`}>ID: {user.studentId}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
          <div className="font-mono text-2xl font-bold text-amber-500">{user.cred}</div>
          <div className="text-[10px] text-amber-500/80 uppercase font-bold mt-0.5">Total Cred</div>
        </div>
        <div className={`rounded-xl p-3 text-center border ${theme.pillBg} ${theme.cardBorder}`}>
          <div className={`font-mono text-2xl font-bold ${theme.textPrimary}`}>{user.badges.length}</div>
          <div className={`text-[10px] uppercase font-bold mt-0.5 ${theme.textMuted}`}>Badges</div>
        </div>
      </div>
    </Modal>
  );
}

function Hero({ theme, dark, onLogin, goHome }) {
  const [counts, setCounts] = useState({ questions: 1284, cred: 96500, mentors: 42 });

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] fire-glow rounded-full" />
        {[...Array(10)].map((_, i) => (
          <span key={i} className="ember" style={{ width: `${4 + (i%3)*2}px`, height: `${4 + (i%3)*2}px`, left: `${10 + i*8}%`, animationDelay: `${i*0.3}s`, animationDuration: `${3.5 + (i%3)}s` }} />
        ))}
      </div>
      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 text-center z-10">
        <button onClick={goHome} className="inline-block group mb-6 focus:outline-none">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Icon name="flame" className="h-8 w-8 text-amber-500 animate-bounce" />
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">Campfire Cred Hub</span>
            </div>
          </div>
        </button>
        <h1 className={`font-display text-4xl sm:text-6xl font-extrabold tracking-tight ${theme.textPrimary}`}>
          Gather around the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Campfire.</span><br />Solve together, build real Cred.
        </h1>
        <p className={`mt-5 max-w-2xl mx-auto text-lg ${theme.textMuted}`}>
          The peer learning platform for Scaler School of Technology. Ask technical questions, mentor fellow students, and schedule 1-on-1 sessions.
        </p>
        <div className="mt-8 flex justify-center">
          <button onClick={() => onLogin({ name: "Arya Ravindra Koshti", email: "arya.26bcs10491@sst.scaler.com", studentId: "26BCS10491", initials: "AK", cred: 450, badges: ["Early Adopter"] })} className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25">
            <svg className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.2 5.6-6 7.2l6.4 5.4C39.5 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
            Sign in with SST Google Account
          </button>
        </div>
      </div>
    </div>
  );
}

function QAFeed({ questions, setQuestions, user, setUser, onCredAwarded, upvoted, setUpvoted, theme }) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [showAsk, setShowAsk] = useState(false);
  const [form, setForm] = useState({ title: "", tag: "React", desc: "" });

  const toggleTag = (tag) => setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  const filtered = questions.filter((q) => (q.title + q.desc).toLowerCase().includes(search.toLowerCase()) && (activeTags.length === 0 || activeTags.includes(q.tag)));

  const toggleUpvote = (id) => {
    setUpvoted((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, upvotes: q.upvotes + (upvoted.has(id) ? -1 : 1) } : q));
  };

  const solveQuestion = (id) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, solved: true } : q));
    setUser((prev) => ({ ...prev, cred: prev.cred + 50 }));
    onCredAwarded();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="search" className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textFaint}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search technical discussions..." className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
        </div>
        <button onClick={() => setShowAsk(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md">
          <Icon name="plus" className="h-4 w-4" /> Ask Question
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button key={tag} onClick={() => toggleTag(tag)} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${activeTags.includes(tag) ? "bg-amber-500 border-amber-500 text-slate-950 font-bold" : `${theme.cardBg} ${theme.inputBorder} ${theme.textSecondary}`}`}>
            #{tag}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">{q.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-semibold ${theme.textPrimary}`}>{q.author}</span>
                  <span className={`text-xs ${theme.textFaint}`}>{q.time}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{q.tag}</span>
                  {q.solved && <span className="text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">Solved</span>}
                </div>
                <h3 className={`font-display text-base font-bold mt-1.5 ${theme.textPrimary}`}>{q.title}</h3>
                <p className={`text-sm mt-1 ${theme.textMuted}`}>{q.desc}</p>
              </div>
            </div>
            <div className={`flex items-center justify-between mt-4 pt-3.5 border-t ${theme.divider}`}>
              <button onClick={() => toggleUpvote(q.id)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${upvoted.has(q.id) ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : `${theme.inputBorder} ${theme.textMuted}`}`}>
                <Icon name="thumbs-up" className="h-3.5 w-3.5" /> {q.upvotes} Upvotes
              </button>
              {!q.solved ? (
                <button onClick={() => solveQuestion(q.id)} className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-lg">
                  <Icon name="zap" className="h-3.5 w-3.5" /> Answer & Earn +50 Cred
                </button>
              ) : <span className={`text-xs italic ${theme.textFaint}`}>Verified Solution</span>}
            </div>
          </div>
        ))}
      </div>
      {showAsk && (
        <Modal title="Ask the Community" onClose={() => setShowAsk(false)} theme={theme}>
          <div className="space-y-3.5">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title..." className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={4} placeholder="Description..." className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            <button onClick={() => { if (!form.title) return; setQuestions([{ id: Date.now(), author: user.name, initials: user.initials, time: "just now", tag: form.tag, title: form.title, desc: form.desc, upvotes: 0, solved: false }, ...questions]); setShowAsk(false); }} className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl">Publish</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SchedulePage({ type, theme }) {
  const list = type === "ta" ? taList : peerList;
  const [selected, setSelected] = useState({});
  const [confirmed, setConfirmed] = useState(null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>{type === "ta" ? "TA Meeting Scheduling" : "Peer-to-Peer Scheduling"}</h2>
        <p className={`text-sm mt-1 ${theme.textMuted}`}>Book office hours and mentorship sessions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder} flex flex-col justify-between`}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold">{p.initials}</div>
              <div>
                <div className={`text-base font-bold ${theme.textPrimary}`}>{p.name}</div>
                <div className="flex gap-1 mt-1 flex-wrap">{p.expertise.map((e) => <span key={e} className={`text-[10px] px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{e}</span>)}</div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/40 flex gap-2">
              <select value={selected[p.id] || p.slots[0]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}>
                {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setConfirmed({ person: p, slot: selected[p.id] || p.slots[0], link: genLink() })} className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0">Request</button>
            </div>
          </div>
        ))}
      </div>
      {confirmed && (
        <Modal title="Session Confirmed!" onClose={() => setConfirmed(null)} theme={theme}>
          <div className="space-y-4 text-sm">
            <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">Confirmed with {confirmed.person.name} at {confirmed.slot}</div>
            <div className={`p-3 border rounded-xl font-mono text-xs ${theme.inputBorder} ${theme.textSecondary}`}>Room link: {confirmed.link}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function LeaderboardPage({ user, theme }) {
  const merged = [...leaderboardBase, { id: "me", name: user.name, initials: user.initials, cred: user.cred, badges: user.badges }].sort((a, b) => b.cred - a.cred);
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className={`rounded-2xl border ${theme.cardBg} ${theme.cardBorder} p-6 shadow-md`}>
        <h3 className={`font-display text-lg font-bold mb-4 ${theme.textPrimary}`}>Campfire Leaderboard</h3>
        <div className="space-y-2">
          {merged.map((entry, i) => (
            <div key={entry.id} className={`flex items-center gap-4 p-3.5 rounded-xl ${entry.id === "me" ? "bg-amber-500/10 border border-amber-500/40" : ""}`}>
              <div className="w-6 text-center font-mono font-bold text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
              <div className="h-10 w-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold">{entry.initials}</div>
              <div className="flex-1"><div className={`text-sm font-bold ${theme.textPrimary}`}>{entry.name} {entry.id === "me" && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">YOU</span>}</div></div>
              <div className="text-right font-mono font-bold text-amber-500">{entry.cred} Creds</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CampfireCredApp() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [showProfile, setShowProfile] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvoted, setUpvoted] = useState(new Set());
  const [toast, setToast] = useState(null);

  const theme = getTheme(dark);

  return (
    <div className={`min-h-screen ${theme.appBg}`}>
      <Navbar user={user} onLogin={setUser} onLogout={() => setUser(null)} onOpenProfile={() => setShowProfile(true)} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} dark={dark} setDark={setDark} goHome={() => setActiveTab("feed")} />
      {!user ? (
        <Hero theme={theme} dark={dark} onLogin={setUser} goHome={() => setActiveTab("feed")} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === "feed" && <QAFeed questions={questions} setQuestions={setQuestions} user={user} setUser={setUser} onCredAwarded={() => { setToast("+50 Cred Points Added!"); setTimeout(() => setToast(null), 2000); }} upvoted={upvoted} setUpvoted={setUpvoted} theme={theme} />}
          {activeTab === "ta_hours" && <SchedulePage type="ta" theme={theme} />}
          {activeTab === "peer_hours" && <SchedulePage type="peer" theme={theme} />}
          {activeTab === "leaderboard" && <LeaderboardPage user={user} theme={theme} />}
        </main>
      )}
      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} theme={theme} />}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CampfireCredApp />);
