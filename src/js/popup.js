// wait for DOM content to load before displaying
document.addEventListener("DOMContentLoaded", displayStorage);
document.addEventListener("DOMContentLoaded", setInputChangeListeners);

async function displayStorage() {
  const storageObject = await getStorageObject();
  const ul = document.getElementById("hostname-list");
  const template = document.getElementById("template-storage-item");

  displayGlobalOptions(storageObject.options);

  // display hosts insterting to <template>
  for (const iterator of storageObject.hosts) {
    // clone the template in loop to prevent overwrting
    const clone = createFromTemplate(template, iterator);
    ul.appendChild(clone);
  }
}

function displayGlobalOptions(optionsObject) {
  // TODO: implement global reload
  document.getElementById("global-enable").checked = optionsObject.enabled;
  document.getElementById("global-window-reload").checked = optionsObject.reloadWindows;
}

function createFromTemplate(template, hostObject) {
  const clone = template.content.cloneNode(true);

  clone.querySelector("[data-id]").dataset.id = hostObject.id;
  clone.querySelector(".hostname-text").innerText = hostObject.hostName;
  clone.querySelector(".user-string-text").innerText = hostObject.usrString;
  if (hostObject.append) {
    clone.querySelector("input[value='append-btn']").checked = true;
  } else {
    clone.querySelector("input[value='overwrite-btn']").checked = true;
  }
  clone.querySelector(".enable").checked = hostObject.enabled;

  return clone;
}

function setInputChangeListeners() {
  globalOptionsListener();
  hostOptionsListener();

  // disable the default form submit on Enter key
  document.getElementById("hostname-list").addEventListener(
    "keydown",
    e => {
      if (e.key === "Enter") e.preventDefault();
    },
    true
  );

  userStringListener();
  deleteButtonListener();
}

function globalOptionsListener() {
  document.getElementById("global-options").addEventListener(
    "change",
    e => {
      if (e.target.type === "checkbox" && e.target.id === "global-enable") {
        const path = ["options", "enabled"];
        saveHostOptions(path, e.target.checked);
      }
      if (e.target.type === "checkbox" && e.target.id === "global-window-reload") {
        const path = ["options", "reloadWindows"];
        saveHostOptions(path, e.target.checked);
      }
    },
    true
  );
}

function hostOptionsListener() {
  document.getElementById("hostname-list").addEventListener(
    "change",
    e => {
      if (e.target.type === "radio" && e.target.name === "action") {
        let radioValue;
        if (e.target.value === "append-btn") radioValue = true;
        if (e.target.value === "overwrite-btn") radioValue = false;
        const dataId = e.target.closest("[data-id]").dataset.id;
        const path = ["hosts", dataId, "append"];
        saveHostOptions(path, radioValue);
      }
      if (e.target.type === "checkbox" && e.target.name === "enable") {
        const dataId = e.target.closest("[data-id]").dataset.id;
        const path = ["hosts", dataId, "enabled"];
        saveHostOptions(path, e.target.checked);
      }
    },
    true
  );
}

function userStringListener() {
  document.getElementById("hostname-list").addEventListener(
    "keyup",
    e => {
      e.target.closest("form").querySelector(".user-string-text").innerText = e.target.value;
      if (e.key === "Enter" && e.target.value !== "" && e.target.name === "usrString") {
        const dataId = e.target.closest("[data-id]").dataset.id;
        const path = ["hosts", dataId, "usrString"];
        saveHostOptions(path, e.target.value);
        e.target.value = "";
      }
    },
    true
  );
}

function deleteButtonListener() {
  document.getElementById("hostname-list").addEventListener(
    "click",
    e => {
      if (e.target.type === "button" && e.target.value === "delete-btn") {
        const dataId = e.target.closest("[data-id]").dataset.id;
        deleteHost(parseInt(dataId, 10));
        document.querySelector(`[data-id="${dataId}"]`).remove();
      }
    },
    true
  );
}
