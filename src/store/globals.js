/* eslint-disable no-shadow */
import * as types from "./mutation-types";

const state = {
	schemaVersion: "1.0.0",
	options: {
		globalState: true,
		notifications: true,
	},
};

const getters = {};

const actions = {};

const mutations = {
	[types.SET_GLOBAL_STATE](state, payload) {
		console.log(`LOG: mutation => payload:`, payload);
		state.options.globalState = payload;
	},
	[types.SET_NOTIFCATIONS](state, payload) {
		console.log(`LOG: mutation => payload:`, payload);
		state.options.notifications = payload;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
