export function apiErrorMessage(error: unknown, fallback: string): string {
  const throttled = throttleMessage(error);
  if (throttled) return throttled;

  const found = firstString((error as { data?: unknown })?.data);
  if (found) return found;

  return fallback;
}

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
    const record = value as Record<string, unknown>;
    for (const key of ['detail', ...Object.keys(record)]) {
      const found = firstString(record[key]);
      if (found) return found;
    }
  }

  return null;
}
