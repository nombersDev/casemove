import { StorageEngine } from '../../storage/00-storage';
import { StorageAccountSubInterfaceProcessed } from '../storageInterfaces';
import { LoginUserDetails } from 'shared/Interfaces.tsx/rendererToMainMessages';
import SteamTotp from 'steam-totp';

class LoginMethod {
  loginDetails: LoginUserDetails
  StorageEngine: StorageEngine;
  accountDetails: StorageAccountSubInterfaceProcessed;

  constructor(
    loginDetails: LoginUserDetails
  ) {
    this.StorageEngine = new StorageEngine();
    this.loginDetails = loginDetails

    // Get the account details
    this.accountDetails = this.StorageEngine.getAccount(
      this.loginDetails.username
    ) as StorageAccountSubInterfaceProcessed;
  }

  clientJSMethod() {
    return {
      accountName: this.loginDetails.clientjstoken?.account_name,
      webLogonToken: this.loginDetails.clientjstoken?.token,
      steamID: this.loginDetails.clientjstoken?.steamid,
    };
  }

  loginKeyMethod() {
    return {
      accountName: this.loginDetails.username,
      password: this.loginDetails.password,
      loginKey: this.accountDetails.safeLoginKey,
    };
  }

  loginSharedSecret() {
    return {
      accountName: this.loginDetails.username,
      password: this.loginDetails.password,
      twoFactorCode: SteamTotp.generateAuthCode(this.accountDetails.safeData.secretKey)
    }
  }

  loginSteamGuard() {
    return {
      accountName: this.loginDetails.username,
      password: this.loginDetails.password,
      twoFactorCode: this.loginDetails.steamGuard,
      rememberPassword: this.loginDetails.shouldRemember,
    }
  }

  loginPlain() {
    return {
      accountName: this.loginDetails.username,
      password: this.loginDetails.password
    }
  }
}

export class GetLoginDetails extends LoginMethod {
  constructor(
    loginDetails: LoginUserDetails
  ) {
    super(loginDetails);
  }

  run() {
    // Client JS Method
    if (this.loginDetails.clientjstoken) {
      return this.clientJSMethod();
    }

    // Shared Secret
    if (this.accountDetails?.safeData?.secretKey) {
      return this.loginSharedSecret();
    }

    // Loginkey
    if (!this?.loginDetails.password && !this.accountDetails?.safeLoginKey) {
      return this.loginKeyMethod();
    }

    // Auth code
    if (this.loginDetails.steamGuard) {
      return this.loginSteamGuard()
    }

    // Login plain
    return this.loginPlain()
  }
}
