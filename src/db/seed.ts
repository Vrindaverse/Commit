import './load-env';

import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { users, tasks, goals, habits, learningPaths, subjects, exams, journalEntries, projects } from './schema';
import { calcStreak } from '@/lib/habits';
import { localDateKey } from '@/lib/date';
import {
  tasks as seedTasks,
  goals as seedGoals,
  habits as seedHabits,
  learningPaths as seedLearning,
  subjects as seedSubjects,
  exams as seedExams,
  journalEntries as seedEntries,
  projects as seedProjects,
} from '@/lib/data';

const HABIT_PROBABILITIES = [0.7, 0.5, 0.4, 0.3, 0.6];

function makeLogs(seed: number, probability: number, days = 90): { date: string; count: number }[] {
  let state = seed * 2654435761 % 4294967296;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  const logs: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    logs.push({ date: localDateKey(date), count: next() < probability ? 1 : 0 });
  }
  return logs;
}

async function resolveUserId(): Promise<string | null> {
  const explicitId = process.env.SEED_USER_ID?.trim();
  if (explicitId) return explicitId;

  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
  if (!email) return null;

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  return user?.id ?? null;
}

async function seed() {
  console.log('Seeding database...');

  const userId = await resolveUserId();
  if (!userId) {
    console.error(
      'No target user. Set SEED_USER_ID or SEED_USER_EMAIL (to an existing account) and run again.',
    );
    process.exitCode = 1;
    return;
  }

  const [existing] = await db.select({ id: tasks.id }).from(tasks).where(eq(tasks.userId, userId)).limit(1);
  if (existing) {
    console.log('Target user already has data; skipping seed.');
    return;
  }

  const projectIdMap = new Map(seedProjects.map(p => [p.id, randomUUID()]));
  const taskIdMap = new Map(seedTasks.map(t => [t.id, randomUUID()]));

  const projectRows: (typeof projects.$inferInsert)[] = seedProjects.map(p => {
    const projectId = projectIdMap.get(p.id)!;
    return {
      id: projectId,
      userId,
      title: p.title,
      description: p.description,
      progress: p.progress,
      tasks: p.tasks.map(t => ({
        id: taskIdMap.get(t.id)!,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        time: t.time,
        tags: t.tags,
        projectId,
      })),
      milestones: p.milestones,
      color: p.color,
    };
  });

  const taskRows: (typeof tasks.$inferInsert)[] = seedTasks.map(t => ({
    id: taskIdMap.get(t.id)!,
    userId,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    time: t.time ?? null,
    tags: t.tags,
    projectId: t.projectId ? projectIdMap.get(t.projectId) ?? null : null,
  }));

  const goalRows: (typeof goals.$inferInsert)[] = seedGoals.map(g => ({
    userId,
    title: g.title,
    description: g.description,
    category: g.category,
    deadline: g.deadline,
    progress: g.progress,
    milestones: g.milestones,
    color: g.color,
  }));

  const habitRows: (typeof habits.$inferInsert)[] = seedHabits.map((h, i) => {
    const logs = makeLogs(i + 1, HABIT_PROBABILITIES[i] ?? 0.5);
    return {
      userId,
      name: h.name,
      icon: h.icon ?? null,
      color: h.color,
      category: h.category,
      streak: calcStreak(logs),
      logs,
    };
  });

  const learningRows: (typeof learningPaths.$inferInsert)[] = seedLearning.map(lp => ({
    userId,
    title: lp.title,
    description: lp.description ?? null,
    category: lp.category,
    progress: lp.progress,
    modules: lp.modules,
    color: lp.color,
  }));

  const subjectRows: (typeof subjects.$inferInsert)[] = seedSubjects.map(s => ({
    userId,
    name: s.name,
    code: s.code,
    attendance: s.attendance,
    assignments: s.assignments,
    grade: s.grade,
    color: s.color,
  }));

  const examRows: (typeof exams.$inferInsert)[] = seedExams.map(e => ({
    userId,
    subject: e.subject,
    date: e.date,
    time: e.time,
    syllabus: e.syllabus,
    color: e.color,
  }));

  const entryRows: (typeof journalEntries.$inferInsert)[] = seedEntries.map(j => ({
    userId,
    date: j.date,
    title: j.title,
    content: j.content,
    mood: j.mood,
    tags: j.tags,
  }));

  await db.insert(projects).values(projectRows);
  await db.insert(tasks).values(taskRows);
  await db.insert(goals).values(goalRows);
  await db.insert(habits).values(habitRows);
  await db.insert(learningPaths).values(learningRows);
  await db.insert(subjects).values(subjectRows);
  await db.insert(exams).values(examRows);
  await db.insert(journalEntries).values(entryRows);

  console.log('Seed complete!');
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seed().catch(err => console.error('Seed failed:', err));
}
