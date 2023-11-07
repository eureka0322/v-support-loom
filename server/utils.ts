import { join } from 'path';
import { config } from 'dotenv';

let loadedEnv = false;

const NODE_ENV = process.env.NODE_ENV;

export function getEnv() {
  if (!loadedEnv) {
    loadedEnv = true;

    const path = join(process.cwd(), `.env.${NODE_ENV}`);
    config({ path });
  }

  return process.env;
}

export function plainObj(inst: any) {
  const { ...obj } = inst;
  return obj;
}

export function baseUrl(path?: string): string {
  const env = getEnv();

  const url = env.PUBLIC_URL;
  if (!url) {
    throw new Error(`Could not find the "PUBLIC_URL" environment variable`);
  }

  const base = url;

  if (!path) return base;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base}${path}`;
}

export function videoUrl(path?: string): string {
  const env = getEnv();

  const url = env.PUBLIC_URL;
  if (!url) {
    throw new Error(`Could not find the "PUBLIC_URL" environment variable`);
  }

  const base = `${url}/v`;

  if (!path) return base;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base}${path}`;
}

export function screenUrl(path?: string): string {
  const env = getEnv();

  const url = env.PUBLIC_URL;
  if (!url) {
    throw new Error(`Could not find the "PUBLIC_URL" environment variable`);
  }
  const base = `${url}/s`;

  if (!path) return base;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base}${path}`;
}
