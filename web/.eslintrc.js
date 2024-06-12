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
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
		'plugin:react-hooks/recommended',
    '@/shared/eslint-config-prettier'
  ],
  plugins: ['jsx-a11y', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/no-unescaped-entities': 0,
    'react/jsx-props-no-spreading': 0,
    'react-hooks/exhaustive-deps': 1,
    'react/no-unknown-property': 0,
    'react/require-default-props': 0,
    'react/no-array-index-key': 0,
    'react/jsx-filename-extension': [0, { "extensions": [".js", ".jsx"] }],
    "react/react-in-jsx-scope": 0,

    // TODO: fix errors
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unsafe-return": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-unsafe-argument": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/restrict-plus-operands": 0
  },
};
