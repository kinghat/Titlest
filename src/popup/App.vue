<template>
  <v-app>
    <TheSetupDialog
      v-model="setupDialog"
      v-if="setupDialog"
      @setSetupDialogValue="setupDialog = $event"
      @setSavedSnackbarValue="savedSnackbar = $event"
    />
    <TheAppBar />
    <v-content>
      <v-container>
        <TheList
          @setRemovedSnackbarValue="removedSnackbar = $event"
          @checkSetupDialogValue="setSetupDialog"
        />
      </v-container>
    </v-content>
    <v-snackbar v-model="savedSnackbar" color="success" :timeout="5000">
      {{ savedSnackbarText }}
      <v-btn text icon @click="savedSnackbar = false">
        <v-icon>mdi-close-outline</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="removedSnackbar" color="success" :timeout="5000">
      {{ removedSnackbarText }}
      <v-btn text icon @click="removedSnackbar = false">
        <v-icon>mdi-close-outline</v-icon>
      </v-btn>
    </v-snackbar>
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
      setupDialog: false,
      savedSnackbar: false,
      removedSnackbar: false,
      savedSnackbarText: "Host(s) saved to list.",
      removedSnackbarText: "Host removed."
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
  },
  mounted() {},
  beforeCreate() {
    store.subscribe((mutation, state) => {
      if (mutation.type === "vweReplaceState") {
        this.setSetupDialog();
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
