import { initialQuestions, getTheme } from './data.js';
import { Icon, Navbar, ProfileModal } from './components.js';
import { Hero } from './hero.js';
import { QAFeed, SchedulePage, LeaderboardPage } from './features.js';

const { useState } = React;

function CampfireCredApp() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [showProfile, setShowProfile] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [upvoted, setUpvoted] = useState(new Set());
  const [toast, setToast] = useState(null);

  const theme = getTheme(dark);

  const goHome = () => {
    setActiveTab("feed");
  };

  const handleCredAwarded = () => {
    setToast("+50 Cred Points Added!");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.appBg}`}>
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
        goHome={goHome}
      />

      {!user ? (
        <Hero theme={theme} dark={dark} onLogin={setUser} goHome={goHome} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === "feed" && (
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
          )}

          {activeTab === "ta_hours" && (
            <SchedulePage type="ta" user={user} theme={theme} />
          )}

          {activeTab === "peer_hours" && (
            <SchedulePage type="peer" user={user} theme={theme} />
          )}

          {activeTab === "leaderboard" && (
            <LeaderboardPage user={user} theme={theme} />
          )}
        </main>
      )}

      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} theme={theme} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce">
          <Icon name="flame" className="h-4 w-4" /> {toast}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CampfireCredApp />);
