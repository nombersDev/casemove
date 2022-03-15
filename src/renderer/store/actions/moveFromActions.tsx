export const moveFromSetHide = () => {
    return {
        type: 'MOVE_FROM_SET_HIDE'
    }
}

export const moveFromSetSortBack = () => {
    return {
        type: 'MOVE_FROM_SET_SORT_BACK'
    }
}
export const moveFromClearAll = () => {
    return {
        type: 'MOVE_FROM_CLEAR_ALL'
    }
}
export const moveFromReset = () => {
    return {
        type: 'MOVE_FROM_CLEAR'
    }
}
export const moveFromsetSearchField = (searchField) => {
    return {
        type: 'MOVE_FROM_SET_SEARCH',
        payload: {
            searchField: searchField
        }
    }
}

export const moveFromSetSortOption = (sortValue) => {
    return {
        type: 'MOVE_FROM_SET_SORT',
        payload: {
            sortValue: sortValue
        }
    }
}

export const moveFromAddCasketToStorages = (casketID) => {
    return {
        type: 'MOVE_FROM_ADD_TO',
        payload: {
            casketID: casketID
        }
    }
}

export const moveFromAddRemove = (casketID, itemID, totalItems, itemName) => {
    return {
        type: 'MOVE_FROM_TOTAL_TO_ADD',
        payload: {
            casketID: casketID,
            toMove: totalItems,
            itemID: itemID,
            itemName:itemName
            
        }
    }
}

export const moveFromRemoveCasket = (casketID) => {
    return {
        type: 'MOVE_FROM_ALL_CASKET_RESULTS',
        payload: {
            casketID: casketID
            
        }
    }
}
