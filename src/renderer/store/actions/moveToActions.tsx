export const moveToSetHide = () => {
    return {
        type: 'MOVE_TO_SET_HIDE'
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

export const moveToSetSortOption = (sortValue) => {
    return {
        type: 'MOVE_TO_SET_SORT',
        payload: {
            sortValue: sortValue
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


