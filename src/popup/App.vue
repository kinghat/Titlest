<template>
  <v-app>
    <TheSetupDialog v-model="setupDialog" @setDialogValue="setupDialog = $event" />
    <TheAppBar />
    <v-content>
      <v-container>
        <TheList />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import browser from "webextension-polyfill";
import store from "../store";
import TheAppBar from "./components/TheAppBar";
import TheList from "./components/TheList";
import TheSetupDialog from "./components/TheSetupDialog";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    TheAppBar,
    TheList,
    TheSetupDialog
  },
  data() {
    return {
      setupDialog: false
      // setupDialog: Object.keys(this.hosts).length
    };
  },
  computed: {
    ...mapState({
      globals: state => state.globals.options,
      hosts: state => state.hosts.hosts
    })
  },
  methods: {
    setSetupDialog: function() {
      this.setupDialog = Object.keys(this.hosts).length === 0;
    }
    // logHosts: function() {
    //   console.log(`LOG: this.hosts: `, this.hosts);
    // }
  },
  mounted() {},
  beforeCreate() {
    store.subscribe((mutation, state) => {
      if (mutation.type === "vweReplaceState") {
        // console.log(`LOG: beforeCreate -> mutation.type: `, mutation.type);
        this.setSetupDialog();
        // this.logHosts();
      }
    });
  }
};
</script>

<style>
/* html {
  scrollbar-width: none !important;
  background-color: red;
} */
body {
  width: 400px;
  /* min-width: 400px; */
  /* max-width: 400px; */
  min-height: 500px;
  /* scrollbar-width: none; */
}
/* ::-webkit-scrollbar {
  width: 0px;
  background: transparent;
} */
/* Optional: show position indicator in red */
/* ::-webkit-scrollbar-thumb {
  background: #ff0000;
} */
</style>
