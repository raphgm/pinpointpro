const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("pinpoint", {
  isElectron: true,
});
