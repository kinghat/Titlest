const ExtensionReloader = require("webpack-extension-reloader");
// const path = require("path");

module.exports = {
	// productionSourceMap: false,
	lintOnSave: false,
	// filenameHashing: false,
	indexPath: "html/popup.html",
	// pages: {
	// 	"html/popup": {
	// 		entry: "src/popup/popup.js",
	// 		template: "src/popup/popup.html",
	// 		title: "Popup",
	// 	},
	// 	"background/background": {
	// 		entry: "src/background/background.js",
	// 		// template: "src/background/background.html",
	// 	},
	// },
	chainWebpack: (config) => {
		config.entryPoints.clear().end();

		config
			.entry("popup")
			.add("./src/popup/popup.js")
			.end();

		config
			.entry("background")
			.add("./src/background/background.js")
			.end();

		config.output.filename((file) =>
			file.chunk.name !== "background"
				? "js/[name].[contenthash:8].js"
				: "js/[name].js",
		);

		config.plugin("html").tap((args) => {
			args[0].template = "./src/popup/popup.html";
			return args;
		});

		config.plugin("copy").tap(([options]) => {
			const manifest = {
				from: "./src/manifest.json",
				to: "./manifest.json",
			};
			options = [...options, manifest];
			return [options];
		});

		if (process.env.NODE_ENV !== "production") {
			config.plugin("extension-reloader").use(ExtensionReloader, [
				{
					entries: {
						background: "js/background",
						extensionPage: ["popup"],
					},
				},
			]);
		}

		config.optimization.delete("splitChunks");
	},
	// configureWebpack: (config, options) => {
	// 	config.plugins.push(
	// 		new ExtensionReloader({
	// 			// manifest: path.resolve(__dirname, "src/manifest.json"),
	// 			entries: {
	// 				background: "js/background",
	// 				extensionPage: ["popup"],
	// 			},
	// 		}),
	// 	);
	// },
};
