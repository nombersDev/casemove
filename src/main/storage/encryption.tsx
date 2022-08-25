
import { safeStorage } from 'electron';
import {
  StorageAccountSubInterface
} from '../steamEngine/storageInterfaces';

export function decryptString(stringToDecrypt: string): string {
  return safeStorage.decryptString(
    Buffer.from(stringToDecrypt, 'latin1')
  );
}

export function decryptAccount(accountObject: StorageAccountSubInterface): StorageAccountSubInterface {
  if (accountObject.safeData) {
    accountObject.safeData = decryptString(accountObject.safeData)
  }
  if (accountObject.safeLoginKey) {
    accountObject.safeLoginKey = decryptString(accountObject.safeLoginKey)
  }

  return accountObject
}
