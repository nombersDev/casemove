import { currencyCodes } from '../../helpers/classes/steam/pricing';
import type SteamUser from 'steam-user';
import { LoginGenerator } from './loginResponseGenerator';
import GlobalOffensive from 'globaloffensive';
import { convertInventory } from '../inventoryConverter/inventoryConverter';
import EventEmitter from 'events';
import { ReturnLoginPackage } from 'shared/Interfaces.tsx/loginInterface';
import { SteamLogin } from '../01-steamLogin';

class LoginEventsResponses extends EventEmitter {
  emitResponse() {
    this.emit('sendResponse')
  }

  emitPlayingState(blockedStatus: boolean) {
    this.emit('playingState', blockedStatus)
  }
}

export class LoginEventsHandler extends LoginEventsResponses {
  steamUserInstance: SteamUser;
  csgoInstance: GlobalOffensive;
  responseInstance: LoginGenerator;
  baseInstance: SteamLogin
  displayName: string

  constructor(
    accountInstance: SteamLogin,
  ) {
    super()
    this.steamUserInstance = accountInstance.steamUserBaseInstance.steamUser;
    this.csgoInstance = accountInstance.steamUserBaseInstance.globalOffensive;
    this.responseInstance = accountInstance.loginResponse;
    this.baseInstance = accountInstance;
    this.displayName = ''
  }

  // Should remember
  shouldRemember() {
    this.steamUserInstance.once('loginKey', (key) => {
      (this.baseInstance.loginDetails, key);
    });
  }

  // Steam guard
  steamGuardError() {
    this.steamUserInstance.once('steamGuard', (_domain, _callback, lastCodeWrong) => {
      console.log('Steam Guard Error login');
      if (lastCodeWrong) {
        console.log('Last code wrong, try again!');
        this.responseInstance.setEmptyPackage();
        this.responseInstance.setResponseStatus('steamGuardCodeIncorrect');
      } else {
        this.responseInstance.setEmptyPackage();
        this.responseInstance.setResponseStatus('steamGuardError');
      }
      this.emitResponse()
    });
  }

  // Other errors
  defaultError() {
    this.steamUserInstance.once('error', (error) => {
      console.log('Error login: ', error);
      if (error == 'Error: LoggedInElsewhere') {
        this.responseInstance.setEmptyPackage();
        this.responseInstance.setResponseStatus('playingElsewhere');
      } else {
        this.responseInstance.setEmptyPackage();
        this.responseInstance.setResponseStatus('defaultError');
      }

      this.emitResponse()
    });
  }


  // Account info
  accountInfoCurrency() {
    this.steamUserInstance.once('accountInfo', (displayName) => {
      // Set the display name for use in GC
      this.displayName = displayName;

      // Log start message
      console.log('Logged into Steam as ' + displayName);

      // Get the currency & set if undefined
      this.baseInstance.getCurrency().then((returnValue) => {
        if (returnValue == undefined) {
          this.baseInstance.setCurrency(
            currencyCodes?.[this.steamUserInstance?.wallet?.currency] || 'USD'
          );
        }
      });
    });
  }

  // Game coordinate
  gameCoordinate() {
    this.csgoInstance.once('connectedToGC', () => {
      console.log('Connected to GC!');

      if (this.csgoInstance.haveGCSession) {
        console.log('Have Session!');
        convertInventory(this.csgoInstance.inventory).then((returnValue) => {
          // Wallet
          let walletToSend = this.steamUserInstance.wallet;
          if (walletToSend) {
            walletToSend.currency = currencyCodes?.[walletToSend?.currency];
          }

          // Return Package
          const returnPackage: ReturnLoginPackage = {
            steamID: this.steamUserInstance.logOnResult.client_supplied_steamid,
            displayName: this.displayName,
            haveGCSession: this.csgoInstance.haveGCSession,
            csgoInventory: returnValue,
            walletToSend: walletToSend,
          };

          // Set the response status
          this.responseInstance.setResponseStatus('loggedIn');
          this.responseInstance.setPackage(returnPackage);

          // Emit response
          this.emitResponse()
        });
      }
    });
  }
  // Logged on
  loggedOn() {
    // Success
    this.steamUserInstance.once('loggedOn', () => {
      this.accountInfoCurrency();
      this.gameCoordinate();
      this.steamUserInstance.webLogOn();
      this.baseInstance.GCStarter.startGameCoordinator();
    });
  }

  // Playing state
  playingState() {
     this.steamUserInstance.once('playingState', (blocked, _playingApp) => {
      this.emitPlayingState(blocked);
      if (!blocked) {
        this.gameCoordinate();
      } else {
        this.responseInstance.setEmptyPackage();
        this.responseInstance.setResponseStatus('playingElsewhere');
        this.emitResponse();
      }
     })
  }
}
