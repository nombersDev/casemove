import EventEmitter from 'events';
import { SteamLogin } from '../01-steamLogin';
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
    user.setPersona(SteamUser.EPersonaState.Online);

      setTimeout(() => {
        user.setPersona(SteamUser.EPersonaState.Online);
        user.gamesPlayed([730], true);
      }, 3000);
  }
}
