import type { APIRoute } from 'astro';
import { produkteJson } from '../lib/agent';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await produkteJson(), null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
