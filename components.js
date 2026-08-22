import { getTheme } from './data.js';

const { useEffect, useRef } = React;

function Icon({ name, className = "h-4 w-4", strokeWidth = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<i data-lucide="${name}" class="${className}" stroke-width="${strokeWidth}"></i>`;
      lucide.createIcons({
        attrs: { class: className, 'stroke-width': strokeWidth },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, className, strokeWidth]);

  return <span ref={ref} className="inline-flex items-center justify-center" />;
}

function Navbar({ user, onLogin, onLogout, onOpenProfile, activeTab, setActiveTab, theme, dark, setDark, goHome }) {
  const handleGoogleSignIn = () => {
    const mockUser = {
      name: "Arya Ravindra Koshti",
      email: "arya.26bcs10491@sst.scaler.com",
      studentId: "26BCS10491",
      initials: "AK",
      cred: 450,
      badges: ["Early Adopter", "Campfire Spark"]
    };
    onLogin(mockUser);
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
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 duration-200 shadow-md shadow-amber-500/20">
            <Icon name="flame" className="h-5 w-5 text-amber-100 animate-pulse" strokeWidth={2.5} />
          </div>
          <span className={`font-display text-lg font-bold tracking-tight ${theme.textPrimary} group-hover:text-amber-500 transition-colors`}>
            CampfireCred
          </span>
        </button>

        {user && (
          <nav className={`hidden lg:flex items-center gap-1 rounded-full p-1 border ${theme.cardBorder} ${theme.pillBg}`}>
            {navTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 ${
                  activeTab === t.id ? theme.pillActive : theme.pillInactive
                }`}
              >
                <Icon name={t.icon} className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md border border-slate-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.2 5.6-6 7.2l6.4 5.4C39.5 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Sign in with Google
            </button>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab("leaderboard")}
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1 transition-all duration-200"
              >
                <Icon name="flame" className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-amber-500">{user.cred}</span>
                <span className="text-[10px] text-amber-500/80 uppercase tracking-wider">Cred</span>
              </button>

              <button onClick={onOpenProfile} className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold group-hover:ring-2 group-hover:ring-amber-400 transition-all duration-200 shadow-sm">
                  {user.initials}
                </div>
              </button>

              <button onClick={onLogout} className={`p-2 rounded-lg ${theme.textFaint} ${theme.hoverBg} transition-colors duration-200`}>
                <Icon name="log-out" className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className={`p-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${theme.inputBorder} ${theme.hoverBg}`}
          >
            {dark ? <Icon name="sun" className="h-4 w-4 text-amber-400" /> : <Icon name="moon" className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {user && (
        <nav className="lg:hidden flex items-center gap-1 px-4 pb-2.5 overflow-x-auto border-t border-slate-800/40 pt-2">
          {navTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === t.id ? "bg-amber-500 text-slate-950 font-bold" : theme.chipBg
              }`}
            >
              <Icon name={t.icon} className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Modal({ title, onClose, children, theme }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-sm">
      <div className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display font-bold ${theme.textPrimary}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${theme.textFaint} ${theme.hoverBg}`}>
            <Icon name="x" className="h-4.5 w-4.5" />
          </button>
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
        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
          {user.initials}
        </div>
        <div>
          <div className={`font-display font-bold ${theme.textPrimary}`}>{user.name}</div>
          <div className={`text-xs ${theme.textFaint}`}>{user.email}</div>
          <div className={`text-xs mt-0.5 font-mono text-amber-500`}>ID: {user.studentId}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
          <div className="font-mono text-2xl font-bold text-amber-500">{user.cred}</div>
          <div className="text-[10px] text-amber-500/80 uppercase font-bold tracking-wider mt-0.5">Total Cred</div>
        </div>
        <div className={`rounded-xl p-3 text-center border ${theme.pillBg} ${theme.cardBorder}`}>
          <div className={`font-mono text-2xl font-bold ${theme.textPrimary}`}>{user.badges.length}</div>
          <div className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${theme.textMuted}`}>Badges</div>
        </div>
      </div>
    </Modal>
  );
}

export { Icon, Navbar, Modal, ProfileModal };
