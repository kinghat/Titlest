import { getField } from "vuex-map-fields";

// export const options = state => state.options;
// export const hosts = state => state.hosts;
// export const name = state => state.name;
const options = state => state.options;
const hosts = state => state.hosts;
// const hostString = state => state.hosts[0].hostString;
const getHostByHostName = state => hostName => state.hosts.find(host => host.hostName === hostName);
const name = state => state.name;

export default {
  getField,
  hosts,
  // hostString,
  getHostByHostName,
  options,
  name,
};
