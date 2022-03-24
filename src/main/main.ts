import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  session,
  nativeTheme,
} from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { fetchItems } from './steam/getCommands';
import os from 'os';
import SteamUser from 'steam-user';
import GlobalOffensive from 'globaloffensive';
import { isLoggedInElsewhere } from './steam/steam';
import { getGithubVersion } from './scripts/versionHelper';
import * as fs from 'fs';
import SteamTotp from 'steam-totp';
import {
  storeUserAccount,
  getLoginDetails,
  deleteUserData,
  getValue,
  setValue,
  setAccountPosition,
} from './store/settings';
import { pricingEmitter, runItems } from './store/pricing';
import { currency } from './store/currency';
import { tradeUps } from './store/tradeup';

const currencyClass = new currency();

let tradeUpClass = new tradeUps();

let mainWindow: BrowserWindow | null = null;
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  let frameValue = true;
  if (process.platform == 'win32') {
    frameValue = false;
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1124,
    height: 850,
    minWidth: 1030,
    minHeight: 800,
    frame: frameValue,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });
  mainWindow.webContents.session.clearStorageData();

  ipcMain.on('download', (_event, info) => {
    let fileP = path.join(os.homedir(), '/Downloads/casemove.csv');

    fs.writeFileSync(fileP, info, 'utf-8');
    shell.showItemInFolder(fileP);
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    console.log(app.getVersion());
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    console.log(url);
    shell.openExternal(
      url
        .replaceAll('http://localhost:1212/#/', '')
        .replaceAll('http://localhost:1212/index.html#/', '')
    );
  });

  if (process.platform == 'linux') {
    mainWindow.removeMenu();
  }
};

/**
 * Add event listeners...
 */
// Windows actions

ipcMain.on('windowsActions', async (_event, message) => {
  if (message == 'min') {
    mainWindow?.minimize();
  }
  if (message == 'max') {
    if (mainWindow?.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow?.maximize();
    }
  }
  if (message == 'close') {
    mainWindow?.close();
  }
});

let currentLocale = 'da-dk';

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    // localStorage.clear();
  }
});

let myWindow = null as any;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  });
  app
    .whenReady()
    .then(async () => {
      currentLocale = app.getLocale();
      console.log('Currentlocal', currentLocale);

      if (process.env.NODE_ENV === 'development') {
        let reactDevToolsPath = '';
        // on windows
        console.log(process.platform);
        if (process.platform == 'win32') {
          reactDevToolsPath = path.join(
            os.homedir(),
            '/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.0.9_0'
          );
        }

        // On linux
        if (process.platform == 'linux') {
          reactDevToolsPath = path.join(
            os.homedir(),
            '/.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.0.9_0'
          );
        }
        // on macOS
        if (process.platform == 'darwin') {
          reactDevToolsPath = path.join(
            os.homedir(),
            '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.0.9_0'
          );
        }

        await session.defaultSession.loadExtension(reactDevToolsPath);
      }
      createWindow();
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
      });
    })
    .catch(console.log);
}

/**
 * IPC...
 */

var fetchItemClass = new fetchItems();

// Version manager
let gitHub = 0;
ipcMain.on('needUpdate', async (event) => {
  try {
    if (gitHub == 0) {
      gitHub = parseInt(await getGithubVersion());
    }
    const version = parseInt(app.getVersion().toString().replaceAll('.', ''));

    if (gitHub > version) {
      event.reply('needUpdate-reply', [true, app.getVersion(), gitHub]);
    } else {
      event.reply('needUpdate-reply', [false, app.getVersion(), gitHub]);
    }
  } catch {
    event.reply('needUpdate-reply', [false, app.getVersion(), 0]);
    gitHub = 1;
  }
});

// Return 1 = Success
// Return 2 = Steam Guard
// Return 3 = Steam Guard wrong
// Return 4 = Wrong password
// Return 5 = Playing elsewhere
ipcMain.on(
  'login',
  async (
    event,
    username,
    password,
    shouldRemember,
    authcode = null,
    secretKey = null
  ) => {
    // Conditional check with random string
    if (password == '~{nA?HJjb]7hB7-') {
      let safeDetails = await getLoginDetails(username);
      password = safeDetails.password;
      if (safeDetails.secretKey != undefined) {
        secretKey = safeDetails.secretKey;
      }
    }

    let user = new SteamUser();
    let csgo = new GlobalOffensive(user);

    let logInOptions = {
      accountName: username,
      password: password,
      twoFactorCode: undefined,
    };
    if (secretKey != null) {
      logInOptions = {
        accountName: username,
        password: password,
        twoFactorCode: SteamTotp.generateAuthCode(secretKey),
      };
    }

    if (authcode != null) {
      logInOptions = {
        accountName: username,
        password: password,
        twoFactorCode: authcode,
      };
    }

    // Steam guard
    user.once('steamGuard', function (domain, callback, lastCodeWrong) {
      domain;
      callback;
      if (lastCodeWrong) {
        console.log('Last code wrong, try again!');
        event.reply('login-reply', [3]);
      } else {
        event.reply('login-reply', [2]);
      }
    });

    // Success
    user.once('loggedOn', () => {
      user.on('accountInfo', (displayName) => {
        console.log('Logged into Steam as ' + displayName);
        isLoggedInElsewhere(user).then((returnValue) => {
          if (returnValue) {
            event.reply('login-reply', [5]);
          } else {
            user.gamesPlayed([]);
            user.gamesPlayed([730]);
            csgo.once('connectedToGC', () => {
              console.log('Connected to GC!');
              if (csgo.haveGCSession) {
                console.log('Have Session!');
                fetchItemClass
                  .convertInventory(csgo.inventory)
                  .then((returnValue) => {
                    const returnPackage = [
                      user.logOnResult.client_supplied_steamid,
                      displayName,
                      csgo.haveGCSession,
                      returnValue,
                    ];
                    startEvents(csgo, user);
                    if (shouldRemember) {
                      storeUserAccount(
                        username,
                        displayName,
                        password,
                        user.logOnResult.client_supplied_steamid,
                        secretKey
                      );
                    }

                    event.reply('login-reply', [1, returnPackage]);
                  });
              }
            });
          }
        });
      });
    });
    user.once('error', (error) => {
      event.reply('login-reply', [4, error]);
    });

    user.logOn(logInOptions);
  }
);

// Adds events listeners the user
// Forward Steam notifications to renderer
async function startEvents(csgo, user) {
  // Pricing
  const pricing = new runItems(user);
  pricingEmitter.on('result', (message) => {
    mainWindow?.webContents.send('pricing', [message]);
  });
  ipcMain.on('getPrice', async (_event, info) => {
    pricing.handleItem(info);
  });

  // Get tradeup
  // Get storage unit contents
  ipcMain.on('getTradeUpPossible', async (event, itemsToGet) => {
    tradeUpClass.getPotentitalOutcome(itemsToGet).then((returnValue) => {
      pricing.handleTradeUp(returnValue);
      event.reply('getTradeUpPossible-reply', returnValue);
    });
  });
  ipcMain.on('processTradeOrder', async (_event, tradeupPayLoad) => {
    console.log(tradeupPayLoad)
    // csgo._send(1002, null, tradeupPayLoad)

  });
  ipcMain.on('getCurrency', async (event) => {
    getValue('pricing.currency').then((returnValue) => {
      currencyClass.getRate(returnValue).then((response) => {
        console.log(returnValue, response);
        event.reply('getCurrency-reply', [returnValue, response]);
      });
    });
  });

  // CSGO listeners
  // Inventory events
  csgo.on('itemRemoved', (item) => {
    if (!Object.keys(item).includes('casket_id')) {
      console.log('Item' + item.itemid + ' was removed');
      fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
        mainWindow?.webContents.send('userEvents', [
          1,
          'itemRemoved',
          [item, returnValue],
        ]);
      });
    }
  });

  csgo.on('itemChanged', (item) => {
    console.log('Item' + item.itemid + ' was changed');
    fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
      mainWindow?.webContents.send('userEvents', [
        1,
        'itemChanged',
        [item, returnValue],
      ]);
    });
  });

  csgo.on('itemAcquired', (item) => {
    if (!Object.keys(item).includes('casket_id')) {
      console.log('Item' + item.itemid + ' was acquired');
      fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
        mainWindow?.webContents.send('userEvents', [
          1,
          'itemAcquired',
          [item, returnValue],
        ]);
      });
    }
  });

  csgo.on('disconnectedFromGC', (reason) => {
    console.log('Disconnected from GC - reason: ', reason);
    mainWindow?.webContents.send('userEvents', [
      3,
      'disconnectedFromGC',
      [reason],
    ]);
  });

  csgo.on('connectedToGC', () => {
    console.log('Connected to GC!');
    if (csgo.haveGCSession) {
      mainWindow?.webContents.send('userEvents', [3, 'connectedToGC']);
    }
  });

  // User listeners
  // Steam Connection
  user.on('error', (eresult, msg) => {
    console.log(eresult, msg);
    mainWindow?.webContents.send('userEvents', [2, 'fatalError']);
    clearForNewSession();
  });
  user.on('disconnected', (eresult, msg) => {
    console.log(eresult, msg);
    mainWindow?.webContents.send('userEvents', [2, 'disconnected']);
  });
  user.on('loggedOn', () => {
    mainWindow?.webContents.send('userEvents', [2, 'reconnected']);
  });

  // Get commands from Renderer
  ipcMain.on('refreshInventory', async () => {
    fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
      mainWindow?.webContents.send('userEvents', [
        1,
        'itemAcquired',
        [{}, returnValue],
      ]);
    });
  });
  // Retry connection
  ipcMain.on('retryConnection', async () => {
    user.gamesPlayed([]);
    user.gamesPlayed([730]);
    console.log('Retrying');
  });
  // Rename Storage units
  ipcMain.on('renameStorageUnit', async (event, itemID, newName) => {
    csgo.nameItem(0, itemID, newName);
    csgo.once('itemCustomizationNotification', (itemIds, notificationType) => {
      if (
        notificationType ==
        GlobalOffensive.ItemCustomizationNotification.NameItem
      ) {
        event.reply('renameStorageUnit-reply', [1, itemIds[0]]);
      }
    });
  });

  // Remove items from storage unit
  ipcMain.on(
    'removeFromStorageUnit',
    async (event, casketID, itemID, fastMode) => {
      csgo.removeFromCasket(casketID, itemID);
      if (fastMode == false) {
        csgo.once(
          'itemCustomizationNotification',
          (itemIds, notificationType) => {
            if (
              notificationType ==
              GlobalOffensive.ItemCustomizationNotification.CasketRemoved
            ) {
              console.log(itemIds + ' removed from storage unit');
              event.reply('removeFromStorageUnit-reply', [1, itemIds[0]]);
            }
          }
        );
      }
    }
  );

  // Move to Storage Unit
  ipcMain.on('moveToStorageUnit', async (event, casketID, itemID, fastMode) => {
    csgo.addToCasket(casketID, itemID);
    if (fastMode == false) {
      csgo.once(
        'itemCustomizationNotification',
        (itemIds, notificationType) => {
          if (
            notificationType ==
            GlobalOffensive.ItemCustomizationNotification.CasketAdded
          ) {
            console.log(itemIds[0] + ' added to storage unit');
            event.reply('moveToStorageUnit-reply', [1, itemIds[0]]);
          }
        }
      );
    }
  });

  // Get storage unit contents
  ipcMain.on('getCasketContents', async (event, casketID) => {
    await csgo.getCasketContents(casketID, async function (err, items) {
      fetchItemClass.convertStorageData(items).then((returnValue) => {
        event.reply('getCasketContent-reply', [1, returnValue]);
        console.log('Casket contains: ', returnValue.length);
      });

      if (err) {
        event.reply('getCasketContent-reply', [0]);
      }
    });
  });
  // Get commands from Renderer
  ipcMain.on('signOut', async () => {
    clearForNewSession();
  });

  async function clearForNewSession() {
    // Remove for pricing
    pricingEmitter.removeAllListeners('result');

    // Remove for CSGO
    csgo.removeAllListeners('itemRemoved');
    csgo.removeAllListeners('itemChanged');
    csgo.removeAllListeners('itemAcquired');
    csgo.removeAllListeners('connectedToGC');
    csgo.removeAllListeners('disconnectedFromGC');

    // Remove for user
    user.removeAllListeners('error');
    user.removeAllListeners('disconnected');
    user.removeAllListeners('loggedOn');

    // IPC
    ipcMain.removeAllListeners('renameStorageUnit');
    ipcMain.removeAllListeners('removeFromStorageUnit');
    ipcMain.removeAllListeners('moveToStorageUnit');
    ipcMain.removeAllListeners('getCasketContents');
    ipcMain.removeAllListeners('signOut');
  }
}

// setValue('darkmode.hasSet', false)
// Set dark mode
async function darkModeSetup() {
  getValue('darkmode.hasSet').then((returnValue) => {
    console.log('hasSet', returnValue);
    if (returnValue == false) {
      if (nativeTheme.shouldUseDarkColors) {
        setValue('darkmode.value', true);
      } else {
        setValue('darkmode.value', false);
      }
    }
  });
}
darkModeSetup();

// Set platform
setValue('os', process.platform);

// Kinda store
ipcMain.on('electron-store-getAccountDetails', async (event) => {
  const accountDetails = await getValue('account');
  event.returnValue = event.reply(
    'electron-store-getAccountDetails-reply',
    accountDetails
  );
});

ipcMain.on('electron-store-deleteAccountDetails', async (_event, username) => {
  deleteUserData(username);
});

ipcMain.on(
  'electron-store-setAccountPosition',
  async (_event, username, position) => {
    setAccountPosition(username, position);
  }
);

// Store IPC
ipcMain.on('electron-store-get', async (event, val, key) => {
  if (val == 'locale') {
    event.reply('electron-store-get-reply' + key, currentLocale);
    return;
  }
  getValue(val).then((returnValue) => {
    event.reply('electron-store-get-reply' + key, returnValue);
  });
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  event;
  setValue(key, val);
});
