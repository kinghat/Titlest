module.exports = {
	// Global options:
	verbose: true,
	// Command options:
	build: {
		overwriteDest: true,
		sourceDir: "dist",
		artifactsDir: "zips",
	},
	run: {
		firefox: "nightly",
	},
};
