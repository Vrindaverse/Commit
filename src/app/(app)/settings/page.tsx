'use client';

import { motion } from 'framer-motion';
import { Settings, Palette, Download, Check, RotateCcw, LogOut, User, Mail, Phone, Code2 } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore } from '@/store/use-store';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/shared/toast';

const accentColors = ['#F7E8A4', '#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#FFD8BE'];

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 border-b-[2px] border-[#2D2D2D] last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-extrabold">{label}</p>
        <p className="text-xs text-[#5C5C5C] font-medium">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
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
    let failed = 0;
    for (const ep of endpoints) {
      try {
        const res = await fetch(`/api/${ep}`);
        if (!res.ok) throw new Error(`Export ${ep} failed: ${res.status}`);
        data[ep] = await res.json();
      } catch {
        failed += 1;
      }
    }
    if (failed === endpoints.length) {
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
    clearStore();
    toast.success('All data cleared');
    setTimeout(() => window.location.reload(), 700);
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

        <NeoCard color="#CDEAC0">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} />
            <h2 className="text-base font-extrabold">About</h2>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl border-[3px] border-[#2D2D2D] bg-[#CDEAC0] flex items-center justify-center shrink-0 text-xl font-extrabold">
              NM
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">NIKHIL MAHALIK</p>
              <p className="text-xs text-[#5C5C5C] font-bold">aka Vrinda</p>
              <p className="text-xs text-[#5C5C5C] font-medium mt-0.5">Creator &amp; Developer of Commit</p>
            </div>
          </div>
          <SettingRow label="Email" description="Say hello or send feedback">
            <a
              href="mailto:vrindaverse78@gmail.com"
              className="neo-button px-4 py-1.5 text-xs bg-[#FFFDF8] flex items-center gap-2"
            >
              <Mail size={12} /> vrindaverse78@gmail.com
            </a>
          </SettingRow>
          <SettingRow label="Phone" description="Call or WhatsApp">
            <a
              href="tel:+919149411249"
              className="neo-button px-4 py-1.5 text-xs bg-[#FFFDF8] flex items-center gap-2"
            >
              <Phone size={12} /> +91 91494 11249
            </a>
          </SettingRow>
          <SettingRow label="GitHub" description="See more projects">
            <a
              href="https://github.com/Vrindaverse"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button px-4 py-1.5 text-xs bg-[#FFFDF8] flex items-center gap-2"
            >
              <Code2 size={12} /> @Vrindaverse
            </a>
          </SettingRow>
        </NeoCard>
      </div>
    </div>
  );
}
