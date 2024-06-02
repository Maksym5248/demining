module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
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
    "react/react-in-jsx-scope": 0
  },
};
