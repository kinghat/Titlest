import { configure, extend } from "vee-validate";

import { required, regex } from "vee-validate/dist/rules";

const config = {
	bails: false,
};

configure(config);

// Install rules
extend("required", {
	...required,
	message: "this field cannot be left empty",
});

extend("regex", {
	// regex found here: https://stackoverflow.com/a/28274783/8023318
	...regex,
	message: "cannot start with or have consecutive spaces",
	params: [{ name: "regex" }, { name: "target", isTarget: true }],
});
