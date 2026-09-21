const PREFIX = 'K30';

const GROUPS = [4, 4, 6, 1];

const TOTAL_LENGTH =
  PREFIX.length + GROUPS.reduce((sum, length) => sum + length, 0);

const LOOKALIKES: Record<string, string> = {
  O: '0',
  I: '1',
  L: '1',
  U: 'V',
};

export function normalizeKey(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .replace(/[OILU]/g, (char) => LOOKALIKES[char] ?? char);
}

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

export function isKeyComplete(raw: string): boolean {
  const flat = normalizeKey(raw);
  return flat.length === TOTAL_LENGTH && flat.startsWith(PREFIX);
}
