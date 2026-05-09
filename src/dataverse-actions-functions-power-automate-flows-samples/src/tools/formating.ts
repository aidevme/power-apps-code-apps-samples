/**
 * Formats an ISO date string to a full locale date and time, or returns `'—'` when absent.
 *
 * @param iso - An ISO 8601 date string (e.g. from a Dataverse `modifiedon` field).
 * @returns A human-readable date/time string, or `'—'` when `iso` is `undefined`.
 *
 * @example
 * ```ts
 * formatDate('2026-05-08T14:32:05Z') // 'May 8, 2026, 02:32:05 PM'
 * formatDate(undefined)              // '—'
 * ```
 */
export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}
