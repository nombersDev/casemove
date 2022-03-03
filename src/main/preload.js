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
    needUpdate() {
      return new Promise((resolve) => {
        ipcRenderer.send('needUpdate');
        ipcRenderer.once('needUpdate-reply', (evt, message) => {
          resolve(message);
        });
      });
    },
    // User account
    getAccountDetails() {
      return new Promise((resolve) => {
        ipcRenderer.send('electron-store-getAccountDetails');
        ipcRenderer.once(
          'electron-store-getAccountDetails-reply',
          (evt, message) => {
            resolve(message);
          }
        );
      });
    },

    // User account
    deleteAccountDetails(username) {
      ipcRenderer.send('electron-store-deleteAccountDetails', username);
    },

    downloadFile(data) {
      ipcRenderer.send('download', data);
    },
    getPrice(itemRow) {
      ipcRenderer.send('getPrice', itemRow);
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
    loginUser(
      username,
      password,
      shouldRemember,
      authcode,
      sharedSecret
    )
    {

      if (authcode == '') {
        authcode = null;
      }
      if (sharedSecret == '') {
        sharedSecret = null;
      }
      return new Promise((resolve) => {
        ipcRenderer.send(
          'login',
          username,
          password,
          shouldRemember,
          authcode,
          sharedSecret
        );
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
    moveFromStorageUnit(casketID, itemID, fastMode) {

      // Create a promise that rejects in <ms> milliseconds
      let storageUnitResponse = new Promise((resolve) => {
        ipcRenderer.send('removeFromStorageUnit', casketID, itemID, fastMode);

        if (fastMode) {
          resolve(fastMode)
        }
        else {
          ipcRenderer.once('removeFromStorageUnit-reply', (event, arg) => {
            resolve(arg);
          });
        }

      });
      if (fastMode) {
        return true
      } else {
        let timeout = new Promise((_resolve, reject) => {
          let id = setTimeout(() => {
            clearTimeout(id);
            reject();
          }, 10000);
        });
        return Promise.race([storageUnitResponse, timeout]);
      }

    },
    // Commands
    moveToStorageUnit(casketID, itemID, fastMode) {
      let storageUnitResponse = new Promise((resolve) => {
        ipcRenderer.send('moveToStorageUnit', casketID, itemID, fastMode);
        if (fastMode) {
          resolve(fastMode)
        }
        else {
          ipcRenderer.once('moveToStorageUnit-reply', (event, arg) => {
            resolve(arg);
          });
        }


      });

      if (fastMode) {
        return true
      } else {
        let timeout = new Promise((_resolve, reject) => {
          let id = setTimeout(() => {
            clearTimeout(id);
            reject();
          }, 10000);
        });

      return Promise.race([storageUnitResponse, timeout]);
      }

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
        'needUpdate',
        'download',
        'electron-store-getAccountDetails',
        'electron-store-get',
        'electron-store-set',
        'pricing'
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
        'needUpdate',
        'download',
        'electron-store-getAccountDetails',
        'electron-store-get',
        'electron-store-set',
        'pricing'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  store: {
    // Commands
    get(val) {
      return new Promise((resolve) => {
        ipcRenderer.send('electron-store-get', val);

        ipcRenderer.once('electron-store-get-reply', (event, arg) => {
          resolve(arg);
        });
      });
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },
});
