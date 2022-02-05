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

export const setMoveModal = (itemName, number, type, storageID, itemID, isLast, key) => {
    return {
        type: 'SET_MOVE_MODAL',
        payload: {
            name: itemName,
            number: number,
            type: type,
            storageID: storageID,
            itemID: itemID,
            isLast: isLast,
            key: key
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