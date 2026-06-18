import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt([
  eslintConfigPrettier,
  {
    ignores: ['node_modules', 'dist', '.nuxt', '.output'],
    rules: {
      // `~/*`꼴의 import 금지
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/*', '~~/*'],
              message: '`~/*` 대신 `@/*`를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
]);
