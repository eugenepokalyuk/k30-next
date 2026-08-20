/** Человеческий текст из ответа DRF.
 *
 *  Django отдаёт ошибки деревом: `{"email": ["…"], "non_field_errors":
 *  ["…"]}`. Под полем нужна одна строка, поэтому берём первую найденную,
 *  а не склеиваем всё подряд — склейка получалась бы длиннее самой формы.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  const throttled = throttleMessage(error);
  if (throttled) return throttled;

  const found = firstString((error as { data?: unknown })?.data);
  if (found) return found;

  // Ответа с телом нет вовсе: сеть, CORS, упавший бэкенд.
  return fallback;
}

/** Отдельный текст на 429.
 *
 *  Общее «не получилось связаться с сервером» здесь врёт: связались, и
 *  проблема не в вводе, а в том, что надо подождать. Покупатель иначе
 *  жмёт кнопку ещё чаще и лимит не отпускает.
 */
export function throttleMessage(error: unknown): string | null {
  if ((error as { status?: number })?.status !== 429) return null;
  return 'Слишком много попыток подряд. Подождите минуту и повторите.';
}

function firstString(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstString(item);
      if (found) return found;
    }
    return null;
  }

  if (value && typeof value === 'object') {
    // detail — стандартное поле DRF для «одной общей ошибки», поэтому
    // проверяем его первым: остальные ключи идут в порядке объявления
    // сериализатора и первым может оказаться не самое понятное поле.
    const record = value as Record<string, unknown>;
    for (const key of ['detail', ...Object.keys(record)]) {
      const found = firstString(record[key]);
      if (found) return found;
    }
  }

  return null;
}
