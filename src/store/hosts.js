/* eslint-disable no-shadow */
import * as types from "./mutation-types";

const state = {
	hosts: [
		// {
		// 	id: 0,
		// 	date: undefined,
		// 	hostState: false,
		// 	hostName: "www.google.com",
		// 	userTitle: " - Titlest",
		// 	defaultTitle: undefined,
		// 	originalTabTitles: {},
		// 	isAppended: true,
		// 	hostBindings: [],
		// },
		// {
		// 	id: 1,
		// 	date: undefined,
		// 	hostState: false,
		// 	hostName: "discordapp.com",
		// 	userTitle: " - Titlest",
		// 	defaultTitle: undefined,
		// 	originalTabTitles: {},
		// 	isAppended: false,
		// 	hostBindings: [],
		// },
		// {
		// 	id: 2,
		// 	date: undefined,
		// 	hostState: true,
		// 	hostName: "www.stackoverflow.com",
		// 	userTitle: " - Titlest",
		// 	defaultTitle: undefined,
		// 	originalTabTitles: {},
		// 	isAppended: true,
		// 	hostBindings: [],
		// },
		// {
		// 	id: 3,
		// 	date: undefined,
		// 	hostState: true,
		// 	hostName: "open.spotify.com",
		// 	userTitle: " - Titlest",
		// 	defaultTitle: undefined,
		// 	originalTabTitles: {},
		// 	isAppended: true,
		// 	hostBindings: [],
		// },
		// {
		// 	id: 4,
		// 	date: undefined,
		// 	hostState: true,
		// 	hostName: "www.github.com",
		// 	userTitle: " - Titlest",
		// 	defaultTitle: undefined,
		// 	originalTabTitles: {},
		// 	isAppended: true,
		// 	hostBindings: [],
		// },
	],
};

const getters = {
	getHosts: (state) => state.hosts,
	getHostIndexByHostName: (state) => (hostName) =>
		state.hosts.findIndex((host) => host.hostName === hostName),
	getHostByHostName: (state) => (hostName) =>
		state.hosts.find((host) => host.hostName === hostName),
};

const actions = {
	setHostProperty({ commit, getters }, payload) {
		// i cant figure out why this is happening. cross talk between popup
		// and background scripts and a weird payload property is added to the
		// action payload unnecessarily. if that property is here i return
		// from the action. :shruggie:
		if (payload.payload) return;
		payload.index = getters.getHostIndexByHostName(payload.host.hostName);
		// console.log(`LOG: action => setHostProperty -> payload: `, payload);
		commit(payload.mutation, payload);
	},
	setHosts({ commit, getters }, payload) {
		// console.log(`LOG: action => setHosts -> payload: `, payload);
		commit("SET_HOSTS", payload);
	},
	setHost({ commit, getters }, payload) {
		// console.log(`LOG: action => setHost -> payload: `, payload);
		commit("SET_HOST", payload);
	},
	removeHost({commit, gett}, payload) {
      // console.log(`LOG: removeHost -> payload: `, payload);
		commit("REMOVE_HOST", payload)
	}
};

const mutations = {
	[types.SET_HOST](state, payload) {
		// console.log(`LOG: SET_HOST => payload:`, payload);
		state.hosts.push(payload);
		// console.log(`LOG: SET_HOST => state.host: `, state.host);
	},
	[types.SET_HOSTS](state, payload) {
		// console.log(`LOG: SET_HOSTS => payload:`, payload);
		state.hosts = [...payload];
		// console.log(`LOG: SET_HOSTS => state.hosts: `, state.hosts);
	},
	[types.REMOVE_HOST](state, payload) {
   // console.log(`LOG: REMOVE_HOST => payload: `, payload);
		state.hosts.splice(payload.index, 1);
	},
	[types.REMOVE_HOSTS](state, payload) {
		// console.log(`LOG: SET_HOSTS => payload:`, payload);
		state.hosts = [...payload];
		// console.log(`LOG: SET_HOSTS => state.hosts: `, state.hosts);
	},
	[types.SET_USER_TITLE](state, payload) {
		state.hosts[payload.index].userTitle = payload.value;
	},
	[types.SET_IS_APPENDED](state, payload) {
		state.hosts[payload.index].isAppended = payload.value;
	},
	[types.SET_HOST_STATE](state, payload) {
		// console.log(`LOG: mutation => SET_HOST_STATE payload: `, payload);
		state.hosts[payload.index].hostState = payload.value;
		// console.log(`LOG: mutation => SET_HOST_STATE state: `, state);
	},
	[types.SET_ORIGINAL_TAB_TITLE](state, payload) {
		// console.log(`LOG: mutation => SET_ORIGINAL_TAB_TITLE payload: `, payload);
		state.hosts[payload.index].originalTabTitles = { ...payload.value };
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
