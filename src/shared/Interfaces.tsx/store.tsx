import { ItemRow } from "renderer/interfaces/items";
import { WalletInterface } from "renderer/interfaces/states";

export interface LoginCommandReturnPackage {
  steamID: string
  displayName: string
  haveGCSession: boolean
  csgoInventory: Array<ItemRow>
  walletToSend: WalletInterface
}
export interface LoginCommand {
  responseStatus: keyof LoginOptions,
  returnPackage: {} | LoginCommandReturnPackage
}

export type HandleLoginObjectClass = {
  [key in keyof LoginOptions]: Function;
}

export interface LoginNotification {
  success: boolean
  title: string
  text: string
}

export interface LoginOptions {
  loggedIn: string,
  steamGuardError: string,
  steamGuardCodeIncorrect: string
  defaultError: string
  playingElsewhere: string
  wrongLoginToken: string
  webtokenNotJSON: string
  webtokenNotLoggedIn: string
}

export type LoginNotificationObject = {
  [key in keyof LoginOptions]: LoginNotification;
};
