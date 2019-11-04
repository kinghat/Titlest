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

store.subscribe((mutation, state) => {
	if (mutation.type === "vweReplaceState") reloadInit();
});

// browser.runtime.onInstalled.addListener(subscribeToStorage);
// browser.runtime.onStartup.addListener(subscribeToStorage);
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "updateTabs") updateTabs(message);
});
browser.tabs.onUpdated.addListener(handleUpdated);

// subscribeToStorage();

// function subscribeToStorage() {
//   store.subscribe((mutation, state) => {
//     console.log(`LOG: subscribeToStorage -> mutation:  `, mutation);
//     if (mutation.type === "vweReplaceState") init();
//   });}

async function reloadInit() {
	try {
		const tabs = await browser.tabs.query({});
		// console.log(`LOG: realoadInit -> tabs: `, tabs);
		clearOriginalTabTitles(tabs);

		for (const tab of tabs) {
			const hostName = new URL(tab.url).hostname;
			// console.log(`LOG: getHostName -> hostName: `, hostName);
			const host = store.getters["hosts/getHostByHostName"](hostName);
			// console.log(`LOG: reloadInit -> host: `, host);
			// console.log(`LOG: init -> host awaited: `, JSON.stringify(host));

			if (host) {
				// console.log(`LOG: init -> host: `, host);
				// clearOriginalTabTitle(tab, host);
				setOriginalTabTitle(tab, host);
			}
			// console.log(`LOG: init -> host: `, host);
			if (host && host.hostState) {
				// console.log(`LOG: init -> tabObject: `, tabObject);
				// console.log(`LOG: init -> host: BLAH`);
				const loopCheck = preventDocumentLoops(tab, host);
				console.log(`LOG: init -> loopCheck: `, loopCheck);
				if (loopCheck) {
					setTabTitle(tab, host);
				}
			}
		}
	} catch (error) {
		console.log(`LOG: error: `, error);
	}
}

async function clearOriginalTabTitles(tabs) {
	// console.log(`LOG: clearOriginalTabTitles -> tabs: `, tabs);
	for (const tab of tabs) {
		// console.log(`LOG: clearOriginalTabTitles -> tab: `, tab);
		const hostName = new URL(tab.url).hostname;
		const host = store.getters["hosts/getHostByHostName"](hostName);
		if (host) {
			console.log(`LOG: clearOriginalTabTitles -> host.hostName: `, host.hostName);
			const { title } = tab;
			const { userTitle } = host;
			if (title !== userTitle) {
				store.dispatch("hosts/setHostProperty", {
					mutation: "SET_ORIGINAL_TAB_TITLE",
					value: {},
					host,
				});
			}
		}
	}
}

async function setOriginalTabTitle(tab, host) {
	if (tab.title !== host.userTitle) {
		// console.log(`LOG: setOriginalTabTitle -> tab.id: `, tab.id);
		// console.log(`LOG: setOriginalTabTitle -> host.hostName: `, host.hostName);
		const { title, id } = tab;
		const { userTitle, originalTabTitles } = host;
		const tabTitle = tab.title;
		// console.log(`LOG: setOriginalTabTitle -> tabTitle: `, tabTitle);
		const originalTabTitle = title.replace(`${userTitle}`, "");
		console.log(`LOG: setOriginalTabTitle -> originalTabTitle: `, originalTabTitle);

		await store.dispatch("hosts/setHostProperty", {
			mutation: "SET_ORIGINAL_TAB_TITLE",
			value: {
				...originalTabTitles,
				[id]: originalTabTitle,
			},
			host,
		});
		// await browser.sessions.setTabValue(tab.id, "originalTabTitle", originalTabTitle);
		// const returnedOriginalTabTitle = getOriginalTabTitle(tab);
		// console.log(`LOG: setOriginalTabTitle -> returnedOriginalTabTitle: `, returnedOriginalTabTitle);
	}
}

function getOriginalTabTitle(tab, host) {
	// console.log(`LOG: getOriginalTabTitle -> tab.id: `, tab.id);
	// const restoredTabTitle = await browser.sessions.getTabValue(tab.id, "originalTabTitle");
	const originalTabTitle = host.originalTabTitles[tab.id];
	console.log(`LOG: getOriginalTabTitle -> originalTabTitle: `, originalTabTitle);
	return originalTabTitle;
}

async function updateTabs(payload) {
	console.log(`LOG: updateTabs WAS CALLED!`);
	console.log(`LOG: updateTabs -> payload: `, payload);
	const { host } = payload;
	try {
		// debugger;
		// if (!payload.host.hostState) return;
		const tabs = await browser.tabs.query({
			url: `*://${payload.host.hostName}/*`,
		});
		console.log(`LOG: updateTabs -> tabs: `, tabs);

		for (const tab of tabs) {
			const loopCheck = preventDocumentLoops(tab, host);
			console.log(`LOG: updateTabs -> loopCheck`, loopCheck);
			if (loopCheck) {
				setTabTitle(tab, host);
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
		setOriginalTabTitle(tabInfo, host);
		const loopCheck = preventDocumentLoops(tabInfo, host);
		if (host.hostState && loopCheck) {
			// console.log(`LOG: handleUpdated -> host.isAppended`, host.isAppended);
			// console.log(`LOG: handleUpdated -> host`, host);
			const title = formatTabTitle(tabInfo, host);
			console.log(`LOG: handleUpdated -> title:`, title);
			// console.log(`LOG: handleUpdated -> tabInfo(2): `, tabInfo);
			browser.tabs.executeScript(tabId, {
				code: `document.title = "${title}";`,
			});
		}
	}
}

function setTabTitle(tab, host) {
	const title = formatTabTitle(tab, host);
	console.log(`LOG: setTabTitle -> title: `, title);
	browser.tabs.executeScript(tab.id, {
		code: `document.title = "${title}";`,
	});
}

function formatTabTitle(tab, host) {
	console.log(`LOG: formatTabTitle -> host.hostName: `, host.hostName);
	console.log(`LOG: formatTabTitle -> tab.id: `, tab.id);
	const { userTitle, isAppended, originalTabTitles, hostState } = host;
	console.log(`LOG: formatTabTitle -> originalTabTitles: `, originalTabTitles);
	// console.log(`LOG: formatTabTitle -> userTitle`, userTitle);
	// const tabTitle = tab.title;
	const originalTabTitle = getOriginalTabTitle(tab, host);
	console.log(`LOG: formatTabTitle -> originalTabTitle: `, originalTabTitle);
	let formattedTitle;
	if (hostState) formattedTitle = isAppended ? originalTabTitle + userTitle : userTitle;
	if (!hostState) formattedTitle = originalTabTitle;
	console.log(`LOG: formatTabTitle -> formattedTitle: `, formattedTitle);
	return formattedTitle;
}

function preventDocumentLoops(tab, host) {
	// console.log(`LOG: preventDocumentLoops -> preventDocumentLoops1: `);
	// debugger;
	if (!host) return;
	const { isAppended, originalTabTitles, userTitle, hostState } = host;
	const { title, id } = tab;
	console.log(`LOG: preventDocumentLoops -> preventDocumentLoops`);
	if (hostState) {
		if (isAppended && title === `${originalTabTitles[id]}${userTitle}`) return;
		if (!isAppended && title === userTitle) return;
	}
	// if (isAppended && title.includes(userTitle)) return;
	return true;
}

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

/* browser.browserAction.onClicked.addListener(function(tab) {
  console.log(`Hello ${store.getters.foo}!`);
});
 */
