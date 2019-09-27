<template>
  <v-navigation-drawer :value="drawer" @input="value => $emit('update:drawer', value)" app>
    <v-list-item>
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>John Leider</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-content>
      <v-container fluid>
        <div id="nav">
          <router-link to="/">Home</router-link>|
          <router-link to="/options">Options</router-link>|
          <router-link to="/about">About</router-link>
        </div>
        <router-view />
      </v-container>
    </v-content>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "TheNavDrawer",
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // drawerChild: false
    };
  }
};
</script>

<style>
</style>