// Ported from v2.9.4 subscription.js: a human label (remark/email) for a share link.
export function linkName(link: string, idx: number): string {
  try {
    if (link.startsWith('vmess://')) {
      const json = JSON.parse(atob(link.slice('vmess://'.length))) as {
        ps?: string;
        add?: string;
        id?: string;
      };
      if (json.ps) return json.ps;
      if (json.add && json.id) return json.add;
    } else if (/^(vless|trojan|hysteria2?|hy2|tuic):\/\//.test(link)) {
      const hashIdx = link.indexOf('#');
      if (hashIdx !== -1) return decodeURIComponent(link.slice(hashIdx + 1));
      const qIdx = link.indexOf('?');
      if (qIdx !== -1) {
        const qs = new URLSearchParams(link.slice(qIdx + 1));
        const named = qs.get('remark') || qs.get('email');
        if (named) return named;
      }
      const at = link.indexOf('@');
      const protSep = link.indexOf('://');
      if (at !== -1 && protSep !== -1) return link.slice(protSep + 3, at);
    } else {
      const hashIdx = link.indexOf('#');
      if (hashIdx !== -1) return decodeURIComponent(link.slice(hashIdx + 1));
    }
  } catch {
    // fall through to the positional label
  }
  return `Link ${idx + 1}`;
}
