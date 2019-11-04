<template>
  <div>
    <v-app-bar height="48" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline green--text">
        <span>T</span>
      </v-toolbar-title>
      <v-toolbar-title class="headline">
        <span>itlest</span>
      </v-toolbar-title>
    </v-app-bar>
    <TheNavDrawer :drawer.sync="drawer" />
  </div>
</template>
<script>
import TheNavDrawer from "./TheNavDrawer.vue";

export default {
  name: "TheAppBar",
  components: {
    TheNavDrawer
  },
  data() {
    return {
      drawer: false
    };
  }
};
</script>

<style></style>
