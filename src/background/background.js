import browser from "webextension-polyfill";
// import Vue from "vue";
// import App from "./App.vue";
import store from "../store";
// import { createHost } from "./models/Host";

/* eslint-disable no-new */
// new Vue({
//   store,
//   render: h => h(App),
// }).$mount("#app");

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

// browser.runtime.onInstalled.addListener(subscribeToStorage);
// browser.runtime.onStartup.addListener(subscribeToStorage);
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "updateTabs") updateTabs(message);
// })
// browser.tabs.onUpdated.addListener(handleUpdated);

// subscribeToStorage();

// function subscribeToStorage() {
//   store.subscribe((mutation, state) => {
//     console.log(`LOG: subscribeToStorage -> mutation:  `, mutation);
//     if (mutation.type === "vweReplaceState") init();
//   });}

async function init() {
  try {
    const tabs = await browser.tabs.query({});
    console.log(`LOG: init -> tabs: `, tabs);
    // clearOriginalTabTitles(tabs);

    for (const tab of tabs) {
      const hostName = new URL(tab.url).hostname;
      // console.log(`LOG: getHostName -> hostName: `, hostName);
      const host = store.getters["hosts/getHostByHostName"](hostName);
      // console.log(`LOG: init -> host awaited: `, JSON.stringify(host));
      
      if (host) {
      // console.log(`LOG: init -> host: `, host);
        setOriginalTabTitle(tab, host);
      }
      // console.log(`LOG: init -> host: `, host);
      if (host && host.hostState) {
        // console.log(`LOG: init -> tabObject: `, tabObject);
        // console.log(`LOG: init -> host: BLAH`);
        const loopCheck = preventDocumentLoops(host, tab);
        console.log(`LOG: init -> loopCheck: `, loopCheck);
        if (loopCheck) {
          const title = formatTabTitle(host, tab);
          browser.tabs.executeScript(tab.id, {
            code: `document.title = "${title}";`
          });
        }
      }
    }
  }
  catch(error){
    console.log(`LOG: error: `, error);
  }
}

function clearOriginalTabTitles(tabs) {
  for (const tab of tabs) {
    const hostName = new URL(tab.url).hostname;
    const host = store.getters["hosts/getHostByHostName"](hostName);
    if (host) host.originalTabTitles = {};
  }
}

async function setOriginalTabTitle(tab, host) {
  if (tab.title !== host.userTitle) {
    console.log(`LOG: setOriginalTabTitle -> tab: `, tab);
    console.log(`LOG: setOriginalTabTitle -> host: `, host);
    const tabTitle = tab.title;
    console.log(`LOG: setOriginalTabTitle -> tabTitle: `, tabTitle);
    const originalTabTitle = tabTitle.replace(`${host.userTitle}`, "");
    console.log(`LOG: setOriginalTabTitle -> originalTabTitle: `, originalTabTitle);
    // await store.dispatch("hosts/setHostProperty", {mutation: "SET_ORIGINAL_TAB_TITLE", value: {tabId: tab.id, originalTabTitle }, host: host});
    await browser.sessions.setTabValue(tab.id, "originalTabTitle", originalTabTitle);
    console.log(`LOG: setOriginalTabTitle -> getOriginalTabTitle: `, getOriginalTabTitle(tab));
    
  }
}

async function getOriginalTabTitle(tab) {
  const restoredTabTitle = await browser.sessions.getTabValue(tab.id, "originalTabTitle")
  console.log(`LOG: getOriginalTabTitle -> restoredTabTitle: `, restoredTabTitle);
  if (restoredTabTitle) return restoredTabTitle;
}

async function updateTabs(payload) {
  console.log(`LOG: updateTabs WAS CALLED!`);
  console.log(`LOG: updateTabs -> payload: `, payload);
  try {
    // debugger;
    // if (!payload.host.hostState) return;
    const tabs = await browser.tabs.query({
      url: `*://${payload.host.hostName}/*`
    });
    console.log(`LOG: updateTabs -> tabs: `, tabs);

    for (const tab of tabs) {

      const loopCheck = preventDocumentLoops(payload.host, tab);
      // console.log(`LOG: init -> tabObject: `, tabObject);
      if (payload.mutation === "SET_USER_TITLE" && loopCheck) {
        const title = formatTabTitle(payload.host, tab);
        console.log(`LOG: updateTabs -> title: `, title);
        browser.tabs.executeScript(tab.id, {
          code: `document.title = "${title}";`
        });
      }
    }
  } catch (error) {
    console.log(`LOG: error: `, error);
  }
}

async function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.title) {
    // console.log(`LOG: handleUpdated -> tabInfo(1): `, tabInfo);
    const hostName = new URL(tabInfo.url).hostname;
    const host = store.getters["hosts/getHostByHostName"](hostName);
    if (!host) return;
    
    const loopCheck = preventDocumentLoops(host, tabInfo);
    if (host && host.hostState && loopCheck) {
      // console.log(`LOG: handleUpdated -> host.isAppended`, host.isAppended);
      // console.log(`LOG: handleUpdated -> host`, host);
      const title = formatTabTitle(host, tabInfo);
      console.log(`LOG: handleUpdated -> title`, title);
      // console.log(`LOG: handleUpdated -> tabInfo(2): `, tabInfo);
      browser.tabs.executeScript(tabId, {
        code: `document.title = "${title}";`
      });
    }
  }
}

async function formatTabTitle(host, tab) {
  console.log(`LOG: formatTabTitle -> host: `, host);
  console.log(`LOG: formatTabTitle -> tab: `, tab);
  const userTitle = host.userTitle;
  // console.log(`LOG: formatTabTitle -> userTitle`, userTitle);
  // const tabTitle = tab.title;
  const originalTabTitle = await getOriginalTabTitle(tab);
  console.log(`LOG: formatTabTitle -> originalTabTitle: `, originalTabTitle);
  const formattedTitle = host.isAppended
    ? (originalTabTitle + userTitle)
    : userTitle;
  console.log(`LOG: formatTabTitle -> formattedTitle: `, formattedTitle);
  return formattedTitle;
}

function preventDocumentLoops(host, tab) {
  console.log(`LOG: preventDocumentLoops -> preventDocumentLoops1: `);
  // debugger;
  if (!host || !host.hostState) return;
  console.log(`LOG: preventDocumentLoops -> preventDocumentLoops2: `);
  // const title = tab.title;
  // const defaultTitle = title.replace(`${host.userTitle}`, "");
  // store.dispatch("hosts/setHostProperty", {mutation: "SET_DEFAULT_TITLE", value: defaultTitle, host: host});
  if (
    host.isAppended &&
    tab.title ===
    `${host.defaultTitle}${host.userTitle}`
  ) return;
  if (
    !host.isAppended &&
    tab.title === `${host.userTitle}`
  ) return;
  if (
    host.isAppended &&
    tab.title.includes(host.userTitle)
  )return;
  return true;
}

// subscribeToStorage();

store.subscribe((mutation, state) => {
  console.log(`LOG: subscribeToStorage -> mutation: `, mutation);
    if (mutation.type === "vweReplaceState") init();
  });

// init();
// tester();
// setTimeout(() => {
//   // init();
//   tester();
// }, 10);

// function tester() {
//   const hosts = store.getters["hosts/getHosts"];
//   console.log(`LOG: hosts: `, hosts);
// }

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
            
// function getHostName() {
//   return new Promise((resolve, reject) => {
//     browser.tabs.query({ active: true, currentWindow: true }, tabs => {
//       if (browser.runtime.lastError) {
//         reject(new Error(browser.runtime.lastError));
//       } else if (tabs === []) {
//         reject(new Error("tabs array is empty"));
//       } else {
//         const hostName = new URL(tabs[0].url).hostname;
//         console.log(`LOG: getHostName -> hostName`, hostName);
//         resolve(hostName);
//       }
//     });
//   });
// }

// async function getTabHostName() {
//   const tabQuery = await browser.tabs.query({ active: true, currentWindow: true });
//   return new URL(tabQuery[0].url).hostname;
// }

/* browser.browserAction.onClicked.addListener(function(tab) {
  console.log(`Hello ${store.getters.foo}!`);
});
 */
