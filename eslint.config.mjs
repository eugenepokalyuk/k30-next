import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      '**/*.config.{js,cjs,mjs,ts}',
      'next-env.d.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React + hooks + правила React Compiler
  ...reactHooks.configs['recommended-latest'],

  // Клиентский код — браузерное окружение, jsx и a11y
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  // Смягчения для первичного внедрения
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      // jsx-a11y — пока советующие предупреждения, не блокеры
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      // Правила React Compiler — пока предупреждения
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/globals': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/component-hook-factories': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/unsupported-syntax': 'warn',
    },
  },

  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // react первым, затем остальные внешние пакеты
            ['^react', '^next', '^@?\\w'],
            // внутренние @-алиасы (см. paths в tsconfig.json):
            // сначала с подпутём (@/utils/hooks), затем голый алиас
            ['^@/(components|store|lib|utils|styles)/', '^@/'],
            // относительные импорты одной группой (без пустых строк между)
            // внутри ./ стили (./foo.module.scss) выше компонентов
            [
              '^\\./.*\\.s?css$',
              '^\\./',
              '^\\.\\./(?!\\.\\.)',
              '^\\.\\./\\.\\./(?!\\.\\.)',
              '^\\.\\.',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },

  // Отключаем стилевые правила, конфликтующие с Prettier
  prettier,
);
