module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  env: {
    es2021: true,
    node: true,
  },
  extends: ['@/shared/eslint-config-base.js', "prettier"],
};