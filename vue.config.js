const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const path = require("path");

const pages = {
	"popup/popup": {
		entry: "src/popup/popup.js",
		template: "src/popup/popup.html",
	},
	"background/background": {
		entry: "src/background/background.js",
		template: "src/background/background.html",
	},
	"content-scripts/content-script": {
		entry: "src/content-scripts/content-script.js",
	},
	"content-scripts/content-script-inject": {
		entry: "src/content-scripts/content-script-inject.js",
	},
};

module.exports = {
	// productionSourceMap: false,
	lintOnSave: false,
	// filenameHashing: false,
	pages,
	// pages: {
	//   "popup/popup": {
	//     entry: "src/popup/popup.js",
	//     template: "src/popup/popup.html",
	//   },
	//   background: {
	//     entry: "src/background.js",
	//   },
	//   "content-scripts/content-script": {
	//     entry: "src/content-scripts/content-script.js",
	//   },
	// },
	// outputDir: path.resolve(__dirname, "dist/popup"),
	// indexPath: "./popup/popup.html",
	chainWebpack: (config) => {
		//   config.entryPoints.delete("app");
		//   config
		//     .entry("popup/popup")
		//     .add(".src/popup/popup.js")
		//     .end()
		//     .entry("background")
		//     .add(".src/background.js")
		//     .end()
		//     .entry("content-scripts/content-script")
		//     .add(".src/content-scripts/content-script.js")
		//     .end();
		// config.output.path("dist/popup").filename("[name].bundle.js");
		// config.output.path("dist/popup").filename("[name].js");
		// config.plugin("html").tap(args => {
		//   (args[0].template = path.resolve(__dirname, "./src/popup/popup.html")), (args[0].filename = "popup/popup.html");
		//   return args;
		// });
		config.plugin("copy").tap(([options]) => {
			const manifest = {
				from: "./src/manifest.json",
				to: "./manifest.json",
			};
			options = [...options, manifest];
			return [options];
		});

		// config.plugin("copy").tap(([options]) => {
		//   const polyfill = {
		//     from: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
		//   };
		//   options = [...options, polyfill];
		//   return [options];
		// });

		Object.keys(pages).forEach((page) => {
			if (page !== "popup/popup" && page !== "background/background") {
				config.plugins.delete(`html-${page}`);
				config.plugins.delete(`preload-${page}`);
				config.plugins.delete(`prefetch-${page}`);
			}
		});
		// config.plugins.delete("html-background");
		// config.plugins.delete("html-content-scripts/content-script");
		config.optimization.delete("splitChunks");
	},
	configureWebpack: (config, options) => {
		config.output.filename = "[name].js";
		// config.output.chunkFilename = "[name].js";
		config.output.chunkFilename = "js/[id].[name].js";
		// config.plugins.template = path.resolve(__dirname, "./src/popup/popup.html");
		// config.plugins.filename = "popup/popup.html";
		// console.log(`configureWebpack config:
		// ${config}
		// ${options}
		// end configureWebpack config:`);
		// entry: {
		// 	// popup: "src/popup/popup.js",
		// 	background: "src/background.js",
		// 	content_scripts: "src/content_scripts/content_script.js",
		// },
		// output: {
		// 	filename: "[name].js",
		// 	path: path.resolve(__dirname, "./popup"),
		// },
		// plugins: [
		// 	new HtmlWebpackPlugin({
		// 		// filename: "./popup/popup.html",
		// 		// template: path.resolve(__dirname, "./src/popup/popup.html"),
		// 		filename: "popup/popup.html",
		// 		template: "src/popup/popup.html",
		// 		title: "Popup",
		// 	}),
		// ],
		config.plugins.push(
			new ExtensionReloader({
				// manifest: path.resolve(__dirname, "src/manifest.json"),
				entries: {
					contentScript: [
						"content-scripts/content-script",
						"content-scripts/content-script-inject",
					],
					background: "background/background",
					extensionPage: ["popup/popup"],
				},
			}),
		);
	},
	// entry: {
	//   background: "background.js",
	//   content-scripts: "content-scripts/content_script.js",
	// },
	// output: {
	// 	path: path.resolve(__dirname, "dist"),
	// 	filename: "[name].js",
	// },
};
