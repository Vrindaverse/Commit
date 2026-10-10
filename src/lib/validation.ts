import { z } from 'zod';

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address.' }));

export const passwordField = z
  .string()
  .min(8, { error: 'Must be at least 8 characters.' })
  .max(72, { error: 'Must be 72 characters or fewer.' })
  .regex(/[a-zA-Z]/, { error: 'Must include at least one letter.' })
  .regex(/[0-9]/, { error: 'Must include at least one number.' });

export const otpField = z
  .string()
  .trim()
  .regex(/^\d{6}$/, { error: 'Enter the 6-digit code.' });

export const signupSchema = z.object({
  name: z.string().trim().min(2, { error: 'Name must be at least 2 characters.' }),
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: 'Enter your password.' }),
});

export const otpFormSchema = z.object({ code: otpField });

export const verifyEmailSchema = z.object({ code: otpField });

export const forgotSchema = z.object({ email: emailField });

export const resetSchema = z.object({
  code: otpField,
  password: passwordField,
});

export const accountUpdateSchema = z.object({
  name: z.string().trim().min(2, { error: 'Name must be at least 2 characters.' }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
