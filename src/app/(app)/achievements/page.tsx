'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Lock, Star, Zap, BookOpen, Target, Moon, Rocket, Heart, Globe,
  NotebookPen, GraduationCap, Award, Medal, CheckSquare, Flame, Layers,
  Brain, Dumbbell, Droplet, Code, Pen, Sun, ListChecks,
  type LucideIcon,
} from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore } from '@/store/use-store';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  check: () => boolean;
  getDate: () => string;
  tier?: number;
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

function useAchievements() {
  const tasks = useLifeStore(s => s.tasks);
  const goals = useLifeStore(s => s.goals);
  const habits = useLifeStore(s => s.habits);
  const projects = useLifeStore(s => s.projects);
  const learningPaths = useLifeStore(s => s.learningPaths);
  const journalEntries = useLifeStore(s => s.journalEntries);
  const subjects = useLifeStore(s => s.subjects);
  const exams = useLifeStore(s => s.exams);
  const [loginLogs, setLoginLogs] = useState<string[]>([]);
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    fetch('/api/login-logs').then(r => { if (!r.ok) throw new Error('Failed to fetch login logs'); return r.json(); }).then((data: { logs: { date: string }[]; streak: number }) => {
      setLoginLogs(data.logs.map(d => d.date));
      setLoginStreak(data.streak);
    }).catch(() => {});
  }, []);

  return useMemo(() => {
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

    const today = new Date().toISOString().split('T')[0];

    const date = () => today;

    const defs: AchievementDef[] = [
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

    return defs;
  }, [tasks, goals, habits, projects, learningPaths, journalEntries, subjects, exams, loginLogs, loginStreak]);
}
const categoryConfig: Record<string, { label: string; color: string }> = {
  Productivity: { label: 'Productivity', color: '#F8C8C8' },
  Coding: { label: 'Coding', color: '#B8D8F8' },
  Goals: { label: 'Goals', color: '#FFD8BE' },
  Habits: { label: 'Habits', color: '#F7E8A4' },
  Wellness: { label: 'Wellness', color: '#E8D0F8' },
  Projects: { label: 'Projects', color: '#F8D8E8' },
  Learning: { label: 'Learning', color: '#C8F0E8' },
  Journal: { label: 'Journal', color: '#FFF0C0' },
  Academics: { label: 'Academics', color: '#D0E8F8' },
  Login: { label: 'Login', color: '#CDEAC0' },
  Special: { label: 'Special', color: '#F0ECE4' },
};

const iconCache = new Map<string, React.ReactNode>();

function getIcon(Icon: LucideIcon, title: string) {
  const key = title;
  if (!iconCache.has(key)) {
    iconCache.set(key, <Icon size={22} />);
  }
  return iconCache.get(key);
}

function AchievementCard({ achievement, index }: { achievement: { id: string; title: string; description: string; icon: LucideIcon; category: string; unlocked: boolean; date: string }; index: number }) {
  const cat = categoryConfig[achievement.category] || { label: achievement.category, color: '#F0ECE4' };

  if (!achievement.unlocked) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
        <div className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-3 opacity-45 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center justify-center mb-2">
              <Lock size={18} className="text-[#5C5C5C]" />
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] mb-1">{cat.label}</span>
            <h3 className="text-[11px] font-extrabold text-[#5C5C5C]">{achievement.title}</h3>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
    >
      <div className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-3 shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[5px_5px_0px_0px_var(--neo-shadow)] transition-all duration-150">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: index * 0.04 }}
            className="w-12 h-12 rounded-xl border-[2px] border-[#2D2D2D] flex items-center justify-center mb-2 shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
            style={{ backgroundColor: cat.color }}
          >
            {getIcon(achievement.icon, achievement.title)}
          </motion.div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] mb-1">{cat.label}</span>
          <h3 className="text-[11px] font-extrabold text-[#2A2A2A] leading-tight">{achievement.title}</h3>
          <p className="text-[8px] text-[#5C5C5C] font-medium mt-0.5 leading-tight">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const defs = useAchievements();
  const computed = useMemo(() => defs.map(d => ({
    ...d,
    unlocked: d.check(),
    date: d.check() ? d.getDate() : '',
  })), [defs]);

  const unlocked = computed.filter(a => a.unlocked);
  const locked = computed.filter(a => !a.unlocked);
  const completionRate = Math.round((unlocked.length / computed.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description={`${unlocked.length}/${computed.length} unlocked`}
        icon={<Trophy size={20} />}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { label: 'Earned', value: unlocked.length, icon: <Trophy size={14} />, color: '#F7E8A4' },
          { label: 'Complete', value: `${completionRate}%`, icon: <Medal size={14} />, color: '#CDEAC0' },
          { label: 'To Go', value: locked.length, icon: <Star size={14} />, color: '#B8D8F8' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-[3px] border-[#2D2D2D] shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
            style={{ backgroundColor: stat.color }}
          >
            {stat.icon}
            <div>
              <span className="text-lg font-extrabold text-[#2A2A2A]">{stat.value}</span>
              <span className="text-[11px] font-bold text-[#5C5C5C] ml-1 uppercase text-[10px]">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full h-3 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] overflow-hidden"
      >
        <motion.div
          className="h-full rounded-full bg-[#2D2D2D]"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
      </motion.div>

      <div>
        <h2 className="text-lg font-extrabold mb-3">Unlocked ({unlocked.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {unlocked.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
          {unlocked.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm font-medium text-[#5C5C5C]">
              No achievements yet. Start using Commit to earn your first one!
            </div>
          )}
        </div>
      </div>

      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold mb-3 text-[#5C5C5C]">Locked ({locked.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {locked.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
