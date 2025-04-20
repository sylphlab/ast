// eslint.config.js
import love from 'eslint-config-love';

export default [
  ...love,
  // Add any project-specific overrides or additional configurations here
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '.turbo/**',
    ],
  },
];