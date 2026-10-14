import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { expenses, goals, habits, learningPaths, loans, projects, settings, tasks } from '@/db/schema';
import type { DashboardDataset } from '@/lib/dashboard-stats';
import type {
  BudgetMap, Expense, Goal, Habit, HabitCategory, LearningPath, Loan,
  Milestone, Project, Priority, Settings, Task, TaskStatus,
} from '@/types';

type TaskRow = typeof tasks.$inferSelect;
type GoalRow = typeof goals.$inferSelect;
type ProjectRow = typeof projects.$inferSelect;
type HabitRow = typeof habits.$inferSelect;
type LearningRow = typeof learningPaths.$inferSelect;
type ExpenseRow = typeof expenses.$inferSelect;
type LoanRow = typeof loans.$inferSelect;
type SettingsRow = typeof settings.$inferSelect;

const iso = (value: Date | null | undefined): string | undefined =>
  value instanceof Date ? value.toISOString() : undefined;

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    priority: row.priority as Priority,
    dueDate: row.dueDate,
    time: row.time ?? undefined,
    tags: row.tags,
    projectId: row.projectId ?? undefined,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    deadline: row.deadline,
    progress: row.progress,
    milestones: (row.milestones ?? []) as Milestone[],
    color: row.color,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    progress: row.progress,
    tasks: (row.tasks ?? []) as Task[],
    milestones: (row.milestones ?? []) as Milestone[],
    color: row.color,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? undefined,
    color: row.color,
    category: row.category as HabitCategory,
    streak: row.streak,
    logs: (row.logs ?? []) as { date: string; count: number }[],
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toLearningPath(row: LearningRow): LearningPath {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    progress: row.progress,
    modules: (row.modules ?? []) as { id: string; name: string; completed: boolean }[],
    color: row.color,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    title: row.title,
    amount: String(row.amount),
    type: row.type,
    category: row.category,
    account: row.account,
    date: row.date,
    notes: row.notes,
    recurring: row.recurring,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toLoan(row: LoanRow): Loan {
  return {
    id: row.id,
    title: row.title,
    counterparty: row.counterparty,
    kind: row.kind,
    principal: String(row.principal),
    paid: String(row.paid),
    date: row.date,
    dueDate: row.dueDate,
    notes: row.notes,
    settled: row.settled,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

function toSettings(row: SettingsRow): Settings {
  return {
    id: row.id,
    displayName: row.displayName,
    email: row.email,
    bio: row.bio,
    dailyReminder: row.dailyReminder,
    goalAlerts: row.goalAlerts,
    accentColor: row.accentColor,
    currency: row.currency ?? 'INR',
    budgets: (row.budgets ?? {}) as BudgetMap,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

/** Fetches everything the dashboard needs for a user in one round of queries. */
export async function getDashboardDataset(userId: string): Promise<DashboardDataset> {
  const [taskRows, goalRows, projectRows, habitRows, learningRows, expenseRows, loanRows] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)),
    db.select().from(goals).where(eq(goals.userId, userId)),
    db.select().from(projects).where(eq(projects.userId, userId)),
    db.select().from(habits).where(eq(habits.userId, userId)),
    db.select().from(learningPaths).where(eq(learningPaths.userId, userId)),
    db.select().from(expenses).where(eq(expenses.userId, userId)),
    db.select().from(loans).where(eq(loans.userId, userId)),
  ]);

  return {
    tasks: taskRows.map(toTask),
    goals: goalRows.map(toGoal),
    projects: projectRows.map(toProject),
    habits: habitRows.map(toHabit),
    learningPaths: learningRows.map(toLearningPath),
    expenses: expenseRows.map(toExpense),
    loans: loanRows.map(toLoan),
  };
}

/** Reads the user's stored settings, creating the row on first visit. */
export async function getUserSettings(userId: string): Promise<Settings> {
  const existing = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  if (existing[0]) return toSettings(existing[0]);

  await db.insert(settings).values({ userId }).onConflictDoNothing();
  const created = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  if (!created[0]) throw new Error('Settings row could not be created');
  return toSettings(created[0]);
}
