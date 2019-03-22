const defaultSettingsObject = {
  options: {
    enabled: true,
    reloadWindows: false,
    replaceAll: false
  },
  hosts: [
    {
      id: 0,
      enabled: true,
      hostName: "www.google.com",
      usrString: " - Titlest",
      append: true,
      bindings: []
    }
  ]
};

const defaultNotificationObject = {
  type: "basic",
  iconUrl: "img/t48.png",
  title: "the title",
  message: "the message"
};

function getStorageObject() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(items => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items);
      }
    });
  });
}

async function initializeExtension() {
  const storageObjectLength = await checkStorageExists();
  if (storageObjectLength === 0) {
    chrome.storage.sync.set(defaultSettingsObject);
  }
}

async function checkStorageExists() {
  const storageObject = await getStorageObject();
  return Object.entries(storageObject).length;
}

// checks to see if page is in storage
function filterPage(storage, docHostName) {
  const hostArray = storage.hosts;
  const filteredArray = hostArray.find(
    hosts => hosts.hostName.includes(docHostName) || hosts.bindings.includes(docHostName)
  );

  if (!filteredArray) {
    // console.log("page is not in the array");
    return false;
  }
  // console.log("page is in array");
  return filteredArray;
}

async function saveHost(hostName) {
  if (hostName) {
    const storageObject = await getStorageObject();
    if (filterPage(storageObject, hostName)) {
      defaultNotificationObject.title = "Duplicate Storage Item";
      defaultNotificationObject.message = `You already have "${hostName}" in your list. 
      The list is located in the extension popup.`;
      chrome.notifications.create("duplicateNotification", defaultNotificationObject);
    }

    defaultSettingsObject.hosts[0].id = storageObject.hosts.length;
    defaultSettingsObject.hosts[0].hostName = hostName;
    storageObject.hosts.push(defaultSettingsObject.hosts[0]);
    chrome.storage.sync.set(storageObject);

    defaultNotificationObject.title = "Saved Host";
    defaultNotificationObject.message = `You saved "${hostName}" to your list. 
    The list is located in the extension popup.`;
    chrome.notifications.create("savedNotification", defaultNotificationObject);
  }
}

async function saveHostOptions(pathArray, value) {
  const storageObject = await getStorageObject();
  let path = storageObject;
  const finalPathItem = pathArray.pop();

  if (!finalPathItem) throw new Error("No path given");
  for (const p of pathArray) {
    // build path to storage object
    path = path[p];
  }

  path[finalPathItem] = value;
  chrome.storage.sync.set(storageObject);
}

async function deleteHost(hostId) {
  if (Number.isInteger(hostId)) {
    const storageObject = await getStorageObject();
    const { hostName } = storageObject.hosts[hostId];

    storageObject.hosts = storageObject.hosts
      .filter((value, index) => index !== hostId)
      .map((value, index) => ({ ...value, id: index }));

    chrome.storage.sync.set(storageObject);

    defaultNotificationObject.title = "Deleted Host";
    defaultNotificationObject.message = `You Deleted "${hostName}" from your list.`;
    chrome.notifications.create("deletedNotification", defaultNotificationObject);
  }
}

const extData = {
  options: {
    enabled: true,
    reloadWindows: false,
    replaceAll: false
  },
  hosts: [
    {
      id: 0,
      enabled: true,
      hostName: "stackoverflow.com",
      usrString: " - Stack Overflow",
      append: true,
      bindings: ["stackexchange.com"]
    },
    {
      id: 1,
      enabled: true,
      hostName: "www.google.com",
      usrString: "Booble",
      append: false,
      bindings: []
    }
  ]
};

const hostNameData = [
  {
    id: 2,
    enabled: false,
    hostName: "irc.kinghat.info",
    usrString: "test",
    append: true,
    bindings: ["test1.com"]
  },
  {
    id: 3,
    enabled: false,
    hostName: "paste.debian.net",
    usrString: "",
    append: false,
    bindings: ["debian.com"]
  },
  {
    id: 4,
    enabled: true,
    hostName: "irccloud.com",
    usrString: " - IRCCloud",
    append: true,
    bindings: []
  },
  {
    id: 5,
    enabled: true,
    hostName: "discordapp.com",
    usrString: " - discord",
    append: true,
    bindings: []
  }
];

async function saveDatas() {
  chrome.storage.sync.clear(() => {
    console.log("cleared storage!");
  });

  chrome.storage.sync.set(extData, () => {
    console.log("you saved to storage!");
  });

  const sitesObj = await getStorageObject();

  sitesObj.hosts.push(...hostNameData);

  chrome.storage.sync.set(sitesObj, () => {
    console.log("you updated the page array object!");
  });

  const storedObj = await getStorageObject();
  console.log(storedObj);
}
