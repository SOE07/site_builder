import type { APIRoute } from 'astro';
import { seiteConfig } from '../lib/inhalt';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nDisallow: /go/\nDisallow: /keystatic/\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap-index.xml', seiteConfig.domain)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
