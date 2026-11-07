// Mini-Formatierung für Redaktionstexte: Absätze, Listen ("- " und "1. "), **fett**, [Text](/pfad).
export function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // nur interne Links (/…) und #Anker; externe Affiliate-Links gehören in Produktdaten
    .replace(/\[([^\]]+)\]\(((?:\/|#)[^)\s]*)\)/g, '<a href="$2">$1</a>');
}

export function richtext(s: string | null | undefined): string {
  const blocks = String(s ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((b) => {
      const zeilen = b.split('\n');
      if (zeilen.every((z) => /^[-*]\s+/.test(z))) return '<ul>' + zeilen.map((z) => `<li>${inline(z.replace(/^[-*]\s+/, ''))}</li>`).join('') + '</ul>';
      if (zeilen.every((z) => /^\d+[.)]\s+/.test(z))) return '<ol>' + zeilen.map((z) => `<li>${inline(z.replace(/^\d+[.)]\s+/, ''))}</li>`).join('') + '</ol>';
      return '<p>' + zeilen.map(inline).join('<br>') + '</p>';
    })
    .join('');
}

export function datumDe(iso: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '';
}

export function nurText(s: string | null | undefined): string {
  return String(s ?? '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
}
