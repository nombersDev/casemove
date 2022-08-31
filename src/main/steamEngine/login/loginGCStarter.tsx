import EventEmitter from 'events';
import { SteamLogin } from '../01-steamLogin';
import { getValue } from '../../helpers/classes/steam/settings';
import SteamUser from 'steam-user';

class GCStarterEmitter extends EventEmitter {
  emitResponse() {
    this.emit('sendResponse');
  }
}

export class GCStarter extends GCStarterEmitter {
  baseInstance: SteamLogin;

  constructor(baseInstance: SteamLogin) {
    super();
    this.baseInstance = baseInstance;
  }

  // Playing state
  playingStateListener() {
    this.baseInstance.LoginHandler.once('playingState', (blockedStatus) => {
      if (!blockedStatus) {
        this.startGameCoordinator();
      }
    });
  }

  // Start the GC
  startGameCoordinator() {
    const user = this.baseInstance.steamUserBaseInstance.steamUser

    getValue('personaState').then((personaState: string) => {
      user.setPersona(SteamUser.EPersonaState[personaState]);
    })

    setTimeout(() => {
      getValue('personaState').then((personaState: string) => {
        user.setPersona(SteamUser.EPersonaState[personaState]);
      })
      user.gamesPlayed([730], true);
    }, 3000);
  }
}
