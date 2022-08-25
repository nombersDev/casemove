import { ipcMain, shell, app } from 'electron';
import path from 'path';
import os from 'os';
import * as fs from 'fs';
import { IPCListeners } from './ipcInterfaces';
import { StorageEngine } from '../storage/00-storage';
import { getGithubVersion } from '../scripts/versionHelper';

class IPCListener extends StorageEngine {
  mainWindow: any;
  githubVersion: number

  // ConstructerObject
  mappingObject: IPCListeners = {
    download: this.downloadFile,
    windowsActions: this.windowsMenuBar,
    needUpdate: this.needUpdate,
    getAllAccounts: this.returnAllAccounts,
    deleteAccount: this.deleteAccountDetails,
    setAccountPosition: this.storeSetAccountPosition,
    electronStoreGet: this.electronStoreGet,
    electronStoreSet: this.electronStoreSet
  };

  constructor( mainWindow: any) {
    super();
    this.mainWindow = mainWindow;
    this.githubVersion = 0
  }

  // Download CSV File
  async downloadFile() {
    ipcMain.on('download', (_event, info) => {
      // Get the download path
      let fileP = path.join(os.homedir(), '/Downloads/casemove.csv');

      // Write to file
      fs.writeFileSync(fileP, info, 'utf-8');
      shell.showItemInFolder(fileP);
    });
  }

  // Check update
  async needUpdate() {
    ipcMain.on('needUpdate', async (event: any) => {
      try {
        if (this.githubVersion == 0) {
          getGithubVersion(process.platform).then((returnValue) => {
            // Get the current version
            const version = parseInt(
              app.getVersion().toString().replaceAll('.', '')
            );

            // Check success status
            let successStatus: boolean = false;
            if (returnValue.version > version) {
              successStatus = true;
            } else {
              successStatus = false;
            }

            // Send the event back back
            event.reply('needUpdate-reply', {
              requireUpdate: successStatus,
              currentVersion: app.getVersion(),
              githubResponse: returnValue,
            });
          });
        }
      } catch {
        event.reply('needUpdate-reply', [false, app.getVersion(), 0]);
        this.githubVersion = 1
      }
    });

  }

  // Windows custom menu bar
  async windowsMenuBar() {
    ipcMain.on('windowsActions', async (_event, message) => {
      if (message == 'min') {
        this.mainWindow?.minimize();
      }
      if (message == 'max') {
        if (this.mainWindow?.isMaximized()) {
          this.mainWindow.restore();
        } else {
          this.mainWindow?.maximize();
        }
      }
      if (message == 'close') {
        this.mainWindow?.close();
      }
    });
  }

  // Get the account details. Used for Login page.
  async returnAllAccounts() {
    // Kinda store
    ipcMain.on('electron-store-getAccountDetails', async (event) => {
      const accountDetails = await this.getAllAccountDetails()
      event.returnValue = event.reply(
        'electron-store-getAccountDetails-reply',
        accountDetails
      );
    });
  }

  // Delete a specific account
  async deleteAccountDetails() {
    ipcMain.on('electron-store-deleteAccountDetails', async (_event, username) => {
      this.deleteUserData(username);
    });
  }

  // Setaccountposition
  async storeSetAccountPosition() {
    ipcMain.on(
      'electron-store-setAccountPosition',
      async (_event, username, position) => {
        this.setAccountPosition(username, position);
      }
    );
  }

  // Used for local storage get calls
  async electronStoreGet() {
    ipcMain.on('electron-store-get', async (event, val: string, key) => {
      if (val == 'locale') {
        event.reply('electron-store-get-reply' + key,  app.getLocale());
        return;
      }
      this.getValue(val).then((returnValue) => {
        event.reply('electron-store-get-reply' + key, returnValue);
      });
    });
  }

  //  Used for local storage set calls
  async electronStoreSet() {
    ipcMain.on('electron-store-set', async (event, key, val) => {
      event;
      this.setValue(key, val);
    });

  }
}

export class IPCStarter extends IPCListener {
  relevantFunction: Function;
  constructor(mainWindow: any) {
    super(mainWindow)
    this.relevantFunction = function() {}
  }

  setRelevantFunction(nameToSet: keyof IPCListener) {
    this.relevantFunction = this.mappingObject[nameToSet]
  }
}
