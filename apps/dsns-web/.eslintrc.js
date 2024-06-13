module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: [
    '@/shared/eslint-config-base.js',
    '@/shared-client/eslint-config-client.js',
    '@/shared/eslint-config-prettier'
  ],
};
