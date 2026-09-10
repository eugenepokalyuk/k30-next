export interface InstructionParagraph {
  type: 'paragraph';
  text: string;
}

export interface InstructionList {
  type: 'list';
  items: string[];
}

export type InstructionBlock = InstructionParagraph | InstructionList;

export function parseInstruction(source: string): InstructionBlock[] {
  if (!source?.trim()) return [];

  return source
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): InstructionBlock => {
      const lines = block.split('\n').map((line) => line.trim());
      const bullets = lines.filter((line) => line.startsWith('- '));

      if (bullets.length === lines.length) {
        return { type: 'list', items: bullets.map((line) => line.slice(2)) };
      }

      return { type: 'paragraph', text: lines.join(' ') };
    });
}

export interface TextPart {
  text: string;
  isAccent: boolean;
}

const ACCENT = /\*\*(.+?)\*\*/g;

export function parseAccents(source: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  for (const match of source.matchAll(ACCENT)) {
    const start = match.index ?? 0;

    if (start > cursor) {
      parts.push({ text: source.slice(cursor, start), isAccent: false });
    }

    parts.push({ text: match[1], isAccent: true });
    cursor = start + match[0].length;
  }

  if (cursor < source.length) {
    parts.push({ text: source.slice(cursor), isAccent: false });
  }

  return parts;
}
