'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, X, Check, CalendarDays, Sparkles, TrendingUp, ChevronLeft, ChevronRight, BarChart3, Grid3x3, Star, Sun, CircleDot } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore, genId } from '@/store/use-store';
import type { Habit, HabitCategory } from '@/types';

const HabitChart = dynamic(() => import('@/components/charts/habit-chart'), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-xl bg-[#F0ECE4]/40 animate-pulse" />,
});

const colorOptions = ['#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#F7E8A4', '#FFD8BE'];

const HABIT_CATEGORIES: { key: HabitCategory; label: string; hint: string; color: string; icon: React.ReactNode }[] = [
  { key: 'compulsory', label: 'Compulsory', hint: 'Must do every day', color: '#F8C8C8', icon: <Star size={12} /> },
  { key: 'when-free', label: 'When free', hint: 'Do it if time allows', color: '#F7E8A4', icon: <Sun size={12} /> },
  { key: 'other', label: 'Other', hint: 'Anything else', color: '#DCCEF5', icon: <CircleDot size={12} /> },
];

const CATEGORY_META = Object.fromEntries(HABIT_CATEGORIES.map(c => [c.key, c])) as Record<HabitCategory, (typeof HABIT_CATEGORIES)[number]>;

function HabitCategoryBadge({ category, className = '' }: { category?: HabitCategory; className?: string }) {
  const meta = CATEGORY_META[category ?? 'other'] ?? CATEGORY_META.other;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border-[2px] border-[#2D2D2D] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#2A2A2A] ${className}`}
      style={{ backgroundColor: meta.color }}
    >
      {meta.icon} {meta.label}
    </span>
  );
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function calcRate(logs: { date: string; count: number }[], days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const recent = logs.filter(l => {
    const d = new Date(l.date);
    return d >= cutoff && d <= new Date();
  });
  if (recent.length === 0) return 0;
  const done = recent.filter(l => l.count > 0).length;
  return Math.round((done / recent.length) * 100);
}

function generateLogs(days: number): { date: string; count: number }[] {
  const logs: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    logs.push({ date: date.toISOString().split('T')[0], count: 0 });
  }
  return logs;
}

const CATEGORY_ORDER: HabitCategory[] = ['compulsory', 'when-free', 'other'];

function TodayCheckIn({ habits }: { habits: Habit[] }) {
  const toggleHabitLog = useLifeStore(s => s.toggleHabitLog);
  const today = todayKey();
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  const rows = [...habits].sort((a, b) => CATEGORY_ORDER.indexOf(a.category ?? 'other') - CATEGORY_ORDER.indexOf(b.category ?? 'other'));
  const isDone = (h: Habit) => (h.logs.find(l => l.date === today)?.count ?? 0) > 0;
  const doneCount = habits.filter(isDone).length;
  const allDone = habits.length > 0 && doneCount === habits.length;

  const toggleAll = () => {
    habits.forEach(h => {
      const done = isDone(h);
      if (allDone ? done : !done) toggleHabitLog(h.id, today);
    });
  };

  return (
    <NeoCard color="#CDEAC0" className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-extrabold flex items-center gap-2">
            <Check size={16} /> Today&apos;s Check-in
          </h2>
          <p className="text-[11px] font-bold text-[#5C5C5C]">{dateLabel} · {doneCount}/{habits.length} done</p>
        </div>
        <button
          onClick={toggleAll}
          className={`neo-button px-3 py-2 text-xs font-extrabold flex items-center gap-1.5 ${allDone ? 'bg-[#FFFDF8]' : 'bg-[#F7E8A4]'}`}
        >
          {allDone ? <X size={13} /> : <Check size={13} />} {allDone ? 'Unmark all' : 'Mark all done'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {rows.map(h => {
          const done = isDone(h);
          return (
            <button
              key={h.id}
              onClick={() => toggleHabitLog(h.id, today)}
              aria-pressed={done}
              className="flex items-center gap-3 w-full text-left p-2.5 min-h-[48px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-[#CDEAC0]' : ''}`}
                style={{ backgroundColor: done ? '#CDEAC0' : h.color }}
              >
                {done && <Check size={14} />}
              </div>
              <span className="text-xs font-bold flex-1 min-w-0 truncate">{h.name}</span>
              <HabitCategoryBadge category={h.category} />
            </button>
          );
        })}
      </div>
    </NeoCard>
  );
}

const CELL_SIZE = 18;
const CELL_GAP = 3;
const COL_W = CELL_SIZE + CELL_GAP;

function ContributionGrid({
  habitId, logs, color, lookback,
}: {
  habitId: string; logs: { date: string; count: number }[]; color: string; lookback: number;
}) {
  const toggleHabitLog = useLifeStore(s => s.toggleHabitLog);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookback);

  const logMap = new Map(logs.map(l => [l.date, l]));
  const filtered: { date: string; count: number }[] = [];
  const cursor = new Date(cutoff);
  while (cursor <= today) {
    const key = cursor.toISOString().split('T')[0];
    filtered.push(logMap.get(key) || { date: key, count: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  filtered.forEach((log) => {
    const dayOfWeek = new Date(log.date).getDay();
    if (currentWeek.length === 0 && dayOfWeek > 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', count: -1 });
      }
    }
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(log);
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1 });
    }
    weeks.push(currentWeek);
  }

  const monthLabels: { label: string; count: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week) => {
    const midDate = week.find(l => l.date && l.count >= 0) || null;
    if (midDate) {
      const m = new Date(midDate.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ label: new Date(midDate.date).toLocaleString('default', { month: 'short' }), count: 1 });
        lastMonth = m;
      } else if (monthLabels.length > 0) {
        monthLabels[monthLabels.length - 1].count++;
      }
    }
  });

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const todayDone = (logs.find(l => l.date === todayStr)?.count ?? 0) > 0;
  const todayDateLabel = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-extrabold text-[#5C5C5C] uppercase tracking-wide">Today · {todayDateLabel}</span>
        <button
          onClick={() => toggleHabitLog(habitId, todayStr)}
          aria-pressed={todayDone}
          className={`neo-button px-2.5 py-1 text-[10px] font-extrabold flex items-center gap-1 ${todayDone ? 'bg-[#CDEAC0]' : 'bg-[#FFFDF8]'}`}
        >
          {todayDone ? <Check size={11} /> : <Plus size={11} />} {todayDone ? 'Done today' : 'Mark today'}
        </button>
      </div>
      <div className="flex ml-9 mb-0.5 text-[10px] font-extrabold text-[#5C5C5C] select-none">
        {monthLabels.map((m, i) => (
          <div key={i} style={{ width: m.count * COL_W - CELL_GAP }}>{m.label}</div>
        ))}
      </div>
      <div className="flex overflow-x-auto pb-1">
        <div className="flex flex-col gap-[3px] mr-[5px] flex-shrink-0">
          {dayLabels.map((label, i) => (
            <div key={i} style={{ height: CELL_SIZE }} className="flex items-center justify-end text-[10px] font-extrabold text-[#5C5C5C] pr-2 select-none leading-none">
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[2px]">
          {weeks.length === 0 ? (
            <div className="flex items-center h-28 px-6 text-xs text-[#5C5C5C] font-medium">No data for this period</div>
          ) : (
            weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((log, di) => {
                  if (!log || log.count === -1) return <div key={di} style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
                  const dateObj = new Date(log.date);
                  const isFuture = dateObj > today;
                  const isToday = log.date === todayStr;
                  const isDone = log.count > 0;

                  let bg: string;
                  if (isFuture) bg = '#F0ECE4';
                  else if (isToday && isDone) bg = '#CDEAC0';
                  else if (isToday) bg = '#F7E8A4';
                  else if (isDone) bg = color;
                  else bg = '#F0ECE4';

                  return (
                    <motion.button
                      key={di}
                      whileHover={isFuture ? undefined : { scale: 1.3 }}
                      whileTap={isFuture ? undefined : { scale: 0.85 }}
                      onClick={() => { if (!isFuture) toggleHabitLog(habitId, log.date); }}
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: bg,
                        opacity: isFuture ? 0.25 : isDone ? 1 : 0.45,
                        cursor: isFuture ? 'default' : 'pointer',
                      }}
                      className="rounded-sm border-[1.5px] border-[#2D2D2D] transition-colors flex items-center justify-center text-[#2D2D2D]"
                      title={isFuture ? '' : `${log.date}: ${isDone ? 'Done' : 'Missed'}${isToday ? ' (today)' : ''}`}
                    >
                      {isToday && isDone && <Check size={11} strokeWidth={3} />}
                    </motion.button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function HabitCalendar({ habits }: { habits: { id: string; name: string; color: string; logs: { date: string; count: number }[] }[] }) {
  const toggleHabitLog = useLifeStore(s => s.toggleHabitLog);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayLabel = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(todayStr);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const habitMap: Record<number, { id: string; name: string; color: string; done: boolean }[]> = {};
  habits.forEach(h => {
    h.logs.forEach(l => {
      const d = new Date(l.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!habitMap[day]) habitMap[day] = [];
        habitMap[day].push({ id: h.id, name: h.name, color: h.color, done: l.count > 0 });
      }
    });
  });

  const dayHabits = selectedDay ? habitMap[Number(selectedDay.split('-')[2])] || [] : [];

  const todayHabits = habits.map(h => ({
    id: h.id,
    name: h.name,
    color: h.color,
    done: (h.logs.find(l => l.date === todayStr)?.count ?? 0) > 0,
  }));

  const activeRows = selectedDay === todayStr ? todayHabits : dayHabits;

  const isHabitDone = (h: { logs: { date: string; count: number }[] }, dateStr: string) =>
    (h.logs.find(l => l.date === dateStr)?.count ?? 0) > 0;
  const allDoneForDay = (dateStr: string) => habits.length > 0 && habits.every(h => isHabitDone(h, dateStr));
  const toggleAllForDay = (dateStr: string) => {
    const all = allDoneForDay(dateStr);
    habits.forEach(h => {
      const done = isHabitDone(h, dateStr);
      if (all ? done : !done) toggleHabitLog(h.id, dateStr);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="neo-button p-1.5 bg-[#FFFDF8]" aria-label="Previous month"><ChevronLeft size={16} /></button>
          <h3 className="text-base font-extrabold min-w-[130px] sm:min-w-[180px] text-center">{monthName}</h3>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="neo-button p-1.5 bg-[#FFFDF8]" aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
        {isCurrentMonth ? (
          <span className="neo-button px-3 py-1 text-xs bg-[#F7E8A4] font-extrabold flex items-center gap-1.5 pointer-events-none">
            <Check size={12} /> Today
          </span>
        ) : (
          <button onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))} className="neo-button px-3 py-1 text-xs bg-[#F7E8A4] font-extrabold">Jump to today</button>
        )}
      </div>
      <p className="text-xs font-bold text-[#5C5C5C] mb-3">Today is {todayLabel}</p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'Th', 'F', 'S'].map((d, i) => (
          <div key={`h-${i}`} className="text-center text-[10px] font-extrabold text-[#5C5C5C] py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDay;
          const dayData = habitMap[day] || [];
          const allDone = allDoneForDay(dateStr);
          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedDay(dateStr); toggleAllForDay(dateStr); }}
              title={`${dateStr} · tap to mark all habits ${allDone ? 'undone' : 'done'}`}
              className={`relative rounded-lg border-[2px] border-[#2D2D2D] p-1.5 text-center text-xs font-bold transition-colors min-h-[48px]
                ${isSelected || isToday ? 'ring-[3px] ring-[#2D2D2D]' : ''}
                ${isToday ? 'bg-[#F7E8A4]' : isSelected ? 'bg-[#B8D8F8]' : 'bg-[#FFFDF8]'}
                hover:bg-[#F0ECE4]`}
            >
              <span className="flex items-center justify-center gap-1">
                <span className={`${isToday ? 'inline-flex w-5 h-5 leading-none items-center justify-center rounded-full bg-[#2D2D2D] text-[#FFFDF8]' : ''}`}>{day}</span>
                {allDone && <Check size={12} strokeWidth={3} className="text-[#4C8C4A]" />}
              </span>
              {dayData.length > 0 && (
                <div className="flex flex-wrap justify-center gap-[2px] mt-1">
                  {dayData.slice(0, 4).map(h => (
                    <div
                      key={h.id}
                      className={`w-2 h-2 rounded-sm border-[1.5px] border-[#2D2D2D]`}
                      style={{ backgroundColor: h.done ? h.color : '#F0ECE4' }}
                      title={`${h.name}: ${h.done ? 'Done' : 'Missed'}`}
                    />
                  ))}
                  {dayData.length > 4 && (
                    <span className="text-[7px] font-extrabold text-[#5C5C5C]">+{dayData.length - 4}</span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay || 'none'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t-[2px] border-[#2D2D2D] pt-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 className="text-sm font-extrabold flex items-center flex-wrap gap-2">
              {selectedDay === todayStr ? (
                <>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-lg border-[2px] border-[#2D2D2D] bg-[#F7E8A4]">Today</span>
                  <span>Today&apos;s Log</span>
                </>
              ) : (
                selectedDay
              )}
            </h4>
            {selectedDay && habits.length > 0 && (
              <button
                onClick={() => toggleAllForDay(selectedDay)}
                className={`neo-button px-2.5 py-1 text-[10px] font-extrabold flex items-center gap-1 ${allDoneForDay(selectedDay) ? 'bg-[#FFFDF8]' : 'bg-[#CDEAC0]'}`}
              >
                {allDoneForDay(selectedDay) ? <X size={11} /> : <Check size={11} />}
                {allDoneForDay(selectedDay) ? 'Unmark all' : 'Mark all'}
              </button>
            )}
          </div>
          {activeRows.length === 0 ? (
            <p className="text-xs text-[#5C5C5C] font-medium py-4 text-center">No habits logged for this day</p>
          ) : (
            <div className="space-y-2">
              {activeRows.map(h => (
                <button
                  key={h.id}
                  onClick={() => toggleHabitLog(h.id, selectedDay!)}
                  aria-pressed={h.done}
                  className="flex items-center gap-3 w-full text-left p-2.5 min-h-[48px] rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0 transition-colors ${h.done ? 'bg-[#CDEAC0]' : ''}`}
                    style={{ backgroundColor: h.done ? '#CDEAC0' : h.color }}
                  >
                    {h.done && <Check size={14} />}
                  </div>
                  <span className="text-xs font-bold flex-1">{h.name}</span>
                  <span className={`text-[10px] font-extrabold ${h.done ? 'text-[#4C8C4A]' : 'text-[#5C5C5C]'}`}>
                    {h.done ? 'Done' : 'Not done'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HabitGraph({ logs, color }: { habitId: string; logs: { date: string; count: number }[]; color: string }) {
  const weeks = useMemo(() => {
    const data: { week: string; rate: number; done: number; total: number }[] = [];
    const now = new Date();
    for (let w = 11; w >= 0; w--) {
      const end = new Date(now);
      end.setDate(end.getDate() - (w * 7));
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const weekLogs = logs.filter(l => {
        const d = new Date(l.date);
        return d >= start && d <= end;
      });
      const done = weekLogs.filter(l => l.count > 0).length;
      const total = weekLogs.length;
      data.push({
        week: start.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        rate: total > 0 ? Math.round((done / total) * 100) : 0,
        done,
        total,
      });
    }
    return data;
  }, [logs]);

  return (
    <div>
      <h3 className="text-sm font-extrabold mb-4">Weekly Completion Rate (12 weeks)</h3>
      <HabitChart weeks={weeks} color={color} />
    </div>
  );
}

function AddHabitForm({ onDone }: { onDone: () => void }) {
  const addHabit = useLifeStore(s => s.addHabit);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#B8D8F8');
  const [category, setCategory] = useState<HabitCategory>('when-free');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({
      id: genId(),
      name: name.trim(),
      color: selectedColor,
      category,
      streak: 0,
      logs: generateLogs(90),
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Habit name..."
            className="neo-input flex-1 text-sm font-bold min-w-0"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button type="submit" className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
          <button type="button" onClick={onDone} className="neo-button p-2 bg-[#FFFDF8]"><X size={14} /></button>
        </div>
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#5C5C5C] mb-1.5">Category</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {HABIT_CATEGORIES.map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            aria-pressed={category === c.key}
            className={`rounded-xl border-[2px] border-[#2D2D2D] px-2 py-2 text-left transition-all ${category === c.key ? 'shadow-[2px_2px_0px_0px_var(--neo-shadow)] -translate-y-0.5' : 'opacity-80 hover:opacity-100'}`}
            style={{ backgroundColor: c.color }}
          >
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#2A2A2A]">{c.icon} {c.label}</span>
            <span className="block text-[9px] font-bold text-[#5C5C5C] mt-0.5">{c.hint}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#5C5C5C] mb-1.5">Color</p>
      <div className="flex gap-1.5">
        {colorOptions.map(c => (
          <button key={c} type="button" onClick={() => setSelectedColor(c)}
            className={`w-5 h-5 rounded-lg border-[2px] border-[#2D2D2D] ${selectedColor === c ? 'ring-[3px] ring-[#2D2D2D]' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </form>
  );
}

type HabitView = 'grid' | 'calendar' | 'graph';

export default function HabitsPage() {
  const habits = useLifeStore(s => s.habits);
  const updateHabit = useLifeStore(s => s.updateHabit);
  const deleteHabit = useLifeStore(s => s.deleteHabit);
  const toggleHabitLog = useLifeStore(s => s.toggleHabitLog);

  const [selectedHabit, setSelectedHabit] = useState(habits[0]?.id || '');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [lookback, setLookback] = useState(90);
  const [view, setView] = useState<HabitView>('grid');

  const activeHabit = habits.find(h => h.id === selectedHabit) || habits[0];

  const today = new Date().toISOString().split('T')[0];

  const isTodayDone = activeHabit
    ? (activeHabit.logs.find(l => l.date === today)?.count ?? 0) > 0
    : false;

  const completionRate = activeHabit ? calcRate(activeHabit.logs, 30) : 0;
  const totalDone = activeHabit ? activeHabit.logs.filter(l => l.count > 0).length : 0;
  const totalDays = activeHabit ? activeHabit.logs.length : 0;

  return (
    <div>
      <PageHeader title="Habits" description="Track your daily habits and maintain streaks" icon={<Flame size={20} />} />

      {habits.length > 0 && <TodayCheckIn habits={habits} />}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm font-bold text-[#5C5C5C]">{habits.length} habit{habits.length !== 1 ? 's' : ''} tracked</p>
        <button onClick={() => setShowAdd(!showAdd)} className="neo-button px-3 py-1.5 text-xs bg-[#F7E8A4] font-extrabold flex items-center gap-1">
          <Plus size={12} /> New Habit
        </button>
      </div>

      <AnimatePresence>{showAdd && <AddHabitForm onDone={() => setShowAdd(false)} />}</AnimatePresence>

      {habits.length === 0 ? (
        <div className="text-center py-16">
          <Flame size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No habits yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Create your first habit to start tracking</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[...habits].sort((a, b) => CATEGORY_ORDER.indexOf(a.category ?? 'other') - CATEGORY_ORDER.indexOf(b.category ?? 'other')).map((habit, i) => {
              const todayLog = habit.logs.find(l => l.date === today);
              const doneToday = todayLog ? todayLog.count > 0 : false;
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`neo-card p-4 text-center relative ${selectedHabit === habit.id ? 'ring-[3px] ring-[#2D2D2D]' : ''}`}
                >
                  <button
                    onClick={() => setSelectedHabit(habit.id)}
                    className="absolute inset-0"
                    aria-label="Select habit"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); if (selectedHabit === habit.id) setSelectedHabit(habits.filter(h => h.id !== habit.id)[0]?.id || ''); }}
                    className="absolute top-1 right-1 z-10 text-[#5C5C5C] hover:text-[#F8C8C8] transition-colors p-0.5"
                    title="Delete habit"
                  >
                    <X size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleHabitLog(habit.id, today); }}
                    className={`w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center mx-auto mb-2 transition-all hover:scale-110 ${doneToday ? 'bg-[#CDEAC0]' : ''}`}
                    style={{ backgroundColor: doneToday ? '#CDEAC0' : habit.color }}
                    title={doneToday ? 'Mark as not done' : 'Mark as done today'}
                  >
                    {doneToday ? <Check size={18} /> : <Flame size={18} />}
                  </button>
                  <h3 className="text-xs font-extrabold mb-1 truncate">{habit.name}</h3>
                  <HabitCategoryBadge category={habit.category} className="mb-1.5" />
                  <div className="flex items-center justify-center gap-1">
                    <Flame size={14} className="text-[#F8C8C8]" />
                    <span className="text-lg font-extrabold">{habit.streak}</span>
                  </div>
                  <p className={`text-[9px] font-bold mt-1 uppercase tracking-wide ${doneToday ? 'text-[#4C8C4A]' : 'text-[#5C5C5C]'}`}>
                    {doneToday ? '✓ Done today' : 'Not done today'}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-2 mb-6">
            {(['grid', 'calendar', 'graph'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`neo-button px-4 py-2 text-xs flex items-center gap-2 ${view === v ? 'bg-[#2D2D2D] text-[#FFFDF8]' : 'bg-[#FFFDF8]'}`}>
                {v === 'grid' ? <Grid3x3 size={14} /> : v === 'calendar' ? <CalendarDays size={14} /> : <BarChart3 size={14} />}
                {v === 'grid' ? 'Grid' : v === 'calendar' ? 'Calendar' : 'Graph'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {view === 'grid' && (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <NeoCard color={activeHabit.color}>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => toggleHabitLog(activeHabit.id, today)}
                      className={`w-12 h-12 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center transition-all hover:scale-110 ${isTodayDone ? 'bg-[#CDEAC0]' : ''}`}
                      style={{ backgroundColor: isTodayDone ? '#CDEAC0' : activeHabit.color }}
                    >
                      {isTodayDone ? <Check size={24} /> : <Flame size={24} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      {editingHabit === activeHabit.id ? (
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onBlur={() => {
                            if (editName.trim()) updateHabit(activeHabit.id, { name: editName.trim() });
                            setEditingHabit(null);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              if (editName.trim()) updateHabit(activeHabit.id, { name: editName.trim() });
                              setEditingHabit(null);
                            }
                            if (e.key === 'Escape') setEditingHabit(null);
                          }}
                          className="text-xl font-extrabold bg-[#FFFDF8] border-[2px] border-[#2D2D2D] rounded-lg px-2 py-0.5 w-full"
                          autoFocus
                        />
                      ) : (
                        <h2
                          className="text-xl font-extrabold cursor-pointer hover:text-[#5C5C5C] transition-colors truncate"
                          onClick={() => { setEditingHabit(activeHabit.id); setEditName(activeHabit.name); }}
                          title="Click to rename"
                        >
                          {activeHabit.name}
                        </h2>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-sm text-[#5C5C5C] font-medium">{isTodayDone ? 'Done today!' : 'Not logged yet today'}</p>
                        <HabitCategoryBadge category={activeHabit.category} />
                        <span className="text-[10px] font-bold text-[#5C5C5C] uppercase tracking-wide">Today · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#5C5C5C]">Category</span>
                        {HABIT_CATEGORIES.map(c => (
                          <button
                            key={c.key}
                            onClick={() => updateHabit(activeHabit.id, { category: c.key })}
                            aria-pressed={(activeHabit.category ?? 'other') === c.key}
                            className={`rounded-lg border-[2px] border-[#2D2D2D] px-2 py-0.5 text-[10px] font-extrabold text-[#2A2A2A] transition-all ${(activeHabit.category ?? 'other') === c.key ? 'shadow-[2px_2px_0px_0px_var(--neo-shadow)] -translate-y-0.5' : 'opacity-70 hover:opacity-100'}`}
                            style={{ backgroundColor: c.color }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#5C5C5C]">Streak</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Flame size={18} className="text-[#F8C8C8]" />
                        <span className="text-2xl font-extrabold">{activeHabit.streak}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5C5C5C] bg-[#F0ECE4] rounded-xl px-3 py-1.5 border-[2px] border-[#2D2D2D]">
                      <CalendarDays size={14} />
                      <span>Show:</span>
                      {[7, 30, 90].map(d => (
                        <button
                          key={d}
                          onClick={() => setLookback(d)}
                          className={`px-2 py-0.5 rounded-lg border-[2px] border-[#2D2D2D] text-[10px] font-extrabold transition-colors ${lookback === d ? 'bg-[#2D2D2D] text-[#FFFDF8]' : 'bg-[#FFFDF8] hover:bg-[#F0ECE4]'}`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto text-xs font-bold text-[#5C5C5C]">
                      <span className="flex items-center gap-1 whitespace-nowrap"><Sparkles size={14} />{completionRate}% rate</span>
                      <span className="flex items-center gap-1 whitespace-nowrap"><TrendingUp size={14} />{totalDone}/{totalDays} days</span>
                    </div>
                  </div>

                  <ContributionGrid habitId={activeHabit.id} logs={activeHabit.logs} color={activeHabit.color} lookback={lookback} />

                  <div className="mt-4 flex items-center gap-3 text-xs text-[#5C5C5C] font-medium">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-sm border-[1.5px] border-[#2D2D2D] bg-[#F0ECE4]" />
                      <span>Missed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-sm border-[1.5px] border-[#2D2D2D]" style={{ backgroundColor: activeHabit.color }} />
                      <span>Done</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-sm border-[1.5px] border-[#2D2D2D] bg-[#F7E8A4]" />
                      <span>Today</span>
                    </div>
                  </div>
                </NeoCard>
              </motion.div>
            )}

            {view === 'calendar' && (
              <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <NeoCard color={activeHabit.color}>
                  <HabitCalendar habits={habits} />
                </NeoCard>
              </motion.div>
            )}

            {view === 'graph' && (
              <motion.div key="graph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <NeoCard color={activeHabit.color}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: activeHabit.color }}>
                      {<Flame size={20} />}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold">{activeHabit.name} — Trends</h3>
                      <p className="text-xs text-[#5C5C5C] font-medium">Weekly completion over the last 12 weeks</p>
                    </div>
                  </div>
                  <HabitGraph habitId={activeHabit.id} logs={activeHabit.logs} color={activeHabit.color} />
                </NeoCard>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
