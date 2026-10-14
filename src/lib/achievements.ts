'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Trophy, Star, Zap, BookOpen, Target, Moon, Rocket, Heart, Globe,
  NotebookPen, GraduationCap, Award, Medal, CheckSquare, Flame, Layers,
  Brain, Dumbbell, Droplet, Code, Pen, Sun, ListChecks,
  type LucideIcon,
} from 'lucide-react';
import { useLifeStore } from '@/store/use-store';
import { localDateKey } from '@/lib/date';
import type { Task, Goal, Project, Habit, LearningPath, JournalEntry, Subject, Exam } from '@/types';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  check: () => boolean;
  getDate: () => string;
  tier?: number;
}

export interface AchievementInput {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  projects: Project[];
  learningPaths: LearningPath[];
  journalEntries: JournalEntry[];
  subjects: Subject[];
  exams: Exam[];
  loginLogs: string[];
  loginStreak: number;
}

const tierLabel = ['', ' I', ' II', ' III', ' IV', ' V', ' VI'];

function aDef(
  id: string, title: string, desc: string, icon: LucideIcon,
  category: string, check: () => boolean, getDate: () => string,
  tier?: number,
): AchievementDef {
  const label = tier ? `${title}${tierLabel[tier] || ''}` : title;
  const descText = tier ? `${desc} (Tier ${tier})` : desc;
  return { id, title: label, description: descText, icon, category, check, getDate, tier };
}

export function buildAchievements({
  tasks, goals, habits, projects, learningPaths, journalEntries, subjects, exams, loginLogs, loginStreak,
}: AchievementInput): AchievementDef[] {
  const done = tasks.filter(t => t.status === 'done');
  const doneCount = done.length;
  const urgentDone = done.filter(t => t.priority === 'urgent');
  const highDone = done.filter(t => t.priority === 'high');
  const codingDone = done.filter(t => t.tags.some(tag => ['coding', 'frontend', 'backend'].includes(tag)));
  const allTags = new Set(tasks.flatMap(t => t.tags));
  const allDoneDays = new Set(done.map(t => t.dueDate));

  const goalsComplete = goals.filter(g => g.progress >= 100);
  const allMilestones = goals.flatMap(g => g.milestones);
  const milestonesDone = allMilestones.filter(m => m.completed);
  const categories = new Set(goals.map(g => g.category));
  const shortTermDone = goals.filter(g => g.category === 'short-term' && g.progress >= 100);

  const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0);
  const highStreakHabits = habits.filter(h => h.streak >= 7);
  const totalLogs = habits.reduce((s, h) => s + h.logs.filter(l => l.count > 0).length, 0);
  const loggedHabitNames = new Set(habits.filter(h => h.logs.some(l => l.count > 0)).map(h => h.name));

  const fullProjects = projects.filter(p => p.progress >= 100);
  const projectTasksDone = projects.reduce((s, p) => s + p.tasks.filter(t => t.status === 'done').length, 0);
  const projectMilestonesDone = projects.reduce((s, p) => s + p.milestones.filter(m => m.completed).length, 0);
  const bigProjects = projects.filter(p => p.tasks.length >= 5);

  const pathsDone = learningPaths.filter(lp => lp.progress >= 100);
  const modulesDone = learningPaths.reduce((s, lp) => s + lp.modules.filter(m => m.completed).length, 0);
  const pathCategories = new Set(learningPaths.map(lp => lp.category));

  const entryCount = journalEntries.length;
  const moodTypes = new Set(journalEntries.map(j => j.mood));
  const journalTags = new Set(journalEntries.flatMap(j => j.tags));

  const submitted = subjects.reduce((s, sub) => s + sub.assignments.filter(a => a.submitted).length, 0);

  const loginTotal = loginLogs.length;

  const today = localDateKey();

  const date = () => today;

  return [
    // ── Tasks (22) ──
    aDef('t1', 'Task Tamer', 'Complete tasks', CheckSquare, 'Productivity', () => doneCount >= 1, date, 1),
    aDef('t2', 'Task Tamer', 'Complete tasks', CheckSquare, 'Productivity', () => doneCount >= 5, date, 2),
    aDef('t3', 'Task Tamer', 'Complete tasks', CheckSquare, 'Productivity', () => doneCount >= 10, date, 3),
    aDef('t4', 'Task Tamer', 'Complete tasks', CheckSquare, 'Productivity', () => doneCount >= 25, date, 4),
    aDef('t5', 'Task Tamer', 'Complete tasks', CheckSquare, 'Productivity', () => doneCount >= 50, date, 5),
    aDef('t6', 'Urgent Handler', 'Complete urgent tasks', Zap, 'Productivity', () => urgentDone.length >= 1, date, 1),
    aDef('t7', 'Urgent Handler', 'Complete urgent tasks', Zap, 'Productivity', () => urgentDone.length >= 5, date, 2),
    aDef('t8', 'Urgent Handler', 'Complete urgent tasks', Zap, 'Productivity', () => urgentDone.length >= 10, date, 3),
    aDef('t9', 'High Performer', 'Complete high-priority tasks', Target, 'Productivity', () => highDone.length >= 1, date, 1),
    aDef('t10', 'High Performer', 'Complete high-priority tasks', Target, 'Productivity', () => highDone.length >= 5, date, 2),
    aDef('t11', 'High Performer', 'Complete high-priority tasks', Target, 'Productivity', () => highDone.length >= 10, date, 3),
    aDef('t12', 'Daily Grinder', 'Complete tasks on different days', Sun, 'Productivity', () => allDoneDays.size >= 3, date, 1),
    aDef('t13', 'Daily Grinder', 'Complete tasks on different days', Sun, 'Productivity', () => allDoneDays.size >= 7, date, 2),
    aDef('t14', 'Daily Grinder', 'Complete tasks on different days', Sun, 'Productivity', () => allDoneDays.size >= 14, date, 3),
    aDef('t15', 'Variety Pack', 'Complete tasks across all priority levels', Layers, 'Productivity', () => {
      const levels = new Set(done.map(t => t.priority));
      return levels.size >= 3;
    }, date),
    aDef('t16', 'Tag Master', 'Use 5 different task tags', Star, 'Productivity', () => allTags.size >= 5, date),
    aDef('t17', 'Code Warrior', 'Complete coding tasks', Code, 'Coding', () => codingDone.length >= 1, date, 1),
    aDef('t18', 'Code Warrior', 'Complete coding tasks', Code, 'Coding', () => codingDone.length >= 5, date, 2),
    aDef('t19', 'Code Warrior', 'Complete coding tasks', Code, 'Coding', () => codingDone.length >= 10, date, 3),
    aDef('t20', 'Task Collector', 'Create tasks', ListChecks, 'Productivity', () => tasks.length >= 10, date, 1),
    aDef('t21', 'Task Collector', 'Create tasks', ListChecks, 'Productivity', () => tasks.length >= 25, date, 2),
    aDef('t22', 'Deep Focus', 'Complete 5 high/urgent tasks', Brain, 'Productivity', () => highDone.length + urgentDone.length >= 5, date),

    // ── Goals (20) ──
    aDef('g1', 'Goal Getter', 'Complete goals', Target, 'Goals', () => goalsComplete.length >= 1, date, 1),
    aDef('g2', 'Goal Getter', 'Complete goals', Target, 'Goals', () => goalsComplete.length >= 3, date, 2),
    aDef('g3', 'Goal Getter', 'Complete goals', Target, 'Goals', () => goalsComplete.length >= 5, date, 3),
    aDef('g4', 'Goal Getter', 'Complete goals', Target, 'Goals', () => goalsComplete.length >= 10, date, 4),
    aDef('g5', 'Goal Setter', 'Create goals', Target, 'Goals', () => goals.length >= 3, date, 1),
    aDef('g6', 'Goal Setter', 'Create goals', Target, 'Goals', () => goals.length >= 5, date, 2),
    aDef('g7', 'Goal Setter', 'Create goals', Target, 'Goals', () => goals.length >= 10, date, 3),
    aDef('g8', 'Milestone Maker', 'Complete milestones', Award, 'Goals', () => milestonesDone.length >= 1, date, 1),
    aDef('g9', 'Milestone Maker', 'Complete milestones', Award, 'Goals', () => milestonesDone.length >= 5, date, 2),
    aDef('g10', 'Milestone Maker', 'Complete milestones', Award, 'Goals', () => milestonesDone.length >= 10, date, 3),
    aDef('g11', 'Milestone Maker', 'Complete milestones', Award, 'Goals', () => milestonesDone.length >= 25, date, 4),
    aDef('g12', 'Milestone Maker', 'Complete milestones', Award, 'Goals', () => milestonesDone.length >= 50, date, 5),
    aDef('g13', 'Dream Big', 'Create a long-term goal', Star, 'Goals', () => goals.some(g => g.category === 'long-term'), date),
    aDef('g14', 'Quick Starter', 'Complete a short-term goal', Zap, 'Goals', () => shortTermDone.length > 0, date),
    aDef('g15', 'Balanced', 'Have goals in all 3 categories', Layers, 'Goals', () => categories.size >= 3, date),
    aDef('g16', 'Goal Crusher', 'Complete goals with 100% progress', Trophy, 'Goals', () => goalsComplete.length >= 1, date),
    aDef('g17', 'Think Big', 'Create multiple long-term goals', Star, 'Goals', () => goals.filter(g => g.category === 'long-term').length >= 3, date),
    aDef('g18', 'Short Sprint', 'Complete 3 short-term goals', Zap, 'Goals', () => shortTermDone.length >= 3, date),
    aDef('g19', 'Goal Achiever', 'Create 8+ goals', Target, 'Goals', () => goals.length >= 8, date),
    aDef('g20', 'Overachiever', 'Complete 8+ goals', Trophy, 'Goals', () => goalsComplete.length >= 8, date),

    // ── Habits (24) ──
    aDef('h1', 'Habit Starter', 'Create habits', Flame, 'Habits', () => habits.length >= 1, date, 1),
    aDef('h2', 'Habit Starter', 'Create habits', Flame, 'Habits', () => habits.length >= 3, date, 2),
    aDef('h3', 'Habit Starter', 'Create habits', Flame, 'Habits', () => habits.length >= 5, date, 3),
    aDef('h4', 'Habit Starter', 'Create habits', Flame, 'Habits', () => habits.length >= 10, date, 4),
    aDef('h5', 'Streak Apprentice', 'Reach a habit streak', Flame, 'Habits', () => maxStreak >= 3, date, 1),
    aDef('h6', 'Streak Apprentice', 'Reach a habit streak', Flame, 'Habits', () => maxStreak >= 7, date, 2),
    aDef('h7', 'Streak Apprentice', 'Reach a habit streak', Flame, 'Habits', () => maxStreak >= 14, date, 3),
    aDef('h8', 'Streak Apprentice', 'Reach a habit streak', Flame, 'Habits', () => maxStreak >= 30, date, 4),
    aDef('h9', 'Streak Apprentice', 'Reach a habit streak', Flame, 'Habits', () => maxStreak >= 60, date, 5),
    aDef('h10', 'Consistency King', 'Maintain any streak at 7 days', Award, 'Habits', () => maxStreak >= 7, date),
    aDef('h11', 'Consistency Lord', 'Maintain any streak at 30 days', Award, 'Habits', () => maxStreak >= 30, date),
    aDef('h12', 'Consistency God', 'Maintain any streak at 60 days', Trophy, 'Habits', () => maxStreak >= 60, date),
    aDef('h13', 'Double Streak', 'Have 2 habits with 7+ day streaks', Layers, 'Habits', () => highStreakHabits.length >= 2, date),
    aDef('h14', 'Triple Streak', 'Have 3 habits with 7+ day streaks', Layers, 'Habits', () => highStreakHabits.length >= 3, date),
    aDef('h15', 'Habit Logger', 'Log habit entries', Pen, 'Habits', () => totalLogs >= 10, date, 1),
    aDef('h16', 'Habit Logger', 'Log habit entries', Pen, 'Habits', () => totalLogs >= 50, date, 2),
    aDef('h17', 'Habit Logger', 'Log habit entries', Pen, 'Habits', () => totalLogs >= 100, date, 3),
    aDef('h18', 'All-Rounder', 'Log 3+ different habits in a week', Star, 'Habits', () => loggedHabitNames.size >= 3, date),
    aDef('h19', 'Diverse Habits', 'Create habits with 5+ different names', Layers, 'Habits', () => new Set(habits.map(h => h.name)).size >= 5, date),
    aDef('h20', 'Mindful Meditator', 'Meditation habit with 3+ streak', Heart, 'Wellness', () => {
      const m = habits.find(h => h.name.toLowerCase().includes('meditation'));
      return !!m && m.streak >= 3;
    }, date),
    aDef('h21', 'Fitness Freak', 'Workout habit with 7+ streak', Dumbbell, 'Wellness', () => {
      const w = habits.find(h => h.name.toLowerCase().includes('workout') || h.name.toLowerCase().includes('gym') || h.name.toLowerCase().includes('run') || h.name.toLowerCase().includes('fitness'));
      return !!w && w.streak >= 7;
    }, date),
    aDef('h22', 'Hydrated', 'Water intake habit with 3+ streak', Droplet, 'Wellness', () => {
      const w = habits.find(h => h.name.toLowerCase().includes('water'));
      return !!w && w.streak >= 3;
    }, date),
    aDef('h23', 'Book Lover', 'Reading habit with 7+ streak', BookOpen, 'Habits', () => {
      const r = habits.find(h => h.name.toLowerCase().includes('read'));
      return !!r && r.streak >= 7;
    }, date),
    aDef('h24', 'Perfect Week', 'Log ALL habits for 7 consecutive days', Moon, 'Habits', () => maxStreak >= 7 && habits.length > 0, date),

    // ── Projects (16) ──
    aDef('p1', 'Project Starter', 'Create projects', Rocket, 'Projects', () => projects.length >= 1, date, 1),
    aDef('p2', 'Project Starter', 'Create projects', Rocket, 'Projects', () => projects.length >= 3, date, 2),
    aDef('p3', 'Project Starter', 'Create projects', Rocket, 'Projects', () => projects.length >= 5, date, 3),
    aDef('p4', 'Project Finisher', 'Complete projects to 100%', Trophy, 'Projects', () => fullProjects.length >= 1, date, 1),
    aDef('p5', 'Project Finisher', 'Complete projects to 100%', Trophy, 'Projects', () => fullProjects.length >= 3, date, 2),
    aDef('p6', 'Milestone Achiever', 'Complete project milestones', Award, 'Projects', () => projectMilestonesDone >= 1, date, 1),
    aDef('p7', 'Milestone Achiever', 'Complete project milestones', Award, 'Projects', () => projectMilestonesDone >= 5, date, 2),
    aDef('p8', 'Milestone Achiever', 'Complete project milestones', Award, 'Projects', () => projectMilestonesDone >= 10, date, 3),
    aDef('p9', 'Multi-Tasker', 'Complete tasks across projects', CheckSquare, 'Projects', () => projectTasksDone >= 10, date),
    aDef('p10', 'Project Builder', 'Create projects with 5+ tasks', Layers, 'Projects', () => bigProjects.length >= 1, date, 1),
    aDef('p11', 'Project Builder', 'Create projects with 5+ tasks', Layers, 'Projects', () => bigProjects.length >= 3, date, 2),
    aDef('p12', 'Project Pioneer', 'First project created', Rocket, 'Projects', () => projects.length > 0, date),
    aDef('p13', 'Project Master', 'Complete a project to 100%', Trophy, 'Projects', () => fullProjects.length > 0, date),
    aDef('p14', 'Multi-Project', 'Create 3+ projects', Layers, 'Projects', () => projects.length >= 3, date),
    aDef('p15', 'Shipmaster', 'Complete projects with milestones done', Rocket, 'Projects', () => fullProjects.some(p => p.milestones.filter(m => m.completed).length >= 3), date),
    aDef('p16', 'Portfolio', 'Create 5+ projects', Star, 'Projects', () => projects.length >= 5, date),

    // ── Learning (14) ──
    aDef('l1', 'Learner', 'Create learning paths', BookOpen, 'Learning', () => learningPaths.length >= 1, date, 1),
    aDef('l2', 'Learner', 'Create learning paths', BookOpen, 'Learning', () => learningPaths.length >= 3, date, 2),
    aDef('l3', 'Learner', 'Create learning paths', BookOpen, 'Learning', () => learningPaths.length >= 5, date, 3),
    aDef('l4', 'Module Master', 'Complete modules', CheckSquare, 'Learning', () => modulesDone >= 5, date, 1),
    aDef('l5', 'Module Master', 'Complete modules', CheckSquare, 'Learning', () => modulesDone >= 15, date, 2),
    aDef('l6', 'Module Master', 'Complete modules', CheckSquare, 'Learning', () => modulesDone >= 30, date, 3),
    aDef('l7', 'Path Finisher', 'Complete learning paths to 100%', Trophy, 'Learning', () => pathsDone.length >= 1, date, 1),
    aDef('l8', 'Path Finisher', 'Complete learning paths to 100%', Trophy, 'Learning', () => pathsDone.length >= 3, date, 2),
    aDef('l9', 'Path Finisher', 'Complete learning paths to 100%', Trophy, 'Learning', () => pathsDone.length >= 5, date, 3),
    aDef('l10', 'Diverse Learner', 'Learning paths in 3+ categories', Layers, 'Learning', () => pathCategories.size >= 3, date),
    aDef('l11', 'Bookworm', 'Complete a learning path', BookOpen, 'Learning', () => pathsDone.length > 0, date),
    aDef('l12', 'Polyglot', 'Create 2+ learning paths', Globe, 'Learning', () => learningPaths.length >= 2, date),
    aDef('l13', 'Dedicated Learner', 'Complete 30+ modules', Brain, 'Learning', () => modulesDone >= 30, date),
    aDef('l14', 'Curriculum', 'Create 8+ learning paths', Layers, 'Learning', () => learningPaths.length >= 8, date),

    // ── Journal (14) ──
    aDef('j1', 'Journaler', 'Write journal entries', NotebookPen, 'Journal', () => entryCount >= 1, date, 1),
    aDef('j2', 'Journaler', 'Write journal entries', NotebookPen, 'Journal', () => entryCount >= 5, date, 2),
    aDef('j3', 'Journaler', 'Write journal entries', NotebookPen, 'Journal', () => entryCount >= 10, date, 3),
    aDef('j4', 'Journaler', 'Write journal entries', NotebookPen, 'Journal', () => entryCount >= 25, date, 4),
    aDef('j5', 'Journaler', 'Write journal entries', NotebookPen, 'Journal', () => entryCount >= 50, date, 5),
    aDef('j6', 'Mood Tracker', 'Log different moods', Heart, 'Journal', () => moodTypes.size >= 3, date, 1),
    aDef('j7', 'Mood Tracker', 'Log different moods', Heart, 'Journal', () => moodTypes.size >= 5, date, 2),
    aDef('j8', 'Tag Enthusiast', 'Use different journal tags', Star, 'Journal', () => journalTags.size >= 3, date, 1),
    aDef('j9', 'Tag Enthusiast', 'Use different journal tags', Star, 'Journal', () => journalTags.size >= 7, date, 2),
    aDef('j10', 'Journal Keeper', 'Write 3+ entries', NotebookPen, 'Journal', () => entryCount >= 3, date),
    aDef('j11', 'Reflective', 'Write 10+ entries', Pen, 'Journal', () => entryCount >= 10, date),
    aDef('j12', 'Chronicler', 'Write 25+ entries', BookOpen, 'Journal', () => entryCount >= 25, date),
    aDef('j13', 'Diarist', 'Use all 5 moods', Heart, 'Journal', () => moodTypes.size >= 5, date),
    aDef('j14', 'Consistent Writer', 'Write entries on 7 different days', Sun, 'Journal', () => {
      const days = new Set(journalEntries.map(j => j.date));
      return days.size >= 7;
    }, date),

    // ── Academics (14) ──
    aDef('a1', 'Scholar', 'Create subjects', GraduationCap, 'Academics', () => subjects.length >= 1, date, 1),
    aDef('a2', 'Scholar', 'Create subjects', GraduationCap, 'Academics', () => subjects.length >= 3, date, 2),
    aDef('a3', 'Scholar', 'Create subjects', GraduationCap, 'Academics', () => subjects.length >= 5, date, 3),
    aDef('a4', 'Exam Preparer', 'Create exams', NotebookPen, 'Academics', () => exams.length >= 1, date, 1),
    aDef('a5', 'Exam Preparer', 'Create exams', NotebookPen, 'Academics', () => exams.length >= 3, date, 2),
    aDef('a6', 'Exam Preparer', 'Create exams', NotebookPen, 'Academics', () => exams.length >= 5, date, 3),
    aDef('a7', 'Assignment Master', 'Submit assignments', CheckSquare, 'Academics', () => submitted >= 1, date, 1),
    aDef('a8', 'Assignment Master', 'Submit assignments', CheckSquare, 'Academics', () => submitted >= 5, date, 2),
    aDef('a9', 'Assignment Master', 'Submit assignments', CheckSquare, 'Academics', () => submitted >= 10, date, 3),
    aDef('a10', 'Subject Star', 'Create 2+ subjects', GraduationCap, 'Academics', () => subjects.length >= 2, date),
    aDef('a11', 'Exam Ready', 'Create 3+ exams', NotebookPen, 'Academics', () => exams.length >= 3, date),
    aDef('a12', 'Studious', 'Create 5+ subjects with assignments', Layers, 'Academics', () => subjects.filter(s => s.assignments.length > 0).length >= 5, date),
    aDef('a13', 'Ace', 'Submit all assignments in a subject', Trophy, 'Academics', () => subjects.some(s => s.assignments.length > 0 && s.assignments.every(a => a.submitted)), date),
    aDef('a14', 'Perfect Semester', 'Create both subjects and exams', Star, 'Academics', () => subjects.length > 0 && exams.length > 0, date),

    // ── Login (16) ──
    aDef('d1', 'Regular', 'Consecutive login days', Sun, 'Login', () => loginStreak >= 3, date, 1),
    aDef('d2', 'Regular', 'Consecutive login days', Sun, 'Login', () => loginStreak >= 7, date, 2),
    aDef('d3', 'Regular', 'Consecutive login days', Sun, 'Login', () => loginStreak >= 14, date, 3),
    aDef('d4', 'Regular', 'Consecutive login days', Sun, 'Login', () => loginStreak >= 30, date, 4),
    aDef('d5', 'Regular', 'Consecutive login days', Sun, 'Login', () => loginStreak >= 60, date, 5),
    aDef('d6', 'Dedicated', 'Total login days', Award, 'Login', () => loginTotal >= 5, date, 1),
    aDef('d7', 'Dedicated', 'Total login days', Award, 'Login', () => loginTotal >= 10, date, 2),
    aDef('d8', 'Dedicated', 'Total login days', Award, 'Login', () => loginTotal >= 25, date, 3),
    aDef('d9', 'Dedicated', 'Total login days', Award, 'Login', () => loginTotal >= 50, date, 4),
    aDef('d10', 'Dedicated', 'Total login days', Award, 'Login', () => loginTotal >= 100, date, 5),
    aDef('d11', 'Perfect Attendance', 'Login streak 7 days', Moon, 'Login', () => loginStreak >= 7, date),
    aDef('d12', 'Loyal', 'Login streak 30 days', Star, 'Login', () => loginStreak >= 30, date),
    aDef('d13', 'Devoted', 'Login streak 60 days', Trophy, 'Login', () => loginStreak >= 60, date),
    aDef('d14', 'First Step', 'First login logged', Sun, 'Login', () => loginTotal >= 1, date),
    aDef('d15', 'Committed', 'Login for 50 total days', Medal, 'Login', () => loginTotal >= 50, date),
    aDef('d16', 'All In', 'Login for 100 total days', Trophy, 'Login', () => loginTotal >= 100, date),

    // ── Milestone / Special (8) ──
    aDef('s1', 'First Task', 'Complete your first task', CheckSquare, 'Special', () => doneCount >= 1, date),
    aDef('s2', 'First Goal', 'Create your first goal', Target, 'Special', () => goals.length >= 1, date),
    aDef('s3', 'First Habit', 'Create your first habit', Flame, 'Special', () => habits.length >= 1, date),
    aDef('s4', 'First Project', 'Create your first project', Rocket, 'Special', () => projects.length >= 1, date),
    aDef('s5', 'First Journal', 'Write your first journal entry', NotebookPen, 'Special', () => entryCount >= 1, date),
    aDef('s6', 'First Subject', 'Create your first subject', GraduationCap, 'Special', () => subjects.length >= 1, date),
    aDef('s7', 'First Exam', 'Create your first exam', NotebookPen, 'Special', () => exams.length >= 1, date),
    aDef('s8', 'First Learning Path', 'Create your first learning path', BookOpen, 'Special', () => learningPaths.length >= 1, date),
  ];
}

export function useAchievements(loginData?: { logs: string[]; streak: number }) {
  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const habits = useLifeStore(s => s.habits);
  const projects = useLifeStore(s => s.projects);
  const learningPaths = useLifeStore(s => s.learningPaths);
  const journalEntries = useLifeStore(s => s.journalEntries);
  const subjects = useLifeStore(s => s.subjects);
  const exams = useLifeStore(s => s.exams);
  const [fetched, setFetched] = useState<{ logs: string[]; streak: number }>({ logs: [], streak: 0 });

  useEffect(() => {
    if (loginData) return;
    let cancelled = false;
    fetch(`/api/login-logs?today=${localDateKey()}`)
      .then(r => { if (!r.ok) throw new Error('Failed to fetch login logs'); return r.json(); })
      .then((data: { logs: { date: string }[]; streak: number }) => {
        if (cancelled) return;
        setFetched({ logs: data.logs.map(d => d.date), streak: data.streak });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [loginData]);

  const loginLogs = loginData?.logs ?? fetched.logs;
  const loginStreak = loginData?.streak ?? fetched.streak;

  return useMemo(
    () => buildAchievements({ tasks, goals, habits, projects, learningPaths, journalEntries, subjects, exams, loginLogs, loginStreak }),
    [tasks, goals, habits, projects, learningPaths, journalEntries, subjects, exams, loginLogs, loginStreak],
  );
}
