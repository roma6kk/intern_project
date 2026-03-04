import { BadRequestException } from '@nestjs/common';

interface CursorPayload {
  id: string;
  createdAt: string;
}

export function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf8').toString('base64');
}

export function decodeCursor(cursor: string): CursorPayload {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const parsed = JSON.parse(json) as Partial<CursorPayload>;

    if (!parsed.id || !parsed.createdAt) {
      throw new Error('Invalid cursor payload');
    }

    return {
      id: parsed.id,
      createdAt: parsed.createdAt,
    };
  } catch {
    throw new BadRequestException('Invalid cursor parameter');
  }
}

