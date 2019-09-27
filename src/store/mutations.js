import { updateField } from "vuex-map-fields";
import * as types from "./mutation-types";

export default {
  updateField,
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.UPDATE_HOST](state, payload) {
    console.log(payload);
    state.hosts.host = payload;
  },
  [types.SET_HOST_STATE](state, payload) {
    state.hosts.hostState = payload;
  },
  [types.UPDATE_NAME](state, payload) {
    state.name = payload;
  },
  [types.UPDATE_USER_TITLE](state, payload) {
    state.hosts[payload.index].userTitle = payload.value
  },
  [types.SET_HOST_DEFAULT_TITLE](state, payload) {
    payload.hostObject.defaultTitle = payload.message.title;
  }
};
