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

export { TAGS, initialQuestions, leaderboardBase, taList, peerList, genLink, getTheme };
