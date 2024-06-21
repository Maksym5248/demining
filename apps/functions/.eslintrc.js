module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  extends: [
    "../../node_modules/shared-my/config/eslint-config-base.js",
    "../../node_modules/shared-my/config/eslint-config-prettier.js"
  ],
};