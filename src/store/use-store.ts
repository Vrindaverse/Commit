'use client';

import { create } from 'zustand';
import { Task, Goal, Project, Habit, JournalEntry, Milestone, LearningPath, Subject, Exam, Settings, Expense, Loan } from '@/types';

let idCounter = 100;
export const genId = () => `gen_${++idCounter}`;

async function handleResponse<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const body = await r.text().catch(() => '(unable to read body)');
    throw new Error(`API error: ${r.status} ${r.statusText} — ${body}`);
  }
  return r.json();
}

const api = {
  get: <T>(url: string): Promise<T> => fetch(url).then(r => handleResponse<T>(r)),
  post: <T>(url: string, body: unknown): Promise<T> => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => handleResponse<T>(r)),
  put: <T>(url: string, body: unknown): Promise<T> => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => handleResponse<T>(r)),
  del: <T>(url: string): Promise<T> => fetch(url, { method: 'DELETE' }).then(r => handleResponse<T>(r)),
};

interface LifeStore {
  hydrated: boolean;
  tasks: Task[];
  goals: Goal[];
  projects: Project[];
  habits: Habit[];
  learningPaths: LearningPath[];
  journalEntries: JournalEntry[];
  subjects: Subject[];
  exams: Exam[];
  expenses: Expense[];
  loans: Loan[];
  sidebarCollapsed: boolean;
  settings: Settings;

  toggleSidebar: () => void;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  hydrate: () => Promise<void>;

  // Tasks
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Goals
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  reorderGoals: (goals: Goal[]) => void;
  addMilestone: (goalId: string, title: string) => Promise<void>;
  deleteMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;

  // Projects
  addProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  addProjectTask: (projectId: string, task: Task) => Promise<void>;
  deleteProjectTask: (projectId: string, taskId: string) => Promise<void>;
  updateProjectTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  addProjectMilestone: (projectId: string, title: string) => Promise<void>;
  deleteProjectMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => Promise<void>;

  // Habits
  addHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitLog: (habitId: string, date: string) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;

  // Learning
  addLearningPath: (path: LearningPath) => Promise<void>;
  deleteLearningPath: (id: string) => Promise<void>;
  updateLearningPath: (id: string, updates: Partial<LearningPath>) => Promise<void>;
  addModule: (pathId: string, name: string) => Promise<void>;
  deleteModule: (pathId: string, index: number) => Promise<void>;
  renameModule: (pathId: string, index: number, name: string) => Promise<void>;
  toggleModule: (pathId: string, moduleIndex: number) => Promise<void>;

  // Journal
  addEntry: (entry: JournalEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;

  // Academics
  addSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  toggleAssignment: (subjectId: string, assignmentIndex: number) => Promise<void>;
  addAssignment: (subjectId: string, title: string, due: string) => Promise<void>;
  addExam: (exam: Exam) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  updateExam: (id: string, updates: Partial<Exam>) => Promise<void>;

  // Expenses
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Loans
  addLoan: (loan: Loan) => Promise<void>;
  updateLoan: (id: string, updates: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;

  // Achievements (auto-calculated)
  checkAchievements: () => void;
}

export const useLifeStore = create<LifeStore>((set, get) => ({
  hydrated: false,
  tasks: [],
  goals: [],
  projects: [],
  habits: [],
  learningPaths: [],
  journalEntries: [],
  subjects: [],
  exams: [],
  expenses: [],
  loans: [],
  sidebarCollapsed: false,
  settings: {
    id: '',
    displayName: 'Vrinda',
    email: 'vrinda@example.com',
    dailyReminder: true,
    goalAlerts: true,
    accentColor: '#F7E8A4',
    budgets: {},
    createdAt: '',
    updatedAt: '',
  },

  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  updateSettings: async (updates) => {
    const updated = await api.put<Settings>('/api/settings', updates);
    set(s => ({ settings: { ...s.settings, ...updated } }));
  },

  hydrate: async () => {
    try {
      const [tasks, goals, projects, habits, learningPaths, subjects, exams, journalEntries, expenses, loans, settingsData] = await Promise.all([
        api.get<Task[]>('/api/tasks'),
        api.get<Goal[]>('/api/goals'),
        api.get<Project[]>('/api/projects'),
        api.get<Habit[]>('/api/habits'),
        api.get<LearningPath[]>('/api/learning'),
        api.get<Subject[]>('/api/subjects'),
        api.get<Exam[]>('/api/exams'),
        api.get<JournalEntry[]>('/api/journal'),
        api.get<Expense[]>('/api/expenses'),
        api.get<Loan[]>('/api/loans'),
        api.get<Settings>('/api/settings'),
      ]);
      set({
        tasks, goals, projects, habits, learningPaths, subjects, exams, journalEntries, expenses, loans,
        settings: settingsData,
        hydrated: true,
      });
    } catch (e) {
      console.error('Failed to hydrate store from API:', e);
      set({ hydrated: true });
    }
  },

  // --- Tasks ---
  addTask: async (task) => {
    const created = await api.post<Task>('/api/tasks', task);
    set(s => ({ tasks: [...s.tasks, created] }));
  },

  updateTask: async (id, updates) => {
    const updated = await api.put<Task>(`/api/tasks/${id}`, updates);
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? updated : t) }));
  },

  deleteTask: async (id) => {
    await api.del(`/api/tasks/${id}`);
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
  },

  // --- Goals ---
  addGoal: async (goal) => {
    const created = await api.post<Goal>('/api/goals', goal);
    set(s => ({ goals: [...s.goals, created] }));
  },

  updateGoal: async (id, updates) => {
    const updated = await api.put<Goal>(`/api/goals/${id}`, updates);
    set(s => ({ goals: s.goals.map(g => g.id === id ? updated : g) }));
  },

  deleteGoal: async (id) => {
    await api.del(`/api/goals/${id}`);
    set(s => ({ goals: s.goals.filter(g => g.id !== id) }));
  },

  reorderGoals: (goals) => set(() => ({ goals })),

  addMilestone: async (goalId, title) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;
    const milestone: Milestone = { id: crypto.randomUUID(), title, completed: false };
    const milestones = [...goal.milestones, milestone];
    const completed = milestones.filter(m => m.completed).length;
    const progress = Math.round((completed / milestones.length) * 100);
    await api.put(`/api/goals/${goalId}`, { milestones, progress });
    set(s => ({
      goals: s.goals.map(g => g.id === goalId ? { ...g, milestones, progress } : g),
    }));
  },

  deleteMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.filter(m => m.id !== milestoneId);
    const completed = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;
    await api.put(`/api/goals/${goalId}`, { milestones, progress });
    set(s => ({
      goals: s.goals.map(g => g.id === goalId ? { ...g, milestones, progress } : g),
    }));
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completed = milestones.filter(m => m.completed).length;
    const progress = Math.round((completed / milestones.length) * 100);
    await api.put(`/api/goals/${goalId}`, { milestones, progress });
    set(s => ({
      goals: s.goals.map(g => g.id === goalId ? { ...g, milestones, progress } : g),
    }));
  },

  // --- Projects ---
  addProject: async (project) => {
    const created = await api.post<Project>('/api/projects', project);
    set(s => ({ projects: [...s.projects, created] }));
  },

  deleteProject: async (id) => {
    await api.del(`/api/projects/${id}`);
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
  },

  updateProject: async (id, updates) => {
    const updated = await api.put<Project>(`/api/projects/${id}`, updates);
    set(s => ({ projects: s.projects.map(p => p.id === id ? updated : p) }));
  },

  addProjectTask: async (projectId, task) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const tasks = [...project.tasks, task];
    await api.put(`/api/projects/${projectId}`, { tasks });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, tasks } : p),
    }));
  },

  deleteProjectTask: async (projectId, taskId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const tasks = project.tasks.filter(t => t.id !== taskId);
    await api.put(`/api/projects/${projectId}`, { tasks });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, tasks } : p),
    }));
  },

  updateProjectTask: async (projectId, taskId, updates) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const tasks = project.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    await api.put(`/api/projects/${projectId}`, { tasks });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, tasks } : p),
    }));
  },

  addProjectMilestone: async (projectId, title) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const milestone: Milestone = { id: crypto.randomUUID(), title, completed: false };
    const milestones = [...project.milestones, milestone];
    const completed = milestones.filter(m => m.completed).length;
    const progress = Math.round((completed / milestones.length) * 100);
    await api.put(`/api/projects/${projectId}`, { milestones, progress });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, milestones, progress } : p),
    }));
  },

  deleteProjectMilestone: async (projectId, milestoneId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const milestones = project.milestones.filter(m => m.id !== milestoneId);
    const completed = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;
    await api.put(`/api/projects/${projectId}`, { milestones, progress });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, milestones, progress } : p),
    }));
  },

  toggleProjectMilestone: async (projectId, milestoneId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const milestones = project.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completed = milestones.filter(m => m.completed).length;
    const progress = Math.round((completed / milestones.length) * 100);
    await api.put(`/api/projects/${projectId}`, { milestones, progress });
    set(s => ({
      projects: s.projects.map(p => p.id === projectId ? { ...p, milestones, progress } : p),
    }));
  },

  // --- Habits ---
  addHabit: async (habit) => {
    const created = await api.post<Habit>('/api/habits', habit);
    set(s => ({ habits: [...s.habits, { ...created, streak: calcStreak(created.logs) }] }));
  },

  deleteHabit: async (id) => {
    await api.del(`/api/habits/${id}`);
    set(s => ({ habits: s.habits.filter(h => h.id !== id) }));
  },

  toggleHabitLog: async (habitId, date) => {
    const habit = get().habits.find(h => h.id === habitId);
    if (!habit) return;
    const existing = habit.logs.find(l => l.date === date);
    let logs: { date: string; count: number }[];
    if (existing) {
      logs = habit.logs.map(l => l.date === date ? { ...l, count: l.count === 0 ? 1 : 0 } : l);
    } else {
      logs = [...habit.logs, { date, count: 1 }];
    }
    const streak = calcStreak(logs);
    await api.put(`/api/habits/${habitId}`, { logs, streak });
    set(s => ({
      habits: s.habits.map(h => h.id === habitId ? { ...h, logs, streak } : h),
    }));
  },

  updateHabit: async (id, updates) => {
    const updated = await api.put<Habit>(`/api/habits/${id}`, updates);
    set(s => ({ habits: s.habits.map(h => h.id === id ? { ...updated, streak: calcStreak(updated.logs) } : h) }));
  },

  // --- Learning ---
  addLearningPath: async (path) => {
    const created = await api.post<LearningPath>('/api/learning', path);
    set(s => ({ learningPaths: [...s.learningPaths, created] }));
  },

  deleteLearningPath: async (id) => {
    await api.del(`/api/learning/${id}`);
    set(s => ({ learningPaths: s.learningPaths.filter(lp => lp.id !== id) }));
  },

  updateLearningPath: async (id, updates) => {
    const updated = await api.put<LearningPath>(`/api/learning/${id}`, updates);
    set(s => ({ learningPaths: s.learningPaths.map(lp => lp.id === id ? updated : lp) }));
  },

  addModule: async (pathId, name) => {
    const path = get().learningPaths.find(lp => lp.id === pathId);
    if (!path) return;
    const modules = [...path.modules, { id: crypto.randomUUID(), name, completed: false }];
    const completed = modules.filter(m => m.completed).length;
    const progress = Math.round((completed / modules.length) * 100);
    await api.put(`/api/learning/${pathId}`, { modules, progress });
    set(s => ({
      learningPaths: s.learningPaths.map(lp => lp.id === pathId ? { ...lp, modules, progress } : lp),
    }));
  },

  deleteModule: async (pathId, index) => {
    const path = get().learningPaths.find(lp => lp.id === pathId);
    if (!path) return;
    const modules = path.modules.filter((_, i) => i !== index);
    const completed = modules.filter(m => m.completed).length;
    const progress = modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
    await api.put(`/api/learning/${pathId}`, { modules, progress });
    set(s => ({
      learningPaths: s.learningPaths.map(lp => lp.id === pathId ? { ...lp, modules, progress } : lp),
    }));
  },

  renameModule: async (pathId, index, name) => {
    const path = get().learningPaths.find(lp => lp.id === pathId);
    if (!path) return;
    const modules = path.modules.map((m, i) => i === index ? { ...m, name } : m);
    await api.put(`/api/learning/${pathId}`, { modules });
    set(s => ({
      learningPaths: s.learningPaths.map(lp => lp.id === pathId ? { ...lp, modules } : lp),
    }));
  },

  toggleModule: async (pathId, moduleIndex) => {
    const path = get().learningPaths.find(lp => lp.id === pathId);
    if (!path) return;
    const modules = path.modules.map((m, i) =>
      i === moduleIndex ? { ...m, completed: !m.completed } : m
    );
    const completed = modules.filter(m => m.completed).length;
    const progress = Math.round((completed / modules.length) * 100);
    await api.put(`/api/learning/${pathId}`, { modules, progress });
    set(s => ({
      learningPaths: s.learningPaths.map(lp => lp.id === pathId ? { ...lp, modules, progress } : lp),
    }));
  },

  // --- Journal ---
  addEntry: async (entry) => {
    const created = await api.post<JournalEntry>('/api/journal', entry);
    set(s => ({ journalEntries: [created, ...s.journalEntries] }));
  },

  deleteEntry: async (id) => {
    await api.del(`/api/journal/${id}`);
    set(s => ({ journalEntries: s.journalEntries.filter(e => e.id !== id) }));
  },

  // --- Academics ---
  addSubject: async (subject) => {
    const created = await api.post<Subject>('/api/subjects', subject);
    set(s => ({ subjects: [...s.subjects, created] }));
  },

  deleteSubject: async (id) => {
    await api.del(`/api/subjects/${id}`);
    set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) }));
  },

  updateSubject: async (id, updates) => {
    const updated = await api.put<Subject>(`/api/subjects/${id}`, updates);
    set(s => ({ subjects: s.subjects.map(sub => sub.id === id ? updated : sub) }));
  },

  toggleAssignment: async (subjectId, assignmentIndex) => {
    const subject = get().subjects.find(sub => sub.id === subjectId);
    if (!subject) return;
    const assignments = subject.assignments.map((a, i) =>
      i === assignmentIndex ? { ...a, submitted: !a.submitted } : a
    );
    await api.put(`/api/subjects/${subjectId}`, { assignments });
    set(s => ({
      subjects: s.subjects.map(sub => sub.id === subjectId ? { ...sub, assignments } : sub),
    }));
  },

  addAssignment: async (subjectId, title, due) => {
    const subject = get().subjects.find(sub => sub.id === subjectId);
    if (!subject) return;
    const assignments = [...subject.assignments, { title, due, submitted: false }];
    await api.put(`/api/subjects/${subjectId}`, { assignments });
    set(s => ({
      subjects: s.subjects.map(sub => sub.id === subjectId ? { ...sub, assignments } : sub),
    }));
  },

  addExam: async (exam) => {
    const created = await api.post<Exam>('/api/exams', exam);
    set(s => ({ exams: [...s.exams, created] }));
  },

  deleteExam: async (id) => {
    await api.del(`/api/exams/${id}`);
    set(s => ({ exams: s.exams.filter(e => e.id !== id) }));
  },

  updateExam: async (id, updates) => {
    const updated = await api.put<Exam>(`/api/exams/${id}`, updates);
    set(s => ({ exams: s.exams.map(e => e.id === id ? updated : e) }));
  },

  // --- Expenses ---
  addExpense: async (expense) => {
    const created = await api.post<Expense>('/api/expenses', expense);
    set(s => ({ expenses: [created, ...s.expenses] }));
  },

  updateExpense: async (id, updates) => {
    const updated = await api.put<Expense>(`/api/expenses/${id}`, updates);
    set(s => ({ expenses: s.expenses.map(e => e.id === id ? updated : e) }));
  },

  deleteExpense: async (id) => {
    await api.del(`/api/expenses/${id}`);
    set(s => ({ expenses: s.expenses.filter(e => e.id !== id) }));
  },

  // --- Loans ---
  addLoan: async (loan) => {
    const created = await api.post<Loan>('/api/loans', loan);
    set(s => ({ loans: [created, ...s.loans] }));
  },

  updateLoan: async (id, updates) => {
    const updated = await api.put<Loan>(`/api/loans/${id}`, updates);
    set(s => ({ loans: s.loans.map(l => l.id === id ? updated : l) }));
  },

  deleteLoan: async (id) => {
    await api.del(`/api/loans/${id}`);
    set(s => ({ loans: s.loans.filter(l => l.id !== id) }));
  },

  // --- Achievements ---
  checkAchievements: () => {},
}));

function calcStreak(logs: { date: string; count: number }[]): number {
  if (logs.length === 0) return 0;

  const logMap = new Map<string, number>();
  for (const log of logs) {
    logMap.set(log.date, log.count);
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const current = new Date();
  if (logMap.get(todayStr) !== 1) {
    current.setDate(current.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const dateStr = current.toISOString().split('T')[0];
    if (logMap.get(dateStr) === 1) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
