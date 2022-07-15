const names = {
  authReducer: 'authReducer',
  inventoryReducer: 'inventoryReducer',
  inventoryFiltersReducer: 'InventoryFilters',
  modalMoveReducer: 'ModalMove',
  modalRenameReducer: 'RenameModal',
  moveFromReducer: 'MoveFromReducer',
  moveToReducer: 'MoveToReducer',
  settingsReducer: 'Settings',
  pricingReducer: 'Prices',
  tradeUpReducer: 'TradeUpActions',
  modalTradeReducer: 'ModalTrade'
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

