'use client';

import { motion } from 'framer-motion';
import { BookOpen, Layers, ListChecks, Rocket, Target, Zap } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { slideRight, stagger } from './motion';
import type { GoalCategoryCount } from './goal-progress';

interface QuickOverviewProps {
  pendingTasks: number;
  totalTasks: number;
  projects: number;
  learningPaths: number;
  categories: GoalCategoryCount[];
  hasGoals: boolean;
}

export default function QuickOverview({
  pendingTasks, totalTasks, projects, learningPaths, categories, hasGoals,
}: QuickOverviewProps) {
  return (
    <NeoCard color="#F7E8A4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center"><Layers size={18} /></div>
        <h3 className="text-sm font-extrabold">Quick Overview</h3>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
        {[
          { label: 'Pending Tasks', value: pendingTasks, icon: ListChecks },
          { label: 'Total Tasks', value: totalTasks, icon: Zap },
          { label: 'Projects', value: projects, icon: Rocket },
          { label: 'Learning Paths', value: learningPaths, icon: BookOpen },
        ].map((s, i) => (
          <motion.div key={i} variants={slideRight}
            className="flex items-center justify-between p-2.5 min-h-[44px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
          >
            <div className="flex items-center gap-2">
              <s.icon size={14} />
              <span className="text-xs font-bold text-[#5C5C5C]">{s.label}</span>
            </div>
            <span className="text-sm font-extrabold">{s.value}</span>
          </motion.div>
        ))}
        {hasGoals && (
          <motion.div variants={slideRight}
            className="flex items-center gap-2 p-2.5 min-h-[44px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
          >
            <Target size={14} />
            <span className="text-xs font-bold text-[#5C5C5C]">Goal Split</span>
            <div className="flex gap-0.5 ml-auto">
              {categories.filter(c => c.count > 0).map(c => (
                <span key={c.label} className="text-xs font-bold px-1.5 py-0.5 rounded border-[1.5px] border-[#2D2D2D]" style={{ backgroundColor: c.color }}>
                  {c.count}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </NeoCard>
  );
}
