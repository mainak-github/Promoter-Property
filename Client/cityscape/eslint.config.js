// eslint.config.js
import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...js.configs.recommended.languageOptions.globals,
        window: true,
        document: true,
        setTimeout: true,
        clearTimeout: true,
        console: true,
        localStorage: true,
        // add more as needed
      },
    },
  },
];
