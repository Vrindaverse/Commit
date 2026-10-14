export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type GoalCategory = 'long-term' | 'medium-term' | 'short-term';
export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';
export type TransactionType = 'income' | 'expense';
export type Account = 'cash' | 'bank' | 'card' | 'upi' | 'other';
export type ExpenseCategory =
  | 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment' | 'health' | 'education'
  | 'salary' | 'freelance' | 'investment' | 'gift' | 'refund' | 'other';
export type BudgetMap = Partial<Record<ExpenseCategory | 'overall' | 'savings', number>>;
export type PageName = 'dashboard' | 'goals' | 'tasks' | 'projects' | 'learning' | 'academics' | 'habits' | 'achievements' | 'journal' | 'analytics' | 'settings' | 'expenses';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  time?: string;
  tags: string[];
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  color: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasks: Task[];
  milestones: Milestone[];
  color: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description?: string;
  category: string;
  progress: number;
  modules: { id: string; name: string; completed: boolean }[];
  color: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  attendance: number;
  assignments: { title: string; due: string; submitted: boolean }[];
  grade: string;
  color: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  syllabus: string[];
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export type HabitCategory = 'compulsory' | 'when-free' | 'other';

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  color: string;
  category: HabitCategory;
  streak: number;
  logs: { date: string; count: number }[];
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  unlocked: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  id: string;
  displayName: string;
  email: string;
  dailyReminder: boolean;
  goalAlerts: boolean;
  accentColor: string;
  currency: string;
  budgets: BudgetMap;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: string;
  type: TransactionType;
  category: ExpenseCategory;
  account: Account;
  date: string;
  notes: string;
  recurring: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LoanKind = 'borrowed' | 'lent';

export interface Loan {
  id: string;
  title: string;
  counterparty: string;
  kind: LoanKind;
  principal: string;
  paid: string;
  date: string;
  dueDate: string;
  notes: string;
  settled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsData {
  productivityTrend: { day: string; hours: number }[];
  learningHours: { month: string; hours: number }[];
  goalCompletion: { month: string; completed: number; total: number }[];
  habitStreaks: { habit: string; streak: number }[];
  weeklyDistribution: { day: string; tasks: number; completed: number }[];
}
