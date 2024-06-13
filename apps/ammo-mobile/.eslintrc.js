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
    'plugin:react-native/all',
    '@/shared/eslint-config-prettier'
  ],
  plugins: ["react-native"],
  env: {
    "react-native/react-native": true
  }
};
