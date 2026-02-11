import { neon } from '@neondatabase/serverless';

const appEnv = process.env.APP_ENV;
const vercelEnv = process.env.VERCEL_ENV;

function getDatabaseUrl() {

// console.log(`App Environment: ${appEnv}`);
// console.log(`Vercel Environment: ${vercelEnv}`);

  if (vercelEnv === "production") {
    return process.env.DATABASE_URL;
  }

  if (vercelEnv === "preview") {
    return process.env.PREVIEW_DATABASE_URL ?? process.env.DATABASE_URL;
  }

  if (appEnv === "staging") {
    return process.env.PREVIEW_DATABASE_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL;
  }

  return process.env.PREVIEW_DATABASE_URL ?? process.env.DATABASE_URL;
}

const targetURL = getDatabaseUrl();

if (!targetURL) {
  throw new Error('Unable to determine the database URL. DATABASE_URL or PREVIEW_DATABASE_URL is not set up.');
}

export const sql = neon(targetURL);