import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/dal';
import LandingView from '@/components/landing/landing-view';

export const metadata: Metadata = {
  title: 'Commit — Personal Command Center',
  description:
    'Plan goals, track tasks, build habits, prepare for exams, journal, and manage your finances in one calm, focused console.',
};

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return <LandingView />;
}
