import browser from "webextension-polyfill";

// debugger;
// import store from "../store";
// import Vue from "vue";
// import App from "./App.vue";
// import store from "../store";
console.log("HOLA FROM CONTENT-SCRIPT!");
// console.log("CONTENT-SCRIPT STORE: ", store);

// const testVariable = "is this printing?";
// console.log("testVariable from content-script: ", testVariable);

browser.runtime.sendMessage({ type: "contentScriptInit", hostname: document.location.hostname });

// function clickPause() {
//   document.querySelector(`[title="Pause"]`).click()
//   console.log(`WE CLICKED PAUSE!`)
// }

// function runPauseFunction() {
//   setTimeout(clickPause, 5000);  
// }

// runPauseFunction();

// const vueElement = document.createElement("div");
// vueElement.id = "app";
// document.body.append(vueElement);

// /* eslint-disable no-new */
// new Vue({
//   el: "#app",
//   store,
//   render: h => h(App),
//   // }).$mount("#app");
// });

// // main content script processing
// (async function main() {
//   // const storageObj = store.state;

//   // check if enabled globally before filter and setting title
//   if (store.state.options.globalState) {
//     const hostName = document.location.hostname;
//     const queryResult = hostNameQuery(store.state, hostName);
//     if (queryResult) {
//       formatTitle(queryResult);
//     }
//   }
// })();

// // checks to see if page is in storage
// function hostNameQuery(storage, docHostName) {
//   const hostArray = storage.hosts;
//   const filteredArray = hostArray.find(
//     hosts => hosts.hostName.includes(docHostName) || hosts.hostBindings.includes(docHostName)
//   );

//   if (!filteredArray) {
//     return false;
//   }
//   // console.log("filteredArray", filteredArray);
//   return filteredArray;
// }

// formatting the page title with MuObs
// function formatTitle(hostObject) {
//   if (hostObject) {
//     // console.log("hostObject1", hostObject);

//     // setting title and listening for a change.
//     if (hostObject.hostState && hostObject.append) {
//       // browser.runtime.sendMessage({ iconState: "active" });
//       console.log("hostObject2", hostObject);

//       if (!document.title.includes(hostObject.hostString)) {
//         document.title += hostObject.hostString;
//         console.log("TITLed:", document.title);
//       }

//       new MutationObserver(() => {
//         console.log("title in observer:", document.title);
//         if (!document.title.includes(hostObject.hostString)) {
//           document.title += hostObject.hostString;
//         }
//       }).observe(document.querySelector("title"), {
//         childList: true,
//       });
//     } else if (hostObject.hostState && !hostObject.append) {
//       // browser.runtime.sendMessage({ iconState: "active" });

//       if (document.title !== hostObject.hostString) {
//         document.title = hostObject.hostString;
//       }

//       new MutationObserver(() => {
//         if (document.title !== hostObject.hostString) {
//           document.title = hostObject.hostString;
//         }
//       }).observe(document.querySelector("title"), {
//         childList: true,
//       });
//     } else if (!hostObject.hostState) {
//       // browser.runtime.sendMessage({ iconState: "disabled" });
//     }
//   }
// }
/* browser.runtime.onMessage.addListener(message => {
    console.log("TCL: message", message);
    main();
  }); */
