/** Day-1 in-memory IP daily limit stub (resets on cold start). */
const hits = new Map<string, { day: string; count: number }>();
const LIMIT = 5;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function checkIpLimit(ip: string): { ok: true } | { ok: false; retryAfter: string } {
  const day = todayKey();
  const row = hits.get(ip);
  if (!row || row.day !== day) {
    hits.set(ip, { day, count: 1 });
    return { ok: true };
  }
  if (row.count >= LIMIT) {
    return { ok: false, retryAfter: day };
  }
  row.count += 1;
  return { ok: true };
}
