module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@/shared/eslint-config-base.js',
  ],
  plugins: ['react', 'jsx-a11y'],
  settings: {
      "react": {
          "version": 'detect',
      },
  },
  rules: {
    "import/order": [
      "error",
      {
        "pathGroups": [
          {
            "pattern": "react",
            "group": "builtin",
            "position": "before"
          },
        ],
        "pathGroupsExcludedImportTypes": ["react"],
      }
    ],
    "react/no-unescaped-entities": 0,
    "react/jsx-props-no-spreading": 0,
    "react-hooks/exhaustive-deps": 1,
    "react/no-unknown-property": 0,
    "react/require-default-props": 0,
    "react/no-array-index-key": 0,
  }
}
