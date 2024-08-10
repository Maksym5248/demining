module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "metro.config.js",
    "babel.config.js",
    "jest.config.js",
    "lint-staged.config.js",
    ".eslintrc.js",
    "index.js"
  ],
  extends: [
    '@react-native',
    // "../../node_modules/shared-my/config/eslint-config-base.js",
    // '../../node_modules/shared-my-client/config/eslint-config-client.js',
    // "../../node_modules/shared-my/config/eslint-config-prettier.js"
  ],
};
