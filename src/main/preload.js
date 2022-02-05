const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing(message = 'ping') {
      ipcRenderer.send('ipc-example', message);
    },

    // User commands
    refreshInventory() {
      ipcRenderer.send('refreshInventory');
    },
    // User commands
    retryConnection() {
      ipcRenderer.send('retryConnection');
    },
    // User commands
    logUserOut() {
      ipcRenderer.send('signOut');
    },
    // USER CONNECTIONS
    loginUser(username, password, storePassword, shouldRemember, authcode) {
      return new Promise((resolve) => {
        if (authcode == '') {
          ipcRenderer.send(
            'login',
            username,
            password,
            storePassword,
            shouldRemember
          );
        } else {
          ipcRenderer.send(
            'login',
            username,
            password,
            storePassword,
            shouldRemember,
            authcode
          );
        }
        ipcRenderer.once('login-reply', (event, arg) => {
          resolve(arg);
        });
      });
    },

    userEvents() {
      return new Promise((resolve) => {
        ipcRenderer.once('userEvents', (evt, message) => {
          resolve(message);
        });
      });
    },

    // Commands
    renameStorageUnit(itemID, newName) {
      return new Promise((resolve) => {
        ipcRenderer.send('renameStorageUnit', itemID, newName);

        ipcRenderer.once('renameStorageUnit-reply', (event, arg) => {
          resolve(arg);
        });
      });
    },

    // Commands
    getStorageUnitData(itemID) {
      return new Promise((resolve) => {
        ipcRenderer.send('getCasketContents', itemID);

        ipcRenderer.once('getCasketContent-reply', (event, arg) => {
          resolve(arg);
        });
      });
    },

    // Commands
    moveFromStorageUnit(casketID, itemID) {
      let timeout = new Promise((_resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id);
          reject();
        }, 10000);
      });
      // Create a promise that rejects in <ms> milliseconds
      let storageUnitResponse = new Promise((resolve) => {
        ipcRenderer.send('removeFromStorageUnit', casketID, itemID);

        ipcRenderer.once('removeFromStorageUnit-reply', (event, arg) => {
          resolve(arg);
        });
      });
      return Promise.race([storageUnitResponse, timeout]);
    },
    // Commands
    moveToStorageUnit(casketID, itemID) {
      let timeout = new Promise((_resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id);
          reject();
        }, 10000);
      });
      let storageUnitResponse = new Promise((resolve) => {
        ipcRenderer.send('moveToStorageUnit', casketID, itemID);

        ipcRenderer.once('moveToStorageUnit-reply', (event, arg) => {
          resolve(arg);
        });
      });
      return Promise.race([storageUnitResponse, timeout]);
    },

    on(channel, func) {
      const validChannels = [
        'ipc-example',
        'login',
        'userEvents',
        'refreshInventory',
        'renameStorageUnit',
        'removeFromStorageUnit',
        'errorMain',
        'signOut',
        'retryConnection',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'ipc-example',
        'login',
        'userEvents',
        'refreshInventory',
        'renameStorageUnit',
        'removeFromStorageUnit',
        'errorMain',
        'signOut',
        'retryConnection',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },
});
