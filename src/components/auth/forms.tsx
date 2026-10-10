'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Loader2 } from 'lucide-react';

const RESEND_COOLDOWN = 60;

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
        className="neo-input w-full text-sm font-bold pl-10"
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

function useCountdown(initial: number) {
  const [secondsLeft, setSecondsLeft] = useState(initial);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const reset = (seconds: number) => setSecondsLeft(seconds);

  return { secondsLeft, reset };
}

function formatCountdown(total: number): string {
  const s = Math.max(0, total);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r >= 10 ? `${m}:${r}` : `${m}:0${r}`;
}

function parseCooldownSeconds(error?: string): number | null {
  const match = error?.match(/wait\s+(\d+)s/i);
  return match ? Number(match[1]) : null;
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
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          router.push('/verify-email');
          return;
        }
        setError(data.error ?? 'Invalid email or password. Please try again.');
        return;
      }
      router.push(next ? `/verify?next=${encodeURIComponent(next)}` : '/verify');
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
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-[#2D2D2D]/60 hover:text-[#2A2A2A] underline underline-offset-2"
        >
          Forgot password?
        </Link>
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
        className="neo-button px-6 py-3 text-sm bg-[#F7E8A4] w-full cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
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
      router.push('/verify-email');
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

export function VerifyCodeForm({
  endpoint,
  purpose,
  next,
}: {
  endpoint: '/api/auth/verify-otp' | '/api/auth/verify-email';
  purpose: string;
  next?: string;
}) {
  const router = useRouter();
  const { secondsLeft, reset } = useCountdown(RESEND_COOLDOWN);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const canResend = secondsLeft <= 0 && !resending;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data.error ?? 'That code did not work. Please try again.');
        return;
      }
      router.push(next || data.next || '/');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!canResend) return;
    setResending(true);
    setResent(false);
    setError(null);
    try {
      const res = await fetch('/api/auth/resend-otp', { method: 'POST' });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        if (data.code === 'NO_CHALLENGE') {
          router.push('/login');
          return;
        }
        const wait = parseCooldownSeconds(data.error) ?? RESEND_COOLDOWN;
        reset(wait);
        setError(data.error ?? 'Unable to resend the code.');
        return;
      }
      reset(RESEND_COOLDOWN);
      setResent(true);
    } catch {
      reset(RESEND_COOLDOWN);
      setError('Unable to resend the code.');
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? <FieldError message={error} /> : null}
      {resent ? (
        <p className="text-xs font-bold text-[#2A2A2A] bg-[#CDEAC0] border-[2px] border-[#2D2D2D] rounded-lg px-3 py-2 mb-4">
          New code sent. Check your inbox (or terminal in dev mode).
        </p>
      ) : null}
      <Field label={`Verification code · ${purpose}`}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="neo-input w-full text-lg font-extrabold text-center tracking-[0.5em]"
          autoFocus
          required
        />
      </Field>
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="neo-button px-6 py-2.5 text-sm bg-[#F7E8A4] w-full cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Verifying…' : 'Verify & continue'}
      </button>
      <button
        type="button"
        onClick={onResend}
        disabled={!canResend}
        className="mt-4 w-full text-xs font-bold text-[#5C5C5C] hover:text-[#2A2A2A] underline underline-offset-2 disabled:no-underline disabled:cursor-not-allowed disabled:hover:text-[#5C5C5C]"
      >
        {resending
          ? 'Sending…'
          : canResend
            ? "Didn't get it? Resend code"
            : `Resend code in ${formatCountdown(secondsLeft)}`}
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      router.push('/reset-password');
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
      <p className="text-[11px] font-medium text-[#2D2D2D]/60 mb-5">
        If an account exists for this email, we&apos;ll send a reset code.
      </p>
      <button
        type="submit"
        disabled={loading}
        className="neo-button px-6 py-2.5 text-sm bg-[#B8D8F8] w-full cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Send reset code'}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const { secondsLeft, reset } = useCountdown(RESEND_COOLDOWN);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const canResend = secondsLeft <= 0 && !resending;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      router.push('/');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!canResend) return;
    setResending(true);
    setResent(false);
    setError(null);
    try {
      const res = await fetch('/api/auth/resend-otp', { method: 'POST' });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        if (data.code === 'NO_CHALLENGE') {
          router.push('/forgot-password');
          return;
        }
        const wait = parseCooldownSeconds(data.error) ?? RESEND_COOLDOWN;
        reset(wait);
        setError(data.error ?? 'Unable to resend the code.');
        return;
      }
      reset(RESEND_COOLDOWN);
      setResent(true);
    } catch {
      reset(RESEND_COOLDOWN);
      setError('Unable to resend the code.');
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? <FieldError message={error} /> : null}
      {resent ? (
        <p className="text-xs font-bold text-[#2A2A2A] bg-[#CDEAC0] border-[2px] border-[#2D2D2D] rounded-lg px-3 py-2 mb-4">
          New code sent. Check your inbox (or terminal in dev mode).
        </p>
      ) : null}
      <Field label="Reset code">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="neo-input w-full text-sm font-extrabold text-center tracking-[0.3em]"
          autoFocus
          required
        />
      </Field>
      <Field label="New password">
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters with a letter and number"
          autoComplete="new-password"
        />
      </Field>
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="neo-button px-6 py-2.5 text-sm bg-[#CDEAC0] w-full cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Resetting…' : 'Reset password'}
      </button>
      <button
        type="button"
        onClick={onResend}
        disabled={!canResend}
        className="mt-4 w-full text-xs font-bold text-[#5C5C5C] hover:text-[#2A2A2A] underline underline-offset-2 disabled:no-underline disabled:cursor-not-allowed disabled:hover:text-[#5C5C5C]"
      >
        {resending
          ? 'Sending…'
          : canResend
            ? "Didn't get the code? Resend"
            : `Resend code in ${formatCountdown(secondsLeft)}`}
      </button>
    </form>
  );
}