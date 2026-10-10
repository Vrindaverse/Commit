# LifeOS — Documentation

**Commit - Personal Command Center** is a personal life-management dashboard built as a single-page application. It helps manage tasks, goals, habits, projects, learning paths, academics, journal entries, achievements, and analytics — all in one place.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router) |
| **Language** | TypeScript (strict) |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS v4 + shadcn/ui (base-nova) |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM 0.45 |
| **State** | Zustand 5 |
| **Animation** | Framer Motion 12 |
| **Charts** | Recharts 3 |
| **Drag & Drop** | @dnd-kit |
| **Icons** | Lucide React |
| **Date** | date-fns 4 |
| **Design** | Neobrutalism — thick borders, bold shadows, pastels |

---

## Project Structure

```
lifeos/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (sidebar + mobile nav + theme)
│   │   ├── page.tsx                 # Dashboard (/)
│   │   ├── globals.css              # Tailwind + neobrutalism classes
│   │   ├── academics/page.tsx       # /academics
│   │   ├── achievements/page.tsx    # /achievements
│   │   ├── analytics/page.tsx       # /analytics
│   │   ├── goals/page.tsx           # /goals
│   │   ├── habits/page.tsx          # /habits
│   │   ├── journal/page.tsx         # /journal
│   │   ├── learning/page.tsx        # /learning
│   │   ├── projects/page.tsx        # /projects
│   │   ├── settings/page.tsx        # /settings
│   │   ├── tasks/page.tsx           # /tasks
│   │   └── api/
│   │       ├── tasks/route.ts       # GET, POST
│   │       ├── tasks/[id]/route.ts  # PUT, DELETE
│   │       ├── goals/route.ts
│   │       ├── goals/[id]/route.ts
│   │       ├── projects/route.ts
│   │       ├── projects/[id]/route.ts
│   │       ├── habits/route.ts
│   │       ├── habits/[id]/route.ts
│   │       ├── learning/route.ts
│   │       ├── learning/[id]/route.ts
│   │       ├── subjects/route.ts
│   │       ├── subjects/[id]/route.ts
│   │       ├── exams/route.ts
│   │       ├── exams/[id]/route.ts
│   │       ├── journal/route.ts
│   │       ├── journal/[id]/route.ts
│   │       ├── login-logs/route.ts   # GET (logs+streak), POST (log today)
│   │       └── settings/route.ts     # GET (singleton), PUT
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx           # Desktop floating sidebar + login streak
│   │   │   ├── mobile-nav.tsx        # Radial dial mobile navigation
│   │   │   ├── main-content.tsx      # Content wrapper
│   │   │   ├── theme-provider.tsx    # Accent color CSS variable
│   │   │   └── hydrate-store.tsx     # Calls hydrate() on mount
│   │   ├── shared/
│   │   │   ├── neo-card.tsx          # Animated neobrutalism card
│   │   │   ├── neo-select.tsx        # Custom select dropdown
│   │   │   ├── page-header.tsx       # Page title + description + icon
│   │   │   ├── progress-bar.tsx      # Animated progress bar
│   │   │   ├── empty-state.tsx       # Generic empty state
│   │   │   └── loading-skeleton.tsx  # CardSkeleton + PageSkeleton
│   │   └── ui/                       # shadcn/ui components
│   │       ├── avatar.tsx, badge.tsx, button.tsx, calendar.tsx,
│   │       ├── card.tsx, dialog.tsx, dropdown-menu.tsx, input.tsx,
│   │       ├── progress.tsx, scroll-area.tsx, select.tsx,
│   │       ├── separator.tsx, skeleton.tsx, slider.tsx, switch.tsx,
│   │       ├── tabs.tsx, textarea.tsx, tooltip.tsx
│   ├── db/
│   │   ├── index.ts                  # Neon + Drizzle connection
│   │   ├── schema.ts                 # 10 table definitions
│   │   └── seed.ts                   # Database seed script
│   ├── store/
│   │   └── use-store.ts             # Zustand store (all state + API calls)
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── lib/
│       ├── utils.ts                 # cn() utility (clsx + tailwind-merge)
│       ├── streak.ts                # Login streak calculator
│       └── data.ts                  # Seed data definitions
├── drizzle/                         # Migration files
│   ├── 0000_ancient_master_chief.sql
│   ├── 0001_thin_thing.sql
│   └── meta/
├── drizzle.config.ts
├── components.json                  # shadcn/ui config
└── package.json
```

---

## Routes

### Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Greeting, stats, focus tasks, goal progress, habit streaks, weekly chart, learning |
| `/tasks` | Tasks | Three views: List, Kanban (3 columns), Calendar |
| `/goals` | Goals | Drag-and-drop sortable goals grouped by category, milestones |
| `/projects` | Projects | Expandable cards with tasks and milestones |
| `/habits` | Habits | Contribution grid (GitHub-style), Calendar view, Bar chart |
| `/learning` | Learning | Featured/compact learning path cards with module checklists |
| `/academics` | Academics | Subject cards + exam timeline, modal for subject details |
| `/journal` | Journal | Searchable/filterable journal entries with mood tracking |
| `/achievements` | Achievements | 128 achievement definitions across 11 categories with tier system |
| `/analytics` | Analytics | Charts: productivity trend, goal completion, habit streaks |
| `/settings` | Settings | Accent color picker, export data (JSON), factory reset |

### API Routes

All entities follow a uniform CRUD pattern:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/tasks` | GET, POST | List all / Create task |
| `/api/tasks/[id]` | PUT, DELETE | Update / Delete task |
| `/api/goals` | GET, POST | List all / Create goal |
| `/api/goals/[id]` | PUT, DELETE | Update / Delete goal |
| `/api/projects` | GET, POST | List all / Create project |
| `/api/projects/[id]` | PUT, DELETE | Update / Delete project |
| `/api/habits` | GET, POST | List all / Create habit |
| `/api/habits/[id]` | PUT, DELETE | Update / Delete habit |
| `/api/learning` | GET, POST | List all / Create learning path |
| `/api/learning/[id]` | PUT, DELETE | Update / Delete path |
| `/api/subjects` | GET, POST | List all / Create subject |
| `/api/subjects/[id]` | PUT, DELETE | Update / Delete subject |
| `/api/exams` | GET, POST | List all / Create exam |
| `/api/exams/[id]` | PUT, DELETE | Update / Delete exam |
| `/api/journal` | GET, POST | List all / Create entry |
| `/api/journal/[id]` | PUT, DELETE | Update / Delete entry |
| `/api/login-logs` | GET, POST | Get logs+streak / Log today's visit |
| `/api/settings` | GET, PUT | Get (singleton, auto-create) / Update |

---

## Database Schema (10 tables)

All tables use `uuid` primary keys (default `gen_random_uuid()`) and `created_at` / `updated_at` timestamps.

### tasks
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| title | text (not null) | — |
| description | text | `''` |
| status | text enum: todo / in-progress / done | `'todo'` |
| priority | text enum: low / medium / high / urgent | `'medium'` |
| due_date | text (not null) | — |
| time | text | nullable |
| tags | text[] | `[]` |
| project_id | text | nullable |

### goals
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| title | text (not null) | — |
| description | text | `''` |
| category | text enum: long-term / medium-term / short-term | — |
| deadline | text (not null) | — |
| progress | integer | `0` |
| milestones | jsonb | `[]` |
| color | text | `'#F7E8A4'` |

### projects
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| title | text (not null) | — |
| description | text | `''` |
| progress | integer | `0` |
| tasks | jsonb | `[]` |
| milestones | jsonb | `[]` |
| color | text | `'#B8D8F8'` |

### habits
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| name | text (not null) | — |
| icon | text | nullable |
| color | text | `'#CDEAC0'` |
| streak | integer | `0` |
| logs | jsonb | `[]` |

### learning_paths
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| title | text (not null) | — |
| description | text | nullable |
| category | text (not null) | — |
| progress | integer | `0` |
| modules | jsonb | `[]` |
| color | text | `'#DCCEF5'` |

### subjects
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| name | text (not null) | — |
| code | text (not null) | — |
| attendance | integer | `0` |
| assignments | jsonb | `[]` |
| grade | text | `''` |
| color | text | `'#FFD8BE'` |

### exams
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| subject | text (not null) | — |
| date | text (not null) | — |
| time | text | `''` |
| syllabus | text[] | `[]` |
| color | text | `'#F8C8C8'` |

### journal_entries
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| date | text (not null) | — |
| title | text (not null) | — |
| content | text (not null) | — |
| mood | text enum: great / good / okay / bad / awful | — |
| tags | text[] | `[]` |

### settings (singleton)
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| display_name | text | `'Vrinda'` |
| email | text | `'vrinda@example.com'` |
| daily_reminder | boolean | `true` |
| goal_alerts | boolean | `true` |
| accent_color | text | `'#F7E8A4'` |

### login_logs
| Column | Type | Default |
|--------|------|---------|
| id | uuid (PK) | `gen_random_uuid()` |
| date | text (not null) | — |
| created_at | timestamp | `now()` |

---

## TypeScript Types

Defined in `src/types/index.ts`:

| Type | Description |
|------|-------------|
| `Priority` | `'low' \| 'medium' \| 'high' \| 'urgent'` |
| `TaskStatus` | `'todo' \| 'in-progress' \| 'done'` |
| `GoalCategory` | `'long-term' \| 'medium-term' \| 'short-term'` |
| `Mood` | `'great' \| 'good' \| 'okay' \| 'bad' \| 'awful'` |
| `PageName` | Union of all route names |
| `Task` | id, title, description, status, priority, dueDate, time?, tags, projectId? |
| `Goal` | id, title, description, category, deadline, progress, milestones[], color |
| `Milestone` | id, title, completed |
| `Project` | id, title, description, progress, tasks[], milestones[], color |
| `LearningPath` | id, title, description?, category, progress, modules[], color |
| `Subject` | id, name, code, attendance, assignments[], grade, color |
| `Exam` | id, subject, date, time, syllabus[], color |
| `Habit` | id, name, icon?, color, streak, logs[] |
| `Achievement` | id, title, description, date, category, unlocked |
| `JournalEntry` | id, date, title, content, mood, tags[] |
| `Settings` | id, displayName, email, dailyReminder, goalAlerts, accentColor |
| `AnalyticsData` | productivityTrend[], learningHours[], goalCompletion[], habitStreaks[], weeklyDistribution[] |

---

## State Management (Zustand)

Single store at `src/store/use-store.ts` with the following structure:

### State
- `hydrated: boolean` — whether initial data load is complete
- `tasks`, `goals`, `projects`, `habits`, `learningPaths`, `journalEntries`, `subjects`, `exams` — entity arrays
- `sidebarCollapsed: boolean`
- `settings: Settings`

### Actions

**Initialization:**
- `hydrate()` — fetches all entities from API in parallel via `Promise.all`

**Global:**
- `toggleSidebar()`
- `updateSettings(updates)`

**Tasks:** `addTask`, `updateTask`, `deleteTask`

**Goals:** `addGoal`, `updateGoal`, `deleteGoal`, `reorderGoals`, `addMilestone`, `deleteMilestone`, `toggleMilestone`

**Projects:** `addProject`, `deleteProject`, `updateProject`, `addProjectTask`, `deleteProjectTask`, `updateProjectTask`, `addProjectMilestone`, `deleteProjectMilestone`, `toggleProjectMilestone`

**Habits:** `addHabit`, `deleteHabit`, `toggleHabitLog`, `updateHabit`

**Learning:** `addLearningPath`, `deleteLearningPath`, `updateLearningPath`, `addModule`, `deleteModule`, `renameModule`, `toggleModule`

**Journal:** `addEntry`, `deleteEntry`

**Academics:** `addSubject`, `deleteSubject`, `updateSubject`, `toggleAssignment`, `addAssignment`, `addExam`, `deleteExam`, `updateExam`

**Achievements:** `checkAchievements()` (stub — achievements are computed in `src/app/achievements/page.tsx`)

### Data Flow

```
Pages → Zustand actions → fetch() API → Drizzle ORM → Neon PostgreSQL
```

On mount, `HydrateStore` component calls `hydrate()`. All mutations call the API first, then update local state on success. The store uses a `genId()` counter (`gen_101`, `gen_102`, etc.) for temporary IDs before the API returns the real UUID.

---

## Design System (Neobrutalism)

### CSS Classes (in `globals.css`)
- `.neo-card` — rounded-[20px], border-[3px], thick shadow, hover lift
- `.neo-button` — rounded-xl, border-[3px], active translate-y-1
- `.neo-input` — rounded-xl, border-[3px], focus shadow
- `.bg-paper` — subtle lined paper texture

### Color Palette
- Background: `#F8F5F0` (warm off-white)
- Surface: `#FFFDF8` (card)
- Border/Text: `#2D2D2D` / `#2A2A2A`
- Muted: `#5C5C5C`
- Accent pastels: `#F7E8A4` (yellow), `#B8D8F8` (blue), `#CDEAC0` (green), `#F8C8C8` (pink), `#DCCEF5` (purple), `#FFD8BE` (peach)

### Theme
The `ThemeProvider` component sets a CSS variable `--accent` based on settings, and accent color picker in `/settings` lets users choose their preferred highlight color.

---

## Key Features

### Login Streak
- Auto-logged on app mount via `POST /api/login-logs`
- Streak calculated client-side by counting consecutive days backward
- Popup calendar in sidebar shows per-day login history with month navigation
- Streak displayed in sidebar and mobile badge

### Achievement System
- 128 achievement definitions across 11 categories: Productivity, Coding, Goals, Habits, Wellness, Projects, Learning, Journal, Academics, Login, Special
- Tiered achievements (I–VI) for progressive unlocks
- All computed client-side from store data in `src/app/achievements/page.tsx`
- Checked reactively via `useMemo` whenever data changes

### Mobile Navigation
- Radial dial navigation: swipe up from bottom to open, rotate to select, release to navigate
- Uses Pointer Events API with math-based angle calculation

### Progress Computations
- Goals: `completed_milestones / total_milestones * 100`
- Projects: same milestone-based calculation
- Learning paths: `completed_modules / total_modules * 100`
- Habit streaks: consecutive days with count > 0 via `calcStreak()`

### Settings Page
- Accent color picker (6 color options synced to CSS variable)
- Export all data as JSON (fetches all API endpoints, bundles into single file)
- Factory reset (deletes all entities via API)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migration |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed database with sample data |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |

---

## Notes

- **No authentication** — single-user app (hardcoded "Vrinda"). Auth (NextAuth, Clerk, JWT) is a planned future addition.
- **No test suite** — zero tests exist in the codebase.
- Seed data in `src/lib/data.ts` provides realistic sample content for all entities.
- The `checkAchievements()` store action is a stub; actual achievement computation is done locally in the achievements page component.
