'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, List, Columns, Calendar as CalendarIcon, Plus, X, Clock, Tag, ChevronLeft, ChevronRight, AlignLeft, Save } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useLifeStore, genId } from '@/store/use-store';
import { localDateKey } from '@/lib/date';
import { Task, TaskStatus, Priority } from '@/types';

const priorityColors: Record<string, string> = {
  urgent: '#F8C8C8',
  high: '#FFD8BE',
  medium: '#F7E8A4',
  low: '#CDEAC0',
};

const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

function AddTaskForm({ onDone, defaultStatus }: { onDone: () => void; defaultStatus?: TaskStatus }) {
  const addTask = useLifeStore(s => s.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showExtra, setShowExtra] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      status: defaultStatus || 'todo',
      priority,
      dueDate: dueDate || localDateKey(),
      time: time || undefined,
      tags,
    });
    onDone();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="neo-input flex-1 text-sm font-bold min-w-0"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button type="submit" className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
          <button type="button" onClick={onDone} className="neo-button p-2 bg-[#FFFDF8]"><X size={14} /></button>
        </div>
      </div>

      <div className="flex gap-2 items-center text-xs flex-wrap mb-2">
        <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="neo-input text-xs py-1.5 min-w-0 flex-1 sm:flex-none">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="neo-input text-xs py-1.5 min-w-0 flex-[2] sm:flex-none" />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="neo-input text-xs py-1.5 min-w-0 flex-1 sm:flex-none" />
        <button type="button" onClick={() => setShowExtra(!showExtra)} className="neo-button p-1.5 bg-[#FFFDF8]">
          <AlignLeft size={14} />
        </button>
      </div>

      {showExtra && (
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className="neo-input text-xs w-full resize-none"
          />
          <div className="flex gap-2 items-center">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag..."
              className="neo-input text-xs py-1 flex-1"
            />
            <button type="button" onClick={addTag} className="neo-button p-1 bg-[#F7E8A4]"><Plus size={12} /></button>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.map(t => (
                <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={9} /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}

function TaskEditDialog({ task, open, onOpenChange }: { task: Task; open: boolean; onOpenChange: (v: boolean) => void }) {
  const updateTask = useLifeStore(s => s.updateTask);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [time, setTime] = useState(task.time || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(task.tags);

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
      time: time || undefined,
      tags,
    });
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-card !p-5 !shadow-[6px_6px_0px_0px_var(--neo-shadow)] !border-[3px] !border-[#2D2D2D] !rounded-[20px] !ring-0 max-w-md">
        <DialogTitle className="text-base font-extrabold mb-4">Edit Task</DialogTitle>
        <div className="space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            className="neo-input w-full text-sm font-bold"
            autoFocus
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            className="neo-input w-full text-xs resize-none"
          />
          <div className="flex gap-2 items-center flex-wrap">
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="neo-input text-xs py-1.5 flex-1 min-w-0">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="neo-input text-xs py-1.5 flex-1 min-w-0">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="neo-input text-xs py-1.5 flex-1 min-w-0" />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="neo-input text-xs py-1.5 flex-1 min-w-0" />
          </div>
          <div className="flex gap-2 items-center">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag..."
              className="neo-input text-xs py-1 flex-1"
            />
            <button type="button" onClick={addTag} className="neo-button p-1 bg-[#F7E8A4]"><Plus size={12} /></button>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.map(t => (
                <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={9} /></button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <DialogClose className="neo-button px-4 py-2 text-xs bg-[#FFFDF8] cursor-pointer">
            Cancel
          </DialogClose>
          <button onClick={handleSave} className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold flex items-center gap-1.5">
            <Save size={12} /> Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TaskCard({ task, compact }: { task: Task; compact?: boolean }) {
  const updateTask = useLifeStore(s => s.updateTask);
  const deleteTask = useLifeStore(s => s.deleteTask);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next: Record<TaskStatus, TaskStatus> = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
    updateTask(task.id, { status: next[task.status] });
  };

  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`neo-card p-3.5 cursor-pointer ${isOverdue ? 'border-[#F8C8C8]' : ''}`}
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-start gap-3">
          <button onClick={cycleStatus} className="mt-0.5 flex-shrink-0">
            <div className={`w-5 h-5 rounded-full border-[3px] border-[#2D2D2D] transition-all duration-150 ${task.status === 'done' ? 'bg-[#CDEAC0] scale-110' : task.status === 'in-progress' ? 'bg-[#B8D8F8]' : 'hover:bg-[#F0ECE4]'}`} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-extrabold ${task.status === 'done' ? 'line-through text-[#5C5C5C]' : ''}`}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#5C5C5C] font-medium flex-wrap">
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-[#F8C8C8] font-extrabold' : ''}`}>
                <Clock size={10} />{task.dueDate}{task.time ? ` ${task.time}` : ''}
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D]"
                style={{ backgroundColor: priorityColors[task.priority] }}
              >
                {task.priority}
              </span>
              {task.tags.map(t => (
                <span key={t} className="flex items-center gap-1"><Tag size={10} />{t}</span>
              ))}
            </div>
            {task.description && !compact && (
              <button onClick={e => { e.stopPropagation(); setShowDetails(!showDetails); }} className="text-[10px] text-[#5C5C5C] mt-1 hover:text-[#2A2A2A] transition-colors">
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            )}
            {showDetails && task.description && (
              <p className="text-xs text-[#5C5C5C] mt-1.5 leading-relaxed">{task.description}</p>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); deleteTask(task.id); }} className="text-[#5C5C5C] hover:text-[#F8C8C8] transition-colors shrink-0"><X size={13} /></button>
        </div>
      </motion.div>
      <TaskEditDialog task={task} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

function KanbanView() {
  const tasks = useLifeStore(s => s.tasks);
  const [showAdd, setShowAdd] = useState<TaskStatus | null>(null);
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>('todo');
  const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];
  const columnLabels: Record<TaskStatus, string> = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
  const columnColors: Record<TaskStatus, string> = { todo: '#FFD8BE', 'in-progress': '#B8D8F8', done: '#CDEAC0' };

  return (
    <>
      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {columns.map((status) => {
          const columnTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status}>
              <div className="rounded-xl border-[3px] border-[#2D2D2D] p-3 mb-3 font-extrabold text-sm flex items-center justify-between" style={{ backgroundColor: columnColors[status] }}>
                <span>{columnLabels[status]} ({columnTasks.length})</span>
                <button onClick={() => setShowAdd(showAdd === status ? null : status)} className="neo-button p-1 bg-[#FFFDF8]"><Plus size={14} /></button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>{showAdd === status && <AddTaskForm onDone={() => setShowAdd(null)} defaultStatus={status} />}</AnimatePresence>
                <AnimatePresence>{columnTasks.map(task => <TaskCard key={task.id} task={task} />)}</AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: tab-based column view */}
      <div className="md:hidden">
        {/* Segmented tabs */}
        <div className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-1 flex shadow-[2px_2px_0px_0px_var(--neo-shadow)]">
          {columns.map((status) => {
            const count = tasks.filter(t => t.status === status).length;
            const isActive = mobileColumn === status;
            return (
              <button
                key={status}
                onClick={() => setMobileColumn(status)}
                className={`flex-1 relative py-2 px-1 rounded-lg text-xs font-extrabold transition-all ${
                  isActive ? 'text-[#2A2A2A] shadow-[1px_1px_0px_0px_var(--neo-shadow)]' : 'text-[#5C5C5C] hover:text-[#2A2A2A]'
                }`}
                style={{ backgroundColor: isActive ? columnColors[status] : 'transparent' }}
              >
                <motion.span layout className="block">{columnLabels[status]}</motion.span>
                <span className="text-[9px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Active column */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-[#2A2A2A]">
              {columnLabels[mobileColumn]}
            </h3>
            <button onClick={() => setShowAdd(showAdd === mobileColumn ? null : mobileColumn)} className="neo-button px-3 py-1.5 text-xs bg-[#FFFDF8] flex items-center gap-1 shadow-[2px_2px_0px_0px_var(--neo-shadow)]">
              <Plus size={12} /> Add
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileColumn}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {showAdd === mobileColumn && <AddTaskForm onDone={() => setShowAdd(null)} defaultStatus={mobileColumn} />}
              {tasks.filter(t => t.status === mobileColumn).map(task => <TaskCard key={task.id} task={task} />)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function ListView() {
  const tasks = useLifeStore(s => s.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const result = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
    return result.sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, filter, sortBy]);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {(['all', 'todo', 'in-progress', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`neo-button px-3 py-1.5 text-xs ${filter === f ? 'bg-[#2D2D2D] text-[#FFFDF8]' : 'bg-[#FFFDF8]'}`}>
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
          className="neo-input text-xs py-1.5 ml-auto"
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
        <button onClick={() => setShowAdd(!showAdd)} className="neo-button px-3 py-1.5 text-xs bg-[#F7E8A4] flex items-center gap-1"><Plus size={12} /> Add</button>
      </div>
      <AnimatePresence>{showAdd && <AddTaskForm onDone={() => setShowAdd(false)} />}</AnimatePresence>
      <div className="space-y-3">
        <AnimatePresence>{filtered.map(task => <TaskCard key={task.id} task={task} />)}</AnimatePresence>
      </div>
      {filtered.length === 0 && tasks.length > 0 && (
        <p className="text-sm text-[#5C5C5C] font-medium text-center py-12">No tasks match this filter</p>
      )}
    </div>
  );
}

function CalendarPreview() {
  const tasks = useLifeStore(s => s.tasks);
  const addTask = useLifeStore(s => s.addTask);
  const updateTask = useLifeStore(s => s.updateTask);
  const deleteTask = useLifeStore(s => s.deleteTask);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayStr = localDateKey(today);

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const selectedDate = selectedDay ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '';
  const dayTasks = tasks.filter(t => {
    if (!selectedDay) return false;
    const d = new Date(t.dueDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
  });

  const taskCountByDay: Record<number, { total: number; done: number }> = {};
  tasks.forEach(t => {
    const d = new Date(t.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!taskCountByDay[day]) taskCountByDay[day] = { total: 0, done: 0 };
      taskCountByDay[day].total++;
      if (t.status === 'done') taskCountByDay[day].done++;
    }
  });

  const handleAddTask = () => {
    if (!newTitle.trim() || !selectedDay) return;
    addTask({
      id: genId(),
      title: newTitle.trim(),
      description: '',
      status: 'todo',
      priority: newPriority,
      dueDate: selectedDate,
      tags: [],
    });
    setNewTitle('');
    setShowAdd(false);
  };

  const cycleStatus = (task: Task) => {
    const next: Record<TaskStatus, TaskStatus> = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
    updateTask(task.id, { status: next[task.status] });
  };

  const handleSaveTitle = (taskId: string) => {
    if (editTitle.trim()) updateTask(taskId, { title: editTitle.trim() });
    setEditingTask(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="neo-button p-1.5 bg-[#FFFDF8]"><ChevronLeft size={16} /></button>
          <h3 className="text-lg font-extrabold min-w-[140px] sm:min-w-[200px] text-center">{monthName}</h3>
          <button onClick={nextMonth} className="neo-button p-1.5 bg-[#FFFDF8]"><ChevronRight size={16} /></button>
        </div>
        {!isCurrentMonth && (
          <button onClick={goToday} className="neo-button px-3 py-1 text-xs bg-[#F7E8A4] font-extrabold">Today</button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'Th', 'F', 'S'].map((d, i) => (
          <div key={`h-${i}`} className="text-center text-[10px] font-extrabold text-[#5C5C5C] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const counts = taskCountByDay[day];
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = day === selectedDay;
          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={`relative rounded-lg border-[2px] border-[#2D2D2D] p-1.5 text-center text-xs font-bold transition-colors
                ${isSelected ? 'ring-[3px] ring-[#2D2D2D]' : ''}
                ${isToday ? 'bg-[#F7E8A4]' : isSelected ? 'bg-[#B8D8F8]' : 'bg-[#FFFDF8]'}
                hover:bg-[#F0ECE4]`}
            >
              {day}
              {counts && (
                <div className="flex justify-center gap-[2px] mt-0.5">
                  {counts.total > 0 && (
                    <div className="flex gap-[2px]">
                      <div className={`w-1.5 h-1.5 rounded-full border-[1.5px] border-[#2D2D2D] ${counts.done === counts.total ? 'bg-[#CDEAC0]' : counts.done > 0 ? 'bg-[#B8D8F8]' : 'bg-[#F8C8C8]'}`} />
                      {counts.total > 1 && <div className="w-1.5 h-1.5 rounded-full border-[1.5px] border-[#2D2D2D] bg-[#F0ECE4]" />}
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate || 'none'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 pt-4 border-t-[2px] border-[#2D2D2D]"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-extrabold">
              {selectedDate === todayStr ? "Today's Tasks" : `Tasks — ${selectedDate}`}
              <span className="ml-2 text-[#5C5C5C] font-medium">({dayTasks.length})</span>
            </h4>
            <button onClick={() => setShowAdd(!showAdd)} className="neo-button px-3 py-1 text-xs bg-[#F7E8A4] font-extrabold flex items-center gap-1">
              <Plus size={12} /> Add
            </button>
          </div>

          {showAdd && (
            <div className="neo-card p-3 mb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  placeholder="New task..."
                  className="neo-input flex-1 text-xs py-1.5 min-w-0"
                  autoFocus
                />
                <select value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)} className="neo-input text-xs py-1.5">
                  <option value="low">Low</option>
                  <option value="medium">Med</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button onClick={handleAddTask} className="neo-button px-3 py-1.5 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
                <button onClick={() => setShowAdd(false)} className="neo-button p-1.5 bg-[#FFFDF8]"><X size={14} /></button>
              </div>
            </div>
          )}

          {dayTasks.length === 0 && !showAdd && (
            <p className="text-sm text-[#5C5C5C] font-medium text-center py-8">No tasks due on this day</p>
          )}

          <div className="space-y-2">
            <AnimatePresence>
              {dayTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]"
                >
                  <button onClick={() => cycleStatus(task)}>
                    <div className={`w-4 h-4 rounded-full border-[2px] border-[#2D2D2D] flex-shrink-0 ${task.status === 'done' ? 'bg-[#CDEAC0]' : task.status === 'in-progress' ? 'bg-[#B8D8F8]' : ''}`} />
                  </button>
                  {editingTask === task.id ? (
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(task.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveTitle(task.id);
                        if (e.key === 'Escape') setEditingTask(null);
                      }}
                      className="neo-input text-xs font-bold flex-1"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`text-xs font-bold flex-1 cursor-pointer ${task.status === 'done' ? 'line-through text-[#5C5C5C]' : ''}`}
                      onDoubleClick={() => { setEditingTask(task.id); setEditTitle(task.title); }}
                      title="Double-click to edit"
                    >
                      {task.title}
                    </span>
                  )}
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D]"
                    style={{ backgroundColor: priorityColors[task.priority] }}
                  >
                    {task.priority}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="text-[#5C5C5C] hover:text-[#F8C8C8] transition-colors">
                    <X size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'kanban' | 'calendar'>('list');

  return (
    <div>
      <PageHeader title="Tasks" description="Manage your tasks across different views" icon={<CheckSquare size={20} />} />
      <div className="flex gap-2 mb-6">
        {(['list', 'kanban', 'calendar'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={`neo-button px-4 py-2 text-xs flex items-center gap-2 ${view === v ? 'bg-[#2D2D2D] text-[#FFFDF8]' : 'bg-[#FFFDF8]'}`}>
            {v === 'list' ? <List size={14} /> : v === 'kanban' ? <Columns size={14} /> : <CalendarIcon size={14} />}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {view === 'kanban' && <KanbanView />}
          {view === 'list' && <ListView />}
          {view === 'calendar' && <NeoCard color="#B8D8F8"><CalendarPreview /></NeoCard>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
