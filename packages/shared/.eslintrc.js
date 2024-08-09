module.exports = {
  root: true,
  ignorePatterns: [
    "lint-staged.config.js",
    ".eslintrc.js"
  ],
  extends: ["./config/eslint-config-base.js", "./config/eslint-config-prettier.js"],
}
