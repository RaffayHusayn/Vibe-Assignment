export function formatDate(date: Date): string {
  // Date-only fields (e.g. event start/end) are stored as UTC midnight for the
  // picked calendar day. Formatting must stay in UTC or the displayed date
  // rolls back a day for any server running behind UTC.
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** A real timestamp (e.g. when a touchpoint was logged) — unlike formatDate,
 * this deliberately uses the local timezone since there's a genuine time-of-day. */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Compact currency for enrichment fields stored as bigint (revenue, funding), e.g. "$4.2M". */
export function formatCompactCurrency(value: bigint | null | undefined): string | null {
  if (value == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value));
}

export function formatDateRange(start: Date, end: Date): string {
  const sameDay =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === end.getUTCDate();

  if (sameDay) {
    return formatDate(start);
  }

  const sameMonthYear =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth();

  if (sameMonthYear) {
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    }).format(start);
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${start.getUTCFullYear()}`;
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}
