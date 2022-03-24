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
export const setTradeMoveResult = () => {
  return {
      type: 'TRADE_MODAL_OPEN_RESULT',
  }
}


