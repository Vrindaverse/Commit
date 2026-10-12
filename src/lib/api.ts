import { NextResponse } from 'next/server';
import { ZodError, type ZodType } from 'zod';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function readBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new ApiError('Invalid JSON body.', 400, 'INVALID_JSON');
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue?.path?.join('.') || 'input';
    throw new ApiError(issue?.message ?? 'Invalid input.', 400, `INVALID_${field.toUpperCase()}`);
  }
  return result.data;
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? 'Invalid input.', code: 'VALIDATION_ERROR' },
      { status: 400 },
    );
  }
  console.error('[api] unhandled error:', error);
  return NextResponse.json({ error: 'Something went wrong.', code: 'INTERNAL' }, { status: 500 });
}

export function unauthorized(message = 'You must be signed in.'): NextResponse {
  return NextResponse.json({ error: message, code: 'UNAUTHORIZED' }, { status: 401 });
}


