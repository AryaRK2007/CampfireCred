import { TAGS, leaderboardBase, taList, peerList, genLink } from './data.js';
import { Icon, Modal } from './components.js';

const { useState } = React;

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
          <Icon name="search" className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textFaint}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search technical discussions..."
            className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
          />
        </div>
        <button
          onClick={() => setShowAsk(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 shadow-md shadow-amber-500/20"
        >
          <Icon name="plus" className="h-4 w-4" strokeWidth={2.5} /> Ask Question
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeTags.includes(tag)
                ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
                : `${theme.cardBg} ${theme.inputBorder} ${theme.textSecondary} hover:border-amber-500/50`
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className={`text-center py-12 text-sm rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.textFaint}`}>
            No questions found matching your filter criteria.
          </div>
        )}
        {filtered.map((q) => (
          <div key={q.id} className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg ${theme.cardBg} ${theme.cardBorder} ${theme.cardHover}`}>
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                {q.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-semibold ${theme.textPrimary}`}>{q.author}</span>
                  <span className={`text-xs flex items-center gap-1 ${theme.textFaint}`}><Icon name="clock" className="h-3 w-3" />{q.time}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{q.tag}</span>
                  {q.solved && (
                    <span className="text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Icon name="check-circle" className="h-3 w-3" /> Solved
                    </span>
                  )}
                </div>
                <h3 className={`font-display text-base font-bold mt-1.5 ${theme.textPrimary}`}>{q.title}</h3>
                <p className={`text-sm mt-1 leading-relaxed ${theme.textMuted}`}>{q.desc}</p>
              </div>
            </div>

            <div className={`flex items-center justify-between mt-4 pt-3.5 border-t ${theme.divider}`}>
              <button
                onClick={() => toggleUpvote(q.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  upvoted.has(q.id) ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : `${theme.inputBorder} ${theme.textMuted} hover:border-slate-400`
                }`}
              >
                <Icon name="thumbs-up" className="h-3.5 w-3.5" /> {q.upvotes} Upvotes
              </button>

              {!q.solved ? (
                <button
                  onClick={() => solveQuestion(q.id)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-sm"
                >
                  <Icon name="zap" className="h-3.5 w-3.5" strokeWidth={2.5} /> Answer & Earn +50 Cred
                </button>
              ) : (
                <span className={`text-xs italic ${theme.textFaint}`}>Verified Solution</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAsk && (
        <Modal title="Ask the Campfire Community" onClose={() => setShowAsk(false)} theme={theme}>
          <div className="space-y-3.5">
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. How to manage state with Context API?"
                className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Tag Category</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              >
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Question Context</label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={4}
                placeholder="Describe what code you've written and where you are getting blocked..."
                className={`w-full mt-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>
            <button
              onClick={submitQuestion}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Publish Question
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SchedulePage({ type, user, theme }) {
  const [selected, setSelected] = useState({});
  const [modalInfo, setModalInfo] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [copied, setCopied] = useState(false);

  const list = type === "ta" ? taList : peerList;
  const title = type === "ta" ? "TA Meeting Scheduling" : "Peer-to-Peer Scheduling";
  const subtitle = type === "ta" 
    ? "Book 1-on-1 office hours directly with course Teaching Assistants."
    : "Connect with upperclassmen and high-cred peers for mentorship sessions.";

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>{title}</h2>
        <p className={`text-sm mt-1 ${theme.textMuted}`}>{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder} hover:border-amber-500/40 transition-all duration-200 shadow-sm flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                    {p.initials}
                  </div>
                  {"online" in p && (
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 ${theme.cardBg} ${p.online ? "bg-emerald-500" : "bg-slate-400"}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`text-base font-bold ${theme.textPrimary}`}>{p.name}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p.expertise.map((e) => (
                      <span key={e} className={`text-[10px] px-2 py-0.5 rounded-full ${theme.tagBg}`}>#{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/40 flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selected[p.id] || p.slots[0]}
                  onChange={(e) => setSelected({ ...selected, [p.id]: e.target.value })}
                  className={`w-full appearance-none border rounded-xl pl-3 pr-8 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
                >
                  {p.slots.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <Icon name="chevron-down" className={`h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${theme.textFaint}`} />
              </div>
              <button
                onClick={() => requestMeeting(p)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 shadow-sm"
              >
                Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalInfo && (
        <Modal title="Confirm Session Booking" onClose={() => setModalInfo(null)} theme={theme}>
          <div className="space-y-4 text-sm">
            <p className={theme.textMuted}>
              You are scheduling a session with <span className={`font-bold ${theme.textPrimary}`}>{modalInfo.person.name}</span> for{" "}
              <span className={`font-bold ${theme.textPrimary}`}>{modalInfo.slot}</span>.
            </p>
            <div className={`rounded-xl p-3 flex items-center gap-2 ${theme.pillBg} ${theme.textMuted} border ${theme.cardBorder}`}>
              <Icon name="user" className="h-4 w-4 text-amber-500" /> Booked as {user.name} ({user.studentId})
            </div>
            <button
              onClick={confirmMeeting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Confirm & Generate Meeting
            </button>
          </div>
        </Modal>
      )}

      {confirmed && (
        <Modal title="Meeting Confirmed!" onClose={() => setConfirmed(null)} theme={theme}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <Icon name="check-circle" className="h-5 w-5 shrink-0" /> Session confirmed with {confirmed.person.name} at {confirmed.slot}
            </div>
            <div>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Join Video Room</label>
              <div className="mt-1 flex items-center gap-2">
                <div className={`flex-1 flex items-center gap-2 border rounded-xl px-3 py-2 font-mono text-xs truncate ${theme.inputBorder} ${theme.textSecondary}`}>
                  <Icon name="video" className={`h-3.5 w-3.5 shrink-0 text-amber-500`} /> {confirmed.link}
                </div>
                <button onClick={copyLink} className={`border rounded-xl p-2 transition-all duration-200 hover:scale-105 active:scale-95 ${theme.inputBorder} ${theme.hoverBg}`}>
                  {copied ? <Icon name="check" className="h-4 w-4 text-emerald-500" /> : <Icon name="copy" className={`h-4 w-4 ${theme.textMuted}`} />}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function LeaderboardPage({ user, theme }) {
  const merged = [...leaderboardBase, { id: "me", name: user.name, initials: user.initials, cred: user.cred, badges: user.badges }]
    .sort((a, b) => b.cred - a.cred);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Icon name="flame" className="h-8 w-8 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className={`font-display text-xl font-bold ${theme.textPrimary}`}>Your Creds Balance</h2>
            <p className={`text-xs ${theme.textMuted}`}>Earn creds by answering student questions and hosting peer sessions.</p>
          </div>
        </div>
        <div className="text-right bg-slate-950/60 border border-slate-800 px-6 py-3 rounded-xl w-full sm:w-auto text-center sm:text-right">
          <div className="font-mono text-3xl font-extrabold text-amber-400">{user.cred}</div>
          <div className="text-[10px] text-amber-400/80 uppercase font-bold tracking-wider">Total Earned</div>
        </div>
      </div>

      <div className={`rounded-2xl border ${theme.cardBg} ${theme.cardBorder} p-6 shadow-md`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="trophy" className="h-5 w-5 text-amber-500" />
            <h3 className={`font-display text-lg font-bold ${theme.textPrimary}`}>Campfire Leaderboard</h3>
          </div>
          <span className={`text-xs font-mono ${theme.textFaint}`}>Updated in real-time</span>
        </div>

        <div className="space-y-2">
          {merged.map((entry, i) => {
            const isMe = entry.id === "me";
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 border ${
                  isMe 
                    ? "bg-amber-500/10 border-amber-500/40 shadow-sm" 
                    : `border-transparent ${theme.hoverBg}`
                }`}
              >
                <div className="w-6 text-center font-mono font-bold text-sm">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className={theme.textFaint}>#{i + 1}</span>}
                </div>

                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isMe ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-slate-700"}`}>
                  {entry.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}>
                    {entry.name}
                    {isMe && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans">YOU</span>}
                  </div>
                  {entry.badges.length > 0 && (
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {entry.badges.map((b) => (
                        <span key={b} className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${theme.chipBg}`}>
                          <Icon name="star" className="h-2.5 w-2.5 text-amber-500" />{b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right font-mono">
                  <div className={`text-base font-bold text-amber-500`}>{entry.cred}</div>
                  <div className={`text-[10px] ${theme.textFaint}`}>Creds</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { QAFeed, SchedulePage, LeaderboardPage };
