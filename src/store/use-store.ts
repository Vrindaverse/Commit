'use client';

import { create } from 'zustand';
import { Task, Goal, Project, Habit, JournalEntry, LearningPath, Subject, Exam, Settings, Expense, Loan } from '@/types';
import { toast } from '@/components/shared/toast';
import { calcStreak, habitCountOn, isHabitDoneOn } from '@/lib/habits';
import { computeProgress } from '@/lib/progress';

export const genId = () => crypto.randomUUID();

class ClientApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ClientApiError';
    this.status = status;
  }
}

async function handleResponse<T>(r: Response): Promise<T> {
  if (!r.ok) {
    if (r.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ClientApiError('Unauthorized', 401);
    }
    let message = `Request failed (${r.status}). Please try again.`;
    try {
      const body = await r.json();
      if (typeof body?.error === 'string' && body.error) {
        message = body.error;
      } else if (body?.error?.message) {
        message = body.error.message;
      }
    } catch {
      // keep the fallback message
    }
    toast.error(message);
    throw new ClientApiError(message, r.status);
  }
  if (r.status === 204) return undefined as T;
  return r.json();
}

const api = {
  get: <T>(url: string): Promise<T> => fetch(url).then(r => handleResponse<T>(r)),
  post: <T>(url: string, body: unknown): Promise<T> => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => handleResponse<T>(r)),
  put: <T>(url: string, body: unknown): Promise<T> => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => handleResponse<T>(r)),
  del: <T>(url: string): Promise<T> => fetch(url, { method: 'DELETE' }).then(r => handleResponse<T>(r)),
};

const writeQueues = new Map<string, Promise<unknown>>();

function enqueue(key: string, task: () => Promise<void>): Promise<void> {
  const previous = writeQueues.get(key) ?? Promise.resolve();
  const run = previous.then(task, task);
  writeQueues.set(key, run.catch(() => {}));
  return run;
}

interface PersistOptions<T> {
  key: string;
  read: () => T | undefined;
  url: string;
  build: (current: T) => Record<string, unknown>;
  apply: (row: T) => void;
  resync: () => Promise<void>;
}

function persistArray<T extends { id: string; version?: number }>(opts: PersistOptions<T>): Promise<void> {
  return enqueue(opts.key, async () => {
    const current = opts.read();
    if (!current) return;
    try {
      const row = await api.put<T>(opts.url, { ...opts.build(current), version: current.version });
      opts.apply(row);
    } catch (error) {
      if (error instanceof ClientApiError && error.status === 409) {
        await opts.resync();
      }
    }
  });
}

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
  deleteModule: (pathId: string, moduleId: string) => Promise<void>;
  renameModule: (pathId: string, moduleId: string, name: string) => Promise<void>;
  toggleModule: (pathId: string, moduleId: string) => Promise<void>;

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

  // Auth
  clearStore: () => void;
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
    displayName: '',
    email: '',
    dailyReminder: true,
    goalAlerts: true,
    accentColor: '#F7E8A4',
    currency: 'INR',
    budgets: {},
    createdAt: '',
    updatedAt: '',
  },

  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  clearStore: () => set({
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
    settings: {
      id: '',
      displayName: '',
      email: '',
      dailyReminder: true,
      goalAlerts: true,
      accentColor: '#F7E8A4',
      currency: 'INR',
      budgets: {},
      createdAt: '',
      updatedAt: '',
    },
  }),
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
    }
  },

  // --- Tasks ---
  addTask: async (task) => {
    const created = await api.post<Task>('/api/tasks', task);
    set(s => ({ tasks: [...s.tasks, created] }));
    toast.success('Task added');
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
    toast.success('Goal added');
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

  addMilestone: (goalId, title) =>
    persistArray<Goal>({
      key: `goal:${goalId}`,
      read: () => get().goals.find(g => g.id === goalId),
      url: `/api/goals/${goalId}`,
      build: (goal) => {
        const milestones = [...goal.milestones, { id: crypto.randomUUID(), title, completed: false }];
        return { milestones, progress: computeProgress(milestones) };
      },
      apply: (row) => set(s => ({ goals: s.goals.map(g => g.id === goalId ? row : g) })),
      resync: () => get().hydrate(),
    }),

  deleteMilestone: (goalId, milestoneId) =>
    persistArray<Goal>({
      key: `goal:${goalId}`,
      read: () => get().goals.find(g => g.id === goalId),
      url: `/api/goals/${goalId}`,
      build: (goal) => {
        const milestones = goal.milestones.filter(m => m.id !== milestoneId);
        return { milestones, progress: computeProgress(milestones) };
      },
      apply: (row) => set(s => ({ goals: s.goals.map(g => g.id === goalId ? row : g) })),
      resync: () => get().hydrate(),
    }),

  toggleMilestone: (goalId, milestoneId) =>
    persistArray<Goal>({
      key: `goal:${goalId}`,
      read: () => get().goals.find(g => g.id === goalId),
      url: `/api/goals/${goalId}`,
      build: (goal) => {
        const milestones = goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return { milestones, progress: computeProgress(milestones) };
      },
      apply: (row) => set(s => ({ goals: s.goals.map(g => g.id === goalId ? row : g) })),
      resync: () => get().hydrate(),
    }),

  // --- Projects ---
  addProject: async (project) => {
    const created = await api.post<Project>('/api/projects', project);
    set(s => ({ projects: [...s.projects, created] }));
    toast.success('Project added');
  },

  deleteProject: async (id) => {
    await api.del(`/api/projects/${id}`);
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
  },

  updateProject: async (id, updates) => {
    const updated = await api.put<Project>(`/api/projects/${id}`, updates);
    set(s => ({ projects: s.projects.map(p => p.id === id ? updated : p) }));
  },

  addProjectTask: (projectId, task) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({ tasks: [...project.tasks, task] }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  deleteProjectTask: (projectId, taskId) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({ tasks: project.tasks.filter(t => t.id !== taskId) }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  updateProjectTask: (projectId, taskId, updates) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({
        tasks: project.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  addProjectMilestone: (projectId, title) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({
        milestones: [...project.milestones, { id: crypto.randomUUID(), title, completed: false }],
      }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  deleteProjectMilestone: (projectId, milestoneId) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({
        milestones: project.milestones.filter(m => m.id !== milestoneId),
      }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  toggleProjectMilestone: (projectId, milestoneId) =>
    persistArray<Project>({
      key: `project:${projectId}`,
      read: () => get().projects.find(p => p.id === projectId),
      url: `/api/projects/${projectId}`,
      build: (project) => ({
        milestones: project.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        ),
      }),
      apply: (row) => set(s => ({ projects: s.projects.map(p => p.id === projectId ? row : p) })),
      resync: () => get().hydrate(),
    }),

  // --- Habits ---
  addHabit: async (habit) => {
    const created = await api.post<Habit>('/api/habits', habit);
    set(s => ({ habits: [...s.habits, { ...created, streak: calcStreak(created.logs) }] }));
    toast.success('Habit added');
  },

  deleteHabit: async (id) => {
    await api.del(`/api/habits/${id}`);
    set(s => ({ habits: s.habits.filter(h => h.id !== id) }));
  },

  toggleHabitLog: (habitId, date) =>
    persistArray<Habit>({
      key: `habit:${habitId}`,
      read: () => get().habits.find(h => h.id === habitId),
      url: `/api/habits/${habitId}`,
      build: (habit) => {
        const existing = habit.logs.find(l => l.date === date);
        const logs = existing
          ? habit.logs.map(l => l.date === date ? { ...l, count: l.count === 0 ? 1 : 0 } : l)
          : [...habit.logs, { date, count: 1 }];
        return { logs, streak: calcStreak(logs) };
      },
      apply: (row) => set(s => ({ habits: s.habits.map(h => h.id === habitId ? row : h) })),
      resync: () => get().hydrate(),
    }),

  updateHabit: async (id, updates) => {
    const updated = await api.put<Habit>(`/api/habits/${id}`, updates);
    set(s => ({ habits: s.habits.map(h => h.id === id ? { ...updated, streak: calcStreak(updated.logs) } : h) }));
  },

  // --- Learning ---
  addLearningPath: async (path) => {
    const created = await api.post<LearningPath>('/api/learning', path);
    set(s => ({ learningPaths: [...s.learningPaths, created] }));
    toast.success('Learning path added');
  },

  deleteLearningPath: async (id) => {
    await api.del(`/api/learning/${id}`);
    set(s => ({ learningPaths: s.learningPaths.filter(lp => lp.id !== id) }));
  },

  updateLearningPath: async (id, updates) => {
    const updated = await api.put<LearningPath>(`/api/learning/${id}`, updates);
    set(s => ({ learningPaths: s.learningPaths.map(lp => lp.id === id ? updated : lp) }));
  },

  addModule: (pathId, name) =>
    persistArray<LearningPath>({
      key: `learning:${pathId}`,
      read: () => get().learningPaths.find(lp => lp.id === pathId),
      url: `/api/learning/${pathId}`,
      build: (path) => ({
        modules: [...path.modules, { id: crypto.randomUUID(), name, completed: false }],
      }),
      apply: (row) => set(s => ({
        learningPaths: s.learningPaths.map(lp => lp.id === pathId ? row : lp),
      })),
      resync: () => get().hydrate(),
    }),

  deleteModule: (pathId, moduleId) =>
    persistArray<LearningPath>({
      key: `learning:${pathId}`,
      read: () => get().learningPaths.find(lp => lp.id === pathId),
      url: `/api/learning/${pathId}`,
      build: (path) => ({ modules: path.modules.filter(m => m.id !== moduleId) }),
      apply: (row) => set(s => ({
        learningPaths: s.learningPaths.map(lp => lp.id === pathId ? row : lp),
      })),
      resync: () => get().hydrate(),
    }),

  renameModule: (pathId, moduleId, name) =>
    persistArray<LearningPath>({
      key: `learning:${pathId}`,
      read: () => get().learningPaths.find(lp => lp.id === pathId),
      url: `/api/learning/${pathId}`,
      build: (path) => ({
        modules: path.modules.map(m => m.id === moduleId ? { ...m, name } : m),
      }),
      apply: (row) => set(s => ({
        learningPaths: s.learningPaths.map(lp => lp.id === pathId ? row : lp),
      })),
      resync: () => get().hydrate(),
    }),

  toggleModule: (pathId, moduleId) =>
    persistArray<LearningPath>({
      key: `learning:${pathId}`,
      read: () => get().learningPaths.find(lp => lp.id === pathId),
      url: `/api/learning/${pathId}`,
      build: (path) => ({
        modules: path.modules.map(m => m.id === moduleId ? { ...m, completed: !m.completed } : m),
      }),
      apply: (row) => set(s => ({
        learningPaths: s.learningPaths.map(lp => lp.id === pathId ? row : lp),
      })),
      resync: () => get().hydrate(),
    }),

  // --- Journal ---
  addEntry: async (entry) => {
    const created = await api.post<JournalEntry>('/api/journal', entry);
    set(s => ({ journalEntries: [created, ...s.journalEntries] }));
    toast.success('Journal entry saved');
  },

  deleteEntry: async (id) => {
    await api.del(`/api/journal/${id}`);
    set(s => ({ journalEntries: s.journalEntries.filter(e => e.id !== id) }));
  },

  // --- Academics ---
  addSubject: async (subject) => {
    const created = await api.post<Subject>('/api/subjects', subject);
    set(s => ({ subjects: [...s.subjects, created] }));
    toast.success('Subject added');
  },

  deleteSubject: async (id) => {
    await api.del(`/api/subjects/${id}`);
    set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) }));
  },

  updateSubject: async (id, updates) => {
    const updated = await api.put<Subject>(`/api/subjects/${id}`, updates);
    set(s => ({ subjects: s.subjects.map(sub => sub.id === id ? updated : sub) }));
  },

  toggleAssignment: (subjectId, assignmentIndex) =>
    persistArray<Subject>({
      key: `subject:${subjectId}`,
      read: () => get().subjects.find(sub => sub.id === subjectId),
      url: `/api/subjects/${subjectId}`,
      build: (subject) => ({
        assignments: subject.assignments.map((a, i) =>
          i === assignmentIndex ? { ...a, submitted: !a.submitted } : a
        ),
      }),
      apply: (row) => set(s => ({
        subjects: s.subjects.map(sub => sub.id === subjectId ? row : sub),
      })),
      resync: () => get().hydrate(),
    }),

  addAssignment: (subjectId, title, due) =>
    persistArray<Subject>({
      key: `subject:${subjectId}`,
      read: () => get().subjects.find(sub => sub.id === subjectId),
      url: `/api/subjects/${subjectId}`,
      build: (subject) => ({
        assignments: [...subject.assignments, { title, due, submitted: false }],
      }),
      apply: (row) => set(s => ({
        subjects: s.subjects.map(sub => sub.id === subjectId ? row : sub),
      })),
      resync: () => get().hydrate(),
    }),

  addExam: async (exam) => {
    const created = await api.post<Exam>('/api/exams', exam);
    set(s => ({ exams: [...s.exams, created] }));
    toast.success('Exam added');
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
    toast.success('Transaction added');
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
    toast.success('Loan added');
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

export { calcStreak, isHabitDoneOn, habitCountOn };
