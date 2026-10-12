'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/shared/progress-bar';
import type { Goal } from '@/types';
import { slideUp, stagger } from './motion';

export interface GoalCategoryCount {
  label: string;
  count: number;
  color: string;
}

interface GoalProgressProps {
  goals: Goal[];
  categories: GoalCategoryCount[];
  onOpen: () => void;
}

export default function GoalProgress({ goals, categories, onOpen }: GoalProgressProps) {
  const visibleGoals = goals.slice(0, 4);
  return (
    <NeoCard color="#CDEAC0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] flex items-center justify-center"><Trophy size={18} /></div>
          <h2 className="text-lg font-extrabold">Goal Progress</h2>
        </div>
        <Button onClick={onOpen} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1 min-h-[44px] sm:min-h-6">
          View All <ArrowRight size={12} />
        </Button>
      </div>
      {goals.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          {categories.filter(c => c.count > 0).map(c => (
            <span key={c.label} className="text-xs font-bold px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: c.color }}>
              {c.label} ({c.count})
            </span>
          ))}
        </motion.div>
      )}
      {visibleGoals.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleGoals.map(g => (
            <motion.div key={g.id} variants={slideUp} className="p-4 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: g.color }} />
                <span className="text-xs font-bold truncate">{g.title}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#5C5C5C] uppercase">{g.category.replace('-', ' ')}</span>
                <span className="text-sm font-extrabold">{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} color={g.color} height={8} showLabel={false} />
              <span className="text-xs font-medium text-[#5C5C5C] mt-2 block">
                {g.milestones.filter(m => m.completed).length}/{g.milestones.length} milestones
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="col-span-2 text-center py-8"><p className="text-sm text-[#5C5C5C] font-medium">No goals yet.</p></div>
      )}
    </NeoCard>
  );
}
