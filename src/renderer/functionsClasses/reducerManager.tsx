const names = {
  userdetails: 'authReducer',
  inventory: 'inventoryReducer',
  inventoryFilters: 'inventoryFiltersReducer',
  modalMove: 'modalMoveReducer',
  modalRename: 'modalRenameReducer',
  moveFrom: 'moveFromReducer',
  moveTo: 'moveToReducer',
  settings: 'settingsReducer',
  pricing: 'pricingReducer',
  tradeUp: 'tradeUpReducer',
  modalTrade: 'modalTradeReducer'
}

export class ReducerManager{

  useSelector: Function
  names = names
  preExising: any = {}

  constructor(useSelector: Function) {
    this.useSelector = useSelector
  }

  getStorage(namesOption?: string) {

    if (namesOption == undefined) {
      return this.useSelector((state: any) => state);
    }
    return this.useSelector((state: any) => state[namesOption]);
  }
}

