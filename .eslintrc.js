module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    webextensions: true,
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-inline-comments": "off",
    "no-undef": "warn",
    "no-unused-vars": "warn",
    "no-use-before-define": "off",
    "no-restricted-syntax": [
      "off",
      {
        selector: "ForOfStatement",
        message: "frowned upon using For...Of",
      },
    ],
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
      },
    ],
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
