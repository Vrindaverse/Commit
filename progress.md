# LifeOS Backend Setup — Progress

## ✅ Done

### Database (Drizzle + Neon PostgreSQL)
- [x] Installed `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`
- [x] Created schema with 9 tables in `src/db/schema.ts`
- [x] Generated & pushed migrations to Neon
- [x] Added `.env.local` / `.env.example`

### API Routes
- [x] Full CRUD at `/api/{tasks,goals,projects,habits,learning,subjects,exams,journal,login-logs}`
- [x] All routes confirmed as dynamic (ƒ) in build

### Store → Backend Migration
- [x] Rewrote `src/store/use-store.ts` — all CRUD actions call API instead of localStorage
- [x] Added `hydrate` action — fetches all data on mount
- [x] Created `HydrateStore` component (calls `hydrate` on mount)
- [x] Wrapped app in `HydrateStore` in `layout.tsx`
- [x] Updated sidebar `useLoginStreak` — uses `POST /api/login-logs` instead of localStorage
- [x] Updated settings page export/reset — uses API instead of localStorage

### What's Still Local Only
- Settings (accent color, display name, etc.) are still in-memory only (not persisted to DB)
- The `Settings` table doesn't exist in the DB schema yet

## 📋 Next Steps

### 1. Add a `settings` table to the DB
- Add `settings` table in `src/db/schema.ts`
- Add `/api/settings` GET/PUT route
- Hook store `updateSettings` action + theme provider to API

### 2. Merge login-logs into habits or add a user concept
- `login_logs` table exists but isn't tied to any user
- If you add auth later, link everything to a user ID

### 3. (Optional) Add authentication
- User table with auth (NextAuth, Clerk, or manual JWT)
- `userId` foreign key on all tables
- Filter queries by authenticated user

### 4. (Optional) Move streak calculation server-side
- `calcStreak` still runs client-side in the store
- Could be a DB function or API computed field

### 5. Deployment

#### Prerequisites
- A **Neon PostgreSQL** database (you already have one — grab the connection string from the Neon dashboard)
- A **GitHub** repository with this code pushed
- A **Vercel** account (free tier works)

#### Step-by-step: Vercel

1. **Push your code to GitHub** (if not already):
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import the project in Vercel:**
   - Go to [vercel.com](https://vercel.com) → **Add New Project**
   - Connect your GitHub account and select the repo
   - Vercel auto-detects Next.js — **do not change** the framework preset

3. **Set environment variables:**
   In the Vercel project dashboard → **Settings** → **Environment Variables**, add:
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Neon connection string (e.g. `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`) |

   Also add it for **Preview** and **Development** environments if you want preview deployments to work.

4. **Deploy:**
   - Vercel will run `npm run build` automatically.
   - The build should succeed — API routes become serverless functions (marked `ƒ` in the build output).
   - Your app will be live at `https://<project>.vercel.app`.

5. **Run database migration:**
   After the first deploy, you need to create the tables in production. The easiest way is via Vercel CLI:
   ```bash
   npm i -g vercel
   vercel pull --environment=production
   vercel env pull   # downloads DATABASE_URL locally for production
   npx drizzle-kit push
   ```
   Or use a **one-time Deploy Hook** + script, or run it from your local machine pointing at the production DB:
   ```bash
   DATABASE_URL="<production-neon-url>" npx drizzle-kit push
   ```

   > **Important:** Tables created in dev Neon may already exist in your production Neon instance if it's the same database. `drizzle-kit push` is idempotent — it only creates missing tables/columns.

6. **(Optional) Custom domain:**
   In Vercel dashboard → **Domains** → add your domain. Vercel handles SSL automatically.

#### Troubleshooting

| Symptom | Fix |
|---------|-----|
| API routes return 500 | Check Vercel logs (Runtime Logs). Most likely `DATABASE_URL` is missing or wrong. |
| `DATABASE_URL` not set | Go to Vercel → Settings → Environment Variables → add it, then Redeploy. |
| Tables don't exist | Run `drizzle-kit push` against the production DB (see step 5 above). |
| CORS errors | Not needed — API routes are same-origin with the frontend on Vercel. |
| Build fails with `Module not found` | Ensure all imports use `@/` aliases (Next.js handles these). |

#### No separate backend needed
The `/api/*` routes are Next.js serverless functions inside the same project. The only external service is Neon PostgreSQL, which you connect to via `DATABASE_URL`. No separate backend server or deployment required.
