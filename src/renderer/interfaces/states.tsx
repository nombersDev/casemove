import { ItemRow, ItemRowStorage } from "renderer/interfaces/items"
import { Filter } from "./filters"
import { OverviewOptionsLeftCharts, OverviewOptionsRightCharts } from "./overview"

// Individual
export interface MoveModalPayload {
  number: number,
  itemID: string,
  isLast: boolean
}

// Query
export interface MoveModalQuery {
  payload: {
    key: string,
    storageID: string
  }
}

// Rename modal
export interface RenameModalPayload {
  itemID: string,
  itemName: string
}

// // Prices
interface pricingSources {
  buff163: number,
  steam_listings: number
  skinport: number
  bitskins: string
}
export interface SubPrices {
  [key: string]: pricingSources
}

// // Settings
export interface WalletInterface {
  hasWallet: boolean
  currency: string
  balance: number
}

export interface source {
  title: string
  avatar: string
  name: string
}
// Store
export interface InventoryFilters {
  inventoryFilter: Array<Filter>
  sortValue: string
  inventoryFiltered: Array<ItemRow>
  searchInput: string
  sortBack: boolean
  categoryFilter: Array<string>
  rarityFilter: Array<string>
}

export interface Inventory {
  inventory: Array<ItemRow>,
  combinedInventory: Array<ItemRow>,
  storageInventory: Array<ItemRowStorage>,
  storageInventoryRaw: Array<ItemRowStorage>
  totalAccountItems: number,
};

export interface InventoryNew {
  inventory: Array<ItemRow>,
  combinedInventory: Array<ItemRow>,
  storageInventory: Array<ItemRowStorage>,
  storageInventoryRaw: Array<ItemRowStorage>
  totalAccountItems: number,
};

export interface ModalMove {
  moveOpen: boolean,
  notifcationOpen: boolean,
  storageIdsToClearFrom: Array<string>,
  modalPayload: MoveModalPayload,
  doCancel: Array<string>,
  query: Array<MoveModalQuery>,
  totalFailed: number
};

export interface RenameModal {
  renameOpen: boolean,
  modalPayload: RenameModalPayload
};

export interface RenameModal {
  renameOpen: boolean,
  modalPayload: RenameModalPayload
};

export interface ModalTrade {
  moveOpen: boolean,
  openResult: boolean,
  inventoryFirst: Array<string>
  rowToMatch: ItemRow | {}
}

export interface MoveFromReducer {
  hideFull: boolean,
  activeStorages: Array<string>,
  totalToMove: Array<any>,
  totalItemsToMove: number,
  searchInput: string,
  searchInputStorage: string,
  sortValue: string,
  doCancel: Boolean,
  sortBack: Boolean,
}

export interface MoveToReducer {
  doHide: boolean,
  hideFull: boolean,
  activeStorages: Array<string>,
  activeStoragesAmount: number,
  totalToMove: Array<any>,
  totalItemsToMove: number,
  searchInput: string,
  searchInputStorage: string,
  sortValue: string,
  doCancel: Boolean,
  sortBack: Boolean,
};

export interface Prices {
  prices: SubPrices,
  storageAmount: number,
  productsRequested: Array<string>,
};
export interface Overview {
  by: string
  chartleft: keyof OverviewOptionsLeftCharts
  chartRight: keyof OverviewOptionsRightCharts
}
export interface Settings {
  fastMove: boolean,
  currency: string,
  locale: string,
  os: string,
  devmode: Boolean,
  columns: Array<string>,
  currencyPrice: { [key: string]: number },
  source: source
  overview: Overview
};


export interface TradeUpActions {
  tradeUpProducts: Array<ItemRowStorage>,
  tradeUpProductsIDS: Array<string>,
  possibleOutcomes: Array<ItemRow>,
  searchInput: string,
  MinFloat: number,
  MaxFloat: number,
  collections: Array<string>,
  options: Array<string>,
};

export interface AuthReducer {
  displayName: string | null ,
  CSGOConnection: boolean,
  userProfilePicture: string | null,
  steamID: string | null,
  isLoggedIn: boolean,
  hasConnection: boolean,
  walletBalance: WalletInterface
};

export interface State {
  authReducer: AuthReducer
  inventoryReducer: Inventory
  inventoryFiltersReducer: InventoryFilters
  modalMoveReducer: ModalMove
  modalRenameReducer: RenameModal
  moveFromReducer: MoveFromReducer
  moveToReducer: MoveToReducer
  settingsReducer: Settings
  pricingReducer: Prices
  tradeUpReducer: TradeUpActions
  modalTradeReducer: ModalTrade
}
