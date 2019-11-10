<template>
  <v-app-bar app>
    <v-toolbar-title class="headline green--text">
      <span>T</span>
    </v-toolbar-title>
    <v-toolbar-title class="headline mr-6">
      <span>itlest</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
  <!-- <TheNavDrawer :drawer.sync="drawer" /> -->
</template>
<script>
import TheNavDrawer from "./TheNavDrawer.vue";

export default {
  name: "TheAppBar",
  // components: {
  //   TheNavDrawer
  // },
  data() {
    return {
      drawer: false
    };
  }
};
</script>

<style></style>
