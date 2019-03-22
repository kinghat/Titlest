// main content script processing
(async function main() {
  const storageObj = await getStorageObject();

  // check if enabled globally before filter and setting title
  if (storageObj.options.enabled) {
    const hostName = document.location.hostname;
    const pageResult = filterPage(storageObj, hostName);
    if (pageResult) {
      formatTitle(pageResult);
    }
  }
})();

// formatting the page title with MuObs
function formatTitle(pageObject) {
  if (pageObject) {
    // setting title and listening for a change.
    if (pageObject.enabled && pageObject.append) {
      chrome.runtime.sendMessage({ iconState: "active" });

      if (!document.title.includes(pageObject.usrString)) {
        document.title += pageObject.usrString;
      }

      new MutationObserver(() => {
        if (!document.title.includes(pageObject.usrString)) {
          document.title += pageObject.usrString;
        }
      }).observe(document.querySelector("title"), {
        childList: true
      });
    } else if (pageObject.enabled && !pageObject.append) {
      chrome.runtime.sendMessage({ iconState: "active" });

      if (document.title !== pageObject.usrString) {
        document.title = pageObject.usrString;
      }

      new MutationObserver(() => {
        if (document.title !== pageObject.usrString) {
          document.title = pageObject.usrString;
        }
      }).observe(document.querySelector("title"), {
        childList: true
      });
    } else if (!pageObject.enabled) {
      chrome.runtime.sendMessage({ iconState: "disabled" });
    }
  } else {
    console.log("the end is neigh!");
  }
}
/* chrome.runtime.onMessage.addListener(message => {
  console.log("TCL: message", message);
  main();
}); */
