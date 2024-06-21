module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: [
    "../../node_modules/shared-my/config/eslint-config-base.js",
    '../../node_modules/shared-my-client/config/eslint-config-client.js',
    // 'plugin:react-native/all',
    "../../node_modules/shared-my/config/eslint-config-prettier.js"
  ],
  plugins: ["react-native"],
  env: {
    "react-native/react-native": true
  }
};
