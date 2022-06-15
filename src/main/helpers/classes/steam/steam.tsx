import {
  getLoginDetails,
  getSafeKey,
  storeLoginKey,
  getValue,
} from './settings';
import SteamTotp from 'steam-totp';

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
  shouldRemember = false;
  logInOptions = {} as any;
  resolve;

  mainLogin(
    steamuser,
    username,
    shouldRemember,
    password = null,
    steamGuard = null,
    secretKey = null,
    clientjstoken = null
  ) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.username = username;
      this.password = password;
      this.shouldRemember = shouldRemember;
      this.steamGuard = steamGuard;
      this.secretKey = secretKey;
      this.steamUser = steamuser;
      this.clientjstoken = clientjstoken

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

    if (!this.password && this.rememberedSensitive?.password) {
      this.password = this.rememberedSensitive?.password;
    }
    // 1
    if (this.rememberedDetails['safeLoginKey']) {
      this._login_loginKey();
      return;
    }
    if (!this.password && !this.rememberedSensitive?.password) {
      this._returnToSender(4);
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

  _returnToSender(resolveNumber, error = null) {
    this.resolve([resolveNumber, error]);
  }

  // Login functions
  _loginStart() {
    this.steamUser.logOn(this.logInOptions);
  }

  _defaultError() {
    this.steamUser.once('error', (error) => {
      console.log('Error login: ', error);
      this._returnToSender(4, error);
    });
  }
  // 0 - Client
  _login_clientjstoken() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.clientjstoken?.account_name,
      webLogonToken: this.clientjstoken?.token,
      steamID: this.clientjstoken?.steamid
    }
    this._loginStart();
  }
  
  // 1 - Login key
  _login_loginKey() {
    this.steamUser.once('error', (error) => {
      console.log('Error login 1: ', error);
      storeLoginKey(this.username);
      if (this.rememberedSensitive?.secretKey) {
        console.log('Secret key')
        this._login_secretKey();
      } else {

        this._returnToSender(6);
      }
    });

    getSafeKey(this.username).then((loginKey) => {
      this.logInOptions = {
        accountName: this.username,
        loginKey: loginKey,
        rememberPassword: true,
      };
      this._loginStart();
    });
  }

  // 2 - Shared Secret
  _login_secretKey() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
      twoFactorCode: SteamTotp.generateAuthCode(
        this.rememberedSensitive?.secretKey
      ),
      rememberPassword: true,
    };
    this.steamUser.once('loggedOn', () => {
      console.log('logged on')
    })
    this._loginStart();
  }

  // 3 - Steam Guard
  _login_steamGuard() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
      twoFactorCode: this.steamGuard,
      rememberPassword: this.shouldRemember,
    };
    this._loginStart();
  }

  // 4 - No authcode
  _login_password() {
    this._defaultError();
    this.logInOptions = {
      accountName: this.username,
      password: this.password,
      rememberPassword: this.shouldRemember,
    };
    this._loginStart();
  }
}

module.exports = {
  login,
};
export { login };
