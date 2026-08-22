const { useState, useEffect, useRef } = React;

const TAGS = ["React", "Python", "WebDev", "DSA", "System Design"];

const initialQuestions = [
  { id: 1, author: "Riya Sharma", initials: "RS", time: "2h ago", tag: "React", title: "Why does my useEffect run twice in dev mode?", desc: "Component fetches user data on mount but the network call fires twice locally, only once in production. Is this expected with StrictMode?", upvotes: 12, solved: false, targetStudent: null },
  { id: 2, author: "Kabir Mehta", initials: "KM", time: "4h ago", tag: "Python", title: "Best way to handle circular imports in a Flask app?", desc: "Splitting models across files and running into ImportError loops as the app grows past a few blueprints.", upvotes: 8, solved: false, targetStudent: null },
];

const leaderboardBase = [
  { id: "u1", name: "Meera Nair", initials: "MN", cred: 2840, badges: ["Top Mentor", "Bug Hunter"] },
  { id: "u2", name: "Arjun Rao", initials: "AR", cred: 2510, badges: ["Top Mentor"] },
];

const taList = [
  { id: "t1", name: "Ravi Kulkarni", email: "ravi_ta@gmail.com", initials: "RK", expertise: ["React", "System Design"], online: true, slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  { id: "t2", name: "Ananya Bose", email: "ananya_ta@gmail.com", initials: "AB", expertise: ["Python", "DSA"], online: true, slots: ["11:00 AM", "3:00 PM"] },
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
    if (ref.current) {
      ref.current.innerHTML = `<i data-lucide="${name}" class="${className}" stroke-width="${strokeWidth}"></i>`;
      lucide.createIcons({ attrs: { class: className, 'stroke-width': strokeWidth }, nameAttr: 'data-lucide' });
    }
  }, [name, className, strokeWidth]);
  return <span ref={ref} className="inline-flex items-center justify-center" />;
}

function Navbar({ user, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, goHome, onTriggerAuth }) {
  const navTabs = [
    { id: "feed", label: "Q&A Feed", icon: "message-square" },
    { id: "ta_hours", label: "TA Hours", icon: "user-check" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  ];

  if (user?.isTA) {
    navTabs.push({ id: "ta_portal", label: "TA Portal", icon: "shield" });
  }

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
            <button onClick={onTriggerAuth} className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-800 text-sm font-medium px-4 py-2 rounded-xl shadow-sm border border-slate-300 transition-all">
              Sign in with Google
            </button>
          ) : (
            <>
              {user.isTA && <span className="bg-amber-500/20 border border-amber-500 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">TA Mode</span>}
              <button onClick={onOpenProfile} className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                {user.initials}
              </button>
              <button onClick={onLogout} className={`p-2 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}>
                <Icon name="log-out" className="h-4 w-4" />
              </button>
            </>
          )}
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

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Check for TA login email requirement: ends with _ta@gmail.com
    const isTA = email.trim().toLowerCase().endsWith("_ta@gmail.com");
    const nameDerived = email.split("@")[0].replace(/[._]/g, " ");
    const name = nameDerived.charAt(0).toUpperCase() + nameDerived.slice(1);
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const userObj = {
      name: isTA ? `${name} (TA)` : name,
      email,
      studentId: isTA ? "TA-OFFICIAL" : "26" + Math.floor(10000 + Math.random() * 90000),
      initials,
      cred: isTA ? 9999 : 100,
      badges: isTA ? ["Teaching Assistant", "Mentor"] : ["Campfire Spark"],
      isTA,
    };

    onAuthenticate(userObj);
  };

  return (
    <Modal title="Google Account Sign-In" onClose={onClose} theme={theme}>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john_ta@gmail.com or student@gmail.com"
            className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:outline-none`}
          />
          <p className="text-[11px] text-amber-500 mt-2">
            * Note: Logins ending with <b>_ta@gmail.com</b> are authenticated with full Teaching Assistant privileges.
          </p>
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition-all">
          Sign In
        </button>
      </form>
    </Modal>
  );
}

function TAPortalPage({ user, meetingRequests, setMeetingRequests, questions, setQuestions, theme }) {
  const [askForm, setAskForm] = useState({ studentName: "", title: "", desc: "" });
  const [msgInput, setMsgInput] = useState({});
  const [messages, setMessages] = useState([
    { id: 1, sender: "Riya Sharma", text: "Hi TA, I requested a slot for React debugging.", time: "10 mins ago" }
  ]);

  // Google Calendar Integration Event Handler
  const handleAcceptAndCalendar = (req) => {
    // 1. Mark Request accepted
    setMeetingRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "accepted" } : r));

    // 2. Generate Google Calendar Link
    const startTime = new Date().toISOString().replace(/-|:|\.\d\d\d/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `TA Session: ${req.studentName}`
    )}&details=${encodeURIComponent(
      `Meeting link: ${req.link}`
    )}&dates=${startTime}/${startTime}`;

    // 3. Directly open Google Calendar
    window.open(calendarUrl, "_blank");
  };

  const handleAskStudent = (e) => {
    e.preventDefault();
    if (!askForm.title || !askForm.studentName) return;

    const newQ = {
      id: Date.now(),
      author: user.name,
      initials: user.initials,
      time: "just now",
      tag: "TA Query",
      title: `[Directed to ${askForm.studentName}]: ${askForm.title}`,
      desc: askForm.desc,
      upvotes: 0,
      solved: false,
      targetStudent: askForm.studentName
    };

    setQuestions([newQ, ...questions]);
    setAskForm({ studentName: "", title: "", desc: "" });
  };

  const handleSendMessage = (studentName) => {
    if (!msgInput[studentName]) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: user.name, text: msgInput[studentName], time: "Just now" }]);
    setMsgInput({ ...msgInput, [studentName]: "" });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. TA Office Hour Requests */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder}`}>
        <h2 className={`text-xl font-bold font-display ${theme.textPrimary} mb-4`}>Meeting Requests & Calendar Sync</h2>
        <div className="space-y-3">
          {meetingRequests.length === 0 ? (
            <p className={`text-sm ${theme.textMuted}`}>No pending meeting requests.</p>
          ) : (
            meetingRequests.map((req) => (
              <div key={req.id} className={`p-4 rounded-xl border flex items-center justify-between ${theme.inputBg} ${theme.inputBorder}`}>
                <div>
                  <div className={`font-bold text-sm ${theme.textPrimary}`}>{req.studentName}</div>
                  <div className={`text-xs ${theme.textMuted}`}>Slot: {req.slot} | Status: <span className="uppercase text-amber-500 font-bold">{req.status}</span></div>
                </div>
                {req.status === "pending" && (
                  <button
                    onClick={() => handleAcceptAndCalendar(req)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1"
                  >
                    <Icon name="calendar" className="h-3.5 w-3.5" /> Accept & Add to Google Calendar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. TA Direct Messages */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder}`}>
        <h2 className={`text-xl font-bold font-display ${theme.textPrimary} mb-4`}>Student Messages</h2>
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {messages.map((m) => (
            <div key={m.id} className={`p-3 rounded-xl border ${theme.inputBg} ${theme.inputBorder}`}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-amber-500">{m.sender}</span>
                <span className={theme.textFaint}>{m.time}</span>
              </div>
              <p className={`text-sm ${theme.textSecondary}`}>{m.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type message to student..."
            value={msgInput["general"] || ""}
            onChange={(e) => setMsgInput({ ...msgInput, general: e.target.value })}
            className={`flex-1 border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
          <button onClick={() => handleSendMessage("general")} className="bg-amber-500 font-bold text-slate-950 text-xs px-4 py-2 rounded-xl">Send</button>
        </div>
      </div>

      {/* 3. Ask Question to Student */}
      <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.cardBorder}`}>
        <h2 className={`text-xl font-bold font-display ${theme.textPrimary} mb-4`}>Ask Question to Student</h2>
        <form onSubmit={handleAskStudent} className="space-y-3">
          <input
            required
            type="text"
            placeholder="Student Name / ID"
            value={askForm.studentName}
            onChange={(e) => setAskForm({ ...askForm, studentName: e.target.value })}
            className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
          <input
            required
            type="text"
            placeholder="Question Title"
            value={askForm.title}
            onChange={(e) => setAskForm({ ...askForm, title: e.target.value })}
            className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
          <textarea
            required
            placeholder="Question Details..."
            value={askForm.desc}
            onChange={(e) => setAskForm({ ...askForm, desc: e.target.value })}
            className={`w-full border rounded-xl px-3 py-2 text-sm ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
          <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl">
            Post Direct Question
          </button>
        </form>
      </div>
    </div>
  );
}

function SchedulePage({ type, user, setMeetingRequests, theme }) {
  const list = taList;
  const [selected, setSelected] = useState({});
  const [requested, setRequested] = useState(false);

  const handleRequest = (ta) => {
    const slot = selected[ta.id] || ta.slots[0];
    setMeetingRequests(prev => [
      ...prev,
      { id: Date.now(), taId: ta.id, taName: ta.name, studentName: user.name, slot, link: genLink(), status: "pending" }
    ]);
    setRequested(true);
    setTimeout(() => setRequested(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>TA Office Hours</h2>
      {requested && <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm">Meeting request sent to TA!</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className={`text-base font-bold ${theme.textPrimary}`}>{p.name}</div>
            <div className="mt-4 flex gap-2">
              <select value={selected[p.id] || p.slots[0]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}>
                {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => handleRequest(p)} className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl">Request</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampfireCredApp() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [showAuth, setShowAuth] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [meetingRequests, setMeetingRequests] = useState([
    { id: 101, taId: "t1", taName: "Ravi Kulkarni", studentName: "Riya Sharma", slot: "2:00 PM", link: genLink(), status: "pending" }
  ]);

  const theme = getTheme(dark);

  return (
    <div className={`min-h-screen ${theme.appBg}`}>
      <Navbar user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} dark={dark} setDark={setDark} goHome={() => setActiveTab("feed")} onTriggerAuth={() => setShowAuth(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "feed" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {questions.map((q) => (
              <div key={q.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{q.tag}</span>
                  <span className={`text-xs ${theme.textFaint}`}>{q.time}</span>
                </div>
                <h3 className={`font-bold mt-2 ${theme.textPrimary}`}>{q.title}</h3>
                <p className={`text-sm mt-1 ${theme.textMuted}`}>{q.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ta_hours" && <SchedulePage user={user} setMeetingRequests={setMeetingRequests} theme={theme} />}
        {activeTab === "ta_portal" && user?.isTA && (
          <TAPortalPage user={user} meetingRequests={meetingRequests} setMeetingRequests={setMeetingRequests} questions={questions} setQuestions={setQuestions} theme={theme} />
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuthenticate={(u) => { setUser(u); setShowAuth(false); }} theme={theme} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CampfireCredApp />);
