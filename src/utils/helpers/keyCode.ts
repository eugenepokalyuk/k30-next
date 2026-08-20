/** Правила кода ключа на стороне витрины.
 *
 *  Формат задаёт бэкенд (k30-api, common/codes.py) — здесь только то, что
 *  нужно полю ввода: подставить дефисы по мере набора и понять, набран
 *  ли код целиком, чтобы не дёргать сервер на каждой букве. Настоящую
 *  проверку (контрольный символ, существование ключа) делает бэкенд:
 *  дублировать её здесь значило бы получить две правды вместо одной.
 */

const PREFIX = 'K30';

/** Длины групп после префикса: провайдер, сервис, ключ, контроль. */
const GROUPS = [4, 4, 6, 1];

const TOTAL_LENGTH =
  PREFIX.length + GROUPS.reduce((sum, length) => sum + length, 0);

/** Символы, которых в алфавите нет, но которые человек напечатает
 *  вместо похожих. Бэкенд раскладывает их так же. */
const LOOKALIKES: Record<string, string> = {
  O: '0',
  I: '1',
  L: '1',
  U: 'V',
};

/** Убирает разделители и раскладывает похожие символы. */
export function normalizeKey(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .replace(/[OILU]/g, (char) => LOOKALIKES[char] ?? char);
}

/** Расставляет дефисы: K30-1E3D-54E3-7A3AF6-K.
 *
 *  Вызывается на каждый ввод, поэтому терпит незаконченный код и не
 *  ставит дефис в конце — иначе курсор прыгал бы за него и стирание
 *  назад начинало бы «залипать».
 */
export function formatKey(raw: string): string {
  const flat = normalizeKey(raw).slice(0, TOTAL_LENGTH);
  if (!flat) return '';

  const parts: string[] = [flat.slice(0, PREFIX.length)];
  let offset = PREFIX.length;

  for (const length of GROUPS) {
    if (flat.length <= offset) break;
    parts.push(flat.slice(offset, offset + length));
    offset += length;
  }

  return parts.join('-');
}

/** Набран ли код целиком. Только длина — контрольный символ считает бэкенд. */
export function isKeyComplete(raw: string): boolean {
  const flat = normalizeKey(raw);
  return flat.length === TOTAL_LENGTH && flat.startsWith(PREFIX);
}
