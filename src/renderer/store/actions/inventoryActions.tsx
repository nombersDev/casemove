export const setInventoryAction = (forwardPackage: any) => {
    return {
        type: 'INVENTORY_SET_INVENTORY',
        payload: {
            inventory: forwardPackage.inventory,
            combinedInventory: forwardPackage.combinedInventory
        }
    }
}

export const addStorageInventoryData = (storageRowsRaw, storageData, casketID, sortValue) => {
    return {
        type: 'INVENTORY_STORAGES_ADD_TO',
        payload: {
            storageRowsRaw: storageRowsRaw,
            storageData: storageData,
            casketID: casketID,
            sortValue: sortValue
        }
    }
}

export const inventorySetSortStorage = (storageData) => {
    return {
        type: 'INVENTORY_STORAGES_SET_SORT_STORAGES',
        payload: {
            storageData: storageData
        }
    }
}

export const clearStorageIDData = (casketID) => {
    return {
        type: 'INVENTORY_STORAGES_CLEAR_CASKET',
        payload: {
            casketID: casketID
        }
    }
}

export const clearStorage = () => {
    return {
        type: 'INVENTORY_STORAGES_CLEAR_ALL'
    }
}
