import { neon } from '@neondatabase/serverless';

const appEnv = process.env.NEXT_PUBLIC_ENV;

function getDatabaseUrl() {
  if (appEnv === "production") {
    return process.env.DATABASE_URL;
  }

  return process.env.PREVIEW_DATABASE_URL;
}

const targetURL = getDatabaseUrl();

if (!targetURL) {
  throw new Error('Unable to determine the database URL. PREVIEW_DATABASE_URL is not set up for non-production, or DATABASE_URL is missing for production.');
}

export const sql = neon(targetURL);