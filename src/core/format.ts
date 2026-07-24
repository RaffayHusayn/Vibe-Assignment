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
