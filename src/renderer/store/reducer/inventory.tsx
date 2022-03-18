const initialState = {
    inventory: [] as any,
    combinedInventory: [] as any,
    storageInventory: [] as any,
    totalAccountItems: 0 as any
  };

  const inventoryReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INVENTORY_SET_INVENTORY':
        let storageTotal = 0
         action.payload.inventory.forEach(element => {
           console.log(element)
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
      case 'INVENTORY_STORAGES_ADD_TO':
          const add_to_filtered = state.storageInventory.filter(id => id.storage_id != action.payload.casketID)
          action.payload.storageData.forEach(storageRow => add_to_filtered.push(storageRow))

          return {
              ...state,
              storageInventory: add_to_filtered
          }
      case 'INVENTORY_STORAGES_CLEAR_CASKET':
          const AddToFiltered = state.storageInventory.filter(id => id.storage_id != action.payload.casketID)

          return {
              ...state,
              storageInventory: AddToFiltered
          }
      case 'INVENTORY_STORAGES_SET_STORAGES':
          return {
              ...state,
              storageInventory: action.payload.storageData
          }
      case 'INVENTORY_STORAGES_CLEAR_ALL':
          return {
            ...state,
            storageInventory: initialState.storageInventory
        }
      case 'MOVE_FROM_CLEAR':
        return {
          ...state,
          storageInventory: initialState.storageInventory

        }
      case 'SIGN_OUT':
        return {
          ...initialState
        }
      default:
        return {...state}

    }
  };

  export default inventoryReducer;
