module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'vue/no-v-html': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-parsing-error': [
      'error',
      {
        'invalid-first-character-of-tag-name': false,
      },
    ],
    'vue/no-v-for-template-key': 0,
    'prefer-regex-literals': 0,
    'no-console': process.env.ENV === 'production' || process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger':
      process.env.ENV === 'production' || process.env.NODE_ENV === 'production' ? 2 : 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
