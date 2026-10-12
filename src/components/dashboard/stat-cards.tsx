'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Target } from 'lucide-react';

interface StatCardsProps {
  tasksDone: number;
  activeGoals: number;
  bestStreak: number;
  completionRate: number;
}

export default function StatCards({ tasksDone, activeGoals, bestStreak, completionRate }: StatCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06, ease: 'easeOut' }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #CDEAC0' }}>
        <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#CDEAC0' }}>
          <CheckCircle2 size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Tasks Done</p>
          <p className="text-xl font-extrabold">{tasksDone}</p>
        </div>
      </div>
      <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #F7E8A4' }}>
        <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F7E8A4' }}>
          <Target size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Active Goals</p>
          <p className="text-xl font-extrabold">{activeGoals}</p>
        </div>
      </div>
      <div className="neo-card p-4 flex items-center gap-3" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #F8C8C8' }}>
        <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F8C8C8' }}>
          <Flame size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">Best Streak</p>
          <p className="text-xl font-extrabold">{bestStreak}</p>
        </div>
      </div>
      <div className="neo-card p-4" style={{ borderColor: '#2D2D2D', boxShadow: '4px 4px 0px 0px #B8D8F8' }}>
        <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Completion</p>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 36 36" className="w-11 h-11 flex-shrink-0">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F0ECE4" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#B8D8F8" strokeWidth="3" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" />
          </svg>
          <span className="text-xl font-extrabold">{completionRate}%</span>
        </div>
      </div>
    </motion.div>
  );
}
