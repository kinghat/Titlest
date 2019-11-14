import Vue from "vue";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";

import globals from "./globals";
import hosts from "./hosts";

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== "production",
	modules: {
		globals,
		hosts,
	},
	plugins: [
		VuexWebExtensions({
			persistentStates: ["globals", "hosts"],
			syncActions: false,
			loggerLevel: "debug",
		}),
	],
});
