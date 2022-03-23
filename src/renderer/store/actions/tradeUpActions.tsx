
export const tradeUpAddRemove = (productRow) => {
    return {
        type: 'TRADEUP_ADD_REMOVE',
        payload: productRow
    }
}

export const tradeUpSetPossible = (productRow) => {
    return {
        type: 'TRADEUP_SET_POSSIBLE',
        payload: productRow
    }
}

export const tradeUpResetPossible = () => {
    return {
        type: 'TRADEUP_RESET'
    }
}