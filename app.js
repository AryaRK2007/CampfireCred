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
  navBg: dark ? "bg-slate-900/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md",
  navBorder: dark ? "border-slate-800/80" : "border-slate-200/80",
  cardBg: dark ? "bg-slate-900/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm",
  cardBorder: dark ? "border-slate-800" : "border-slate-200",
  pillBg: dark ? "bg-slate-800" : "bg-slate-100",
  pillActive: dark ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-105" : "bg-indigo-600 text-white shadow-sm font-semibold scale-105",
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

// Background floating campfire sparks effect
function CampfireSparks() {
  const sparks = Array.from({ length: 18 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(105vh) translateX(0) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(40px) scale(1.2); opacity: 0; }
        }
        .spark {
          position: absolute;
          bottom: -20px;
          background: radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(249,115,22,0.8) 50%, rgba(239,68,68,0) 100%);
          border-radius: 50%;
          animation: floatUp linear infinite;
        }
      `}</style>
      {sparks.map((_, i) => {
        const size = Math.random() * 6 + 3;
        const left = Math.random() * 100;
        const duration = Math.random() * 7 + 5;
        const delay = Math.random() * 5;
        return (
          <div
            key={i}
            className="spark"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function Navbar({ user, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, goHome, onTriggerAuth }) {
  const navTabs = [
    { id: "feed", label: "Q&A Feed", icon: "message-square" },
    { id: "ta_hours", label: "TA Hours", icon: "user-check" },
    { id: "peer_hours", label: "Peer-to-Peer", icon: "users" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${theme.navBg} border-b ${theme.navBorder}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button onClick={goHome} className="flex items-center gap-2 shrink-0 group text-left transition-transform hover:scale-105">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Icon name="flame" className="h-5 w-5 text-amber-100 animate-pulse" strokeWidth={2.5} />
          </div>
          <span className={`font-display text-lg font-bold tracking-tight ${theme.textPrimary}`}>CampfireCred</span>
        </button>

        {user && (
          <nav className={`hidden lg:flex items-center gap-1 rounded-full p-1 border ${theme.cardBorder} ${theme.pillBg} shadow-inner`}>
            {navTabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 ${activeTab === t.id ? theme.pillActive : theme.pillInactive}`}>
                <Icon name={t.icon} className="h-3.5 w-3.5" />{t.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <button onClick={onTriggerAuth} className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-800 text-sm font-medium px-4 py-2 rounded-xl shadow-md border border-slate-300 transition-all hover:scale-105 active:scale-95">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.31 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-2.56z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Sign in with Google
            </button>
          ) : (
            <>
              <button onClick={() => setActiveTab("leaderboard")} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 rounded-full px-3 py-1 transition-transform hover:scale-105">
                <Icon name="flame" className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-amber-500">{user.cred}</span>
                <span className="text-[10px] text-amber-500/80 uppercase">Cred</span>
              </button>
              <button onClick={onOpenProfile} className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-md transition-transform hover:scale-105">
                {user.initials}
              </button>
              <button onClick={onLogout} className={`p-2 rounded-lg ${theme.textFaint} ${theme.hoverBg} transition-colors`}>
                <Icon name="log-out" className="h-4 w-4" />
              </button>
            </>
          )}
          <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode" className={`p-2 rounded-lg border ${theme.inputBorder} ${theme.hoverBg} transition-transform hover:rotate-12`}>
            {dark ? <Icon name="sun" className="h-4 w-4 text-amber-400" /> : <Icon name="moon" className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Modal({ title, onClose, children, theme }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl ${theme.cardBg} border ${theme.cardBorder} transform transition-all`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-bold ${theme.textPrimary}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}><Icon name="x" className="h-4.5 w-4.5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AuthModal({ onClose, onAuthenticate, theme }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState("email");

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const existingUsers = JSON.parse(localStorage.getItem("campfire_users") || "{}");
    if (existingUsers[email]) {
      onAuthenticate(existingUsers[email]);
    } else {
      const derivedName = email.split("@")[0].replace(/[._]/g, " ");
      const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      setName(capitalized);
      setStep("details");
    }
  };

  const handleFinishSignup = (e) => {
    e.preventDefault();
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
    const studentId = "26" + Math.floor(10000 + Math.random() * 90000);
    const newUser = {
      name,
      email,
      studentId,
      initials,
      cred: 0, // Brand new users start with 0 creds as requested!
      badges: ["Campfire Spark"]
    };

    const existingUsers = JSON.parse(localStorage.getItem("campfire_users") || "{}");
    existingUsers[email] = newUser;
    localStorage.setItem("campfire_users", JSON.stringify(existingUsers));

    onAuthenticate(newUser);
  };

  return (
    <Modal title="Google Account Sign-In" onClose={onClose} theme={theme}>
      {step === "email" ? (
        <form onSubmit={handleEmailNext} className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-2">
            <svg className="h-8 w-8 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.31 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-2.56z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <div>
              <div className={`text-sm font-bold ${theme.textPrimary}`}>Google Identity Services</div>
              <div className={`text-xs ${theme.textFaint}`}>Continue to CampfireCred</div>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>Email address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@scaler.com or gmail.com" 
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all">
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinishSignup} className="space-y-4">
          <div className={`text-xs ${theme.textMuted} mb-2`}>
            We noticed <span className={`font-mono font-semibold ${theme.textPrimary}`}>{email}</span> is new. Let's configure your profile card!
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>Full Name</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`}
            />
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="text-[11px] text-amber-500 font-bold uppercase">Fresh Account</div>
            <div className={`text-xs mt-0.5 ${theme.textSecondary}`}>Your starting balance is 0 Creds. Answer questions or participate in sessions to earn your rank!</div>
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all">
            Create Profile & Enter Hub
          </button>
        </form>
      )}
    </Modal>
  );
}

function ProfileModal({ user, onClose, theme }) {
  return (
    <Modal title="Student Profile" onClose={onClose} theme={theme}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">{user.initials}</div>
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

function Hero({ theme, onTriggerAuth, goHome }) {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 text-center z-10">
        <button onClick={goHome} className="inline-block group mb-6 focus:outline-none transition-transform hover:scale-105">
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
          <button onClick={onTriggerAuth} className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm px-8 py-3.5 rounded-xl shadow-xl border border-slate-300 transition-all hover:scale-105 active:scale-95">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.31 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-2.56z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Sign in with Google Account
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
    <div className="space-y-4 max-w-4xl mx-auto relative z-10 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="search" className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textFaint}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search technical discussions..." className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none shadow-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
        </div>
        <button onClick={() => setShowAsk(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
          <Icon name="plus" className="h-4 w-4" /> Ask Question
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button key={tag} onClick={() => toggleTag(tag)} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${activeTags.includes(tag) ? "bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" : `${theme.cardBg} ${theme.inputBorder} ${theme.textSecondary} hover:border-amber-500/50`}`}>
            #{tag}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className={`rounded-2xl border p-5 transition-all hover:shadow-xl ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md">{q.initials}</div>
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
              <button onClick={() => toggleUpvote(q.id)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${upvoted.has(q.id) ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : `${theme.inputBorder} ${theme.textMuted} ${theme.hoverBg}`}`}>
                <Icon name="thumbs-up" className="h-3.5 w-3.5" /> {q.upvotes} Upvotes
              </button>
              {!q.solved ? (
                <button onClick={() => solveQuestion(q.id)} className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-md transition-transform hover:scale-105">
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
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title..." className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`} />
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`}>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={4} placeholder="Description..." className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`} />
            <button onClick={() => { if (!form.title) return; setQuestions([{ id: Date.now(), author: user.name, initials: user.initials, time: "just now", tag: form.tag, title: form.title, desc: form.desc, upvotes: 0, solved: false }, ...questions]); setShowAsk(false); }} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all">Publish Question</button>
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
    <div className="space-y-6 max-w-4xl mx-auto relative z-10 animate-fadeIn">
      <div>
        <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>{type === "ta" ? "TA Meeting Scheduling" : "Peer-to-Peer Scheduling"}</h2>
        <p className={`text-sm mt-1 ${theme.textMuted}`}>Book office hours and mentorship sessions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder} flex flex-col justify-between shadow-sm transition-all hover:shadow-xl`}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">{p.initials}</div>
              <div>
                <div className={`text-base font-bold ${theme.textPrimary}`}>{p.name}</div>
                <div className="flex gap-1 mt-1 flex-wrap">{p.expertise.map((e) => <span key={e} className={`text-[10px] px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{e}</span>)}</div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/40 flex gap-2">
              <select value={selected[p.id] || p.slots[0]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`}>
                {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setConfirmed({ person: p, slot: selected[p.id] || p.slots[0], link: genLink() })} className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0 shadow-md transition-transform hover:scale-105">Request</button>
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
    <div className="space-y-6 max-w-4xl mx-auto relative z-10 animate-fadeIn">
      <div className={`rounded-2xl border ${theme.cardBg} ${theme.cardBorder} p-6 shadow-xl`}>
        <h3 className={`font-display text-lg font-bold mb-4 ${theme.textPrimary}`}>Campfire Leaderboard</h3>
        <div className="space-y-2">
          {merged.map((entry, i) => (
            <div key={entry.id} className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${entry.id === "me" ? "bg-amber-500/10 border border-amber-500/40 shadow-sm" : "hover:bg-slate-500/5"}`}>
              <div className="w-6 text-center font-mono font-bold text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold shadow-md">{entry.initials}</div>
              <div className="flex-1"><div className={`text-sm font-bold ${theme.textPrimary}`}>{entry.name} {entry.id === "me" && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full ml-2">YOU</span>}</div></div>
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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("campfire_active_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState("feed");
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvoted, setUpvoted] = useState(new Set());
  const [toast, setToast] = useState(null);

  const theme = getTheme(dark);

  const handleAuthenticate = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("campfire_active_user", JSON.stringify(loggedInUser));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("campfire_active_user");
  };

  return (
    <div className={`min-h-screen ${theme.appBg} relative overflow-x-hidden transition-colors duration-300`}>
      <CampfireSparks />
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenProfile={() => setShowProfile(true)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        dark={dark} 
        setDark={setDark} 
        goHome={() => setActiveTab("feed")} 
        onTriggerAuth={() => setShowAuth(true)}
      />
      {!user ? (
        <Hero theme={theme} dark={dark} onTriggerAuth={() => setShowAuth(true)} goHome={() => setActiveTab("feed")} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
          {activeTab === "feed" && <QAFeed questions={questions} setQuestions={setQuestions} user={user} setUser={setUser} onCredAwarded={() => { setToast("+50 Cred Points Added!"); setTimeout(() => setToast(null), 2000); }} upvoted={upvoted} setUpvoted={setUpvoted} theme={theme} />}
          {activeTab === "ta_hours" && <SchedulePage type="ta" theme={theme} />}
          {activeTab === "peer_hours" && <SchedulePage type="peer" theme={theme} />}
          {activeTab === "leaderboard" && <LeaderboardPage user={user} theme={theme} />}
        </main>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuthenticate={handleAuthenticate} theme={theme} />}
      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} theme={theme} />}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CampfireCredApp />);
