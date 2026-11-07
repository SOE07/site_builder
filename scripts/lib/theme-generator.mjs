// Erzeugt ein komplettes, eigenständiges Theme (theme.css + theme.json) aus einem Seed.
// Jede Seite bekommt andere Farben, Schriften und Layout-Varianten. Danach darf von Hand weiterdesignt werden.
import crypto from 'node:crypto';

export const SCHRIFTEN = [
  { display: 'Fraunces', body: 'Inter', pakete: [['fraunces', [600, 700]], ['inter', [400, 500, 600]]], dstack: 'serif' },
  { display: 'Space Grotesk', body: 'IBM Plex Sans', pakete: [['space-grotesk', [500, 700]], ['ibm-plex-sans', [400, 500, 600]]], dstack: 'sans-serif' },
  { display: 'Merriweather', body: 'Source Sans 3', pakete: [['merriweather', [700]], ['source-sans-3', [400, 600]]], dstack: 'serif' },
  { display: 'DM Serif Display', body: 'DM Sans', pakete: [['dm-serif-display', [400]], ['dm-sans', [400, 500, 700]]], dstack: 'serif' },
  { display: 'Archivo Narrow', body: 'Archivo', pakete: [['archivo-narrow', [600, 700]], ['archivo', [400, 500, 600]]], dstack: 'sans-serif' },
  { display: 'Bitter', body: 'Work Sans', pakete: [['bitter', [600, 700]], ['work-sans', [400, 500, 600]]], dstack: 'serif' },
  { display: 'Playfair Display', body: 'Lato', pakete: [['playfair-display', [600, 700]], ['lato', [400, 700]]], dstack: 'serif' },
  { display: 'Manrope', body: 'Open Sans', pakete: [['manrope', [600, 800]], ['open-sans', [400, 600]]], dstack: 'sans-serif' },
  { display: 'Poppins', body: 'Mulish', pakete: [['poppins', [600, 700]], ['mulish', [400, 600]]], dstack: 'sans-serif' },
  { display: 'Barlow Condensed', body: 'Barlow', pakete: [['barlow-condensed', [600, 700]], ['barlow', [400, 500, 600]]], dstack: 'sans-serif' },
];
const HEADER = ['bar', 'center', 'stack'];
const HERO = ['split', 'stack'];
const TABELLE = ['lines', 'zebra', 'cards'];
const RADIUS = ['sharp', 'soft', 'round'];

export function rng(seed) {
  let h = crypto.createHash('sha256').update(String(seed)).digest();
  let i = 0;
  return () => { if (i >= h.length - 4) { h = crypto.createHash('sha256').update(h).digest(); i = 0; } const v = h.readUInt32BE(i); i += 4; return v / 2 ** 32; };
}
const pick = (r, a) => a[Math.floor(r() * a.length)];

export function waehleTheme(seed) {
  const r = rng(seed);
  const s = pick(r, SCHRIFTEN);
  const hue = Math.floor(r() * 360);
  const accentHue = (hue + 90 + Math.floor(r() * 150)) % 360;
  return {
    header: pick(r, HEADER), hero: pick(r, HERO), table: pick(r, TABELLE), radius: pick(r, RADIUS),
    farben: { hue, accentHue },
    schrift: { display: s.display, body: s.body },
  };
}

// Ähnlichkeit 0..1 zweier theme.json-Objekte (gleiche Merkmale / Gesamtmerkmale)
export function aehnlichkeit(a, b) {
  const nah = (x, y) => { const d = Math.abs(x - y) % 360; return Math.min(d, 360 - d) < 30; };
  const m = [a.header === b.header, a.hero === b.hero, a.table === b.table, a.radius === b.radius,
    a.schrift?.display === b.schrift?.display, a.schrift?.body === b.schrift?.body,
    nah(a.farben?.hue ?? 0, b.farben?.hue ?? 999), nah(a.farben?.accentHue ?? 0, b.farben?.accentHue ?? 999)];
  return m.filter(Boolean).length / m.length;
}

export function themeDateien(t) {
  const s = SCHRIFTEN.find((x) => x.display === t.schrift.display && x.body === t.schrift.body) ?? SCHRIFTEN[0];
  const { hue: h, accentHue: ah } = t.farben;
  const imports = s.pakete.flatMap(([p, ws]) => ws.flatMap((w) => [`@import '@fontsource/${p}/latin-${w}.css';`, `@import '@fontsource/${p}/latin-ext-${w}.css';`])).join('\n');
  const rad = { sharp: ['2px', '3px'], soft: ['8px', '12px'], round: ['14px', '22px'] }[t.radius];
  const css = `${imports}

/* Theme "${t.schrift.display} / ${t.schrift.body}" – erzeugt von scripts/neue-seite.mjs. Das gesamte Design steckt in dieser Datei. */
:root{
  --bg:hsl(${h} 30% 98%); --surface:#fff; --ink:hsl(${h} 35% 12%); --muted:hsl(${h} 12% 36%); --line:hsl(${h} 22% 86%);
  --primary:hsl(${h} 55% 32%); --primary-deep:hsl(${h} 58% 24%); --on-primary:#fff;
  --accent:hsl(${ah} 80% 62%); --on-accent:hsl(${ah} 60% 12%); --link:hsl(${h} 60% 33%);
  --soft:hsl(${h} 35% 94%); --warn-bg:hsl(45 100% 90%); --warn-ink:hsl(40 80% 17%);
  --r1:${rad[0]}; --r2:${rad[1]};
  --font-display:"${t.schrift.display}",${s.dstack === 'serif' ? 'Georgia,serif' : 'system-ui,sans-serif'};
  --font-body:"${t.schrift.body}",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color-scheme:light dark;
}
@media (prefers-color-scheme:dark){:root{
  --bg:hsl(${h} 28% 9%); --surface:hsl(${h} 26% 13%); --ink:hsl(${h} 25% 92%); --muted:hsl(${h} 14% 70%); --line:hsl(${h} 20% 22%);
  --primary:hsl(${h} 55% 40%); --primary-deep:hsl(${h} 55% 30%); --link:hsl(${h} 70% 75%); --soft:hsl(${h} 25% 17%);
  --warn-bg:hsl(45 45% 20%); --warn-ink:hsl(45 70% 85%);
}}
*,*::before,*::after{box-sizing:border-box}
html{scroll-padding-top:90px}
body{margin:0;background:var(--bg);color:var(--ink);font:400 1.0625rem/1.65 var(--font-body);-webkit-font-smoothing:antialiased}
img,svg{max-width:100%}
a{color:var(--link);text-underline-offset:.18em}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}
h1,h2,h3,h4{font-family:var(--font-display);line-height:1.12;margin:0 0 .5em}
h1{font-size:clamp(2.2rem,5.5vw,3.7rem);font-weight:700}
h2{font-size:clamp(1.6rem,3.4vw,2.3rem);font-weight:700;margin-top:1.7em}
h3{font-size:1.5rem;font-weight:700;margin-top:0}
h4{font-size:1.05rem;font-weight:700;font-family:var(--font-body)}
p{margin:0 0 1em}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.prose{max-width:68ch}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip-link{position:absolute;left:-999px;top:8px;background:var(--surface);padding:8px 12px;z-index:100}
.skip-link:focus{left:8px}
[hidden]{display:none!important}

.werbehinweis-oben{background:var(--soft);border-bottom:1px solid var(--line);font-size:.9rem;color:var(--muted);padding:9px 0}
.site-header{background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}
.site-header .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:62px;flex-wrap:wrap}
.brand{font-family:var(--font-display);font-weight:700;font-size:1.5rem;color:var(--ink);text-decoration:none}
nav.main{display:flex;gap:4px;flex-wrap:wrap}
nav.main a{padding:8px 12px;border-radius:var(--r1);text-decoration:none;color:var(--muted);font-weight:600;font-size:.97rem}
nav.main a:hover{color:var(--ink)}
nav.main a[aria-current=page]{color:var(--on-primary);background:var(--primary)}
[data-header=center] .site-header .wrap{flex-direction:column;justify-content:center;padding-top:12px;padding-bottom:8px;gap:2px}
[data-header=center] .brand{font-size:1.9rem}
[data-header=stack] .site-header{position:static;border-bottom:4px solid var(--primary)}
[data-header=stack] .site-header .wrap{flex-direction:column;align-items:flex-start;padding-top:14px;gap:4px}
[data-header=stack] nav.main{margin-left:-12px}

.hero{padding:48px 20px 56px}
.hero-grid{display:grid;gap:44px;align-items:start;grid-template-columns:1fr}
[data-hero=split] .hero[data-finder=ja] .hero-grid{grid-template-columns:1fr 1.05fr}
[data-hero=stack] .hero-text{max-width:760px}
@media (max-width:900px){[data-hero=split] .hero[data-finder=ja] .hero-grid{grid-template-columns:1fr}}
.lede{font-size:1.2rem;color:var(--muted);max-width:42ch}
.facts{list-style:none;padding:0;margin:22px 0 0;display:grid;gap:10px}
.facts li{position:relative;padding-left:28px}
.facts li::before{content:"";position:absolute;left:0;top:.5em;width:13px;height:13px;border-radius:50%;background:var(--accent)}

.finder{background:var(--primary);color:var(--on-primary);border-radius:var(--r2);padding:28px}
.finder h2{margin:0 0 4px;font-size:1.8rem;color:var(--on-primary)}
.finder-schritt{opacity:.85;margin:0 0 14px;font-size:.95rem}
.finder-fortschritt{display:flex;gap:6px;margin-bottom:16px}
.finder-fortschritt span{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.28)}
.finder-fortschritt span.an{background:var(--accent)}
.finder .frage{font-weight:600;font-size:1.2rem;margin:0 0 14px}
.optionen{display:grid;gap:10px}
.finder button.opt{appearance:none;text-align:left;font:inherit;font-weight:500;color:var(--ink);background:var(--surface);border:0;border-radius:var(--r1);padding:14px 16px;cursor:pointer}
.finder button.opt:hover{background:var(--soft)}
.finder .zurueck{background:none;border:0;color:inherit;font:inherit;opacity:.85;cursor:pointer;margin-top:14px;padding:4px 0;text-decoration:underline}
.ergebnis{background:var(--surface);color:var(--ink);border-radius:var(--r1);padding:20px}
.ergebnis h3{margin:6px 0}
.ergebnis .tag{display:inline-block;background:var(--accent);color:var(--on-accent);font-weight:600;font-size:.88rem;padding:2px 10px;border-radius:999px}
.aktionen{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}

.btn{appearance:none;font:inherit;font-weight:600;border:0;border-radius:var(--r1);padding:11px 16px;cursor:pointer;text-decoration:none;display:inline-block}
.btn-primary{background:var(--primary);color:var(--on-primary)}
.btn-primary:hover{background:var(--primary-deep)}
.btn-ghost{background:transparent;color:var(--link);box-shadow:inset 0 0 0 2px var(--line)}
.werbe-marker{font-weight:500}
.werbe-marker small{font-size:.72em;opacity:.85}
.textlink .werbe-marker small{color:var(--muted)}

.block{padding:6px 0 40px}
.table-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r2);background:var(--surface);margin:18px 0}
table.picks{border-collapse:collapse;width:100%;min-width:720px}
table.picks th,table.picks td{text-align:left;padding:13px 16px;vertical-align:middle;border-bottom:1px solid var(--line)}
table.picks thead th{font-size:.9rem;color:var(--muted);background:var(--soft)}
table.picks tbody tr:last-child td{border-bottom:0}
table.picks td.name{font-weight:600}
table.picks td.symbol{width:64px;color:var(--primary)}
table.picks td.symbol svg{width:34px;height:52px}
.klein{font-size:.85rem;color:var(--muted);font-weight:400}
.warn{color:var(--warn-ink);background:var(--warn-bg);padding:0 6px;border-radius:4px}
[data-table=zebra] table.picks tbody tr:nth-child(even){background:var(--soft)}
[data-table=zebra] table.picks td{border-bottom:0}
[data-table=cards] .table-scroll{border:0;background:transparent}
[data-table=cards] table.picks{border-collapse:separate;border-spacing:0 10px}
[data-table=cards] table.picks td{background:var(--surface);border:0}
[data-table=cards] table.picks td:first-child{border-radius:var(--r1) 0 0 var(--r1)}
[data-table=cards] table.picks td:last-child{border-radius:0 var(--r1) var(--r1) 0}
.note{font-size:.92rem;color:var(--muted)}

.guide-list{display:grid;grid-template-columns:repeat(3,1fr);border-top:2px solid var(--ink)}
@media (max-width:800px){.guide-list{grid-template-columns:1fr}}
.guide-list>a,.guide-list>.soon{display:block;padding:18px 18px 22px 0;text-decoration:none;color:var(--ink);border-bottom:1px solid var(--line)}
.guide-list strong{display:block;font-family:var(--font-display);font-size:1.4rem;line-height:1.15;margin-bottom:6px}
.guide-list span{color:var(--muted);font-size:.97rem}
.guide-list .soon{opacity:.6}

.page{padding:36px 0 60px}
.byline{color:var(--muted);font-size:.95rem}
.answer{border-left:4px solid var(--accent);background:var(--surface);padding:16px 20px 4px;border-radius:0 var(--r1) var(--r1) 0;margin:20px 0 28px}
.quick li,.mistakes li{margin-bottom:.6em}
.produkt{padding-top:.5em}
.produkt-kopf{display:flex;gap:16px;align-items:center;margin-top:2.2em}
.produkt-kopf h3{margin:0}
.produkt-kopf .symbol{color:var(--primary);flex:none}
.produkt-kopf .symbol svg{width:34px;height:52px}
.procon{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0 10px}
@media (max-width:640px){.procon{grid-template-columns:1fr}}
.procon>div{background:var(--surface);border:1px solid var(--line);border-radius:var(--r1);padding:14px 16px}
.procon h4{margin:0 0 6px}
.procon ul{margin:0;padding-left:1.1em}
.skip,.widerspruch{background:var(--warn-bg);color:var(--warn-ink);border-radius:var(--r1);padding:10px 14px;margin:10px 0}
.erfahrung{border-left:4px solid var(--primary);padding:4px 16px;margin:14px 0;background:var(--soft)}
.quellen{margin:12px 0;font-size:.93rem}
.quellen summary{cursor:pointer;font-weight:600}
.quellen table{border-collapse:collapse;width:100%;margin-top:8px}
.quellen th,.quellen td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}
.buy{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0 4px}
.faq dt{font-weight:600;margin-top:1em}
.faq dd{margin:4px 0 0}
.author{display:flex;gap:16px;align-items:center;border-top:1px solid var(--line);margin-top:40px;padding-top:24px}
.avatar{width:60px;height:60px;border-radius:50%;background:var(--soft);border:2px solid var(--line);flex:none}

.site-footer{border-top:1px solid var(--line);background:var(--surface);padding:28px 0 32px;font-size:.95rem;color:var(--muted);margin-top:20px}
.site-footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.site-footer a{color:var(--muted);margin-right:16px}
@media (prefers-reduced-motion:no-preference){.finder #finder-buehne>*{animation:ein .22s ease-out}@keyframes ein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}}
`;
  const json = {
    header: t.header, hero: t.hero, table: t.table, radius: t.radius,
    themeColor: `hsl(${h} 55% 32%)`.replace(/hsl\((\d+) 55% 32%\)/, (_, x) => hslHex(+x, 55, 32)),
    farben: t.farben, schrift: t.schrift,
  };
  return { css, json, pakete: s.pakete.map(([p]) => `@fontsource/${p}`) };
}

function hslHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}
