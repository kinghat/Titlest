<template>
  <v-app-bar app>
    <v-toolbar-title class="headline green--text">
      <span>T</span>
    </v-toolbar-title>
    <v-toolbar-title class="headline mr-6">
      <span>itlest</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="settingsDialog = true">
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <TheSettingsDialog v-model="settingsDialog" @setSettingsDialogValue="settingsDialog = $event" />
  </v-app-bar>
</template>
<script>
import browser from "webextension-polyfill";
import TheSettingsDialog from "./TheSettingsDialog";

export default {
  name: "TheAppBar",
  components: {
    TheSettingsDialog
  },
  data() {
    return {
      settingsDialog: false
    };
  }
};
</script>

<style></style>
