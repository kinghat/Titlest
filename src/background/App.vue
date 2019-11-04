<template></template>

<script>
import browser from "webextension-polyfill";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {};
  },

  computed: {
    // ...mapGetters("hosts", { getHostByHostName: "getHostByHostName" })
    ...mapGetters({
      getHostByHostName: "hosts/getHostByHostName"
    })
    // getHostByHostName: hostname =>
    //   this.$store.getters["hosts/getHostByHostName"](hostname)
  },

  methods: {
    // ...mapActions("hosts", { setHostDefaultTitle: "setHostDefaultTitle" }),
    ...mapActions({
      setHostProperty: "hosts/setHostProperty"
    }),
    sendHostProperty1(mutation, value, index) {
      const payload = { index, mutation, value };
      console.log(`LOG: sendHostProperty -> payload`, payload);
      this.setHostProperty(payload);
    }
  },

  mounted() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const hostObject = this.getHostByHostName(message.hostname);
      // console.log(`LOG: created -> message`, message);
      // console.log(
      //   `LOG: created -> this.getHostByHostName(message.hostname)`,
      //   this.getHostByHostName(message.hostname)
      // );

      if (message.type === "contentScriptInit" && hostObject) {
        browser.tabs.executeScript(sender.tab.id, {
          file: "/content-scripts/content-script-inject.js"
        });
      } else if (message.type === "contentScriptInjectInit" && hostObject) {
        console.log(`contentScriptInjectInit message: `, message);
        this.setHostProperty({
          mutation: "SET_DEFAULT_TITLE",
          value: message.hostname
        });

        if (hostObject) {
          return Promise.resolve({
            type: "updateTitle",
            title: this.formatDocumentTitle(hostObject, message)
          });
        }
      } else if (message.type === "contentScriptTitleMutation" && hostObject) {
        console.log(`contentScriptTitleMutation message: `, message);
        this.setHostProperty({
          mutation: "SET_DEFAULT_TITLE",
          value: message.hostname
        });

        if (hostObject.hostState) {
          if (!this.preventDocumentLoops(hostObject, message)) return;

          return Promise.resolve({
            type: "updateTitle",
            title: this.formatDocumentTitle(hostObject, message)
          });
        }
      } else {
        console.log(`${message.hostname}:
        was not found in store!
        sender.url: ${sender.url}
        sender.id: ${sender.id}`);
      }
      return true;
    });
  }
};

console.log("HOLA FROM App.vue");
</script>
