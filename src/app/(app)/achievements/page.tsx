'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star, Medal, type LucideIcon } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { useAchievements } from '@/lib/achievements';

const categoryConfig: Record<string, { label: string; color: string }> = {
  Productivity: { label: 'Productivity', color: '#F8C8C8' },
  Coding: { label: 'Coding', color: '#B8D8F8' },
  Goals: { label: 'Goals', color: '#FFD8BE' },
  Habits: { label: 'Habits', color: '#F7E8A4' },
  Wellness: { label: 'Wellness', color: '#E8D0F8' },
  Projects: { label: 'Projects', color: '#F8D8E8' },
  Learning: { label: 'Learning', color: '#C8F0E8' },
  Journal: { label: 'Journal', color: '#FFF0C0' },
  Academics: { label: 'Academics', color: '#D0E8F8' },
  Login: { label: 'Login', color: '#CDEAC0' },
  Special: { label: 'Special', color: '#F0ECE4' },
};

const iconCache = new Map<string, React.ReactNode>();

function getIcon(Icon: LucideIcon, title: string) {
  const key = title;
  if (!iconCache.has(key)) {
    iconCache.set(key, <Icon size={22} />);
  }
  return iconCache.get(key);
}

function AchievementCard({ achievement, index }: { achievement: { id: string; title: string; description: string; icon: LucideIcon; category: string; unlocked: boolean; date: string }; index: number }) {
  const cat = categoryConfig[achievement.category] || { label: achievement.category, color: '#F0ECE4' };

  if (!achievement.unlocked) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
        <div className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-3 opacity-45 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center justify-center mb-2">
              <Lock size={18} className="text-[#5C5C5C]" />
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] mb-1">{cat.label}</span>
            <h3 className="text-[11px] font-extrabold text-[#5C5C5C]">{achievement.title}</h3>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
    >
      <div className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-3 shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[5px_5px_0px_0px_var(--neo-shadow)] transition-all duration-150">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: index * 0.04 }}
            className="w-12 h-12 rounded-xl border-[2px] border-[#2D2D2D] flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
            style={{ backgroundColor: cat.color }}
          >
            {getIcon(achievement.icon, achievement.title)}
          </motion.div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] mb-1">{cat.label}</span>
          <h3 className="text-[11px] font-extrabold text-[#2A2A2A] leading-tight">{achievement.title}</h3>
          <p className="text-[8px] text-[#5C5C5C] font-medium mt-0.5 leading-tight">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const defs = useAchievements();
  const computed = useMemo(() => defs.map(d => ({
    ...d,
    unlocked: d.check(),
    date: d.check() ? d.getDate() : '',
  })), [defs]);

  const unlocked = computed.filter(a => a.unlocked);
  const locked = computed.filter(a => !a.unlocked);
  const completionRate = Math.round((unlocked.length / computed.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description={`${unlocked.length}/${computed.length} unlocked`}
        icon={<Trophy size={20} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { label: 'Earned', value: unlocked.length, icon: <Trophy size={14} />, color: '#F7E8A4' },
          { label: 'Complete', value: `${completionRate}%`, icon: <Medal size={14} />, color: '#CDEAC0' },
          { label: 'To Go', value: locked.length, icon: <Star size={14} />, color: '#B8D8F8' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-[3px] border-[#2D2D2D] shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
            style={{ backgroundColor: stat.color }}
          >
            {stat.icon}
            <div>
              <span className="text-lg font-extrabold text-[#2A2A2A]">{stat.value}</span>
              <span className="text-[11px] font-bold text-[#5C5C5C] ml-1 uppercase text-[10px]">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full h-3 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] overflow-hidden"
      >
        <motion.div
          className="h-full rounded-full bg-[#2D2D2D]"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
      </motion.div>

      <div>
        <h2 className="text-lg font-extrabold mb-3">Unlocked ({unlocked.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {unlocked.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
          {unlocked.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm font-medium text-[#5C5C5C]">
              No achievements yet. Start using Commit to earn your first one!
            </div>
          )}
        </div>
      </div>

      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold mb-3 text-[#5C5C5C]">Locked ({locked.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {locked.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
