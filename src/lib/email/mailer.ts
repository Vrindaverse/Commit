import 'server-only';

import { Resend } from 'resend';
import type { OtpPurpose } from '@/lib/auth/otp';
import { otpEmailHtml, otpSubject } from './templates';

const FALLBACK_FROM = 'Commit <onboarding@resend.dev>';

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  return new Resend(apiKey);
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function logOtpToConsole(to: string, purpose: OtpPurpose, code: string): void {
  console.log(`\n[Commit] OTP for ${to} (${purpose}): ${code}\n`);
}

export async function sendOtpEmail({
  to,
  name,
  code,
  purpose,
}: {
  to: string;
  name: string;
  code: string;
  purpose: OtpPurpose;
}): Promise<{ delivered: 'resend' | 'console'; error?: string }> {
  const subject = otpSubject(purpose);
  const html = otpEmailHtml({ purpose, code, name });

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY is not configured in this environment.');
    }
    logOtpToConsole(to, purpose, code);
    return { delivered: 'console' };
  }

  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM || FALLBACK_FROM,
    to: [to],
    subject,
    html,
  });

  if (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Failed to send email: ${error.name} ${error.message}`);
    }
    console.warn(
      `[Commit] Resend rejected delivery to ${to} (${error.name}: ${error.message}). ` +
        'Falling back to console. Verify this address in your Resend account or add a sending domain + EMAIL_FROM.'
    );
    logOtpToConsole(to, purpose, code);
    return { delivered: 'console', error: error.message };
  }

  return { delivered: 'resend' };
}
