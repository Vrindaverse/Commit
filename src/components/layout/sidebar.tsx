'use client';



import { usePathname } from 'next/navigation';

import { motion, AnimatePresence } from 'framer-motion';

import { useEffect, useRef, useState } from 'react';

import {

  LayoutDashboard, Target, CheckSquare, Rocket, BookOpen,

  GraduationCap, Flame, Trophy, BarChart3, Settings,

  NotebookPen, FlameIcon, X, Check, CheckCircle2, ChevronLeft, ChevronRight, Wallet, Menu,

} from 'lucide-react';

import { localDateKey } from '@/lib/date';



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

  const [mounted, setMounted] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);

  const [loggedInToday, setLoggedInToday] = useState(false);



  return { streak: 0, loggedInToday, logs };

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

  const weekRows: { day: number; date: string; logged: boolean; isToday: boolean }[][] = [];
  let currentRow: { day: number; date: string; logged: boolean; isToday: boolean }[] = [];
  cells.forEach((cell, i) => {
    if (currentRow.length === 7) {
      weekRows.push(currentRow);
      currentRow = [];
    }
    currentRow.push(cell);
    if (cells.length > 0 && i === cells.length - 1) {
      weekRows.push(currentRow);
    }
  });

  return (
    <div className="space-y-2">
      {weekRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((cell) => (
            <motion.div
              key={cell.day}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-sm border-[1.5px] border-[#2D2D2D] p-1.5 text-center text-[9px] font-bold transition-colors ${
                cell.isToday ? 'bg-[#F7E8A4]' : cell.logged ? "#B8D8F8" : 'bg-[#F0ECE4]'
              }`}
              style={{ backgroundColor: cell.logged ? "#B8D8F8" : '#F0ECE4' }}
            >
              {cell.logged && <Check size={8} strokeWidth={3} />}
              {cell.day}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}


function ProfilePopup({

  isOpen,

  onClose,

}: { isOpen: boolean; onClose: () => void }) {

  return (

    <AnimatePresence mode='wait'>

      <motion.div

        initial={{ opacity: 0, y: 10 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -10 }}

        className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-[#FFFDF8] border-t-[2px] border-[#2D2D2D] rounded-xl p-4 w-64 shadow-[2px_2px_0px_0px_var(--neo-shadow)] min-h-[200px]"

      >

        <h3 className="text-sm font-extrabold mb-3">Profile</h3>

        <div className="space-y-3">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-[#F7E8A4] flex items-center justify-center text-[2xl] font-bold">C</div>

            <div>

              <h4 className="font-extrabold text-[12px]">Username</h4>

              <p className="text-[10px] text-[#5C5C5C]">Member since 2024</p>

            </div>

          </div>

          <button onClick={onClose} className="neo-button w-full text-[10px] font-extrabold px-4 py-2 bg-[#2D2D2D] text-[#FFFDF8]">Close</button>

        </div>

      </motion.div>

    </AnimatePresence>

  );

}



function SidebarContent({

  streak,

  loggedInToday,

  logs,

  showStreak,

  setShowStreak,

}: {

  streak: number;

  loggedInToday: boolean;

  logs: string[];

  showStreak: boolean;

  setShowStreak: React.Dispatch<React.SetStateAction<boolean>>;

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

            <motion.div

              whileHover={{ x: 2 }}

              whileTap={{ scale: 0.97 }}

              key={item.href}

              className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl border-[2px] transition-all duration-150 ${

                isActive

                  ? 'tint-yellow bg-[#F7E8A4] border-[#2D2D2D] text-[#2A2A2A] shadow-[2px_2px_0px_0px_var(--neo-shadow)]'

                  : 'border-transparent text-[#5C5C5C] hover:text-[#2A2A2A] hover:bg-[#F0ECE4]'

            }`}

            >

              <Icon size={18} />

              <span className="text-sm font-medium">{item.label}</span>

            </motion.div>

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

            <p className="text-xl font-extrabold text-[#2A2A2A]">0d</p>

            <div className={`flex items-center gap-1 text-[10px] font-extrabold ${loggedInToday ? 'text-[#2A2A2A]' : 'text-[#B85042]'}`}>

              {loggedInToday ? <CheckCircle2 size={12} /> : <X size={12} />}

              <span>{loggedInToday ? 'Today' : 'Not yet'}</span>

            </div>

          </div>

        </button>

      </div>



      <AnimatePresence>

        {showStreak && <StreakPopup logs={logs} streak={streak} onClose={() => setShowStreak(false)} />}

      </AnimatePresence>

    </>

  );

}



export default function Sidebar() {

  const { streak, loggedInToday, logs } = useLoginStreak();

  const [showStreak, setShowStreak] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();



  // Close the drawer whenever the route changes (links, back button, etc.).

  useEffect(() => {

    setProfileOpen(false);

  });



  useEffect(() => {

    if (!profileOpen) return;

    // Simple profile open - no drawer animation

    const onKey = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {

        setProfileOpen(false);

        return;

      }

    };

    window.addEventListener('keydown', onKey);

    return () => {

      window.removeEventListener('keydown', onKey);

    };

  }, [profileOpen]);



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

          <button onClick={() => setShowStreak(true)} aria-label="Login streak: 0 day" className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:bg-[#b8d8b0] transition-colors">

            <FlameIcon size={14} />

            <span className="text-xs font-extrabold">0</span>

          </button>

        </div>

      )}



      {/* Mobile avatar — opens profile popup */}

      {true && (

        <div className="md:hidden top-4 left-4 z-40">

          <button

            onClick={() => setProfileOpen(true)}

            aria-label="Open profile"

            className="relative rounded-full w-10 h-10 bg-[#CDEAC0] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:bg-[#b8d8b0] transition-colors">

            <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center text-[2xl] font-bold">C</div>

          </button>

        </div>

      )}



      {/* Profile popup */}

      {profileOpen && <ProfilePopup isOpen={profileOpen} onClose={() => setProfileOpen(false)} />}



      {/* Desktop sidebar - bottom bar */}

      <aside className="hidden md:flex flex-col border-[3px] border-[#2D2D2D] bg-[#FFFDF8] fixed right-0 top-0 bottom-0 w-64 z-40 rounded-[20px] shadow-[6px_6px_0px_0px_var(--neo-shadow)] tint-purple overflow-y-auto">

        <SidebarContent

          streak={streak}

          loggedInToday={loggedInToday}

          logs={logs}

          showStreak={showStreak}

          setShowStreak={setShowStreak}

        />

      </aside>

    </>

  );

}
