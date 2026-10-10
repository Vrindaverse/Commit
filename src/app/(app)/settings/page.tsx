'use client';

import { motion } from 'framer-motion';
import { Settings, Palette, Download, Check, RotateCcw, LogOut } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore } from '@/store/use-store';
import { useRouter } from 'next/navigation';

const accentColors = ['#F7E8A4', '#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#FFD8BE'];

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b-[2px] border-[#2D2D2D] last:border-b-0">
      <div>
        <p className="text-sm font-extrabold">{label}</p>
        <p className="text-xs text-[#5C5C5C] font-medium">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const settings = useLifeStore(s => s.settings);
  const updateSettings = useLifeStore(s => s.updateSettings);
  const clearStore = useLifeStore(s => s.clearStore);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      clearStore();
      router.push('/login');
      router.refresh();
    } catch {
      // fallback
      clearStore();
      window.location.href = '/login';
    }
  };

  const handleExport = async () => {
    const endpoints = ['tasks', 'goals', 'projects', 'habits', 'learning', 'subjects', 'exams', 'journal', 'login-logs'];
    const data: Record<string, unknown> = {};
    for (const ep of endpoints) {
      try {
        const res = await fetch(`/api/${ep}`);
        if (!res.ok) throw new Error(`Export ${ep} failed: ${res.status}`);
        data[ep] = await res.json();
      } catch { /* skip */ }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) return;
    const endpoints = ['tasks', 'goals', 'projects', 'habits', 'learning', 'subjects', 'exams', 'journal', 'login-logs'];
    for (const ep of endpoints) {
      try {
        const res = await fetch(`/api/${ep}`);
        if (!res.ok) throw new Error(`Reset ${ep} failed: ${res.status}`);
        const items: { id: string }[] = await res.json();
        await Promise.all(items.map(item => fetch(`/api/${ep}/${item.id}`, { method: 'DELETE' })));
      } catch { /* skip */ }
    }
    window.location.reload();
  };

  return (
    <div>
      <PageHeader         title="Settings" description="Manage your Commit preferences" icon={<Settings size={20} />} />

      <div className="max-w-2xl space-y-6">
        <NeoCard color="#DCCEF5">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={18} />
            <h2 className="text-base font-extrabold">Appearance</h2>
          </div>
          <SettingRow label="Accent Color" description="Choose your theme accent">
            <div className="flex gap-2">
              {accentColors.map((c) => (
                <button
                  key={c}
                  onClick={() => updateSettings({ accentColor: c })}
                  className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] transition-all relative"
                  style={{ backgroundColor: c }}
                >
                  {settings.accentColor === c && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check size={12} className="text-[#2D2D2D]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </SettingRow>
        </NeoCard>

        <NeoCard color="#F8C8C8">
          <div className="flex items-center gap-3 mb-6">
            <Download size={18} />
            <h2 className="text-base font-extrabold">Data</h2>
          </div>
          <SettingRow label="Export Data" description="Download your Commit data as JSON">
            <button onClick={handleExport} className="neo-button px-4 py-1.5 text-xs bg-[#FFFDF8]">Export</button>
          </SettingRow>
          <SettingRow label="Factory Reset" description="Clear all data and start fresh">
            <button onClick={handleReset} className="neo-button px-4 py-1.5 text-xs bg-[#F8C8C8] flex items-center gap-1">
              <RotateCcw size={12} /> Reset
            </button>
          </SettingRow>
        </NeoCard>

        <NeoCard color="#B8D8F8">
          <div className="flex items-center gap-3 mb-6">
            <LogOut size={18} />
            <h2 className="text-base font-extrabold">Account</h2>
          </div>
          <SettingRow label="Sign Out" description="Log out of your account">
            <button onClick={handleLogout} className="neo-button px-4 py-1.5 text-xs bg-[#B8D8F8] flex items-center gap-1">
              <LogOut size={12} /> Sign out
            </button>
          </SettingRow>
        </NeoCard>
      </div>
    </div>
  );
}
