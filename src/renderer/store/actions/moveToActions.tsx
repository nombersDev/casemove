export const moveToSetHide = () => {
    return {
        type: 'MOVE_TO_SET_HIDE'
    }
}
export const moveToSetFull = () => {
    return {
        type: 'MOVE_TO_SET_FULL'
    }
}
export const moveToClearAll = () => {
    return {
        type: 'MOVE_TO_CLEAR_ALL'
    }
}
export const doCancel = (doCancel) => {
    return {
        type: 'DO_CANCEL',
        payload: {
            doCancel: doCancel
        }
    }
}
export const moveTosetSearchField = (searchField) => {
    return {
        type: 'MOVE_TO_SET_SEARCH',
        payload: {
            searchField: searchField
        }
    }
}
export const moveTosetSearchFieldStorage = (searchField) => {
    return {
        type: 'MOVE_TO_SET_SEARCH_STORAGE',
        payload: {
            searchField: searchField
        }
    }
}

export const moveToAddCasketToStorages = (casketID, casketVolume) => {
    return {
        type: 'MOVE_TO_ADD_TO',
        payload: {
            casketID: casketID,
            casketVolume: casketVolume
        }
    }
}

export const moveToSetStorageAmount = (storageAmount) => {
    return {
        type: 'SET_STORAGE_AMOUNT',
        payload: {
            storageAmount: storageAmount
        }
    }
}
export const moveToAddRemove = (casketID, itemID, totalItems, itemName) => {
    return {
        type: 'MOVE_TO_TOTAL_TO_ADD',
        payload: {
            casketID: casketID,
            toMove: totalItems,
            itemID: itemID,
            itemName:itemName
            
        }
    }
}


