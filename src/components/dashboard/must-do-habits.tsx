'use client';

import { CheckCircle2, Star } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { habitCountOn } from '@/lib/habits';
import type { Habit } from '@/types';

interface MustDoHabitsProps {
  habits: Habit[];
  doneCount: number;
  todayKey: string;
  onToggle: (id: string) => void;
}

export default function MustDoHabits({ habits, doneCount, todayKey, onToggle }: MustDoHabitsProps) {
  if (habits.length === 0) return null;

  return (
    <NeoCard color="#F8C8C8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F8C8C8] flex items-center justify-center"><Star size={18} /></div>
        <div>
          <h3 className="text-sm font-extrabold">Must-Do Today</h3>
          <p className="text-[10px] font-bold text-[#5C5C5C]">{doneCount}/{habits.length} compulsory habits done</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {habits.map(h => {
          const done = habitCountOn(h.logs, todayKey) > 0;
          return (
            <button
              key={h.id}
              onClick={() => onToggle(h.id)}
              aria-pressed={done}
              className="flex items-center gap-3 w-full text-left p-2.5 min-h-[44px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] transition-colors"
            >
              <span className="w-6 h-6 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: done ? '#CDEAC0' : h.color }}>
                {done && <CheckCircle2 size={14} />}
              </span>
              <span className="text-xs font-bold flex-1 min-w-0 truncate">{h.name}</span>
              <span className={`text-[10px] font-extrabold ${done ? 'text-[#4C8C4A]' : 'text-[#5C5C5C]'}`}>{done ? 'Done' : 'Not done'}</span>
            </button>
          );
        })}
      </div>
    </NeoCard>
  );
}
