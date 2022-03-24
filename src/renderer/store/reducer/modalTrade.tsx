const initialState = {
    moveOpen: false,
    openResult: false,
    inventoryFirst: [] as any
  };

  const modalTradeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TRADE_MODAL_OPEN_CLOSE':
        return {
          ...state,
          moveOpen: !state.moveOpen
        }
      case 'TRADE_MODAL_CONFIRM':
        return {
          ...state,
          moveOpen: false,
          inventoryFirst: action.payload.inventory
        }
      case 'TRADE_MODAL_OPEN_RESULT':
      if (state.moveOpen == true) {
        return {
          ...state,
          moveOpen: false,
          openResult: !state.openResult
        }
      }
        return {
          ...state,
          openResult: !state.openResult
        }



      case 'SIGN_OUT':
        return {
          ...initialState
        }
      default:
        return {...state}

    }
  };


  export default modalTradeReducer;
