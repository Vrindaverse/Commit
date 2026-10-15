'use client';



import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import { motion, AnimatePresence, useDragControls, useReducedMotion } from 'framer-motion';

import { useEffect, useState, useSyncExternalStore } from 'react';

import {

  LayoutDashboard, Target, CheckSquare, Rocket, BookOpen,

  GraduationCap, Flame, Trophy, BarChart3, Settings,

  NotebookPen, FlameIcon, X, Check, CheckCircle2, Wallet, User,

  Pencil, Save, LogOut, Download, ChevronRight, Mail,

} from 'lucide-react';

import { localDateKey } from '@/lib/date';

import { computeDashboardStats, parseDateKey } from '@/lib/dashboard-stats';

import { useLifeStore } from '@/store/use-store';

import { useUIStore } from '@/store/ui-store';

import ProgressBar from '@/components/shared/progress-bar';

import { toast } from '@/components/shared/toast';

import { useAchievements } from '@/lib/achievements';

import { logout, exportAllData } from '@/lib/account';



const navItems = [

  { href: '/', label: 'Dashboard', icon: LayoutDashboard },

  { href: '/goals', label: 'Goals', icon: Target },

  { href: '/tasks', label: 'Tasks', icon: CheckSquare },

  { href: '/projects', label: 'Projects', icon: Rocket },

  { href: '/learning', label: 'Learning', icon: BookOpen },

  { href: '/academics', label: 'Academics', icon: GraduationCap },

  { href: '/habits', label: 'Habits', icon: Flame },

  { href: '/expenses', label: 'Finance', icon: Wallet },

  { href: '/achievements', label: 'Achievements', icon: Trophy },

  { href: '/journal', label: 'Journal', icon: NotebookPen },

  { href: '/analytics', label: 'Analytics', icon: BarChart3 },

  { href: '/settings', label: 'Settings', icon: Settings },

];



function MandalaSVG() {

  const C = 300;

  const a8 = [0, 45, 90, 135, 180, 225, 270, 315];

  const a12 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const a16 = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];

  const c = { dk: '#1C1814', go: '#D4A046', ru: '#C24A34', ea: '#7A5A42' };

  return (

    <svg viewBox="-100 0 800 800" className="h-full w-auto">

      <circle cx={C} cy="400" r="358" fill="none" stroke={c.dk} strokeWidth="2" />

      <circle cx={C} cy="400" r="352" fill="none" stroke={c.go} strokeWidth="1" strokeDasharray="8 6" />

      <circle cx={C} cy="400" r="346" fill="none" stroke={c.dk} strokeWidth="0.8" strokeDasharray="2 4" />

      {a16.map(a => (

        <circle key={`bd-${a}`} cx={C + 342 * Math.cos((a * Math.PI) / 180)} cy={400 + 342 * Math.sin((a * Math.PI) / 180)} r="4" fill={c.go} fillOpacity="0.5" stroke={c.dk} strokeWidth="0.6" />

      ))}

      <circle cx={C} cy="400" r="328" fill="none" stroke={c.dk} strokeWidth="1.5" />

      <circle cx={C} cy="400" r="322" fill="none" stroke={c.ru} strokeWidth="0.5" strokeDasharray="3 5" />

      {a12.map(a => (

        <g key={`bp-${a}`} transform={`rotate(${a}, ${C}, 400)`}>

          <path d={`M ${C} 60 Q ${C + 48} 130 ${C + 22} 210 Q ${C} 228 ${C - 22} 210 Q ${C - 48} 130 ${C} 60`} fill="none" stroke={c.dk} strokeWidth="1.2" />

          <path d={`M ${C} 66 Q ${C + 26} 130 ${C + 12} 200 Q ${C} 214 ${C - 12} 200 Q ${C - 26} 130 ${C} 66`} fill="none" stroke={c.ea} strokeWidth="0.6" />

          <line x1={C} y1="66" x2={C} y2="200" stroke={c.go} strokeWidth="0.5" opacity="0.6" />

        </g>

      ))}

      <circle cx={C} cy="400" r="248" fill="none" stroke={c.dk} strokeWidth="1.2" />

      <circle cx={C} cy="400" r="242" fill="none" stroke={c.ru} strokeWidth="0.6" strokeDasharray="4 4" />

      {a16.map(a => (

        <g key={`tri-${a}`} transform={`rotate(${a}, ${C}, 400)`}>

          <polygon points={`${C},230 ${C + 14},250 ${C},270 ${C - 14},250`} fill={c.go} fillOpacity="0.12" stroke={c.go} strokeWidth="0.6" opacity="0.6" />

        </g>

      ))}

      <circle cx={C} cy="400" r="230" fill="none" stroke={c.dk} strokeWidth="1" />

      <circle cx={C} cy="400" r="225" fill="none" stroke={c.ea} strokeWidth="0.5" strokeDasharray="2 6" />

      {a8.map(a => (

        <g key={`ir-${a}`} transform={`rotate(${a}, ${C}, 400)`}>

          <line x1={C} y1="225" x2={C} y2="310" stroke={c.dk} strokeWidth="1" opacity="0.7" />

          <path d={`M ${C} 235 Q ${C + 22} 265 ${C} 300`} fill="none" stroke={c.ru} strokeWidth="0.6" opacity="0.5" />

          <path d={`M ${C} 235 Q ${C - 22} 265 ${C} 300`} fill="none" stroke={c.ru} strokeWidth="0.6" opacity="0.5" />

        </g>

      ))}

      <circle cx={C} cy="400" r="210" fill="none" stroke={c.dk} strokeWidth="1.5" />

      <circle cx={C} cy="400" r="200" fill="none" stroke={c.go} strokeWidth="0.5" strokeDasharray="5 3" />

      {a8.map(a => (

        <line key={`sb-${a}`} x1={C + 195 * Math.cos((a * Math.PI) / 180)} y1={400 + 195 * Math.sin((a * Math.PI) / 180)} x2={C + 195 * Math.cos(((a + 45) * Math.PI) / 180)} y2={400 + 195 * Math.sin(((a + 45) * Math.PI) / 180)} stroke={c.go} strokeWidth="0.8" opacity="0.4" />

      ))}

      {a12.map(a => (

        <line key={`sb2-${a}`} x1={C} y1="205" x2={C} y2="400" stroke={c.ea} strokeWidth="0.5" opacity="0.35" transform={`rotate(${a - 15}, ${C}, 400)`} />

      ))}

      <circle cx={C} cy="400" r="160" fill="none" stroke={c.dk} strokeWidth="1.2" />

      <circle cx={C} cy="400" r="152" fill="none" stroke={c.ru} strokeWidth="0.6" />

      {a12.map((a, i) => (

        <g key={`il-${a}`} transform={`rotate(${a}, ${C}, 400)`}>

          <path d={`M ${C} 152 Q ${C + 32} 195 ${C + 16} 255 Q ${C} 268 ${C - 16} 255 Q ${C - 32} 195 ${C} 152`} fill={i % 2 === 0 ? c.go : c.ru} fillOpacity="0.08" stroke={c.dk} strokeWidth="1" />

          <path d={`M ${C} 156 Q ${C + 14} 195 ${C + 7} 245 Q ${C} 255 ${C - 7} 245 Q ${C - 14} 195 ${C} 156`} fill={i % 2 === 0 ? c.ru : c.go} fillOpacity="0.06" stroke={c.go} strokeWidth="0.5" />

        </g>

      ))}

      <circle cx={C} cy="400" r="120" fill="none" stroke={c.dk} strokeWidth="1.5" />

      <circle cx={C} cy="400" r="112" fill="none" stroke={c.ea} strokeWidth="0.5" strokeDasharray="3 3" />

      {a8.map(a => (

        <line key={`sp-${a}`} x1={C + 105 * Math.cos((a * Math.PI) / 180)} y1={400 + 105 * Math.sin((a * Math.PI) / 180)} x2={C + 105 * Math.cos(((a + 3) * 45 * Math.PI) / 180)} y2={400 + 105 * Math.sin(((a + 3) * 45 * Math.PI) / 180)} stroke={c.ru} strokeWidth="0.7" opacity="0.5" />

      ))}

      {a8.map(a => (

        <line key={`sp2-${a}`} x1={C + 80 * Math.cos((a * Math.PI) / 180)} y1={400 + 80 * Math.sin((a * Math.PI) / 180)} x2={C + 80 * Math.cos(((a + 1) * 45 * Math.PI) / 180)} y2={400 + 80 * Math.sin(((a + 1) * 45 * Math.PI) / 180)} stroke={c.dk} strokeWidth="0.8" opacity="0.5" />

      ))}

      <circle cx={C} cy="400" r="70" fill="none" stroke={c.dk} strokeWidth="1.2" />

      <circle cx={C} cy="400" r="60" fill={c.go} fillOpacity="0.15" stroke={c.dk} strokeWidth="0.6" strokeDasharray="3 4" />

      {a8.map(a => (

        <line key={`is-${a}`} x1={C} y1="60" x2={C} y2="400" stroke={c.ea} strokeWidth="0.5" opacity="0.4" transform={`rotate(${a + 22.5}, ${C}, 400)`} />

      ))}

      <circle cx={C} cy="400" r="42" fill={c.go} fillOpacity="0.06" stroke={c.dk} strokeWidth="1" />

      {a8.map((a, i) => (

        <g key={`cp-${a}`} transform={`rotate(${a}, ${C}, 400)`}>

          <path d={`M ${C} 42 Q ${C + 14} 52 ${C} 62 Q ${C - 14} 52 ${C} 42`} fill={i % 2 === 0 ? c.go : c.ru} fillOpacity="0.12" stroke={c.ru} strokeWidth="0.7" />

        </g>

      ))}

      <circle cx={C} cy="400" r="22" fill={c.ru} fillOpacity="0.08" stroke={c.dk} strokeWidth="1.5" />

      <circle cx={C} cy="400" r="28" fill="none" stroke={c.go} strokeWidth="0.4" strokeDasharray="2 2" />

      <circle cx={C} cy="400" r="10" fill={c.go} fillOpacity="0.15" stroke={c.dk} strokeWidth="0.8" />

      <circle cx={C} cy="400" r="4" fill={c.go} />

    </svg>

  );

}



function useLoginStreak() {

  const [logs, setLogs] = useState<string[]>([]);

  const [loggedInToday, setLoggedInToday] = useState(false);

  const [streak, setStreak] = useState(0);



  useEffect(() => {

    let cancelled = false;

    (async () => {

      try {

        const today = localDateKey();

        const res = await fetch(`/api/login-logs?today=${today}`);

        if (!res.ok) throw new Error(`Failed to fetch login logs: ${res.status}`);

        const data: { logs: { date: string }[]; streak: number } = await res.json();

        const existing = data.logs.map(d => d.date);

        if (existing.includes(today)) {

          if (cancelled) return;

          setLogs(existing);

          setLoggedInToday(true);

          setStreak(data.streak);

          return;

        }

        const postRes = await fetch('/api/login-logs', {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({ date: today }),

        });

        if (!postRes.ok) throw new Error(`Failed to post login log: ${postRes.status}`);

        const postData: { log?: { date: string }; streak: number } = await postRes.json();

        if (cancelled) return;

        const date = postData.log?.date ?? today;

        setLogs(existing.includes(date) ? existing : [...existing, date]);

        setLoggedInToday(true);

        setStreak(postData.streak);

      } catch {

        // Keep defaults (0 streak) when the API is unavailable.

      }

    })();

    return () => { cancelled = true; };

  }, []);



  return { streak, loggedInToday, logs };

}




function StreakPopup({ logs, streak, onClose }: { logs: string[]; streak: number; onClose: () => void }) {
  const today = new Date();
  const todayStr = localDateKey(today);
  const logSet = new Set(logs);
  const [monthOffset, setMonthOffset] = useState(0);

  const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthName = base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDow = base.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: { day: number; date: string; logged: boolean; isToday: boolean }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = localDateKey(date);
    cells.push({
      day: d,
      date: dateStr,
      logged: logSet.has(dateStr),
      isToday: dateStr === todayStr,
    });
  }

  const grid: (typeof cells[number] | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...cells,
  ];
  const weekRows: (typeof cells[number] | null)[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weekRows.push(grid.slice(i, i + 7));
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        role="dialog"
        aria-modal="true"
        aria-label="Login activity"
        className="w-full max-w-xs rounded-2xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-4 shadow-[6px_6px_0px_0px_var(--neo-shadow)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] bg-[#CDEAC0] flex items-center justify-center">
              <FlameIcon size={14} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Login Activity</h3>
              <p className="text-[9px] font-medium text-[#5C5C5C]">{streak} day streak · {logs.length} total</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close login activity" className="neo-button p-1.5 bg-[#F0ECE4]"><X size={12} /></button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setMonthOffset(o => o - 1)} aria-label="Previous month" className="neo-button px-2 py-1 text-[10px] font-extrabold bg-[#F0ECE4]">&lt;</button>
          <p className="text-[10px] font-extrabold uppercase tracking-wider">{monthName}</p>
          <button onClick={() => setMonthOffset(o => Math.min(0, o + 1))} aria-label="Next month" className="neo-button px-2 py-1 text-[10px] font-extrabold bg-[#F0ECE4]">&gt;</button>
        </div>
        <div className="space-y-1">
          {weekRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, cellIndex) =>
                cell ? (
                  <motion.div
                    key={cell.day}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 rounded-sm border-[1.5px] border-[#2D2D2D] flex flex-col items-center justify-center text-[9px] font-bold transition-colors"
                    style={{ backgroundColor: cell.logged ? "#B8D8F8" : cell.isToday ? '#F7E8A4' : '#F0ECE4' }}
                  >
                    {cell.logged ? <Check size={9} strokeWidth={3} /> : cell.day}
                  </motion.div>
                ) : (
                  <div key={`blank-${cellIndex}`} className="w-6 h-6" />
                )
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}


function useProfileMetrics() {
  const hydrated = useLifeStore(s => s.hydrated);
  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const projects = useLifeStore(s => s.projects);
  const habits = useLifeStore(s => s.habits);
  const learningPaths = useLifeStore(s => s.learningPaths);
  const journalEntries = useLifeStore(s => s.journalEntries);
  const subjects = useLifeStore(s => s.subjects);
  const exams = useLifeStore(s => s.exams);
  const settings = useLifeStore(s => s.settings);

  const stats = computeDashboardStats({ tasks, goals, projects, habits, learningPaths, expenses: [], loans: [] });

  const now = new Date();
  const goalsCompleted = goals.filter(g => g.progress >= 100).length;
  const goalsAvg = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) : 0;
  const learningAvg = learningPaths.length > 0 ? Math.round(learningPaths.reduce((sum, l) => sum + (l.progress || 0), 0) / learningPaths.length) : 0;
  const upcomingExams = exams.filter(e => {
    const d = parseDateKey(e.date);
    return d ? d >= now : false;
  }).length;
  const assignments = subjects.flatMap(s => s.assignments);
  const assignmentsDone = assignments.filter(a => a.submitted).length;
  const habitsToday = stats.compulsoryHabits.length;
  const habitsDone = stats.compulsoryDone;
  const habitRate = habitsToday > 0 ? Math.round((habitsDone / habitsToday) * 100) : 0;
  const score = Math.round((stats.completionRate + habitRate + goalsAvg + learningAvg) / 4);

  return {
    hydrated, settings, stats,
    goalsCompleted, goalsAvg, learningAvg, upcomingExams,
    assignmentsDone, assignmentsTotal: assignments.length,
    habitsToday, habitsDone, habitRate, score,
    journalCount: journalEntries.length,
  };
}

function MetricTile({ icon: Icon, label, value, sub, color }: {
  icon: typeof Target; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-xl border-[2px] border-[#2D2D2D] p-2.5" style={{ backgroundColor: color }}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} />
        <span className="text-[9px] font-extrabold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-extrabold leading-none">{value}</p>
      {sub && <p className="text-[9px] font-bold text-[#5C5C5C] mt-0.5">{sub}</p>}
    </div>
  );
}

function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(max-width: 767px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false,
  );
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfilePanel({
  onClose,
  loginLogs,
  loginStreak,
}: {
  onClose: () => void;
  loginLogs: string[];
  loginStreak: number;
}) {
  const m = useProfileMetrics();
  const updateSettings = useLifeStore(s => s.updateSettings);
  const router = useRouter();
  const isMobile = useIsMobile();
  const dragControls = useDragControls();
  const achievements = useAchievements({ logs: loginLogs, streak: loginStreak });

  const unlocked = achievements.filter(a => a.check());
  const total = achievements.length;
  const completionRate = total > 0 ? Math.round((unlocked.length / total) * 100) : 0;
  const preview = unlocked.slice(0, 4);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');

  const memberSince = m.settings.createdAt
    ? new Date(m.settings.createdAt).getFullYear()
    : null;

  const startEdit = () => {
    setDraftName(m.settings.displayName || '');
    setDraftEmail(m.settings.email || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        displayName: draftName.trim(),
        email: draftEmail.trim(),
      });
      toast.success('Profile updated');
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close profile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] cursor-default bg-black/30 md:bg-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: isMobile ? 60 : 10, scale: isMobile ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isMobile ? 60 : 10, scale: isMobile ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 900) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[calc(100dvh-10rem)] w-full flex-col overflow-hidden rounded-t-2xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] shadow-[0_-4px_0px_0px_var(--neo-shadow)] md:inset-x-auto md:bottom-auto md:top-4 md:right-[17rem] md:max-h-[calc(100vh-2rem)] md:w-80 md:rounded-2xl md:shadow-[6px_6px_0px_0px_var(--neo-shadow)]"
      >
        <div
          className="mx-auto mt-3 mb-1 h-1.5 w-12 shrink-0 touch-none rounded-full bg-[#D8D2C8] md:hidden"
          style={{ cursor: 'grab' }}
          onPointerDown={(e) => dragControls.start(e)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-4 md:pb-4">

        {editing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold">Edit Profile</h3>
              <button onClick={() => setEditing(false)} aria-label="Cancel editing" className="neo-button p-1.5 bg-[#FFFDF8]"><X size={12} /></button>
            </div>
            <label className="block">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C5C5C]">Name</span>
              <input value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="Your name" className="neo-input w-full text-sm mt-1" />
            </label>
            <label className="block">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C5C5C]">Email</span>
              <input value={draftEmail} onChange={e => setDraftEmail(e.target.value)} placeholder="you@example.com" type="email" className="neo-input w-full text-sm mt-1" />
            </label>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving} className="neo-button flex-1 text-[11px] font-extrabold px-4 py-2 bg-[#CDEAC0] flex items-center justify-center gap-1.5 disabled:opacity-60">
                <Save size={12} /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="neo-button text-[11px] font-extrabold px-4 py-2 bg-[#FFFDF8]">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F7E8A4] border-[3px] border-[#2D2D2D] flex items-center justify-center text-sm font-extrabold flex-shrink-0">{initialsOf(m.settings.displayName)}</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold truncate">{m.settings.displayName || 'User'}</h3>
                <p className="text-[10px] text-[#5C5C5C] truncate flex items-center gap-1"><Mail size={10} className="flex-shrink-0" />{m.settings.email || 'No email set'}</p>
              </div>
              <button onClick={startEdit} aria-label="Edit profile" className="neo-button p-1.5 bg-[#F7E8A4] flex-shrink-0"><Pencil size={12} /></button>
              <button onClick={onClose} aria-label="Close profile" className="neo-button p-1.5 bg-[#FFFDF8] flex-shrink-0"><X size={12} /></button>
            </div>

            {memberSince && <p className="text-[9px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-3">Member since {memberSince}</p>}

            {!m.hydrated ? (
              <p className="text-[10px] font-bold text-[#5C5C5C] py-6 text-center">Loading your stats...</p>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[#F0ECE4] p-3 mb-3">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 flex-shrink-0">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FFFDF8" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#CDEAC0" strokeWidth="3" strokeDasharray={`${m.score}, 100`} strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#5C5C5C]">Productivity Score</p>
                    <p className="text-xl font-extrabold leading-none">{m.score}%</p>
                  </div>
                </div>

                <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#F7E8A4] p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Trophy size={13} />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Achievements</span>
                    </div>
                    <Link href="/achievements" onClick={onClose} className="text-[10px] font-extrabold flex items-center gap-0.5 underline decoration-2 underline-offset-2">
                      View all <ChevronRight size={11} />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span>{unlocked.length}/{total} unlocked</span>
                    <span>{completionRate}%</span>
                  </div>
                  <ProgressBar value={completionRate} color="#2D2D2D" height={8} showLabel={false} />
                  {preview.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {preview.map(a => {
                        const IconComp = a.icon;
                        return (
                          <div key={a.id} title={a.title} className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] bg-[#FFFDF8] flex items-center justify-center shadow-[1px_1px_0px_0px_var(--neo-shadow)]">
                            <IconComp size={15} />
                          </div>
                        );
                      })}
                      {unlocked.length > preview.length && (
                        <span className="text-[10px] font-extrabold text-[#5C5C5C]">+{unlocked.length - preview.length}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart3 size={13} />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C5C5C]">Activity</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MetricTile icon={CheckCircle2} label="Tasks Done" value={m.stats.tasksDone} sub={`${m.stats.tasksPending} pending`} color="#CDEAC0" />
                  <MetricTile icon={Target} label="Completion" value={`${m.stats.completionRate}%`} sub={`${m.stats.tasksTotal} total`} color="#B8D8F8" />
                  <MetricTile icon={Flame} label="Best Streak" value={`${m.stats.bestStreak}d`} sub="habit streak" color="#F8C8C8" />
                  <MetricTile icon={FlameIcon} label="Habits Today" value={`${m.habitsDone}/${m.habitsToday}`} sub={`${m.habitRate}% done`} color="#F7E8A4" />
                  <MetricTile icon={Trophy} label="Goals" value={`${m.goalsCompleted}/${m.stats.goalCategories.reduce((n, c) => n + c.count, 0)}`} sub={`${m.goalsAvg}% avg progress`} color="#DCCEF5" />
                  <MetricTile icon={BookOpen} label="Learning" value={`${m.learningAvg}%`} sub="avg progress" color="#B8D8F8" />
                  <MetricTile icon={NotebookPen} label="Journal" value={m.journalCount} sub="entries" color="#F7E8A4" />
                  <MetricTile icon={GraduationCap} label="Exams" value={m.upcomingExams} sub="upcoming" color="#F8C8C8" />
                </div>

                {m.assignmentsTotal > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-[#5C5C5C]">Assignments</span>
                      <span>{m.assignmentsDone}/{m.assignmentsTotal}</span>
                    </div>
                    <ProgressBar value={Math.round((m.assignmentsDone / m.assignmentsTotal) * 100)} color="#B8D8F8" height={8} showLabel={false} />
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-4 mb-2">
                  <User size={13} />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C5C5C]">Account</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { void exportAllData(); }} className="neo-button flex-1 text-[10px] font-extrabold px-3 py-2 bg-[#B8D8F8] flex items-center justify-center gap-1.5">
                    <Download size={12} /> Export
                  </button>
                  <button onClick={() => { onClose(); void logout(router); }} className="neo-button flex-1 text-[10px] font-extrabold px-3 py-2 bg-[#F8C8C8] flex items-center justify-center gap-1.5">
                    <LogOut size={12} /> Sign out
                  </button>
                </div>
              </>
            )}
          </>
        )}
        </div>
      </motion.div>
    </>
  );
}

function ProfilePopup({
  isOpen,
  onClose,
  loginLogs,
  loginStreak,
}: {
  isOpen: boolean;
  onClose: () => void;
  loginLogs: string[];
  loginStreak: number;
}) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && <ProfilePanel key="profile" onClose={onClose} loginLogs={loginLogs} loginStreak={loginStreak} />}
    </AnimatePresence>
  );
}


function SidebarContent({

  streak,

  loggedInToday,

  setShowStreak,
  onOpenProfile,

}: {

  streak: number;

  loggedInToday: boolean;

  setShowStreak: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenProfile: () => void;

}) {

  const pathname = usePathname();



  return (

    <>

      <header className="border-b [3px] solid #[2D2D2D] bg-[#FFFDF8] rounded-t-[20px] p-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-[#F7E8A4] flex items-center justify-center text-[2xl] font-bold flex-shrink-0">C</div>

          <div>

            <h1 className="text-xl font-extrabold leading-tight text-[#2A2A2A]">Commit</h1>

            <p className="text-sm text-[#5C5C5C] font-medium">Command Center</p>

          </div>

        </div>

      </header>



      <nav aria-label="Primary" className="overflow-y-auto flex-1 py-2 px-2 space-y-1">

        {navItems.map((item) => {

          const isActive = pathname === item.href;

          const Icon = item.icon;

          return (

            <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined} className="block">

              <motion.div

                whileHover={{ x: 2 }}

                whileTap={{ scale: 0.97 }}

                className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl border-[2px] transition-all duration-150 ${

                  isActive

                    ? 'tint-yellow bg-[#F7E8A4] border-[#2D2D2D] text-[#2A2A2A] shadow-[2px_2px_0px_0px_var(--neo-shadow)]'

                    : 'border-transparent text-[#5C5C5C] hover:text-[#2A2A2A] hover:bg-[#F0ECE4]'

                }`}

              >

                <Icon size={18} />

                <span className="text-sm font-medium">{item.label}</span>

              </motion.div>

            </Link>

          );

        })}

      </nav>



      <div className="p-4 border-t [3px] solid #[2D2D2D] rounded-b-[20px]">

        <button onClick={() => setShowStreak(true)} className="w-full rounded-xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] p-3 hover:bg-[#b8d8b0] transition-colors text-left">

          <div className="flex items-center gap-2">

            <FlameIcon size={16} />

            <p className="text-xs font-extrabold text-[#2A2A2A]">Daily Login</p>

          </div>

          <div className="flex items-center justify-between mt-1.5">

            <p className="text-xl font-extrabold text-[#2A2A2A]">{streak}d</p>

            <div className={`flex items-center gap-1 text-[10px] font-extrabold ${loggedInToday ? 'text-[#2A2A2A]' : 'text-[#B85042]'}`}>

              {loggedInToday ? <CheckCircle2 size={12} /> : <X size={12} />}

              <span>{loggedInToday ? 'Today' : 'Not yet'}</span>

            </div>

          </div>

        </button>

      </div>

      <div className="p-4 border-t [3px] solid #[2D2D2D]">
        <button
          onClick={onOpenProfile}
          className="w-full rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] p-3 hover:bg-[#e8d890] transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <User size={16} />
            <p className="text-xs font-extrabold text-[#2A2A2A]">Profile</p>
          </div>
        </button>
      </div>


    </>

  );

}



export default function Sidebar() {

  const { streak, loggedInToday, logs } = useLoginStreak();

  const [showStreak, setShowStreak] = useState(false);

  const profileOpen = useUIStore(s => s.profileOpen);

  const openProfile = useUIStore(s => s.openProfile);

  const closeProfile = useUIStore(s => s.closeProfile);



  useEffect(() => {

    if (!profileOpen) return;

    // Simple profile open - no drawer animation

    const onKey = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {

        closeProfile();

        return;

      }

    };

    window.addEventListener('keydown', onKey);

    return () => {

      window.removeEventListener('keydown', onKey);

    };

  }, [profileOpen, closeProfile]);



  return (

    <>

      {true && (

        <div className="fixed -z-10 pointer-events-none select-none">

          <div className="fixed pointer-events-none overflow-hidden opacity-25"

            style={{ width: '140vw', height: '100vh', left: '-50vw', top: 0 }}

          >

            <div className="flex items-center justify-center h-full w-full animate-spin-slow">

              <MandalaSVG />

            </div>

          </div>

        </div>

      )}



      {/* Mobile streak badge — scrolls with page */}

      {true && (

        <div className="md:hidden absolute top-4 right-4 z-50">

          <button onClick={() => setShowStreak(true)} aria-label={`Login streak: ${streak} day${streak === 1 ? '' : 's'}`} className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:bg-[#b8d8b0] transition-colors">

            <FlameIcon size={14} />

            <span className="text-xs font-extrabold">{streak}</span>

          </button>

        </div>

      )}



      {/* Profile popup */}

      <ProfilePopup isOpen={profileOpen} onClose={closeProfile} loginLogs={logs} loginStreak={streak} />



      {/* Streak popup */}

      <AnimatePresence>

        {showStreak && <StreakPopup logs={logs} streak={streak} onClose={() => setShowStreak(false)} />}

      </AnimatePresence>



      {/* Desktop sidebar - bottom bar */}

      <aside className="hidden md:flex flex-col border-[3px] border-[#2D2D2D] bg-[#FFFDF8] fixed right-2 top-2 bottom-2 w-64 z-40 rounded-[20px] shadow-[6px_6px_0px_0px_var(--neo-shadow)] tint-purple overflow-y-auto">

        <SidebarContent

          streak={streak}

          loggedInToday={loggedInToday}

          setShowStreak={setShowStreak}

          onOpenProfile={openProfile}

        />

      </aside>

    </>

  );

}
