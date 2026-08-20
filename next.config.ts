import type { NextConfig } from 'next';

/** Хост бэкенда для next/image. Логотипы сервисов лежат на Django, и без
 *  явного разрешения next/image откажется их грузить. Берём из того же
 *  адреса API, чтобы не держать домен в двух переменных. */
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
);

/** Подкаталог, в котором лежит сайт. На GitHub Pages без своего домена это
 *  /k30-next — адрес вида eugenepokalyuk.github.io/k30-next. Со своим
 *  доменом переменную не задают вовсе, и сайт живёт в корне. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Сайт раздаётся как статика с GitHub Pages, поэтому собираем экспорт в out/.
  // Витрина берёт данные из API прямо в браузере, так что правка в админке
  // видна сразу — пересобирать сайт из-за неё не нужно.
  output: 'export',
  // Без слеша на конце Pages отдаёт 404 на /activate: он ищет activate.html,
  // а экспорт кладёт activate/index.html.
  trailingSlash: true,
  basePath,
  images: {
    // На Pages оптимизатора нет — картинки уезжают как есть. Логотипы мелкие,
    // и терять на этом нечего.
    unoptimized: true,
    // Проверка источника работает и при выключенной оптимизации, так что
    // список хостов нужен по-прежнему.
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/media/**',
      },
      // Локальная разработка против Django на localhost:8000.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
