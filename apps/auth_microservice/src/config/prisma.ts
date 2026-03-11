import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('[Prisma] Database connected successfully');
  } catch (error) {
    console.error('[Prisma] Connection failed', error);
    process.exit(1);
  }
};

export default prisma;