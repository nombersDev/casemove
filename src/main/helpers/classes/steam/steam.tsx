import { StartLoginSessionWithCredentialsDetails } from 'steam-session/dist/interfaces-external';
import SteamTotp from 'steam-totp';
import { flowLoginRegular } from '../../login/loginRegular';
import { LoginGenerator } from '../IPCGenerators/loginGenerator';
import {
  getLoginDetails,
  getRefreshToken,
  getValue
} from './settings';

const ClassLoginResponse = new LoginGenerator();
// 1: If the user has remembered the account, check if login key exists. If login fails, notify renderer, delete Loginkey (not password)
class login {
  steamUser = {} as any;
  rememberedDetails = {} as any;
  rememberedSensitive = {} as any;
  password;
  username;
  steamGuard;
  secretKey;
  clientjstoken;
  refreshToken: string | null = null;
  shouldRemember = false;
  logInOptions: StartLoginSessionWithCredentialsDetails = {
    accountName: '',
    password: '',
  };
  loginOptionsLegacy = {} as any;
  resolve;



  mainLogin(
    steamuser,
    username,
    shouldRemember,
    password = null,
    steamGuard = null,
    secretKey = null,
    clientjstoken = null,
    refreshToken: string | null = null
  ) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.username = username;
      this.password = password;
      this.shouldRemember = shouldRemember;
      this.steamGuard = steamGuard;
      this.secretKey = secretKey;
      this.steamUser = steamuser;
      this.clientjstoken = clientjstoken;
      this.refreshToken = refreshToken;


      // Get all account details
      getValue('account').then((returnValue) => {
        if (returnValue?.[username]) {
          this.rememberedDetails = returnValue?.[username];
          if (returnValue?.[username].safeData) {
            // Get remembered details
            getLoginDetails(username).then((returnValue) => {
              if (returnValue) {
                this.rememberedSensitive = returnValue;
                this._loginCoordinator();
              }
            });
          } else {
            // Start login
            this._loginCoordinator();
          }
        } else {
          // Start login
          this._loginCoordinator();
        }
      });
    });
  }

  _loginCoordinator() {
    // 0
    if (this.clientjstoken) {
      this._login_clientjstoken();
      return;
    }

    // 1
    if (this.rememberedDetails['refreshToken'] || this.refreshToken) {
      this._login_refreshToken();
      return;
    }
    if (!this.password && !this.rememberedSensitive?.password) {
      ClassLoginResponse.setEmptyPackage();
      ClassLoginResponse.setResponseStatus('defaultError');
      this._returnToSender();
      return;
    }

    // 2
    if (this.rememberedSensitive?.secretKey) {
      this._login_secretKey();
      return;
    }

    // 3
    if (this.steamGuard) {
      this._login_steamGuard();
      return;
    }

    this._login_password();
    return;
  }

  _returnToSender() {
    this.resolve(ClassLoginResponse.returnValue);
  }

  // Login functions
  _loginStartLegacy() {
    this.steamUser.logOn(this.loginOptionsLegacy);
  }

  _loginStart() {
    flowLoginRegular(this.logInOptions, this.shouldRemember).then(
      (returnValue) => {
        if (returnValue.responseStatus == 'loggedIn') {

          this.steamUser.logOn({
            refreshToken: returnValue.refreshToken,
          });
        } else {
          ClassLoginResponse.setEmptyPackage();
          ClassLoginResponse.setResponseStatus(returnValue.responseStatus);
          this._returnToSender();
        }
      }
    );
  }

  _defaultError() {
    this.steamUser.once('error', (error) => {
      if (error == 'Error: LoggedInElsewhere') {
        ClassLoginResponse.setEmptyPackage();
        ClassLoginResponse.setResponseStatus('playingElsewhere');
        this._returnToSender();
      } else {
        ClassLoginResponse.setEmptyPackage();
        ClassLoginResponse.setResponseStatus('defaultError');
        this._returnToSender();
      }
    });
  }
  // 0 - Client
  _login_clientjstoken() {
    this._defaultError();
    this.loginOptionsLegacy = {
      accountName: this.clientjstoken?.account_name,
      webLogonToken: this.clientjstoken?.token,
      steamID: this.clientjstoken?.steamid,
    };
    this._loginStartLegacy();
  }

  // 1 - Login key
  _login_refreshToken() {
    getRefreshToken(this.username).then((refreshToken) => {
      this.loginOptionsLegacy = {
        refreshToken: refreshToken,
      };
      this._loginStartLegacy();
    });
  }

  // 2 - Shared Secret
  _login_secretKey() {
    this._defaultError();
    this.shouldRemember = true;
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
      steamGuardCode: SteamTotp.generateAuthCode(
        this.rememberedSensitive?.secretKey
      ),
    };
    this._loginStart();
  }

  // 3 - Steam Guard
  _login_steamGuard() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
      steamGuardCode: this.steamGuard,
    };
    this._loginStart();
  }

  // 4 - No authcode
  _login_password() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
    };
    this._loginStart();
  }
}

module.exports = {
  login,
};
export { login };
