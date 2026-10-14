'use client';

import { useLifeStore } from '@/store/use-store';
import { toast } from '@/components/shared/toast';

type RouterLike = { push: (href: string) => void; refresh: () => void };

export async function logout(router?: RouterLike): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    useLifeStore.getState().clearStore();
    if (router) {
      router.push('/login');
      router.refresh();
    } else {
      window.location.href = '/login';
    }
  } catch {
    useLifeStore.getState().clearStore();
    window.location.href = '/login';
  }
}

export async function logoutAll(router?: RouterLike): Promise<void> {
  try {
    await fetch('/api/auth/logout-all', { method: 'POST' });
    useLifeStore.getState().clearStore();
    if (router) {
      router.push('/login');
      router.refresh();
    } else {
      window.location.href = '/login';
    }
  } catch {
    useLifeStore.getState().clearStore();
    window.location.href = '/login';
  }
}

const EXPORT_ENDPOINTS = ['tasks', 'goals', 'projects', 'habits', 'learning', 'subjects', 'exams', 'journal', 'expenses', 'loans', 'login-logs'];

export async function exportAllData(): Promise<void> {
  const data: Record<string, unknown> = {};
  let failed = 0;
  for (const ep of EXPORT_ENDPOINTS) {
    try {
      const res = await fetch(`/api/${ep}`);
      if (!res.ok) throw new Error(`Export ${ep} failed: ${res.status}`);
      data[ep] = await res.json();
    } catch {
      failed += 1;
    }
  }
  if (failed === EXPORT_ENDPOINTS.length) {
    toast.error('Export failed. Please try again.');
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `commit-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(failed ? 'Export ready (some data skipped)' : 'Export downloaded');
}
