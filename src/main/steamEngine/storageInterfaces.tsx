
export interface StorageAccountSubInterface {
  displayName: string;
  imageURL: string;
  safeData: string;
  safeLoginKey: string;
}

export interface StorageAccountSubInterfaceProcessed {
  displayName: string;
  imageURL: string;
  safeData: SafeData;
  safeLoginKey: string;
}

export interface StorageAccountInterface {
  [key: string]: StorageAccountSubInterface
}

export interface SafeData {
  password: string,
  secretKey: string
}


interface StoragePricingInterface {
  currency: string;
  source: {
    id: number
    name: string
    title: string
    avatar: string
  }
}

interface StorageOverviewInterface {
  by: string
  chartLeft: string
  chartRight: string
}

export interface Storage {
  account: StorageAccountInterface,
  fastmove: boolean,
  personaState: string,
  pricing: StoragePricingInterface
  os: string
  accountKeyList: Array<string>
  columns: Array<string>
  devmode: {value: boolean}
  overview: StorageOverviewInterface
 }
