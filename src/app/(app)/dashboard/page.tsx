import { verifySession } from '@/lib/auth/dal';
import { getDashboardDataset, getUserSettings } from '@/lib/dashboard-data';
import { computeDashboardStats } from '@/lib/dashboard-stats';
import { quoteOfTheDay } from '@/lib/motivationalQuotes';
import DashboardView from '@/components/dashboard/dashboard-view';

export default async function Dashboard() {
  const user = await verifySession();

  const [dataset, settings] = await Promise.all([
    getDashboardDataset(user.id),
    getUserSettings(user.id),
  ]);

  const stats = computeDashboardStats(dataset);

  return (
    <DashboardView
      initialData={dataset}
      initialStats={stats}
      currency={settings.currency}
      quote={quoteOfTheDay()}
    />
  );
}
