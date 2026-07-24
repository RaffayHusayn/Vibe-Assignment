// Pure extraction helpers shared by the capture UI (client) and the server
// actions, so the name/company we show at the booth is exactly what we persist.

const WEBMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "live.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
]);

const GENERIC_LOCAL_PARTS = new Set([
  "info",
  "hello",
  "hi",
  "sales",
  "support",
  "contact",
  "team",
  "mail",
  "office",
  "admin",
  "help",
  "careers",
  "press",
  "noreply",
  "no-reply",
]);

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** The lowercased domain after "@", or null if the email has no usable domain. */
export function domainFromEmail(email: string): string | null {
  const at = email.indexOf("@");
  if (at <= 0 || at === email.length - 1) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return null;
  return domain;
}

/**
 * Best-effort display name from an email local-part. Handles `first.last@`,
 * `first_last@`, `first-last@`, AND single tokens like `raffay@gmail.com` →
 * "Raffay". Digits are stripped. Returns null only for generic mailboxes
 * (info@, sales@…) — a missing name beats a wrong one there.
 */
export function nameFromEmail(email: string): string | null {
  const at = email.indexOf("@");
  if (at <= 0) return null;
  const local = email.slice(0, at).trim().toLowerCase();
  if (!local || GENERIC_LOCAL_PARTS.has(local)) return null;

  const parts = local
    .split(/[._-]+/)
    .map((p) => p.replace(/\d+/g, ""))
    .filter(Boolean);
  if (parts.length === 0) return null;

  return parts.map(capitalize).join(" ");
}

/**
 * Best-effort company display name from a domain. Returns null for consumer
 * webmail domains (no company to infer) — e.g. gmail.com → null, acme-corp.com
 * → "Acme Corp".
 */
export function companyFromDomain(domain: string | null): string | null {
  if (!domain) return null;
  const d = domain.trim().toLowerCase();
  if (!d || WEBMAIL_DOMAINS.has(d)) return null;
  const root = d.split(".")[0] ?? d;
  if (!root) return null;
  return root.split(/[-_]+/).filter(Boolean).map(capitalize).join(" ");
}
