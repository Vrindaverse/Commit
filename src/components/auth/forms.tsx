'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { toast } from '@/components/shared/toast';
import { safeNextPath } from '@/lib/utils';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2D2D]/60 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <div
      className="text-xs font-bold text-[#B85042] border-[2px] border-[#2D2D2D] bg-[#FFF0F0] rounded-lg px-3 py-2 mb-4"
      role="alert"
    >
      {message}
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="neo-input w-full text-sm font-bold pr-11"
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#2D2D2D]/50 hover:text-[#2A2A2A] hover:bg-[#F0ECE4] transition-colors cursor-pointer"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function EmailInput({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <Mail
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]/50 pointer-events-none"
      />
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@example.com"
        className="neo-input w-full text-sm font-bold pl-11"
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data.error ?? 'Invalid email or password. Please try again.');
        return;
      }
      toast.success('Welcome back!');
      router.push(safeNextPath(next) ?? '/dashboard');
      router.refresh();
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? <FieldError message={error} /> : null}
      <Field label="Email">
        <EmailInput value={email} onChange={setEmail} autoComplete="email" />
      </Field>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D2D2D]/60">
          Password
        </span>
      </div>
      <div className="mb-5">
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="neo-button px-6 py-3 text-sm bg-[#F7E8A4] w-full cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      toast.success('Account created. Welcome!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? <FieldError message={error} /> : null}
      <Field label="Name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="neo-input w-full text-sm font-bold"
          autoComplete="name"
          required
        />
      </Field>
      <Field label="Email">
        <EmailInput value={email} onChange={setEmail} autoComplete="email" />
      </Field>
      <Field label="Password">
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters with a letter and number"
          autoComplete="new-password"
        />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="neo-button px-6 py-2.5 text-sm bg-[#CDEAC0] w-full cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}