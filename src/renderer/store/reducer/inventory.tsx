import { Inventory } from "renderer/interfaces/states";

const initialState: Inventory = {
  inventory: [],
  combinedInventory: [],
  storageInventory: [],
  storageInventoryRaw: [],
  totalAccountItems: 0,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INVENTORY_SET_INVENTORY':
      let storageTotal = 0
      action.payload.inventory.forEach(element => {
        storageTotal += 1
        if (element.item_url == "econ/tools/casket") {
          storageTotal += element.item_storage_total
        }
      });
      return {
        ...state,
        inventory: action.payload.inventory,
        combinedInventory: action.payload.combinedInventory,
        totalAccountItems: storageTotal
      }
    case 'INVENTORY_ITEM_ACCUIRED':
       
      return {
        ...state
      }
    case 'INVENTORY_STORAGES_ADD_TO':
      console.log(state)
      const add_to_filtered = state.storageInventory?.filter(id => id.storage_id != action.payload.casketID) || []
      const add_to_filtered_raw = state.storageInventoryRaw?.filter(id => id.storage_id != action.pay) || []
      action.payload.storageData.forEach(storageRow => add_to_filtered.push(storageRow))
      action.payload.storageRowsRaw.forEach(storageRow => add_to_filtered_raw.push(storageRow))

      return {
        ...state,
        storageInventory: add_to_filtered,
        storageInventoryRaw: add_to_filtered_raw
      }
    case 'INVENTORY_STORAGES_CLEAR_CASKET':
      const AddToFiltered = state.storageInventory.filter(id => id.storage_id != action.payload.casketID)
      const AddToFilteredRaw = state.storageInventoryRaw.filter(id => id.storage_id != action.payload.casketID)

      return {
        ...state,
        storageInventory: AddToFiltered,
        storageInventoryRaw: AddToFilteredRaw
      }
    case 'INVENTORY_STORAGES_SET_SORT_STORAGES':
      return {
        ...state,
        storageInventory: action.payload.storageData
      }
    case 'INVENTORY_STORAGES_CLEAR_ALL':
      return {
        ...state,
        storageInventory: initialState.storageInventory,
        storageInventoryRaw: initialState.storageInventoryRaw
      }
    case 'MOVE_FROM_CLEAR':
      return {
        ...state,
        storageInventory: initialState.storageInventory,
        storageInventoryRaw: initialState.storageInventoryRaw

      }
    case 'MOVE_FROM_RESET':
      return {
        ...state,
        storageInventory: initialState.storageInventory,
        storageInventoryRaw: initialState.storageInventoryRaw

      }
    case 'SIGN_OUT':
      return {
        ...initialState
      }
    default:
      return { ...state }

  }
};

export default inventoryReducer;