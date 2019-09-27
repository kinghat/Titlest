<template>
  <div>
    <!-- <input v-model="hosts[0].userTitle" /> -->
    <!-- <input v-model="getHostByHostName()" /> -->
    <!-- {{hosts[0].userTitle}} -->
    <!-- {{hosts}} -->
    <!-- <input v-model="getHostByHostName" /> -->
    <!-- {{ getHostByHostName("www.google.com") }} -->
  </div>
</template>

<script>
// <div>{{this.hosts[0].userTitle}}</div>
import browser from "webextension-polyfill";
import { mapState, mapGetters, mapActions } from "vuex";
import { mapMultiRowFields, mapFields } from "vuex-map-fields";
// import { Promise } from "q";

export default {
  // name: "App",
  data() {
    return {
      // hostObject: "",
      // userTitleer: { ...this.hosts }
    };
  },

  computed: {
    ...mapState(["options", "name", "hosts"]),

    ...mapGetters(["getHostByHostName"]),
    logHostString(hoststring) {
      // const userTitle = getHostByHostName();
      console.log(
        "userTitle: ",
        this.$store.getters.getHostByHostName(hoststring)
      );
    }
  },

  methods: {
    ...mapActions(["setHostDefaultTitle"]),

    formatDocumentTitle(hostObject, documentObject) {
      let userTitle = hostObject.userTitle;
      let documentTitle = documentObject.title;
      const formattedTitle = hostObject.append
        ? (documentTitle += userTitle)
        : (documentTitle = userTitle);
      return formattedTitle;
    },

    preventDocumentLoops(hostObject, documentObject) {
      // debugger;
      if (
        hostObject.append &&
        documentObject.title ===
          `${hostObject.defaultTitle}${hostObject.userTitle}`
      )
        return;
      if (
        !hostObject.append &&
        documentObject.title === `${hostObject.userTitle}`
      )
        return;
      if (
        hostObject.append &&
        documentObject.title.includes(hostObject.userTitle)
      )
        return;

      // return formatDocumentTitle(hostObject, documentObject);
      return true;
    }
  },

  // beforeCreate: function() {
  // },

  created: function() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const returnedHostObject = this.$store.getters.getHostByHostName(
        message.hostname
      );

      if (message.type === "contentScriptInit" && returnedHostObject) {
        browser.tabs.executeScript(sender.tab.id, {
          file: "/content-scripts/content-script-inject.js"
        });
      } else if (message.type === "contentScriptInjectInit") {
        this.setHostDefaultTitle(message);

        if (returnedHostObject.hostState) {
          return Promise.resolve({
            type: "updateTitle",
            title: this.formatDocumentTitle(returnedHostObject, message)
          });
        }
      } else if (message.type === "contentScriptTitleMutation") {
        console.log(`contentScriptTitleMutation message: `, message);
        this.setHostDefaultTitle(message);
        console.log(
          `returnedHostObject.defaultTitle: `,
          returnedHostObject.defaultTitle
        );

        if (returnedHostObject.hostState) {
          // console.log(
          //   `LOG: preventDocumentLoops(returnedHostObject, message)`,
          //   this.preventDocumentLoops(returnedHostObject, message)
          // );

          if (!this.preventDocumentLoops(returnedHostObject, message)) return;

          return Promise.resolve({
            type: "updateTitle",
            title: this.formatDocumentTitle(returnedHostObject, message)
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
  },

  // beforeMount: function() {},

  mounted: function() {
    console.log("<mounted>");

    // console.log(document.location.hostname);
    // console.log(getHostByHostName("www.google.com"));
    // logHostString("www.google.com");
    // stateHosts();
    // console.log(getHostByHostName(document.location.hostname));
    // getHostByHostName(document.location.hostname);
    // this.$store.watch(
    //   (state, getters) => getters.hosts[0].userTitle,
    //   (newValue, oldValue) => {
    //     console.log(`Updating from ${oldValue} to ${newValue}`);

    //     // Do whatever makes sense now
    //     // if (newValue === 'success') {
    //     //   this.complex = {
    //     //     deep: 'some deep object',
    //     //   };
    //     // }
    //   }
    // );

    console.log("</mounted>");
  },
  updated: function() {
    console.log("<updated>");

    console.log("</updated>");
  }
};

console.log("HOLA FROM App.vue");
</script>