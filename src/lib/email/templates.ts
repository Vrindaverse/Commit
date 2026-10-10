import 'server-only';

import type { OtpPurpose } from '@/lib/auth/otp';

const PALETTE = {
  paper: '#F8F5F0',
  card: '#FFFDF8',
  ink: '#2D2D2D',
  muted: '#5C5C5C',
  yellow: '#F7E8A4',
  blue: '#B8D8F8',
  green: '#CDEAC0',
  pink: '#F8C8C8',
};

const COPY: Record<OtpPurpose, { heading: string; blurb: string; subject: string; accent: string }> = {
  login: {
    heading: 'Sign in to LifeOS',
    blurb: 'Use this code to finish signing in. It expires in 10 minutes.',
    subject: 'Your LifeOS sign-in code',
    accent: PALETTE.yellow,
  },
  email_verification: {
    heading: 'Verify your email',
    blurb: 'Enter this code to verify your email address. It expires in 10 minutes.',
    subject: 'Verify your email address',
    accent: PALETTE.blue,
  },
  password_reset: {
    heading: 'Reset your password',
    blurb: 'Enter this code to choose a new password. It expires in 10 minutes.',
    subject: 'Reset your LifeOS password',
    accent: PALETTE.pink,
  },
};

export function otpSubject(purpose: OtpPurpose): string {
  return COPY[purpose].subject;
}

export function otpEmailHtml({ purpose, code, name }: { purpose: OtpPurpose; code: string; name: string }): string {
  const { heading, blurb, accent } = COPY[purpose];
  const digits = code.split('');

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PALETTE.paper};font-family:ui-sans-serif,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.paper};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
            <tr>
              <td style="padding-bottom:20px;">
                <div style="display:inline-flex;align-items:center;gap:10px;">
                  <div style="width:34px;height:34px;border:3px solid ${PALETTE.ink};border-radius:12px;background:${PALETTE.yellow};text-align:center;line-height:28px;font-weight:800;font-size:16px;color:${PALETTE.ink};">L</div>
                  <span style="font-size:16px;font-weight:800;color:${PALETTE.ink};">LifeOS</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="border:3px solid ${PALETTE.ink};border-radius:20px;background:${PALETTE.card};box-shadow:6px 6px 0 0 ${PALETTE.ink};padding:32px 28px;">
                <div style="display:inline-block;border:2px solid ${PALETTE.ink};border-radius:10px;background:${accent};padding:5px 12px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:${PALETTE.ink};">
                  One-time code
                </div>
                <h1 style="margin:18px 0 8px;font-size:24px;line-height:1.15;font-weight:800;color:${PALETTE.ink};">
                  ${heading}
                </h1>
                <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:${PALETTE.ink};">Hi ${escapeHtml(name)},</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${PALETTE.muted};">${blurb}</p>

                <div style="text-align:center;padding:10px 0 4px;">
                  ${digits
                    .map(
                      (d) =>
                        `<span style="display:inline-block;width:44px;height:56px;margin:0 4px;border:3px solid ${PALETTE.ink};border-radius:12px;background:#FBF8F2;box-shadow:3px 3px 0 0 ${PALETTE.ink};font-size:28px;font-weight:800;line-height:50px;color:${PALETTE.ink};font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${d}</span>`,
                    )
                    .join('')}
                </div>

                <p style="margin:24px 0 0;font-size:12.5px;line-height:1.6;color:${PALETTE.muted};">
                  If you didn't request this code, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;text-align:center;font-size:11px;color:${PALETTE.muted};font-weight:600;">
                LifeOS &middot; Your personal command center
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
