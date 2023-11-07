/**
 * DO NOT PUT SENSITIVE INFORMATION LIKE ACCESS DATA HERE, THIS FILE WILL BE BUNDLED TO THE CLIENT!
 * DO NOT USE PRIVATE VARIABLES FROM process.env EITHER!
 */

export const PUBLIC_URL = 'http://localhost:3000';

export function baseUrl(path) {
  let base_path = PUBLIC_URL;
  if (!path) return base_path;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base_path}${path}`;
}

export function videoUrl(path) {
  let base_path = `${PUBLIC_URL}/v`;
  if (!path) return base_path;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base_path}${path}`;
}

export function screenUrl(path) {
  const base_path = `${PUBLIC_URL}/s`;
  if (!path) return base_path;
  if (!path.startsWith('/')) path = `/${path}`;

  return `${base_path}${path}`;
}
