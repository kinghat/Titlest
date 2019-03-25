chrome.runtime.onInstalled.addListener(initializeExtension);

/* clear persisted context menus: https://stackoverflow.com/a/38204762/934239 
create the right click context menu item */
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    title: "change/append title (Alt+Shift+N)",
    id: "addSite",
    type: "normal",
    contexts: ["page"]
  });
});

// listeners for action context menu or keyboard shorcut
chrome.commands.onCommand.addListener(sendHostToStorage);
chrome.contextMenus.onClicked.addListener(sendHostToStorage);
// chrome.contextMenus.onClicked.addListener(saveDatas);

// message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.iconState === "active") {
    chrome.browserAction.setIcon({ path: "/img/t16e.png" });
    console.log("got the msg mang!");
  }
  if (message.iconState === "disabled") {
    chrome.browserAction.setIcon({ path: "/img/t16d.png" });
    console.log("got the msg mang!");
  }
});

async function sendHostToStorage() {
  const hostName = await getHostName();
  saveHost(hostName);
}

function getHostName() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else if (tabs === []) {
        reject(new Error("tabs array is empty"));
      } else {
        const hostName = new URL(tabs[0].url).hostname;
        resolve(hostName);
      }
    });
  });
}

// listeners for setting icon
chrome.tabs.onActivated.addListener(getHostName);
chrome.tabs.onActivated.addListener(activeInfo => {});
chrome.windows.onFocusChanged.addListener(integer => {});
chrome.windows.getLastFocused(getInfo => {});

chrome.tabs.onActivated.addListener(setIcon);
async function setIcon() {
  const storageObject = await getStorageObject();
  const hostName = await getHostName();
  const inArray = filterPage(storageObject, hostName);
  console.log("LOG: setIcon -> inArray", inArray);
}
