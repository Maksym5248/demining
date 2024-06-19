module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: [
    "@/shared/config/eslint-config-base",
    "./config/eslint-config-client.js",
    "@/shared/config/eslint-config-prettier"
  ],
};
