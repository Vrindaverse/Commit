import 'server-only';

import { isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  tasks,
  goals,
  projects,
  habits,
  learningPaths,
  subjects,
  exams,
  journalEntries,
  settings,
  loginLogs,
} from '@/db/schema';

const ownerlessTables = [
  tasks,
  goals,
  projects,
  habits,
  learningPaths,
  subjects,
  exams,
  journalEntries,
  loginLogs,
] as const;

export async function claimLegacyData(userId: string, name: string, email: string): Promise<void> {
  let claimed = 0;

  for (const table of ownerlessTables) {
    const updated = await db
      .update(table)
      .set({ userId })
      .where(isNull(table.userId))
      .returning({ id: table.id });
    claimed += updated.length;
  }

  const existingSettings = await db.select({ id: settings.id }).from(settings).where(isNull(settings.userId)).limit(1);
  const ownSettings = await db.select({ id: settings.id }).from(settings).where(sql`${settings.userId} = ${userId}`).limit(1);

  if (ownSettings.length === 0 && existingSettings.length > 0) {
    await db
      .update(settings)
      .set({ userId, displayName: name, email, updatedAt: new Date() })
      .where(sql`${settings.id} = ${existingSettings[0].id}`);
    claimed += 1;
  }

  if (claimed > 0) {
    await hardenOwnershipColumns();
  }
}

async function hardenOwnershipColumns(): Promise<void> {
  const tables = [
    'tasks',
    'goals',
    'projects',
    'habits',
    'learning_paths',
    'subjects',
    'exams',
    'journal_entries',
    'login_logs',
    'settings',
    'otp_codes',
    'sessions',
  ];
  for (const table of tables) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "${table}" ALTER COLUMN "user_id" SET NOT NULL`));
    } catch {
      // Column already enforces NOT NULL or an ownerless row remains; safe to ignore.
    }
  }
}
