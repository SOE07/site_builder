import type { APIRoute, GetStaticPaths } from 'astro';
import { ladeRatgeber } from '../../lib/inhalt';
import { ratgeberMd } from '../../lib/agent';

export const getStaticPaths: GetStaticPaths = async () => (await ladeRatgeber()).map((r) => ({ params: { slug: r.slug } }));
export const GET: APIRoute = async ({ params }) =>
  new Response(await ratgeberMd(params.slug as string), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
