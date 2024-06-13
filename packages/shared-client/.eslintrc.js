module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: [
    "@/shared/eslint-config-base",
    "./eslint-config-client.js",
    "@/shared/eslint-config-prettier"
  ],
};
