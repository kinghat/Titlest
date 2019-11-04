module.exports = {
	env: {
		node: true,
		browser: true,
		es6: true,
	},
	extends: ["@vue/airbnb", "airbnb-base", "plugin:vue/essential", "plugin:prettier/recommended"],
	// globals: {
	// 	Atomics: "readonly",
	// 	SharedArrayBuffer: "readonly",
	// },
	parserOptions: {
		parser: "babel-eslint",
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["vue"],
	rules: {
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
		"no-use-before-define": "warn",
		"consistent-return": "warn",
		"no-unused-vars": ["warn"],
		// "no-unused-vars": ["off", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
		"prettier/prettier": [
			"error",
			{
				arrowParens: "always",
				bracketSpacing: true,
				printWidth: 100,
				semi: true,
				tabWidth: 3,
				trailingComma: "all",
				useTabs: true,
				endOfLine: "auto",
			},
		],
	},
};
