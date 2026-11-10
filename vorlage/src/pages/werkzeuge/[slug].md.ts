import type { APIRoute, GetStaticPaths } from 'astro';
import { ladeWerkzeuge } from '../../lib/inhalt';
import { werkzeugMd } from '../../lib/agent';

export const getStaticPaths: GetStaticPaths = async () => (await ladeWerkzeuge()).map((w) => ({ params: { slug: w.slug } }));
export const GET: APIRoute = async ({ params }) =>
  new Response(await werkzeugMd(params.slug as string), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
