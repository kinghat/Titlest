import browser from "webextension-polyfill";
import store from "../store";

/* clear persisted context menus: https://stackoverflow.com/a/38204762/934239
create the right click context menu item */
browser.contextMenus.removeAll(() => {
	browser.contextMenus.create({
		title: "change/append title (Alt+Shift+N)",
		id: "addSite",
		type: "normal",
		contexts: ["page"],
	});
});

store.subscribe((mutation, state) => {
	if (mutation.type === "vweReplaceState") reloadInit();
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "updateTabs") updateTabs(message);
	if (message.type === "setTabsToGlobalState") setTabsToGlobalState();
	if (message.type === "updateSavedTabs") reloadInit();
});

browser.tabs.onUpdated.addListener(handleUpdated);

async function reloadInit() {
	try {
		const tabs = await browser.tabs.query({});

		clearOriginalTabTitles(tabs);

		for (const tab of tabs) {
			const hostName = new URL(tab.url).hostname;
			const host = store.getters["hosts/getHostByHostName"](hostName);

			if (host) {
				setOriginalTabTitle(tab, host);
			}
			if (host && host.hostState) {
				const loopCheck = preventDocumentLoops(tab, host);
				console.log(`LOG: init -> loopCheck: `, loopCheck);
				if (loopCheck) {
					setTabTitle(tab, host);
				}
			}
		}
	} catch (error) {
		console.log(`LOG: reloadInit -> error: `, error);
	}
}

async function setTabsToGlobalState() {
	try {
		const tabs = await browser.tabs.query({});

		for (const tab of tabs) {
			const hostName = new URL(tab.url).hostname;
			const host = store.getters["hosts/getHostByHostName"](hostName);

			if (host && host.hostState) {
				const title = await formatTabTitle(tab, host);
				browser.tabs.executeScript(tab.id, {
					code: `document.title = "${title}";`,
				});
				// setTabTitle(tab, host);
			}
		}
	} catch (error) {
		console.log(`LOG: setTabsToGlobalState -> error: `, error);
	}
}

async function clearOriginalTabTitles(tabs) {
	try {
		for (const tab of tabs) {
			const hostName = new URL(tab.url).hostname;
			const host = store.getters["hosts/getHostByHostName"](hostName);

			if (host) {
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
	} catch (error) {
		console.log(`LOG: clearOriginalTabTitles -> error: `, error);
	}
}

async function setOriginalTabTitle(tab, host) {
	try {
		if (tab.title !== host.userTitle) {
			const { title, id } = tab;
			const { userTitle, originalTabTitles } = host;
			const originalTabTitle = title.replace(`${userTitle}`, "");

			await store.dispatch("hosts/setHostProperty", {
				mutation: "SET_ORIGINAL_TAB_TITLE",
				value: {
					...originalTabTitles,
					[id]: originalTabTitle,
				},
				host,
			});
		}
	} catch (error) {
		console.log(`LOG: setOriginalTabTitle -> error: `, error);
	}
}

function getOriginalTabTitle(tab, host) {
	const originalTabTitle = host.originalTabTitles[tab.id];
	return originalTabTitle;
}

async function updateTabs(payload) {
	try {
		const { host } = payload;
		const tabs = await browser.tabs.query({
			url: `*://${payload.host.hostName}/*`,
		});

		for (const tab of tabs) {
			const loopCheck = preventDocumentLoops(tab, host);
			if (loopCheck) {
				setTabTitle(tab, host);
			}
		}
	} catch (error) {
		console.log(`LOG: updateTabs -> error: `, error);
	}
}

async function handleUpdated(tabId, changeInfo, tabInfo) {
	try {
		if (changeInfo.title) {
			const hostName = new URL(tabInfo.url).hostname;
			const host = store.getters["hosts/getHostByHostName"](hostName);

			if (!host) return;

			setOriginalTabTitle(tabInfo, host);

			const loopCheck = preventDocumentLoops(tabInfo, host);
			const globalState = await getGlobalState();

			if (host.hostState && loopCheck && globalState) {
				const title = await formatTabTitle(tabInfo, host);

				browser.tabs.executeScript(tabId, {
					code: `document.title = "${title}";`,
				});
			}
		}
	} catch (error) {
		console.log(`LOG: handleUpdated -> error: `, error);
	}
}

async function setTabTitle(tab, host) {
	try {
		const title = await formatTabTitle(tab, host);
		const globalState = await getGlobalState();

		if (globalState) {
			browser.tabs.executeScript(tab.id, {
				code: `document.title = "${title}";`,
			});
		}
	} catch (error) {
		console.log(`LOG: setTabTitle -> error: `, error);
	}
}

async function formatTabTitle(tab, host) {
	try {
		const { userTitle, isAppended, originalTabTitles, hostState } = host;
		const originalTabTitle = getOriginalTabTitle(tab, host);
		const globalState = await getGlobalState();
		let formattedTitle;

		if (hostState)
			formattedTitle = isAppended ? originalTabTitle + userTitle : userTitle;
		if (!hostState || !globalState) formattedTitle = originalTabTitle;

		return formattedTitle;
	} catch (error) {
		console.log(`LOG: formatTabTitle -> error: `, error);
	}
}

function preventDocumentLoops(tab, host) {
	if (!host) return;

	const { isAppended, originalTabTitles, userTitle, hostState } = host;
	const { title, id } = tab;

	if (hostState) {
		if (isAppended && title === `${originalTabTitles[id]}${userTitle}`)
			return;
		if (!isAppended && title === userTitle) return;
	}

	return true;
}

async function getGlobalState() {
	try {
		const state = await store.state.globals.options.globalState;

		return state;
	} catch (error) {
		console.log(`LOG: getGlobalState -> error: `, error);
	}
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
