/** Форматы дат витрины.
 *
 *  Intl вместо библиотеки: форматов нужно два, а dayjs с локалью — лишние
 *  килобайты в бандле ради них.
 */

function parse(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** «14 августа 2026, 21:40» — там, где время что-то значит.
 *
 *  У заказа это момент покупки: по нему сходятся вопрос в поддержку и
 *  запись в админке, и без времени два заказа за один день не различить.
 */
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

/** «14 августа 2026» — там, где время лишнее.
 *
 *  Дата регистрации ровно такой случай: минута, в которую человек завёл
 *  кабинет, ему ни о чём не говорит.
 */
export function formatDate(value: string | null): string {
  const date = parse(value);
  if (!date) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
