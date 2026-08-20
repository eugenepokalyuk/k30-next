import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import clsx from 'clsx';

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  weight: ['500', '600', '700', '800'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

// Код ключа и настоящие токены — моноширинным: группы символов встают
// столбиком, и покупателю проще сверить код с тем, что ему прислали.
const jetBrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  weight: ['400', '500'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export function getFonts() {
  return clsx(interSans.variable, manrope.variable, jetBrainsMono.variable);
}
