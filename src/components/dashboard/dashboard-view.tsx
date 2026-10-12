'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLifeStore } from '@/store/use-store';
import { computeDashboardStats, type DashboardDataset, type DashboardStats } from '@/lib/dashboard-stats';
import { localDateKey } from '@/lib/date';
import type { MotivationalQuote } from '@/lib/motivationalQuotes';
import ActiveProjects from './active-projects';
import DashboardHeader from './dashboard-header';
import FinanceCard from './finance-card';
import FocusToday from './focus-today';
import GoalProgress from './goal-progress';
import HabitStreaks from './habit-streaks';
import LearningCard from './learning-card';
import MustDoHabits from './must-do-habits';
import QuickOverview from './quick-overview';
import StatCards from './stat-cards';
import WeeklyActivity from './weekly-activity';

interface DashboardViewProps {
  /** Data fetched on the server, used until the client store hydrates. */
  initialData: DashboardDataset;
  /** Stats computed on the server, used until the client store hydrates. */
  initialStats: DashboardStats;
  currency: string;
  quote: MotivationalQuote;
}

export default function DashboardView({ initialData, initialStats, currency: initialCurrency, quote }: DashboardViewProps) {
  const router = useRouter();

  const hydrated = useLifeStore(s => s.hydrated);
  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const projects = useLifeStore(s => s.projects);
  const habits = useLifeStore(s => s.habits);
  const learningPaths = useLifeStore(s => s.learningPaths);
  const expenses = useLifeStore(s => s.expenses);
  const loans = useLifeStore(s => s.loans);
  const currency = useLifeStore(s => s.settings.currency);
  const updateTask = useLifeStore(s => s.updateTask);
  const toggleHabitLog = useLifeStore(s => s.toggleHabitLog);

  const dataset = useMemo<DashboardDataset>(
    () => (hydrated ? { tasks, goals, projects, habits, learningPaths, expenses, loans } : initialData),
    [hydrated, tasks, goals, projects, habits, learningPaths, expenses, loans, initialData],
  );

  // Recomputes the (potentially expensive) derived values only when inputs change.
  const stats = useMemo<DashboardStats>(
    () => (hydrated ? computeDashboardStats(dataset) : initialStats),
    [hydrated, dataset, initialStats],
  );

  const activeCurrency = hydrated ? currency : initialCurrency;

  const handleCompleteTask = useCallback(
    (id: string) => { void updateTask(id, { status: 'done' }); },
    [updateTask],
  );
  const handleToggleHabit = useCallback(
    (id: string) => { void toggleHabitLog(id, localDateKey()); },
    [toggleHabitLog],
  );

  return (
    <div className="space-y-8 relative">
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#2D2D2D 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      />
      <DashboardHeader greeting={stats.greeting} todayLabel={stats.todayLabel} quote={quote} />

      <StatCards
        tasksDone={stats.tasksDone}
        activeGoals={dataset.goals.length}
        bestStreak={stats.bestStreak}
        completionRate={stats.completionRate}
      />

      <FinanceCard
        finance={stats.finance}
        monthLabel={stats.monthLabel}
        currency={activeCurrency}
        onOpen={() => router.push('/expenses')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FocusToday
            tasks={stats.topTasks}
            onComplete={handleCompleteTask}
            onOpen={() => router.push('/tasks')}
          />

          <GoalProgress
            goals={dataset.goals}
            categories={stats.goalCategories}
            onOpen={() => router.push('/goals')}
          />

          <ActiveProjects projects={dataset.projects} onOpen={() => router.push('/projects')} />
        </div>

        <div className="space-y-6">
          <WeeklyActivity
            weeklyData={stats.weeklyData}
            maxWeeklyTasks={stats.maxWeeklyTasks}
            trendPoints={stats.trendPoints}
            trendArea={stats.trendArea}
          />

          <MustDoHabits
            habits={stats.compulsoryHabits}
            doneCount={stats.compulsoryDone}
            todayKey={stats.todayKey}
            onToggle={handleToggleHabit}
          />

          <HabitStreaks habits={dataset.habits} />

          <LearningCard learningPaths={dataset.learningPaths} onOpen={() => router.push('/learning')} />

          <QuickOverview
            pendingTasks={stats.tasksPending}
            totalTasks={stats.tasksTotal}
            projects={dataset.projects.length}
            learningPaths={dataset.learningPaths.length}
            categories={stats.goalCategories}
            hasGoals={dataset.goals.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
