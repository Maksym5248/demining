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
  plugins: ["react-native"],
  extends: [
    "../../node_modules/shared-my/config/eslint-config-base.js",
    '../../node_modules/shared-my-client/config/eslint-config-client.js',
    "../../node_modules/shared-my/config/eslint-config-prettier.js"
  ],
  rules: {
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-raw-text": 2,
    "react-native/no-single-element-style-arrays": 2,
    "react/prop-types": 0,
  }
};
