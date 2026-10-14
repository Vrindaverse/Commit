import { z } from 'zod';
import { isDateKey } from './date';

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address.' }));

export const passwordField = z
  .string()
  .min(8, { error: 'Must be at least 8 characters.' })
  .max(72, { error: 'Must be 72 characters or fewer.' })
  .regex(/[a-zA-Z]/, { error: 'Must include at least one letter.' })
  .regex(/[0-9]/, { error: 'Must include at least one number.' });

export const signupSchema = z.object({
  name: z.string().trim().min(2, { error: 'Name must be at least 2 characters.' }),
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: 'Enter your password.' }),
});

const milestoneSchema = z.object({
  id: z.string().max(100),
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  completed: z.boolean(),
});

const moduleSchema = z.object({
  id: z.string().max(100),
  name: z.string().trim().min(1, { error: 'Name is required.' }).max(200),
  completed: z.boolean(),
});

const assignmentSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  due: z.string().max(40),
  submitted: z.boolean(),
});

const habitLogSchema = z.object({
  date: z.string().max(40),
  count: z.number().int().min(0).max(100),
});

const projectTaskSchema = z.object({
  id: z.string().max(100),
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  description: z.string().max(5_000),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().max(40),
  time: z.string().max(40).optional(),
  tags: z.array(z.string().max(50)).max(50),
  projectId: z.string().max(100).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const dateField = z
  .string()
  .trim()
  .refine((v) => v === '' || isDateKey(v), { error: 'Enter a valid date.' });
const dueDateField = dateField;
const colorField = z.string().regex(/^#[0-9a-fA-F]{6}$/, { error: 'Enter a valid hex color.' });

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  description: z.string().max(5_000).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: dueDateField,
  time: z.string().max(40).optional(),
  tags: z.array(z.string().max(50)).max(50).optional(),
  projectId: z.string().max(100).optional(),
});

export const goalCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  description: z.string().max(5_000).optional(),
  category: z.enum(['long-term', 'medium-term', 'short-term']),
  deadline: dateField,
  progress: z.number().int().min(0).max(100).optional(),
  milestones: z.array(milestoneSchema).max(200).optional(),
  color: colorField.optional(),
});

export const projectCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  description: z.string().max(5_000).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  tasks: z.array(projectTaskSchema).max(500).optional(),
  milestones: z.array(milestoneSchema).max(200).optional(),
  color: colorField.optional(),
});

export const habitCreateSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required.' }).max(200),
  icon: z.string().max(100).optional(),
  color: colorField.optional(),
  category: z.enum(['compulsory', 'when-free', 'other']).optional(),
  streak: z.number().int().min(0).optional(),
  logs: z.array(habitLogSchema).max(2_000).optional(),
});

export const learningCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  description: z.string().max(5_000).optional(),
  category: z.string().trim().min(1, { error: 'Category is required.' }).max(100),
  progress: z.number().int().min(0).max(100).optional(),
  modules: z.array(moduleSchema).max(500).optional(),
  color: colorField.optional(),
});

export const subjectCreateSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required.' }).max(200),
  code: z.string().max(50),
  attendance: z.number().int().min(0).max(100).optional(),
  assignments: z.array(assignmentSchema).max(500).optional(),
  grade: z.string().max(20).optional(),
  color: colorField.optional(),
});

export const examCreateSchema = z.object({
  subject: z.string().trim().min(1, { error: 'Subject is required.' }).max(200),
  date: dateField,
  time: z.string().max(40).optional(),
  syllabus: z.array(z.string().max(200)).max(200).optional(),
  color: colorField.optional(),
});

export const journalCreateSchema = z.object({
  date: dateField,
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  content: z.string().trim().min(1, { error: 'Content is required.' }).max(20_000),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'awful']),
  tags: z.array(z.string().max(50)).max(50).optional(),
});

const moneyField = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === 'string' ? v.trim() : v))
  .refine((v) => v !== '', { error: 'Amount is required.' })
  .transform((v) => Number(v))
  .refine((n) => Number.isFinite(n), { error: 'Enter a valid amount.' })
  .refine((n) => n >= 0, { error: 'Amount cannot be negative.' })
  .refine((n) => n <= 1_000_000_000, { error: 'Amount is too large.' })
  .transform((n) => n.toFixed(2));

export const expenseCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  amount: moneyField,
  type: z.enum(['income', 'expense']).optional(),
  category: z.enum([
    'food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education',
    'salary', 'freelance', 'investment', 'gift', 'refund', 'other',
  ]),
  account: z.enum(['cash', 'bank', 'card', 'upi', 'other']).optional(),
  date: dateField,
  notes: z.string().max(5_000).optional(),
  recurring: z.boolean().optional(),
});

export const loanCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }).max(200),
  counterparty: z.string().max(200).optional(),
  kind: z.enum(['borrowed', 'lent']).optional(),
  principal: moneyField,
  paid: moneyField.optional(),
  date: dateField,
  dueDate: dueDateField.optional(),
  notes: z.string().max(5_000).optional(),
  settled: z.boolean().optional(),
});

export const settingsUpdateSchema = z.object({
  displayName: z.string().max(100).optional(),
  email: z.union([emailField, z.literal('')]).optional(),
  dailyReminder: z.boolean().optional(),
  goalAlerts: z.boolean().optional(),
  accentColor: colorField.optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
  budgets: z.record(z.string(), z.number()).optional(),
});

const versionField = z.number().int().positive().optional();

export const taskUpdateSchema = taskCreateSchema.partial();
export const goalUpdateSchema = goalCreateSchema.partial().extend({ version: versionField });
export const projectUpdateSchema = projectCreateSchema.partial().extend({ version: versionField });
export const habitUpdateSchema = habitCreateSchema.partial().extend({ version: versionField });
export const learningUpdateSchema = learningCreateSchema.partial().extend({ version: versionField });
export const subjectUpdateSchema = subjectCreateSchema.partial().extend({ version: versionField });
export const examUpdateSchema = examCreateSchema.partial();
export const journalUpdateSchema = journalCreateSchema.partial();
export const expenseUpdateSchema = expenseCreateSchema.partial();
export const loanUpdateSchema = loanCreateSchema.partial();

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
