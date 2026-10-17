import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Normalizes a MongoDB Atlas / MongoDB URI ensuring a database name is always present.
 * Prevents Atlas Error 8000: 'empty database name not allowed'.
 */
export function normalizeMongoUri(rawUri, defaultDbName = 'kshetraKredit') {
  if (!rawUri || typeof rawUri !== 'string') {
    return null;
  }
  let uri = rawUri.trim();

  // Pattern matching: protocol://user:pass@host[:port][/][?query]
  // Matches when path between host and ? is empty or just '/'
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^\/?#]+)(?:\/)?(?:\?([^#]*))?(#.*)?$/);
  if (match) {
    const hostPart = match[1];
    const queryPart = match[2];
    const hashPart = match[3] || '';

    let queryString = queryPart || 'retryWrites=true&w=majority';
    if (!queryString.includes('retryWrites=')) {
      queryString += '&retryWrites=true&w=majority';
    }

    return `${hostPart}/${defaultDbName}?${queryString}${hashPart}`;
  }

  return uri;
}

export function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!rawUrl) {
    return null;
  }
  return normalizeMongoUri(rawUrl);
}

const normalizedUrl = getDatabaseUrl();

// Reuse PrismaClient instance across hot-reloads and serverless invocations
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: normalizedUrl
      ? {
          db: {
            url: normalizedUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Tests database connectivity and returns metadata.
 * Safe for health check endpoints (no credentials leaked).
 */
export async function checkDatabaseConnection() {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return {
      connected: false,
      error: 'DATABASE_URL or MONGODB_URI environment variable is not defined',
    };
  }

  const startTime = Date.now();
  try {
    const pingResult = await prisma.$runCommandRaw({ ping: 1 });
    const latencyMs = Date.now() - startTime;
    return {
      connected: true,
      latencyMs,
      ping: pingResult,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message || 'Database connection error',
      code: error.code || 'UNKNOWN',
    };
  }
}

export default prisma;
