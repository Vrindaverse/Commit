'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';

interface WeeklyActivityProps {
  weeklyData: { day: string; tasks: number; completed: number }[];
  maxWeeklyTasks: number;
  trendPoints: string;
  trendArea: string;
}

export default function WeeklyActivity({ weeklyData, maxWeeklyTasks, trendPoints, trendArea }: WeeklyActivityProps) {
  return (
    <NeoCard color="#B8D8F8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#B8D8F8] flex items-center justify-center"><Activity size={18} /></div>
          <h3 className="text-sm font-extrabold">Weekly Activity</h3>
        </div>
        <motion.svg initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
          viewBox="0 0 120 32" className="w-20 h-6"
        >
          <polygon points={trendArea} fill="#B8D8F840" />
          <polyline points={trendPoints} fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
      <div className="flex items-end justify-between gap-1.5 h-28 pt-4">
        {weeklyData.map(d => {
          const height = (d.tasks / maxWeeklyTasks) * 100;
          const completedHeight = d.tasks > 0 ? (d.completed / d.tasks) * height : 0;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <motion.div
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                className="w-full relative rounded-md overflow-hidden origin-bottom"
                style={{ height: `${height}%`, backgroundColor: '#F0ECE4' }}
              >
                <motion.div
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                  className="absolute bottom-0 w-full rounded-md origin-bottom"
                  style={{ height: `${completedHeight}%`, backgroundColor: '#B8D8F8' }}
                />
              </motion.div>
              <span className="text-xs font-bold text-[#5C5C5C]">{d.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-[#5C5C5C]">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#B8D8F8]" /> Done</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0ECE4]" /> Total</div>
      </div>
    </NeoCard>
  );
}
