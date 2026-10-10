import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __ironpulse_prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__ironpulse_prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__ironpulse_prisma = prisma;
}

export * from '@prisma/client';
