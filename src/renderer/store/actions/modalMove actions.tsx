export const setRenameModal = (itemID, itemName) => {
    return {
        type: 'SET_RENAME_MODAL',
        payload: {
            itemID: itemID,
            itemName: itemName
        }
    }
}

export const closeRenameModal = () => {
    return {
        type: 'CLOSE_RENAME_MODAL'
    }
}


export const moveModalQuerySet = (queryList) => {
    return {
        type: 'MOVE_MODAL_QUERY_SET',
        payload: {
            query: queryList
        }
    }
}
export const modalResetStorageIdsToClearFrom = () => {
    return {
        type: 'MODAL_RESET_STORAGE_IDS_TO_CLEAR_FROM'
    }
}
export const closeMoveModal = () => {
    return {
        type: 'CLOSE_MOVE_MODAL'
    }
}

export const cancelModal = (key) => {
    return {
        type: 'MOVE_MODAL_CANCEL',
        payload: {
            doCancel: key
        }
    }
}

export const moveModalAddToFail = () => {
    return {
        type: 'MODAL_ADD_TO_FAILED',
    }
}


export const moveModalUpdate = () => {
    return {
        type: 'MOVE_MODAL_UPDATE'
    }
}

export const moveModalResetPayload = () => {
    return {
        type: 'MOVE_MODAL_RESET_PAYLOAD'
    }
}

