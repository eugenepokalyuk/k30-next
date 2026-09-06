/** Форматы дат витрины. */

function parse(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** «14 августа 2026, 21:40» — там, где время что-то значит. */
export function formatDateTime(value: string | null): string {
  const date = parse(value);
  if (!date) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** «14 августа 2026» — там, где время лишнее. */
export function formatDate(value: string | null): string {
  const date = parse(value);
  if (!date) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
