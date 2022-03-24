export const setTradeMove = () => {
    return {
        type: 'TRADE_MODAL_OPEN_CLOSE',
    }
}
export const setTradeConfirm = (inven) => {
  return {
      type: 'TRADE_MODAL_CONFIRM',
      payload: {
        inventory: inven
    }
  }
}

export const setTradeReset = () => {
  return {
      type: 'TRADE_MODAL_RESET'
    }
}

export const setTradeFoundMatch = (matchRow) => {
  return {
      type: 'TRADE_MODAL_MATCH_FOUND',
      payload: {
        matchRow: matchRow
    }
  }
}
export const setTradeMoveResult = () => {
  return {
      type: 'TRADE_MODAL_OPEN_RESULT',
  }
}


