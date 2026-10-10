'use client';

import { useMemo, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, Flame, CheckSquare } from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore } from '@/store/use-store';

const AnalyticsCharts = dynamic(() => import('@/components/analytics/analytics-charts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="neo-card p-5 h-[320px] animate-pulse bg-[#F0ECE4]/40" />
      ))}
    </div>
  ),
});

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function StatCard({ label, value, icon, color, index }: { label: string; value: number | string; icon: React.ReactNode; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-4 flex items-center gap-3 shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[5px_5px_0px_0px_var(--neo-shadow)] hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#5C5C5C] font-medium">{label}</p>
        <p className="text-xl font-extrabold">{value}</p>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const habits = useLifeStore(s => s.habits);
  const learningPaths = useLifeStore(s => s.learningPaths);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const goalsHit = goals.filter(g => g.progress >= 100).length;
    const habitsKept = habits.filter(h => h.streak > 0).length;
    const focusHours = totalTasks * 2;
    return { totalTasks, completedTasks, goalsHit, habitsKept, focusHours };
  }, [tasks, goals, habits]);

  const productivityTrend = useMemo(() => {
    const counts: Record<string, number> = {};
    DAYS.forEach(d => { counts[d] = 0; });
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    tasks.forEach(t => {
      const d = new Date(t.dueDate);
      if (d >= weekStart && d <= now) {
        const day = DAYS[d.getDay()];
        counts[day] += t.status === 'done' ? 2.5 : 1;
      }
    });
    return DAYS.map(d => ({ day: d, hours: counts[d] }));
  }, [tasks]);

  const goalCompletion = useMemo(() => {
    const groups: Record<string, { completed: number; total: number }> = {};
    goals.forEach(g => {
      const m = MONTHS[new Date(g.deadline).getMonth()];
      if (!groups[m]) groups[m] = { completed: 0, total: 0 };
      groups[m].total++;
      if (g.progress >= 100) groups[m].completed++;
    });
    return Object.entries(groups).map(([month, v]) => ({ month, ...v }));
  }, [goals]);

  const learningHours = useMemo(() => {
    const groups: Record<string, number> = {};
    learningPaths.forEach(lp => {
      const m = MONTHS[new Date().getMonth()];
      if (!groups[m]) groups[m] = 0;
      groups[m] += lp.modules.filter(m => m.completed).length * 5;
    });
    const months = MONTHS.slice(0, new Date().getMonth() + 1);
    return months.map(m => ({ month: m, hours: groups[m] || 0 }));
  }, [learningPaths]);

  const weeklyDistribution = useMemo(() => {
    const counts: Record<string, { tasks: number; completed: number }> = {};
    DAYS.forEach(d => { counts[d] = { tasks: 0, completed: 0 }; });
    tasks.forEach(t => {
      const day = DAYS[new Date(t.dueDate).getDay()];
      if (counts[day]) {
        counts[day].tasks++;
        if (t.status === 'done') counts[day].completed++;
      }
    });
    return DAYS.map(d => ({ day: d, tasks: counts[d].tasks, completed: counts[d].completed }));
  }, [tasks]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
        <PageHeader title="Analytics" description="Track your productivity and progress over time" icon={<BarChart3 size={20} />} />
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Focus Hours" value={mounted ? stats.focusHours : 0} icon={<Clock size={18} />} color="#B8D8F8" index={0} />
        <StatCard label="Tasks Done" value={mounted ? stats.completedTasks : 0} icon={<CheckSquare size={18} />} color="#CDEAC0" index={1} />
        <StatCard label="Goals Hit" value={mounted ? stats.goalsHit : 0} icon={<Target size={18} />} color="#F7E8A4" index={2} />
        <StatCard label="Habits Kept" value={mounted ? stats.habitsKept : 0} icon={<Flame size={18} />} color="#F8C8C8" index={3} />
      </div>

      <AnalyticsCharts
        productivityTrend={productivityTrend}
        learningHours={learningHours}
        goalCompletion={goalCompletion}
        habits={habits.map(h => ({ habit: h.name, streak: h.streak }))}
        weeklyDistribution={weeklyDistribution}
      />
    </motion.div>
  );
}
