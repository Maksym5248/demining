module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: [
    '@/shared/config/eslint-config-base.js',
    '@/shared-client/config/eslint-config-client.js',
    '@/shared/config/eslint-config-prettier'
  ],
};
