import 'dotenv/config';
import { db } from './index';
import { tasks, goals, habits, learningPaths, subjects, exams, journalEntries } from './schema';
import { tasks as seedTasks, goals as seedGoals, habits as seedHabits, learningPaths as seedLearning, subjects as seedSubjects, exams as seedExams, journalEntries as seedEntries } from '@/lib/data';

async function seed() {
  console.log('Seeding database...');

  await db.insert(tasks).values(seedTasks as unknown as typeof tasks.$inferInsert[]).onConflictDoNothing();
  await db.insert(goals).values(seedGoals as unknown as typeof goals.$inferInsert[]).onConflictDoNothing();
  await db.insert(habits).values(seedHabits as unknown as typeof habits.$inferInsert[]).onConflictDoNothing();
  await db.insert(learningPaths).values(seedLearning as unknown as typeof learningPaths.$inferInsert[]).onConflictDoNothing();
  await db.insert(subjects).values(seedSubjects as unknown as typeof subjects.$inferInsert[]).onConflictDoNothing();
  await db.insert(exams).values(seedExams as unknown as typeof exams.$inferInsert[]).onConflictDoNothing();
  await db.insert(journalEntries).values(seedEntries as unknown as typeof journalEntries.$inferInsert[]).onConflictDoNothing();

  console.log('Seed complete!');
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seed().catch(err => console.error('Seed failed:', err));
}
