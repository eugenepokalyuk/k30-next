/** Разбор шаблона инструкции из админки.
 *
 *  Менеджер пишет текст в обычной textarea, без разметки. Markdown-парсер
 *  ради этого тянуть незачем, а рендерить сырой HTML из админки нельзя:
 *  поле правят люди, и одна вставленная из письма ссылка со скриптом
 *  стала бы XSS на странице, где вводят токен от чужого аккаунта.
 *
 *  Правила ровно два: пустая строка разделяет блоки, строка с «- »
 *  в начале — пункт списка. Они же описаны в подсказке к полю в админке.
 */

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

      // Блок считаем списком, только если списочные все его строки —
      // иначе абзац с одним тире посередине развалился бы на пункты.
      if (bullets.length === lines.length) {
        return { type: 'list', items: bullets.map((line) => line.slice(2)) };
      }

      return { type: 'paragraph', text: lines.join(' ') };
    });
}
