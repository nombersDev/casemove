import { safeStorage } from 'electron';
import Store from 'electron-store';
import { decryptAccount } from './encryption';
import {
  StorageAccountInterface,
  StorageAccountSubInterfaceProcessed,
  StorageAccountSubInterface
} from '../steamEngine/storageInterfaces';


export class StorageEngine {
  // Get the store
  store: Store
  constructor() {
    this.store = new Store({
      name: 'casemoveEnc',
      watch: true,
      encryptionKey: 'this_only_obfuscates',
    });
  }

  // Return all account details
  getAllAccountDetails(): StorageAccountInterface {
    console.log(this)
    return this.store.get('account') as StorageAccountInterface;
  }

  // Get the account
  getAccount(username: string): StorageAccountSubInterfaceProcessed | {} {
    const accountDetails = this.getAllAccountDetails()?.[username];
    if (accountDetails == undefined) {
      return {};
    }

    return decryptAccount(accountDetails)
  }

  // Get the currency
  async getCurrency(): Promise<string | undefined> {
    return this.store.get('pricing.currency') as string | undefined
  }

  async setCurrency(valueToSet): Promise<void> {
    this.store.set('pricing.currency', valueToSet)
  }

  // Store login key
  async storeLoginKey(username: string, keyToSet: string) {

    let allAccountDetails = this.getAllAccountDetails()
    let specificAccount = allAccountDetails?.[username]

    if (specificAccount != undefined) {
      let newAccountDetails = specificAccount as StorageAccountSubInterface
      let encrypted = safeStorage.encryptString(keyToSet);
      newAccountDetails.safeLoginKey = encrypted.toString('latin1')
      allAccountDetails[username] = newAccountDetails
    }

    console.log(allAccountDetails)

    // this.store.set({account: allAccountDetails})

  }

  // Delete user data
  async deleteUserData(username) {
    // Get account details
    let accountDetails = this.getAllAccountDetails()
    if (
      typeof accountDetails === 'object' &&
      Object.keys(accountDetails).includes(username)
    ) {
      delete accountDetails[username];

      console.log(accountDetails)

      // this.store.set('account', accountDetails);
    }
  }

  // Set account position
  async setAccountPosition(username, newPosition) {
    let accountDetails = this.getAllAccountDetails();
    if (accountDetails == undefined) {
      accountDetails = {};
    }

    // Add to account details
    accountDetails[username]['position'] = newPosition;

    // Set store
    console.log(accountDetails)
    // this.store.set('account', accountDetails);
  }

  async getValue(value: string) {
    return this.store.get(value);
  }

  async setValue(stringToSet, valueToSet) {
    this.store.set(stringToSet, valueToSet);
  }

}
