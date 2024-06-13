const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
	parserOptions: {
		project: true,
	},
	env: {
		"browser": true,
		"es2021": true,
		"node": true,
	},
	ignorePatterns: [
		"node_modules/",
		"dist/",
		".eslintrc.js",
		"eslint-config-base.js"
	],
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	parser: "@typescript-eslint/parser",
	plugins: ['import', '@typescript-eslint'],
	settings: {
		'import/resolver': {
			typescript: {
				project
			},
			node: true,
		},
	},
	rules: {
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
			  "alphabetize": {
				 "order": "asc",
				 "caseInsensitive": true
			   },
			  "pathGroupsExcludedImportTypes": ["react"],
			  "groups": [["builtin"], ["external"], ["internal"], ["parent", "sibling"], ["object"]],
			  "newlines-between": "always"
			}
		],
		"import/newline-after-import": "error",
		"import/no-default-export": "error",
		"import/prefer-default-export": 0,
		"import/no-self-import": "error",
		"import/no-useless-path-segments": "error",
		"import/extensions": 0,
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
		"no-nested-ternary": "error",
		"class-methods-use-this": 0,
		"no-promise-executor-return": 0,
		"indent": ["error", "tab"],
		"arrow-body-style": 0,
		"prefer-arrow-callback": 0,
		// "@typescript-eslint/consistent-type-exports": 0,
		// "@typescript-eslint/consistent-type-imports": 0,
		"@typescript-eslint/no-floating-promises": 0,
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				selector: 'typeLike',
				format: ['PascalCase', 'UPPER_CASE'],
			},
		],
	}
}
