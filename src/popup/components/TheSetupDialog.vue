<template>
  <v-dialog :value="value" persistent scrollable overlay-opacity=".90">
    <v-card max-height="400">
      <v-card-title class="headline">Select host(s)</v-card-title>
      <v-card-subtitle>NOTE: titles are applied to entire hostnames, not individual tabs.</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item-group v-model="selected" multiple>
            <template v-for="(host, index) in hostList">
              <v-list-item :key="host.hostName">
                <template v-slot:default="{ active, toggle }">
                  <v-list-item-avatar size="32">
                    <v-img :src="host.favIconUrl"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="host.hostName"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="!active" color="grey lighten-1">mdi-check-outline</v-icon>
                    <v-icon v-else color="green accent-4">mdi-check-outline</v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="index + 1 < hostList.length" :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        {{selected}}
      </v-card-text>
      <v-card-actions>
        <v-btn block :disabled="!selected.length" color="green accent-4--text" @click="save">SAVE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import browser from "webextension-polyfill";
import { mapState } from "vuex";

export default {
  name: "TheSetupDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hostList: [],
      selected: []
    };
  },
  computed: {
    ...mapState({
      globals: state => state.globals.options,
      hosts: state => state.hosts.hosts
    }),
    logSelected: function() {
      console.log(`LOG: computed -> selected: `, this.selected);
    }
  },
  methods: {
    runSetup: async function() {
      try {
        const tabs = await browser.tabs.query({});
        const tabList = [];
        for (const tab of tabs) {
          if (!tab.url.includes("chrome:")) {
            const hostName = new URL(tab.url).hostname;
            tabList.push({ ...tab, hostName });
          }
        }
        this.hostList = [
          ...new Map(tabList.map(obj => [obj.hostName, obj])).values()
        ];
      } catch {
        error => console.log(`LOG: error: `, error);
      }
    },
    save: async function() {
      try {
        if (this.selected) {
          let payload = [];
          for (const [index, value] of this.selected.entries()) {
            console.log(`LOG: index: `, index, value);
            const hostObject = {
              id: index,
              date: undefined,
              hostState: true,
              hostName: this.hostList[value].hostName,
              userTitle: " - Titlest",
              originalTabTitles: {},
              isAppended: true,
              hostBindings: []
            };
            console.log(`LOG: hostObject: `, hostObject);
            payload.push(hostObject);
          }
          await this.$store.dispatch("hosts/setHosts", payload);
          console.log(`LOG: payload: `, payload);
        }

        this.$emit("setDialogValue", false);

        browser.runtime.sendMessage({
          type: "updateSavedTabs"
        });
      } catch {
        error => console.log(`LOG: error: `, error);
      }
    }
  },
  created() {
    this.runSetup();
  }
};
</script>

<style>
</style>