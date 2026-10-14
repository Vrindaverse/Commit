import { z } from 'zod';

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

export const otpField = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: 'Enter the 6-digit code.' });

export const signupSchema = z.object({
  name: z.string().trim().min(2, { error: 'Name must be at least 2 characters.' }),
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: 'Enter your password.' }),
});

export const otpFormSchema = z.object({ code: otpField });

export const verifyEmailSchema = z.object({ code: otpField });

export const forgotSchema = z.object({ email: emailField });

export const resetSchema = z.object({
  code: otpField,
  password: passwordField,
});

export const accountUpdateSchema = z.object({
  name: z.string().trim().min(2, { error: 'Name must be at least 2 characters.' }),
});

const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

const moduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.boolean(),
});

const assignmentSchema = z.object({
  title: z.string(),
  due: z.string(),
  submitted: z.boolean(),
});

const habitLogSchema = z.object({
  date: z.string(),
  count: z.number().int().min(0),
});

const projectTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
  time: z.string().optional(),
  tags: z.array(z.string()),
  projectId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const dueDateField = z.string();
const colorField = z.string().regex(/^#[0-9a-fA-F]{6}$/, { error: 'Enter a valid hex color.' });

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: dueDateField,
  time: z.string().optional(),
  tags: z.array(z.string()).optional(),
  projectId: z.string().optional(),
});

export const goalCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  description: z.string().optional(),
  category: z.enum(['long-term', 'medium-term', 'short-term']),
  deadline: z.string(),
  progress: z.number().int().min(0).max(100).optional(),
  milestones: z.array(milestoneSchema).optional(),
  color: colorField.optional(),
});

export const projectCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  description: z.string().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  tasks: z.array(projectTaskSchema).optional(),
  milestones: z.array(milestoneSchema).optional(),
  color: colorField.optional(),
});

export const habitCreateSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required.' }),
  icon: z.string().optional(),
  color: colorField.optional(),
  category: z.enum(['compulsory', 'when-free', 'other']).optional(),
  streak: z.number().int().min(0).optional(),
  logs: z.array(habitLogSchema).optional(),
});

export const learningCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  description: z.string().optional(),
  category: z.string().trim().min(1, { error: 'Category is required.' }),
  progress: z.number().int().min(0).max(100).optional(),
  modules: z.array(moduleSchema).optional(),
  color: colorField.optional(),
});

export const subjectCreateSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required.' }),
  code: z.string(),
  attendance: z.number().int().min(0).max(100).optional(),
  assignments: z.array(assignmentSchema).optional(),
  grade: z.string().optional(),
  color: colorField.optional(),
});

export const examCreateSchema = z.object({
  subject: z.string().trim().min(1, { error: 'Subject is required.' }),
  date: z.string(),
  time: z.string().optional(),
  syllabus: z.array(z.string()).optional(),
  color: colorField.optional(),
});

export const journalCreateSchema = z.object({
  date: z.string(),
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  content: z.string().trim().min(1, { error: 'Content is required.' }),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'awful']),
  tags: z.array(z.string()).optional(),
});

const moneyField = z.union([z.string(), z.number()]).transform((v) => String(v));

export const expenseCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  amount: moneyField,
  type: z.enum(['income', 'expense']).optional(),
  category: z.enum([
    'food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education',
    'salary', 'freelance', 'investment', 'gift', 'refund', 'other',
  ]),
  account: z.enum(['cash', 'bank', 'card', 'upi', 'other']).optional(),
  date: z.string(),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
});

export const loanCreateSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required.' }),
  counterparty: z.string().optional(),
  kind: z.enum(['borrowed', 'lent']).optional(),
  principal: moneyField,
  paid: moneyField.optional(),
  date: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  settled: z.boolean().optional(),
});

export const settingsUpdateSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().max(500).optional(),
  dailyReminder: z.boolean().optional(),
  goalAlerts: z.boolean().optional(),
  accentColor: colorField.optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
  budgets: z.record(z.string(), z.number()).optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial();
export const goalUpdateSchema = goalCreateSchema.partial();
export const projectUpdateSchema = projectCreateSchema.partial();
export const habitUpdateSchema = habitCreateSchema.partial();
export const learningUpdateSchema = learningCreateSchema.partial();
export const subjectUpdateSchema = subjectCreateSchema.partial();
export const examUpdateSchema = examCreateSchema.partial();
export const journalUpdateSchema = journalCreateSchema.partial();
export const expenseUpdateSchema = expenseCreateSchema.partial();
export const loanUpdateSchema = loanCreateSchema.partial();

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
