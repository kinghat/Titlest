import * as types from "./mutation-types";

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setHostDefaultTitle = ({commit, getters}, payload) => {
  const hostObject = getters.getHostByHostName(payload.hostname);
  commit(types.SET_HOST_DEFAULT_TITLE, {hostObject, message: payload} );
};