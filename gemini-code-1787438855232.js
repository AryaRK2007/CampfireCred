const { useState, useEffect, useRef } = React;

const TAGS = ["React", "Python", "WebDev", "DSA", "System Design"];

const initialQuestions = [
  { id: 1, author: "Riya Sharma", initials: "RS", time: "2h ago", tag: "React", title: "Why does my useEffect run twice in dev mode?", desc: "Component fetches user data on mount but the network call fires twice locally, only once in production. Is this expected with StrictMode?", upvotes: 12, solved: false },
  { id: 2, author: "Kabir Mehta", initials: "KM", time: "4h ago", tag: "Python", title: "Best way to handle circular imports in a Flask app?", desc: "Splitting models across files and running into ImportError loops as the app grows past a few blueprints.", upvotes: 8, solved: false },
  { id: 3, author: "Ananya Iyer", initials: "AI", time: "6h ago", tag: "DSA", title: "When should I reach for a trie over a hashmap?", desc: "Working through a prefix-search problem and unsure which structure actually scales better past a few thousand entries.", upvotes: 15, solved: true },
];

const initialRequests = [
  { id: "r1", studentName: "Riya Sharma", studentEmail: "riya@sst.scaler.com", slot: "Today at 2:00 PM", topic: "React State Management & useEffect Loops", status: "pending" },
  { id: "r2", studentName: "Kabir Mehta", studentEmail: "kabir@sst.scaler.com", slot: "Tomorrow at 4:30 PM", topic: "Python Flask Blueprint Architecture", status: "pending" },
];

const initialMessages = [
  { id: "m1", sender: "Riya Sharma", role: "Student", text: "Hello TA! Can we discuss my React query during today's session?", time: "10:15 AM" },
];

const leaderboardBase = [
  { id: "u1", name: "Meera Nair", initials: "MN", cred: 2840, badges: ["Top Mentor", "Bug Hunter"] },
  { id: "u2", name: "Arjun Rao", initials: "AR", cred: 2510, badges: ["Top Mentor"] },
  { id: "u3", name: "Priya Das", initials: "PD", cred: 2205, badges: ["Bug Hunter", "Streak x30"] },
];

const taList = [
  { id: "t1", name: "Ravi Kulkarni", initials: "RK", expertise: ["React", "System Design"], online: true, slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  { id: "t2", name: "Ananya Bose", initials: "AB", expertise: ["Python", "DSA"], online: true, slots: ["11:00 AM", "3:00 PM"] },
];

const peerList = [
  { id: "p1", name: "Ishaan Verma", initials: "IV", expertise: ["React", "WebDev"], cred: 1420, slots: ["1:00 PM", "5:00 PM"] },
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
});

function Icon({ name, className = "h-4 w-4", strokeWidth = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = `<i data-lucide="${name}" class="${className}" stroke-width="${strokeWidth}"></i>`;
      lucide.createIcons({ attrs: { class: className, 'stroke-width': strokeWidth }, nameAttr: 'data-lucide' });
    }
  }, [name, className, strokeWidth]);
  return <span ref={ref} className="inline-flex items-center justify-center" />;
}

function Navbar({ user, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, goHome, onTriggerAuth }) {
  const navTabs = user?.isTA ? [
    { id: "ta_dashboard", label: "TA Portal & Requests", icon: "clipboard-list" },
    { id: "ta_messages", label: "TA Messages", icon: "message-circle" },
    { id: "feed", label: "Q&A Feed", icon: "message-square" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  ] : [
    { id: "feed", label: "Q&A Feed", icon: "message-square" },
    { id: "ta_hours", label: "TA Hours", icon: "user-check" },
    { id: "peer_hours", label: "Peer-to-Peer", icon: "users" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur ${theme.navBg} border-b ${theme.navBorder}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button onClick={goHome} className="flex items-center gap-2 shrink-0 group text-left">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-tr from-amber-600 via-orange-500 to-red-500 flex items-center justify-center shadow-md animate-logo-flame">
            <Icon name="flame" className="h-5 w-5 text-amber-100" strokeWidth={2.5} />
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
            <button onClick={onTriggerAuth} className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-800 text-sm font-medium px-4 py-2 rounded-xl shadow-sm border border-slate-300 transition-all">
              Sign in with Google
            </button>
          ) : (
            <>
              {user.isTA ? (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  TA Account
                </span>
              ) : (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Student Account
                </span>
              )}
              <button onClick={() => setActiveTab("leaderboard")} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 rounded-full px-3 py-1">
                <Icon name="flame" className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-amber-500">{user.cred}</span>
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

function AuthModal({ onClose, onAuthenticate, theme }) {
  const [email, setEmail] = useState("");

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const isStudent = email.toLowerCase().endsWith("@sst.scaler.com");
    const isTA = !isStudent;

    const derivedName = email.split("@")[0].replace(/[._]/g, " ");
    const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    const newUser = {
      name: capitalized,
      email,
      studentId: isTA 
        ? "TA-" + Math.floor(1000 + Math.random() * 9000) 
        : "SST-" + Math.floor(10000 + Math.random() * 90000),
      initials: capitalized.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U",
      cred: isTA ? 500 : 100,
      isTA,
      badges: isTA 
        ? ["Teaching Assistant", "Official Mentor"] 
        : ["Scaler Student", "Campfire Spark"]
    };

    onAuthenticate(newUser);
  };

  return (
    <Modal title="Google Account Sign-In" onClose={onClose} theme={theme}>
      <form onSubmit={handleEmailNext} className="space-y-4">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>
            Email address
          </label>
          <input 
            type="email" 
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="student@sst.scaler.com or ta@gmail.com" 
            className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
          />
          <p className={`text-[11px] mt-1.5 ${theme.textMuted}`}>
            Emails ending in <span className="font-mono text-amber-500 font-bold">@sst.scaler.com</span> log in to the <strong className={theme.textPrimary}>Student Portal</strong>. All other emails route to the <strong className={theme.textPrimary}>TA Portal</strong>.
          </p>
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition-all">
          Continue
        </button>
      </form>
    </Modal>
  );
}

function TAPortal({ requests, setRequests, messages, setMessages, questions, setQuestions, user, theme, setToast }) {
  const [newMsg, setNewMsg] = useState("");
  const [askStudent, setAskStudent] = useState({ show: false, question: "", targetStudent: "Riya Sharma" });

  const handleAcceptRequest = (req) => {
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: "accepted" } : r));
    setToast(`Meeting accepted! Auto-added to ${user.name}'s Google Calendar 📅`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: user.name, role: "TA", text: newMsg, time: "Just now" }]);
    setNewMsg("");
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!askStudent.question.trim()) return;
    
    const newQ = {
      id: Date.now(),
      author: `${user.name} (TA)`,
      initials: user.initials,
      time: "Just now",
      tag: "TA Direct Question",
      title: `[Question to ${askStudent.targetStudent}]: ${askStudent.question}`,
      desc: `Direct question initiated by TA ${user.name} for ${askStudent.targetStudent}.`,
      upvotes: 0,
      solved: false
    };

    setQuestions([newQ, ...questions]);
    setAskStudent({ show: false, question: "", targetStudent: "Riya Sharma" });
    setToast(`Question published to feed for ${askStudent.targetStudent}!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>TA Control Portal</h2>
          <p className={`text-xs mt-1 ${theme.textMuted}`}>Welcome back, {user.name}. Manage incoming student requests and chat messages.</p>
        </div>
        <button onClick={() => setAskStudent({ ...askStudent, show: true })} className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md">
          + Ask Student a Question
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder}`}>
          <h3 className={`font-display font-bold text-base mb-3 ${theme.textPrimary}`}>Meeting Requests</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className={`p-4 rounded-xl border ${theme.inputBorder} ${theme.pillBg} space-y-2`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-bold text-sm ${theme.textPrimary}`}>{r.studentName}</div>
                    <div className={`text-xs ${theme.textFaint}`}>{r.studentEmail}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {r.status === 'accepted' ? 'Added to G-Calendar' : 'Pending'}
                  </span>
                </div>
                <div className={`text-xs ${theme.textMuted}`}><strong>Slot:</strong> {r.slot}</div>
                <div className={`text-xs ${theme.textMuted}`}><strong>Topic:</strong> {r.topic}</div>
                {r.status === 'pending' && (
                  <button onClick={() => handleAcceptRequest(r)} className="w-full mt-2 bg-emerald-500 text-slate-950 text-xs font-bold py-2 rounded-lg">
                    Accept & Add to Google Calendar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} flex flex-col h-96`}>
          <h3 className={`font-display font-bold text-base mb-3 ${theme.textPrimary}`}>Student Chat & Inbox</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
            {messages.map((m) => (
              <div key={m.id} className={`p-3 rounded-xl max-w-[85%] text-xs ${m.role === 'TA' ? 'ml-auto bg-amber-500/20 text-amber-200 border border-amber-500/30' : `${theme.inputBg} ${theme.textPrimary} border ${theme.inputBorder}`}`}>
                <div className="font-bold mb-0.5">{m.sender} <span className="text-[9px] opacity-70">({m.time})</span></div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." className={`flex-1 border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 text-xs rounded-xl">Send</button>
          </form>
        </div>
      </div>

      {askStudent.show && (
        <Modal title="Ask Question to Student" onClose={() => setAskStudent({ ...askStudent, show: false })} theme={theme}>
          <form onSubmit={handleAskQuestion} className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.textMuted}`}>Target Student</label>
              <input value={askStudent.targetStudent} onChange={(e) => setAskStudent({ ...askStudent, targetStudent: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.textMuted}`}>Question Text</label>
              <textarea value={askStudent.question} onChange={(e) => setAskStudent({ ...askStudent, question: e.target.value })} rows={3} placeholder="Ask student about their task or doubts..." className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs">Post Question to Feed</button>
          </form>
        </Modal>
      )}
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

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) return;

    const newQ = {
      id: Date.now(),
      author: user.name,
      initials: user.initials,
      time: "Just now",
      tag: form.tag,
      title: form.title,
      desc: form.desc,
      upvotes: 0,
      solved: false
    };

    setQuestions([newQ, ...questions]);
    setForm({ title: "", tag: "React", desc: "" });
    setShowAsk(false);
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
        <Modal title="Ask a New Question" onClose={() => setShowAsk(false)} theme={theme}>
          <form onSubmit={handleCreateQuestion} className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.textMuted}`}>Category Tag</label>
              <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}>
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.textMuted}`}>Question Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. How to manage state in React?" className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme.textMuted}`}>Detailed Description</label>
              <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="Provide details about your query..." className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`} />
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs">Publish Question</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function ProfileModal({ user, onClose, theme }) {
  return (
    <Modal title="User Profile" onClose={onClose} theme={theme}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">{user.initials}</div>
        <div>
          <div className={`font-display font-bold ${theme.textPrimary}`}>{user.name} {user.isTA ? "(TA)" : "(Student)"}</div>
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

function SchedulePage({ type, theme }) {
  const list = type === "ta" ? taList : peerList;
  const [selected, setSelected] = useState({});

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>{type === "ta" ? "TA Scheduling" : "Peer Scheduling"}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder} flex flex-col justify-between`}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold">{p.initials}</div>
              <div>
                <div className={`text-base font-bold ${theme.textPrimary}`}>{p.name}</div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/40 flex gap-2">
              <select value={selected[p.id] || p.slots[0]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}>
                {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => alert(`Request sent to ${p.name}`)} className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shrink-0">Request</button>
            </div>
          </div>
        ))}
      </div>
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
              <div className="w-6 text-center font-mono font-bold text-sm">#{i + 1}</div>
              <div className="h-10 w-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold">{entry.initials}</div>
              <div className="flex-1"><div className={`text-sm font-bold ${theme.textPrimary}`}>{entry.name}</div></div>
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
  
  // Safe user initialization using try-catch block to prevent crash
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("campfire_active_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem("campfire_active_user");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.isTA ? "ta_dashboard" : "feed";
    } catch (e) {
      return "feed";
    }
  });

  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [requests, setRequests] = useState(initialRequests);
  const [messages, setMessages] = useState(initialMessages);
  const [upvoted, setUpvoted] = useState(new Set());
  const [toast, setToast] = useState(null);

  const theme = getTheme(dark);

  const handleAuthenticate = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("campfire_active_user", JSON.stringify(loggedInUser));
    setShowAuth(false);
    
    if (loggedInUser.isTA) {
      setActiveTab("ta_dashboard");
    } else {
      setActiveTab("feed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("campfire_active_user");
    setActiveTab("feed");
  };

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={`min-h-screen ${theme.appBg}`}>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenProfile={() => setShowProfile(true)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        dark={dark} 
        setDark={setDark} 
        goHome={() => setActiveTab(user?.isTA ? "ta_dashboard" : "feed")} 
        onTriggerAuth={() => setShowAuth(true)}
      />
      {!user ? (
        <div className="text-center pt-24 px-4">
          <h1 className={`text-4xl font-bold mb-4 ${theme.textPrimary}`}>Welcome to CampfireCred</h1>
          <p className={`text-sm mb-6 ${theme.textMuted}`}>Sign in with your email to access your customized dashboard.</p>
          <button onClick={() => setShowAuth(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all">Sign In to Continue</button>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === "ta_dashboard" && <TAPortal requests={requests} setRequests={setRequests} messages={messages} setMessages={setMessages} questions={questions} setQuestions={setQuestions} user={user} theme={theme} setToast={showToastMsg} />}
          {activeTab === "ta_messages" && <TAPortal requests={requests} setRequests={setRequests} messages={messages} setMessages={setMessages} questions={questions} setQuestions={setQuestions} user={user} theme={theme} setToast={showToastMsg} />}
          {activeTab === "feed" && <QAFeed questions={questions} setQuestions={setQuestions} user={user} setUser={setUser} onCredAwarded={() => showToastMsg("+50 Cred Points Added!")} upvoted={upvoted} setUpvoted={setUpvoted} theme={theme} />}
          {activeTab === "ta_hours" && <SchedulePage type="ta" theme={theme} />}
          {activeTab === "peer_hours" && <SchedulePage type="peer" theme={theme} />}
          {activeTab === "leaderboard" && <LeaderboardPage user={user} theme={theme} />}
        </main>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuthenticate={handleAuthenticate} theme={theme} />}
      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} theme={theme} />}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce z-50">{toast}</div>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CampfireCredApp />);