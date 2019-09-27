// import Vue from "vue";
// import { mapState, mapGetters } from "vuex";
// import { mapMultiRowFields, mapFields } from "vuex-map-fields";
import browser from "webextension-polyfill";
// import App from "./App.vue";
// import store from "../store";
browser.runtime.sendMessage({ type: "contentScriptInjectInit", hostname: document.location.hostname, title: document.title }).then( response => {
  if (response.type === "updateTitle") {
    setTitle(response.title);
    console.log(`contentScriptInjectInit response: `, response);
  }
});

console.log("HOLA FROM INJECTED CONENT-SCRIPT");
new MutationObserver(() => {
  console.log("title in observer: ", document.title);
  browser.runtime.sendMessage({ type: "contentScriptTitleMutation", hostname: document.location.hostname, title: document.title }).then( response => {
    if (response.type === "updateTitle") {
      console.log(`contentScriptTitleMutation response: `, response.title );
      setTitle(response.title);
    }
  });
}).observe(document.querySelector("title"), {
  childList: true,
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // if (message.type === "updateTitle") {
  //   setTitle(message.title);
  // }
})

function setTitle(title) {
  document.title = title;
}

// function clickPause() {
//   document.querySelector(`[title="Pause"]`).click()
//   console.log(`we clicked pause!`)
// }

// function runPauseFunction() {
//   setTimeout(clickPause, 5000);  
// }

// runPauseFunction();

// console.log("testVariable from background-script: ", testVariable);

// browser.runtime.sendMessage({ type: "hostname", hostname: document.location.hostname });

// browser.webNavigation.onCompleted.addListener(
//   e => {
//     console.log("hostString event", store.state.hosts[0].hostString);
//   },
//   { url: [{ hostEquals: document.location.hostname }] },
// );

// const vueElement = document.createElement("div");
// vueElement.id = "injectedapp";
// document.body.append(vueElement);

/* eslint-disable no-new */
// new Vue({
//   // el: "#app",
//   store,
//   render: h => h(App),
// }).$mount("#injectedapp");
// // });

// const wrapper = document.createElement("div");
// wrapper.id = "vwe-bar";
// document.body.prepend(wrapper);

// /* eslint-disable no-new */
// new Vue({
//   el: "#vwe-bar",
//   store,
//   render: h => h(Bar),
// });

// new Vue({
//   el: "#injectedApp",
//   store,
//   data: {},
//   computed: {
//     ...mapState(["hosts"]),
//     // ...mapMultiRowFields(["hosts"]),
//   },

//   updated() {
//     this.$nextTick(function() {
//       console.log("<updated>");
//       // document.title = this.hosts[0].hostString;
//       // document.title = this.name;
//       console.log(this.hosts);
//       // console.log(hosts);
//       // console.log(this.hosts[0].hostString);
//       // console.log(document.title);
//       console.log("</updated>");
//     });
//   },
//   updated() {
//     console.log("<updated>");
//     // document.title = this.hosts[0].hostString;
//     // document.title = this.name;
//     console.log(this.hosts);
//     // console.log(hosts);
//     // console.log(this.hosts[0].hostString);
//     // console.log(document.title);
//     console.log("</updated>");
//   },
// });

// console.log(store.getters.getHostByHostName(document.location.hostname));
