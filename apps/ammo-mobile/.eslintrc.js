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
    // 'plugin:react-native/all',
    '@/shared/config/eslint-config-prettier'
  ],
  plugins: ["react-native"],
  env: {
    "react-native/react-native": true
  }
};
