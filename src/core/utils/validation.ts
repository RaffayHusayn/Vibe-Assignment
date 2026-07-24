// Server-side input validation for the shared core. These run inside the
// server actions (the authoritative write path) — frontend validation is UX
// sugar on top, but every rule that matters is enforced here.

/** Shape-check an email address. Does NOT check deliverability. */
export function isValidEmail(email: string): boolean {
  const value = email.trim();
  // One @, non-empty local part, a dotted domain, no whitespace.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Parse a date-ish string, returning null when it isn't a real date. */
export function parseDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
