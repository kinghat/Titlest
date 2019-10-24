// import { make } from "vuex-pathify";
import * as types from "./mutation-types";

const state = {
    hosts: [
        {
          id: 0,
          date: undefined,
          hostState: false,
          hostName: "www.google.com",
          userTitle: " - Titlest",
          defaultTitle: undefined,
          isAppended: true,
          hostBindings: [],
        },
        {
          id: 1,
          date: undefined,
          hostState: false,
          hostName: "discordapp.com",
          userTitle: " - Titlest",
          defaultTitle: undefined,
          isAppended: false,
          hostBindings: [],
        },
        {
          id: 2,
          date: undefined,
          hostState: true,
          hostName: "www.stackoverflow.com",
          userTitle: " - Titlest",
          defaultTitle: undefined,
          isAppended: true,
          hostBindings: [],
        },
        {
          id: 3,
          date: undefined,
          hostState: true,
          hostName: "open.spotify.com",
          userTitle: " - Titlest",
          defaultTitle: undefined,
          isAppended: true,
          hostBindings: [],
        },
        {
          id: 4,
          date: undefined,
          hostState: true,
          hostName: "www.github.com",
          userTitle: " - Titlest",
          defaultTitle: undefined,
          isAppended: true,
          hostBindings: [],
        },
      ],
};

const getters = {
  getHosts: state => state.hosts,
  getHostIndexByHostName: state => hostName => state.hosts.findIndex(host => host.hostName === hostName),
  getHostByHostName: state => hostName => state.hosts.find(host => host.hostName === hostName)
};

const actions = {
  setHostProperty({ commit, getters }, payload) {
  console.log(`LOG: setHostProperty(1) -> payload`, payload);

  if (payload.index === undefined) {
    payload.index = getters.getHostIndexByHostName(payload.value);
  };
  console.log(`LOG: setHostProperty(2) -> payload`, payload);
    
    commit(payload.mutation, payload);
  },
};

const mutations = {
    // ...make.mutations(state),
  [types.SET_USER_TITLE](state, payload) {
    state.hosts[payload.index].userTitle = payload.value
  },
  [types.SET_IS_APPENDED](state, payload) {
    state.hosts[payload.index].isAppended = payload.value
  },
  [types.SET_HOST_STATE](state, payload) {
    state.hosts[payload.index].hostState = payload.value
  },
  [types.SET_DEFAULT_TITLE](state, payload) {
  console.log(`LOG: SET_DEFAULT_TITLE payload :`, payload);
    state.hosts[payload.index].defaultTitle = payload.value;
  }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}