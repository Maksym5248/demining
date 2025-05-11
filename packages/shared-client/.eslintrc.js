module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js",
    "jest.config.ts",
    "setupTests.ts"
  ],
  extends: [
    "../../node_modules/shared-my/config/eslint-config-base.js",
    "./config/eslint-config-client.js",
    "../../node_modules/shared-my/config/eslint-config-prettier.js"
  ],
};
