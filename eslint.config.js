import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from 'eslint-plugin-next';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const importOrderRule = [
  'error',
  {
    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '**/dist/**',
      'node_modules/**',
      'logs/**',
      'coverage/**',
      '**/coverage/**',
      '.next/**',
      '**/.next/**',
      '.turbo/**',
      '**/.turbo/**',
      '.venv/**',
      '**/.venv/**',
      '_worktree_*/**',
      'tmp/**',
      'site/.next/**',
      'site/components/Button.tsx',
      'site/out/**',
      'functions/node_modules/**',
      'functions/firebase-debug.log',
      'src/filesystem/jest.config.cjs',
      '.eslintrc.cjs',
      '.prettierrc.cjs',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.es2022,
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.cjs'],
        },
      },
    },
    rules: {
      'import/order': importOrderRule,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  ...tseslint.config(
    {
      files: ['**/*.{ts,tsx,cts,mts}'],
      languageOptions: {
        parserOptions: {
          projectService: {
            allowDefaultProject: [
              'eslint.config.js',
              '*.config.{js,ts,cjs,mjs}',
              'site/*.{js,jsx,ts,tsx}',
              'site/pages/*.{js,jsx,ts,tsx}',
              'site/components/*.{js,jsx,ts,tsx}',
              'functions/*.{js,ts}',
              'functions/*/*.{js,ts}',
            ],
          },
          tsconfigRootDir: import.meta.dirname,
          warnOnUnsupportedTypeScriptVersion: false,
          project: ['./tsconfig.json', './src/git/tsconfig.json'],
        },
        globals: {
          ...globals.es2022,
          ...globals.node,
          ...globals.browser,
        },
      },
      plugins: {
        import: importPlugin,
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: ['tsconfig.json', 'src/*/tsconfig.json', 'functions/tsconfig.json'],
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
          },
        },
      },
    },
    ...tseslint.configs.recommended,
    {
      rules: {
        'no-undef': 'off',
        'import/order': importOrderRule,
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/await-thenable': 'off',
      },
    }
  ),
  {
    files: ['**/__tests__/**/*.{ts,tsx,js,jsx,cjs,mjs}', '**/*.test.{ts,tsx,js,jsx,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'import/order': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['functions/**/*.{js,ts}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import/order': importOrderRule,
    },
  },
  {
    files: ['**/*.cjs', '**/next.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['site/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: nextPlugin,
    },
    rules: {
      // some projects use <img> intentionally; disable the Next.js "no-img-element" rule for now
      '@next/next/no-img-element': 'off',
      'next/no-img-element': 'off',
    },
  },
  {
    files: [
      'scripts/**/*.js',
      'site/scripts/**/*.js',
      'site/tests/**/*.js',
      'site/playwright.config.js',
      'firebase/**',
    ],
    rules: {
      // Allow require() style imports in utility scripts to avoid large refactors during cleanup
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/await-thenable': 'off',
    },
  },
  eslintConfigPrettier
);
