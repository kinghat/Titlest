module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
	},
	extends: ["plugin:vue/essential", "@vue/airbnb", "plugin:prettier/recommended"],
	parserOptions: {
		parser: "babel-eslint",
	},
	// plugins: ["vue"],
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
				printWidth: 80,
				semi: true,
				tabWidth: 3,
				trailingComma: "all",
				useTabs: true,
				endOfLine: "auto",
			},
		],
	},
};
