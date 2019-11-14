<template>
  <v-dialog :value="value" persistent scrollable overlay-opacity=".90">
    <v-card max-height="400">
      <v-card-title class="headline justify-center">Global Settings</v-card-title>
      <!-- <v-card-subtitle>NOTE: titles are applied to entire hostnames, not individual tabs.</v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-switch
          v-model="globalState"
          :label="`${(globalState && 'disable') || 'enable'} titles`"
          color="red darken-3"
          hide-details
        ></v-switch>
        <v-switch
          v-model="notifications"
          :label="`${(notifications && 'disable') || 'enable'} notifications`"
          color="orange darken-3"
          hide-details
        ></v-switch>
      </v-card-text>
      <v-btn color="primary" @click="close">CLOSE</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import browser from "webextension-polyfill";
import { mapState } from "vuex";

export default {
  name: "TheSettingsDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      globals: state => state.globals.options,
      hosts: state => state.hosts.hosts
    }),
    globalState: {
      get() {
        return this.$store.state.globals.options.globalState;
      },
      set(value) {
        this.$store.commit("globals/SET_GLOBAL_STATE", value);
        browser.runtime.sendMessage({
          type: "setTabsToGlobalState"
        });
      }
    },
    notifications: {
      get() {
        return this.$store.state.globals.options.notifications;
      },
      set(value) {
        this.$store.commit("globals/SET_NOTIFICATIONS", value);
      }
    }
  },
  methods: {
    close: function() {
      this.$emit("setDialogValue", false);
    }
  }
};
</script>

<style>
</style>