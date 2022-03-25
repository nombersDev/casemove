
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

export const tradeUpSetSearch = (searchField) => {
  return {
      type: 'TRADEUP_SET_SEARCH',
      payload: {
          searchField: searchField
      }
  }
}

export const tradeUpSetMin = (min) => {
  return {
      type: 'TRADEUP_SET_MIN',
      payload: min
  }
}
export const tradeUpSetMax = (max) => {
  return {
      type: 'TRADEUP_SET_MAX',
      payload: max
  }
}
