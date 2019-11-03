module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
    },
    "extends": [
        "plugin:vue/essential",
        "@vue/airbnb",
        "airbnb-base",
        "plugin:prettier/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        parser: "babel-eslint",
    },
    "plugins": [
        "vue"
    ],
    "rules": {
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-unused-expressions": "off",
      "no-param-reassign": "off",
      "import/no-extraneous-dependencies": ["off"],
      "no-restricted-syntax": ["off", "ForOfStatement"],
      // "import/no-extraneous-dependencies": [
      //   "warn",
      //   { devDependencies: false, optionalDependencies: false, peerDependencies: false },
      // ],
      "no-unused-vars": ["off"],
      // "no-unused-vars": ["off", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
        "prettier/prettier": [
            "error",
            {
                "arrowParens": "always",
                "bracketSpacing": true,
                "printWidth": 120,
                "semi": true,
                "tabWidth": 2,
                "trailingComma": "all",
                "useTabs": true
            }
        ]
    }
};