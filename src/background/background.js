import browser from "webextension-polyfill";
import Vue from "vue";
import App from "./App.vue";
import store from "../store";
// import { createHost } from "./models/Host";

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App),
}).$mount("#app");
/* clear persisted context menus: https://stackoverflow.com/a/38204762/934239 
create the right click context menu item */
/* browser.contextMenus.removeAll(() => {
  browser.contextMenus.create({
    title: "change/append title (Alt+Shift+N)",
    id: "addSite",
    type: "normal",
    contexts: ["page"],
  });
}); */

// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log(`background.js: ${message.hostname}`);
// });

//   if (message.type === "hostname" && store.getters.getHostByHostName(message.hostname)) {
//     console.log(
//       `getter :
//       ${store.getters.getHostByHostName(message.hostname)}`,
//     );
//     browser.tabs.executeScript(sender.tab.id, {
//       file: "/content-scripts/content-script-inject.js",
//     });
//   } else {
//     console.log(`${message.hostname} was not found in store!`);
//     console.log(`sender.url: ${sender.url}`);
//     console.log(`sender.id: ${sender.id}`);
//   }
// });

const theHostName = document.location.hostname;
// browser.runtime.onMessage.addListener(async (msg, sender) => {
//   console.log("BG page received message", msg, "from", sender);
//   // console.log("Stored data", await browser.storage.local.get());
// });

// browser.webNavigation.onCompleted.addListener(
//   e => {
//     console.log("userTitle event", store.state.hosts[0].userTitle);
//   },
//   { url: [{ hostEquals: document.location.hostname.toString }] },
// );

// listeners for action context menu or keyboard shorcut
// browser.commands.onCommand.addListener(sendHostToStorage);
// browser.contextMenus.onClicked.addListener(sendHostToStorage);
// browser.contextMenus.onClicked.addListener(getTabHostName);

function getHostName() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (browser.runtime.lastError) {
        reject(new Error(browser.runtime.lastError));
      } else if (tabs === []) {
        reject(new Error("tabs array is empty"));
      } else {
        const hostName = new URL(tabs[0].url).hostname;
        console.log(`LOG: getHostName -> hostName`, hostName);
        resolve(hostName);
      }
    });
  });
}

async function getTabHostName() {
  const tabQuery = await browser.tabs.query({ active: true, currentWindow: true });
  return new URL(tabQuery[0].url).hostname;
}

/* browser.browserAction.onClicked.addListener(function(tab) {
  console.log(`Hello ${store.getters.foo}!`);
});
 */
