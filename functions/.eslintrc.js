module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  extends: ['@/shared/eslint-config-base.js', '@/shared/eslint-config-prettier'],
};