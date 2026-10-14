import { pgTable, text, timestamp, jsonb, uuid, integer, boolean, index, uniqueIndex, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  uniqueIndex('users_email_unique').on(t.email),
]);

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
}, (t) => [
  index('sessions_user_idx').on(t.userId),
]);

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  status: text('status', { enum: ['todo', 'in-progress', 'done'] }).default('todo').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium').notNull(),
  dueDate: text('due_date').notNull(),
  time: text('time'),
  tags: text('tags').array().default([]).notNull(),
  projectId: text('project_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('tasks_user_idx').on(t.userId),
]);

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  category: text('category', { enum: ['long-term', 'medium-term', 'short-term'] }).notNull(),
  deadline: text('deadline').notNull(),
  progress: integer('progress').default(0).notNull(),
  milestones: jsonb('milestones').default([]).notNull(),
  color: text('color').default('#F7E8A4').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('goals_user_idx').on(t.userId),
]);

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  progress: integer('progress').default(0).notNull(),
  tasks: jsonb('tasks').default([]).notNull(),
  milestones: jsonb('milestones').default([]).notNull(),
  color: text('color').default('#B8D8F8').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('projects_user_idx').on(t.userId),
]);

export const habits = pgTable('habits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color').default('#CDEAC0').notNull(),
  category: text('category').default('when-free').notNull(),
  streak: integer('streak').default(0).notNull(),
  logs: jsonb('logs').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('habits_user_idx').on(t.userId),
]);

export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  progress: integer('progress').default(0).notNull(),
  modules: jsonb('modules').default([]).notNull(),
  color: text('color').default('#DCCEF5').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('learning_paths_user_idx').on(t.userId),
]);

export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  attendance: integer('attendance').default(0).notNull(),
  assignments: jsonb('assignments').default([]).notNull(),
  grade: text('grade').default('').notNull(),
  color: text('color').default('#FFD8BE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('subjects_user_idx').on(t.userId),
]);

export const exams = pgTable('exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  date: text('date').notNull(),
  time: text('time').default('').notNull(),
  syllabus: text('syllabus').array().default([]).notNull(),
  color: text('color').default('#F8C8C8').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('exams_user_idx').on(t.userId),
]);

export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mood: text('mood', { enum: ['great', 'good', 'okay', 'bad', 'awful'] }).notNull(),
  tags: text('tags').array().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('journal_entries_user_idx').on(t.userId),
]);

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').default('').notNull(),
  email: text('email').default('').notNull(),
  dailyReminder: boolean('daily_reminder').default(true).notNull(),
  goalAlerts: boolean('goal_alerts').default(true).notNull(),
  accentColor: text('accent_color').default('#F7E8A4').notNull(),
  currency: text('currency').default('INR').notNull(),
  budgets: jsonb('budgets').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  uniqueIndex('settings_user_unique').on(t.userId),
]);

export const loginLogs = pgTable('login_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  uniqueIndex('login_logs_user_date_unique').on(t.userId, t.date),
]);

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: text('type', { enum: ['income', 'expense'] }).default('expense').notNull(),
  category: text('category', {
    enum: ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'salary', 'freelance', 'investment', 'gift', 'refund', 'other'],
  }).notNull(),
  account: text('account', { enum: ['cash', 'bank', 'card', 'upi', 'other'] }).default('bank').notNull(),
  date: text('date').notNull(),
  notes: text('notes').default('').notNull(),
  recurring: boolean('recurring').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('expenses_user_date_idx').on(t.userId, t.date),
]);

export const loans = pgTable('loans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  counterparty: text('counterparty').default('').notNull(),
  kind: text('kind', { enum: ['borrowed', 'lent'] }).default('borrowed').notNull(),
  principal: numeric('principal', { precision: 12, scale: 2 }).notNull(),
  paid: numeric('paid', { precision: 12, scale: 2 }).default('0').notNull(),
  date: text('date').notNull(),
  dueDate: text('due_date').default('').notNull(),
  notes: text('notes').default('').notNull(),
  settled: boolean('settled').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('loans_user_idx').on(t.userId),
]);