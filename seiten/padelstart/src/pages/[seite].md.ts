import type { APIRoute, GetStaticPaths } from 'astro';
import { SEITEN_MD, seiteMd } from '../lib/agent';

export const getStaticPaths: GetStaticPaths = () => SEITEN_MD.map((seite) => ({ params: { seite } }));
export const GET: APIRoute = async ({ params }) =>
  new Response(await seiteMd(params.seite as (typeof SEITEN_MD)[number]), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
