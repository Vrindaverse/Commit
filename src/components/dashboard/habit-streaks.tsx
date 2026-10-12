'use client';

import { motion } from 'framer-motion';
import { BookOpen, Code, Dumbbell, Flame, Heart, Droplet } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import type { Habit } from '@/types';
import { slideRight, stagger } from './motion';

const habitIcons: Record<string, React.ReactNode> = {
  Coding: <Code size={14} />,
  Reading: <BookOpen size={14} />,
  Workout: <Dumbbell size={14} />,
  Meditation: <Heart size={14} />,
  'Water Intake': <Droplet size={14} />,
};

interface HabitStreaksProps {
  habits: Habit[];
}

export default function HabitStreaks({ habits }: HabitStreaksProps) {
  return (
    <NeoCard color="#F8C8C8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F8C8C8] flex items-center justify-center"><Flame size={18} /></div>
        <h3 className="text-sm font-extrabold">Habit Streaks</h3>
      </div>
      {habits.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-1.5">
          {habits.map(h => (
            <motion.div key={h.id} variants={slideRight}
              className="flex items-center justify-between p-2.5 min-h-[44px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: h.color }}>
                  {habitIcons[h.name] || <Flame size={14} />}
                </div>
                <span className="text-xs font-bold">{h.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-[#F8C8C8]" />
                <span className="text-sm font-extrabold">{h.streak}d</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-xs text-[#5C5C5C] text-center py-4">No habits yet.</p>
      )}
    </NeoCard>
  );
}
