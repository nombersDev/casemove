import { ItemRow } from 'renderer/interfaces/items';
import { WalletInterface } from 'renderer/interfaces/states';

export interface ReturnLoginPackage {
  steamID: string;
  displayName: string;
  haveGCSession: boolean;
  csgoInventory: Array<ItemRow>;
  walletToSend: WalletInterface;
}
export interface LoginCommand {
  responseStatus: keyof ReturnLoginStatus;
  returnPackage: {} | ReturnLoginPackage;
}

export type HandleLoginObjectClass = {
  [key in keyof ReturnLoginStatus]: Function;
};

// Main to renderer return package for login
export interface ReturnLoginStatus {
  loggedIn: string;
  steamGuardError: string;
  steamGuardCodeIncorrect: string;
  defaultError: string;
  playingElsewhere: string;
  wrongLoginToken: string;
  webtokenNotJSON: string;
  webtokenNotLoggedIn: string;
}

// Login notification
export interface LoginNotification {
  success: boolean;
  title: string;
  text: string;
}

// Login Notification as type
export type LoginNotificationObject = {
  [key in keyof ReturnLoginStatus]: LoginNotification;
};


