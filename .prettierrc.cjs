module.exports = {
  semi: true,
  singleQuote: false,
  overrides: [
    {
      files: ["**/*.ts", "**/*.js", "**/*.vue"],
      options: {
        singleQuote: true,
      },
    },
  ],
  tabWidth: 2,
  trailingComma: "es5",
};
