/** Разбор шаблона инструкции из админки */

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

      // Блок считаем списком, только если списочные все его строки — иначе
      // абзац с одним тире посередине развалился бы на пункты
      if (bullets.length === lines.length) {
        return { type: 'list', items: bullets.map((line) => line.slice(2)) };
      }

      return { type: 'paragraph', text: lines.join(' ') };
    });
}
