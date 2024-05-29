export default {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js'],
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['react', 'jsx-a11y', 'import', '@typescript-eslint'],
  settings: {
      react: {
          version: 'detect',
      },
      'import/resolver': {
          typescript: true,
          node: true,
      },
  },
  "parser": "@typescript-eslint/parser",
  "rules": {
    "import/named": 0,
    "import/no-unresolved": 0,
    "import/order": [
      "error",
      {
        "pathGroups": [
          {
            "pattern": "react",
            "group": "builtin",
            "position": "before"
          },
          {
            "pattern": "~/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "groups": [["builtin"], ["external"], ["internal"], ["parent", "sibling"], ["object"]],
        "newlines-between": "always"
      }
    ],
    "import/newline-after-import": "error",
    "import/no-default-export": "error",
    "import/no-self-import": "error",
    "import/no-useless-path-segments": "error",
    "import/no-cycle": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        format: ['PascalCase', 'UPPER_CASE'],
      },
    ],
    "no-underscore-dangle": 0,
    "no-mixed-operators": [
      "warn",
      {
        "groups": [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"]
        ],
        "allowSamePrecedence": false
      }
    ],
    "no-unused-expressions": 0,
    "no-param-reassign": 0,
    "no-nested-ternary": 2,
    "class-methods-use-this": 0,
    "react/no-unescaped-entities": 0,
    "react/jsx-props-no-spreading": 0,
    "@typescript-eslint/consistent-type-exports": 0,
    "@typescript-eslint/consistent-type-imports": 0,
    "react-hooks/exhaustive-deps": 1,
    "no-promise-executor-return": 0,
    "react/no-unknown-property": 0,
    "react/require-default-props": 0,
    "react/no-array-index-key": 0,
    "indent": ["error", "tab"]
  }
}
