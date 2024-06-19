module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  extends: [
    '@/shared/config/eslint-config-base.js',
    '@/shared/config/eslint-config-prettier'
  ],
};