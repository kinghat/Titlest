module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "plugin:prettier/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-expressions": "off",
    "no-param-reassign": "off",
    "import/no-extraneous-dependencies": ["off"],
    // "import/no-extraneous-dependencies": [
    //   "warn",
    //   { devDependencies: false, optionalDependencies: false, peerDependencies: false },
    // ],
    "no-unused-vars": ["off"],
    // "no-unused-vars": ["off", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
        singleQuote: false,
        trailingComma: "all",
      },
    ],
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
