import { LoginGenerator } from './login/loginResponseGenerator';
import { LoginUserDetails } from 'shared/Interfaces.tsx/rendererToMainMessages';
import { SteamBase } from './steamBase';
import { GetLoginDetails } from './login/loginDetails';
import { StorageEngine } from '../storage/00-storage';
import { LoginEventsHandler } from './login/loginEventsHandler';
import { GCStarter } from './login/loginGCStarter';

async function loginReply(event, loginResponse) {
  event.reply('login-reply', loginResponse.returnValue);
}


export class SteamLogin extends StorageEngine{
  responseInstance = new LoginGenerator();
  loginDetails: LoginUserDetails;
  steamUserBaseInstance: SteamBase
  LoginClass: GetLoginDetails
  loginResponse: LoginGenerator
  LoginHandler: LoginEventsHandler
  GCStarter: GCStarter;
  event: any


  constructor(loginDetails: LoginUserDetails, steamUserBaseInstance: SteamBase, event: any) {
    super()
    this.LoginClass = new GetLoginDetails(loginDetails)
    this.steamUserBaseInstance = steamUserBaseInstance
    this.loginDetails = loginDetails;
    this.event = event;
    this.loginResponse = new LoginGenerator()
    this.LoginHandler = new LoginEventsHandler(this)
    this.GCStarter = new GCStarter(this)
  }

  login() {

    // Start relevant events
    this.LoginHandler.defaultError()
    this.LoginHandler.steamGuardError()
    this.LoginHandler.loggedOn()
    if (this.loginDetails.shouldRemember) {
      this.LoginHandler.shouldRemember()
    }

    // Logon
    this.steamUserBaseInstance.steamUser.logOn(this.LoginClass.run());

    this.LoginHandler.once('sendResponse', () => {
      console.log('Sending response', this.loginResponse)
      loginReply(this.event, this.loginResponse);
    })
  }


}
