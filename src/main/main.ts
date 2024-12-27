import 'core-js/stable';
import { BrowserWindow, app, ipcMain, session, shell } from 'electron';
import * as fs from 'fs';
import GlobalOffensive from 'globaloffensive';
import os from 'os';
import path from 'path';
import 'regenerator-runtime/runtime';
import { CurrencyReturnValue } from 'shared/Interfaces.tsx/IPCReturn';
import { LoginCommandReturnPackage } from 'shared/Interfaces.tsx/store';
import SteamUser from 'steam-user';
import { LoginGenerator } from './helpers/classes/IPCGenerators/loginGenerator';
import { currency } from './helpers/classes/steam/currency';
import { fetchItems } from './helpers/classes/steam/items/getCommands';
import {
  currencyCodes,
  pricingEmitter,
  runItems,
} from './helpers/classes/steam/pricing';
import {
  deleteUserData,
  getValue,
  setAccountPosition,
  setValue,
  storeUserAccount,
} from './helpers/classes/steam/settings';
import { login } from './helpers/classes/steam/steam';
import { tradeUps } from './helpers/classes/steam/tradeup';
import MenuBuilder from './menu';
import { getGithubVersion } from './scripts/versionHelper';
import { resolveHtmlPath } from './util';
// import log from 'electron-log';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { emitterAccount } from '../emitters';
import { flowLoginRegularQR } from './helpers/login/flowLoginRegularQR';
import { WalletInterface } from '../renderer/interfaces/states';

autoUpdater.logger = log;
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});

const find = require('find-process');

autoUpdater.on('checking-for-update', () => {
  sendUpdaterStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (_info) => {
  sendUpdaterStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (_info) => {
  sendUpdaterStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  sendUpdaterStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  sendUpdaterStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (_info) => {
  sendUpdaterStatusToWindow('Update downloaded');
});

async function checkSteam(): Promise<{
  pid?: number;
  status: boolean;
}> {
  let steamName = 'steam.exe';
  if (process.platform == 'linux') {
    return {
      status: false,
    };
  }
  if (process.platform == 'darwin') {
    return {
      status: false,
    };
    steamName = 'steam_osx';
  }
  return await find('name', steamName, true)
    .then(function (list) {
      if (list.length > 0) {
        return {
          pid: list[0].pid,
          status: true,
        };
      }
      return {
        status: false,
      };
    })
    .catch(function (_err) {
      return {
        status: false,
      };
    });
}
checkSteam();

// Define helpers
var ByteBuffer = require('bytebuffer');
const Protos = require('globaloffensive/protobufs/generated/_load.js');
const Language = require('globaloffensive/language.js');
const currencyClass = new currency();
let tradeUpClass = new tradeUps();
const ClassLoginResponse = new LoginGenerator();

// Electron stuff
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
      sandbox: false,
      enableBlinkFeatures: 'CSSColorSchemeUARendering',
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
    shell.openExternal(url);
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
const reactNombers = false;

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

      if (process.env.NODE_ENV === 'development' && reactNombers) {
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
ipcMain.on('needUpdate', async (event: any) => {
  try {
    if (gitHub == 0) {
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
    gitHub = 1;
  }
});

// Return 1 = Success
// Return 2 = Steam Guard
// Return 3 = Steam Guard wrong
// Return 4 = Wrong password
// Return 5 = Unknown
// Return 6 = Error with loginkey
async function sendLoginReply(event: any) {
  event.reply('login-reply', ClassLoginResponse.returnValue);
}

ipcMain.handle('check-steam', async () => {
  const pid = await checkSteam();
  if (pid.status) {
    return true;
  }
  return false;
});

ipcMain.handle('close-steam', async () => {
  const pid = await checkSteam();
  if (pid.status) {
    process.kill(pid.pid as number);
    return true;
  }
  return false;
});

emitterAccount.on(
  'login',
  async (
    event,
    user: SteamUser,
    csgo: GlobalOffensive,
    username: string,
    shouldRemember: boolean,
    secretKey: string | null
  ) => {
    // Success
    user.once('accountInfo', (displayName) => {
      console.log('Logged into Steam as main ' + displayName);
      getValue('pricing.currency').then((returnValue) => {
        if (returnValue == undefined) {
          setValue(
            'pricing.currency',
            currencyCodes?.[user?.wallet?.currency ?? 1] || 'USD'
          );
        }
      });
      console.log('logged on main');

      async function gameCoordinate(resolve: any = null) {
        csgo.once('connectedToGC', () => {
          if (resolve) {
            resolve('GC');
          }
          console.log('Connected to GC!');
          if (csgo.haveGCSession) {
            console.log('Have Session!');
            fetchItemClass
              .convertInventory(csgo.inventory)
              .then((returnValue) => {
                tradeUpClass
                  .getTradeUp(returnValue)
                  .then((newReturnValue: any) => {
                    let walletToSend = user.wallet;
                    if (walletToSend) {
                      walletToSend.currency =
                        currencyCodes?.[walletToSend?.currency];
                    }
                    const returnPackage: LoginCommandReturnPackage = {
                      // @ts-ignore - logOnResult is not defined in the type
                      steamID: user.logOnResult.client_supplied_steamid,
                      displayName,
                      haveGCSession: csgo.haveGCSession,
                      csgoInventory: newReturnValue,
                      walletToSend: walletToSend as unknown as WalletInterface,
                    };

                    startEvents(csgo, user);
                    if (shouldRemember) {
                      storeUserAccount(
                        username,
                        displayName,
                        // @ts-ignore - logOnResult is not defined in the type
                        user.logOnResult.client_supplied_steamid,
                        secretKey
                      );
                    }
                    ClassLoginResponse.setResponseStatus('loggedIn');
                    ClassLoginResponse.setPackage(returnPackage);
                    sendLoginReply(event);
                  });
              });
          }
        });
      }

      // // Create a timeout race to catch an infinite loading error in case the Steam account hasnt added the CSGO license
      // Run the normal version

      let GCResponse = new Promise((resolve) => {
        user.once('playingState', function (blocked, _playingApp) {
          if (!blocked) {
            startGameCoordinator();
            gameCoordinate(resolve);
          } else {
            ClassLoginResponse.setEmptyPackage();
            ClassLoginResponse.setResponseStatus('playingElsewhere');
            sendLoginReply(event);
            resolve('error');
          }
        });
      });

      // Run the timeout
      let timeout = new Promise((resolve, _reject) => {
        setTimeout(resolve, 10000, 'time');
      });

      // Run the timeout
      let error = new Promise((resolve, _reject) => {
        user.once('error', (error: any) => {
          if (error == 'Error: LoggedInElsewhere') {
            resolve('error');
          }
        });
      });

      // Race the two
      Promise.race([timeout, GCResponse, error]).then((value) => {
        if (value == 'error') {
          // Force login
          ipcMain.on('forceLogin', async () => {
            console.log('forceLogin');
            setTimeout(() => {
              // user.setPersona(SteamUser.EPersonaState.Online);
              gameCoordinate();
              user.gamesPlayed([730], true);
            }, 3000);

            ipcMain.removeAllListeners('forceLogin');
            ipcMain.removeAllListeners('signOut');
          });
          ipcMain.once('signOut', async () => {
            console.log('Sign out');
            user.logOff();
            ipcMain.removeAllListeners('forceLogin');
            ipcMain.removeAllListeners('signOut');
          });
        }
        if (value == 'time') {
          console.log(
            'GC didnt start in time, adding CSGO to the library and retrying.'
          );
          user.requestFreeLicense([730], function (err, packageIds, appIds) {
            if (err) {
              console.log(err);
              ClassLoginResponse.setEmptyPackage();
              ClassLoginResponse.setResponseStatus('playingElsewhere');
              sendLoginReply(event);
            }
            console.log('Granted package: ', packageIds);
            console.log('Granted App: ', appIds);
            startGameCoordinator();
          });
        }
      });
    });

    // Steam guard
    user.once('steamGuard', function (domain, callback, lastCodeWrong) {
      domain;
      callback;
      if (lastCodeWrong) {
        console.log('Last code wrong, try again!');
        cancelLogin(user);

        ClassLoginResponse.setEmptyPackage();
        ClassLoginResponse.setResponseStatus('steamGuardCodeIncorrect');
        sendLoginReply(event);
      } else {
        cancelLogin(user);
        ClassLoginResponse.setEmptyPackage();
        ClassLoginResponse.setResponseStatus('steamGuardError');
        sendLoginReply(event);
      }
    });

    // Login

    // Start the game coordinator for CSGO
    async function startGameCoordinator() {
      // user.setPersona(SteamUser.EPersonaState.Online);

      setTimeout(() => {
        // user.setPersona(SteamUser.EPersonaState.Online);
        user.gamesPlayed([730], true);
      }, 3000);
    }
  }
);

ipcMain.on(
  'login',
  async (
    event,
    username,
    password = null,
    shouldRemember,
    steamGuard = null,
    secretKey = null,
    clientjstoken = null
  ) => {
    let user = new SteamUser();
    let csgo = new GlobalOffensive(user);
    emitterAccount.emit(
      'login',
      event,
      user,
      csgo,
      username,
      shouldRemember,
      secretKey
    );
    let loginClass = new login();
    loginClass
      .mainLogin(
        user,
        username,
        shouldRemember,
        password,
        steamGuard,
        secretKey,
        clientjstoken
      )
      .then((returnValue: any) => {
        console.log(returnValue);
        event.reply('login-reply', returnValue);
      });
  }
);

emitterAccount.on('qrLogin:show', async (qrChallengeLogin) => {
  mainWindow?.webContents.send('qrLogin:show', qrChallengeLogin);
});
ipcMain.on('startQRLogin', async (event, shouldRemember) => {
  let user = new SteamUser();
  let csgo = new GlobalOffensive(user);
  let loginClass = new login();
  emitterAccount.emit('qrLogin:cancel');
  flowLoginRegularQR(shouldRemember).then((returnValue) => {
    if (!returnValue.session) {
      return;
    }

    emitterAccount.emit(
      'login',
      event,
      user,
      csgo,
      returnValue.session.accountName,
      shouldRemember
    );
    loginClass
      .mainLogin(
        user,
        returnValue.session.accountName,
        shouldRemember,
        null,
        null,
        null,
        null,
        returnValue.session.refreshToken
      )
      .then((returnValue: any) => {
        event.reply('login-reply', returnValue);
      });
  });
});

ipcMain.on('qrLogin:cancel', async () => {
  emitterAccount.emit('qrLogin:cancel');
});

async function cancelLogin(user) {
  console.log('Cancel login');
  user.removeAllListeners('loggedOn');
  user.removeAllListeners('loginKey');
  user.removeAllListeners('steamGuard');
  user.removeAllListeners('error');
}

function sendUpdaterStatusToWindow(text) {
  log.info(text);
  mainWindow?.webContents.send('updater', [text]);
}

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

  // Trade up handlers
  ipcMain.on('getTradeUpPossible', async (event, itemsToGet) => {
    tradeUpClass.getPotentitalOutcome(itemsToGet).then((returnValue) => {
      pricing.handleTradeUp(returnValue);
      event.reply('getTradeUpPossible-reply', returnValue);
    });
  });
  ipcMain.on('processTradeOrder', async (_event, idsToProcess, rarityToUse) => {
    const rarObject = {
      0: '00000A00',
      1: '01000A00',
      2: '02000A00',
      3: '03000A00',
      4: '04000A00',
      10: '0a000a00',
      11: '0b000a00',
      12: '0c000a00',
      13: '0d000a00',
      14: '0e000a00',
    };
    let idsToUse = [] as any;
    idsToProcess.forEach((element) => {
      idsToUse.push(parseInt(element));
    });
    let tradeupPayLoad = new ByteBuffer(
      1 + 2 + idsToUse.length * 8,
      ByteBuffer.LITTLE_ENDIAN
    );
    tradeupPayLoad.append(rarObject[rarityToUse], 'hex');
    for (let id of idsToUse) {
      tradeupPayLoad.writeUint64(id);
    }
    await csgo._send(Language.Craft, null, tradeupPayLoad);
  });

  // Open container
  ipcMain.on('openContainer', async (_event, itemsToOpen) => {
    let containerPayload = new ByteBuffer(16, ByteBuffer.LITTLE_ENDIAN);
    containerPayload.append('0000000000000000', 'hex');
    for (let id of itemsToOpen) {
      containerPayload.writeUint64(parseInt(id));
    }
    await csgo._send(Language.UnlockCrate, null, containerPayload);
  });

  // CSGO listeners
  // Inventory events
  async function startChangeEvents() {
    console.log('Start events');
    csgo.on('itemRemoved', (item) => {
      if (
        !Object.keys(item).includes('casket_id') &&
        !Object.keys(item).includes('casket_contained_item_count')
      ) {
        console.log('Item ' + item.id + ' was removed');
        fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
          tradeUpClass.getTradeUp(returnValue).then((newReturnValue: any) => {
            mainWindow?.webContents.send('userEvents', [
              1,
              'itemRemoved',
              [item, newReturnValue],
            ]);
          });
        });
      }
    });

    csgo.on('itemChanged', (item) => {
      fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
        tradeUpClass.getTradeUp(returnValue).then((newReturnValue: any) => {
          mainWindow?.webContents.send('userEvents', [
            1,
            'itemChanged',
            [item, newReturnValue],
          ]);
        });
      });
    });

    csgo.on('itemAcquired', (item) => {
      if (
        !Object.keys(item).includes('casket_id') &&
        !Object.keys(item).includes('casket_contained_item_count')
      ) {
        console.log('Item ' + item.id + ' was acquired');
        removeInventoryListeners();
        setTimeout(function () {
          console.log('ran');
          startChangeEvents();
          fetchItemClass
            .convertInventory(csgo.inventory)
            .then((returnValue) => {
              tradeUpClass.getTradeUp(returnValue).then((newReturnValue) => {
                mainWindow?.webContents.send('userEvents', [
                  1,
                  'itemAcquired',
                  [{}, newReturnValue],
                ]);
              });
            });
        }, 1000);

        fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
          tradeUpClass.getTradeUp(returnValue).then((newReturnValue: any) => {
            mainWindow?.webContents.send('userEvents', [
              1,
              'itemAcquired',
              [item, newReturnValue],
            ]);
          });
        });
      }
    });
  }
  startChangeEvents();

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
    console.log('main', eresult, msg);
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
  user.on('wallet', (hasWallet, currency, balance) => {
    let walletToSend = { hasWallet, currency, balance };
    walletToSend.currency = currencyCodes?.[walletToSend?.currency];
    console.log('Wallet update: ', balance);
    mainWindow?.webContents.send('userEvents', [4, walletToSend]);
  });

  // Get commands from Renderer
  async function removeInventoryListeners() {
    console.log('Removed inventory listeners');
    csgo.removeAllListeners('itemRemoved');
    csgo.removeAllListeners('itemChanged');
    csgo.removeAllListeners('itemAcquired');
  }
  ipcMain.on('refreshInventory', async () => {
    removeInventoryListeners();
    startChangeEvents();

    fetchItemClass.convertInventory(csgo.inventory).then((returnValue) => {
      tradeUpClass.getTradeUp(returnValue).then((newReturnValue) => {
        mainWindow?.webContents.send('userEvents', [
          1,
          'itemAcquired',
          [{}, newReturnValue],
        ]);
      });
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

  // Set item positions
  ipcMain.on('setItemsPositions', async (_event, dictOfItems) => {
    await csgo._send(
      Language.SetItemPositions,
      Protos.CMsgSetItemPositions,
      dictOfItems
    );
  });

  // Set item positions
  ipcMain.on(
    'setItemEquipped',
    async (_event, item_id, item_name, itemClass) => {
      item_name;

      await csgo._send(
        Language.k_EMsgGCAdjustItemEquippedState,
        Protos.CMsgAdjustItemEquippedState,
        {
          item_id: item_id,
          new_class: itemClass,
          new_slot: 0,
          swap: 0,
        }
      );
    }
  );

  // Remove items from storage unit
  ipcMain.on(
    'removeFromStorageUnit',
    async (event, casketID, itemID, fastMode) => {
      removeInventoryListeners();
      csgo.removeFromCasket(casketID, itemID);

      if (fastMode == false) {
        csgo.once(
          'itemCustomizationNotification',
          (itemIds, notificationType) => {
            if (
              notificationType ==
              GlobalOffensive.ItemCustomizationNotification.CasketRemoved
            ) {
              console.log(itemIds + ' got an item removed from it');
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
    //if (fastMode) {

    removeInventoryListeners();

    // }

    if (fastMode == false) {
      csgo.once(
        'itemCustomizationNotification',
        (itemIds, notificationType) => {
          if (
            notificationType ==
            GlobalOffensive.ItemCustomizationNotification.CasketAdded
          ) {
            console.log(itemIds[0] + ' got an item added to it');
            event.reply('moveToStorageUnit-reply', [1, itemIds[0]]);
          }
        }
      );
    }
  });

  // Get storage unit contents
  ipcMain.on('getCasketContents', async (event, casketID, _casketName) => {
    await csgo.getCasketContents(casketID, async function (err, items) {
      fetchItemClass.convertStorageData(items).then((returnValue) => {
        tradeUpClass.getTradeUp(returnValue).then((newReturnValue: any) => {
          event.reply('getCasketContent-reply', [1, newReturnValue]);
          console.log('Casket contains: ', newReturnValue.length);
        });
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
    console.log('Signout');
    // Remove for CSGO
    removeInventoryListeners();
    csgo.removeAllListeners('connectedToGC');
    csgo.removeAllListeners('disconnectedFromGC');

    user.logOff();
    pricingEmitter.removeAllListeners('result');
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
    ipcMain.removeAllListeners('forceLogin');
  }
}

// Get currency
ipcMain.on('getCurrency', async (event) => {
  getValue('pricing.currency').then((returnValue) => {
    currencyClass.getRate(returnValue).then((response) => {
      let returnObject: CurrencyReturnValue = {
        currency: returnValue,
        rate: response as number,
      };
      event.reply('getCurrency-reply', returnObject);
    });
  });
});

// Set initial settings
async function settingsSetup() {
  getValue('devmode').then((returnValue) => {
    if (returnValue == undefined) {
      setValue('devmode', false);
    }
  });
  setValue('fastmove', false);
}
settingsSetup();

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
