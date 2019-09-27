import Vue from "vue";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import pathify from "./pathify";
import { make } from "vuex-pathify";

import getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

const state = {
  dbVersion: "1",
  options: {
    globalState: true,
    reloadWindows: false,
    replaceAll: false,
  },
  hosts: [
    {
      id: 0,
      date: undefined,
      hostState: false,
      hostName: "www.google.com",
      userTitle: " - Titlest",
      defaultTitle: undefined,
      append: true,
      hostBindings: [],
    },
    {
      id: 1,
      date: undefined,
      hostState: false,
      hostName: "discordapp.com",
      userTitle: " - Titlest",
      defaultTitle: undefined,
      append: false,
      hostBindings: [],
    },
    {
      id: 2,
      date: undefined,
      hostState: true,
      hostName: "www.stackoverflow.com",
      userTitle: " - Titlest",
      defaultTitle: undefined,
      append: true,
      hostBindings: [],
    },
    {
      id: 3,
      date: undefined,
      hostState: true,
      hostName: "open.spotify.com",
      userTitle: " - Titlest",
      defaultTitle: undefined,
      append: true,
      hostBindings: [],
    },
    {
      id: 4,
      date: undefined,
      hostState: true,
      hostName: "www.github.com",
      userTitle: " - Titlest",
      defaultTitle: undefined,
      append: true,
      hostBindings: [],
    },
  ],
  name: "kinghat",
};

// const mutations = {
//   ...make.mutations(state),
// }

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    pathify.plugin,
    VuexWebExtensions({
      persistentStates: ["options", "hosts", "name"],
    }),
  ],
});
