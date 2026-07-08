import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/db';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`[SERVER] Lumen x Deli server listening on port ${PORT}`);
  console.log(`[SERVER] Mode: ${process.env.NODE_ENV || 'development'}`);
  try {
    await prisma.$connect();
    console.log('[DATABASE] MongoDB connected successfully via Prisma.');
  } catch (error) {
    console.error('[DATABASE] Database connection failure:', error);
  }
});

const handleShutdown = async () => {
  console.log('[SERVER] Initiating graceful shutdown...');
  server.close(async () => {
    console.log('[SERVER] Express connections closed.');
    try {
      await prisma.$disconnect();
      console.log('[SERVER] Prisma disconnected successfully.');
    } catch (error) {
      console.error('[SERVER] Error disconnecting Prisma:', error);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
