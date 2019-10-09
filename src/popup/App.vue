<template>
  <v-app>
    <TheAppBar />
    <v-content>
      <TheList />
    </v-content>
  </v-app>
</template>

<script>
import TheAppBar from "./components/TheAppBar";
import TheList from "./components/TheList";

export default {
  name: "App",
  components: {
    TheAppBar,
    TheList
  },
  data() {
    return {};
  }
};
</script>

<style>
html {
  scrollbar-width: none !important;
  background-color: red;
}
body {
  width: 400px;
  /* min-width: 400px; */
  /* max-width: 400px; */
  min-height: 500px;
  /* scrollbar-width: none; */
}
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
/* Optional: show position indicator in red */
/* ::-webkit-scrollbar-thumb {
  background: #ff0000;
} */
</style>