import { Icon } from './components.js';

const { useState, useEffect } = React;

function Hero({ theme, dark, onLogin, goHome }) {
  const [counts, setCounts] = useState({ questions: 0, cred: 0, mentors: 0 });

  useEffect(() => {
    const targets = { questions: 1284, cred: 96500, mentors: 42 };
    const duration = 1200;
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

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] fire-glow rounded-full" />
        <div className={`absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-amber-600" : "bg-amber-300"}`} />
        <div className={`absolute top-1/3 right-0 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-red-700" : "bg-red-200"}`} />

        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="ember"
            style={{
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              left: `${8 + i * 5.8}%`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${3.5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 text-center z-10">
        <button onClick={goHome} className="inline-block group mb-6 focus:outline-none">
          <div className="relative inline-flex items-center justify-center p-4 bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-amber-500 transition-all duration-300">
            <div className="flex items-center gap-3">
              <Icon name="flame" className="h-8 w-8 text-amber-500 animate-bounce" />
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Campfire Cred Hub
              </span>
            </div>
          </div>
        </button>

        <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${theme.textPrimary}`}>
          Gather around the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">Campfire.</span><br />
          Solve together, build real Cred.
        </h1>
        
        <p className={`mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${theme.textMuted}`}>
          The peer learning platform for Scaler School of Technology. Ask technical questions, mentor fellow students, schedule 1-on-1 TA sessions, and earn recognized credits.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.2l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.2 5.6-6 7.2l6.4 5.4C39.5 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Sign in with SST Google Account
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto border-t border-slate-800/60 pt-8">
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${theme.textPrimary}`}>{counts.questions.toLocaleString()}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Questions Solved</div>
          </div>
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold text-amber-500`}>{counts.cred.toLocaleString()}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Cred Points Earned</div>
          </div>
          <div>
            <div className={`font-mono text-2xl sm:text-3xl font-bold ${theme.textPrimary}`}>{counts.mentors}</div>
            <div className={`text-xs mt-1 ${theme.textFaint}`}>Active Mentors & TAs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
