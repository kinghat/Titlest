module.exports = {
	// Global options:
	verbose: true,
	sourceDir: "dist",
	artifactsDir: "zips",
	// Command options:
	build: {
		overwriteDest: true,
	},
	run: {
		firefox: "nightly",
	},
};
