import SteamUser from 'steam-user';
import GlobalOffensive from 'globaloffensive';


export class SteamBase {
  steamUser: SteamUser
  globalOffensive: GlobalOffensive

  constructor() {
    this.steamUser = new SteamUser()
    this.globalOffensive = new GlobalOffensive(this.steamUser)
  }

 }
