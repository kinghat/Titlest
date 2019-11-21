/* eslint-disable no-shadow */
import * as types from "./mutation-types";

const state = {
	hosts: [],
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
		commit(payload.mutation, payload);
	},
	setHosts({ commit, getters }, payload) {
		commit("SET_HOSTS", payload);
	},
	setHost({ commit, getters }, payload) {
		commit("SET_HOST", payload);
	},
	removeHost({ commit, gett }, payload) {
		commit("REMOVE_HOST", payload);
	},
};

const mutations = {
	[types.SET_HOST](state, payload) {
		state.hosts.push(payload);
	},
	[types.SET_HOSTS](state, payload) {
		state.hosts = [...payload];
	},
	[types.REMOVE_HOST](state, payload) {
		state.hosts.splice(payload.index, 1);
	},
	[types.REMOVE_HOSTS](state, payload) {
		state.hosts = [...payload];
	},
	[types.SET_USER_TITLE](state, payload) {
		state.hosts[payload.index].userTitle = payload.value;
	},
	[types.SET_IS_APPENDED](state, payload) {
		state.hosts[payload.index].isAppended = payload.value;
	},
	[types.SET_HOST_STATE](state, payload) {
		state.hosts[payload.index].hostState = payload.value;
	},
	[types.SET_ORIGINAL_TAB_TITLE](state, payload) {
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
