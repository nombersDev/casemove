import { WalletInterface } from "../states";

export interface SignInActionPackage {
  displayName: string
  CSGOConnection: boolean
  userProfilePicture: string
  steamID: string
  wallet: WalletInterface
}
