module.exports = {
	  extends: [
		'prettier',
		'plugin:prettier/recommended',
	  ],
	  ignorePatterns: ["eslint-config-prettier.js"],
	  rules: {
		"prettier/prettier": "error",
	  },
}
