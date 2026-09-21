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

  ...reactHooks.configs['recommended-latest'],

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

  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: [
                'useState',
                'useEffect',
                'useLayoutEffect',
                'useRef',
                'useMemo',
                'useCallback',
                'useId',
                'useReducer',
                'useContext',
                'useTransition',
                'useDeferredValue',
                'useImperativeHandle',
                'useSyncExternalStore',
                'useOptimistic',
                'useActionState',
              ],
              message:
                'Хуки зовём через неймспейс: React.useEffect вместо useEffect. '
                + 'Импортируйте сам React, а из пакета берите только типы',
            },
          ],
        },
      ],
    },
  },

  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
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
            ['^react', '^next', '^@?\\w'],
            ['^@/(components|store|lib|utils|styles)/', '^@/'],
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

  prettier,
);
