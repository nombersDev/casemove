const initialState = {
    tradeUpProducts: [] as any,
    tradeUpProductsIDS: [] as any,
    possibleOutcomes: [] as any,
    searchInput: '',
    MinFloat: '0',
    MaxFloat: '1'

  };

  const tradeUpReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TRADEUP_ADD_REMOVE':
          let toMoveAlreadyExists = state.tradeUpProducts.filter(row => row.item_id != action.payload.item_id)
          console.log(action.payload.item_id, toMoveAlreadyExists)
          if (toMoveAlreadyExists.length == state.tradeUpProducts.length) {
            toMoveAlreadyExists.push(action.payload)
          }
          let newTradeUpIDS = [] as any
          toMoveAlreadyExists.forEach(element => {
            newTradeUpIDS.push(element.item_id)

          });
          if (toMoveAlreadyExists.length != 10) {
            return {
              ...state,
              tradeUpProducts: toMoveAlreadyExists,
              tradeUpProductsIDS: newTradeUpIDS,
              possibleOutcomes: initialState.possibleOutcomes
           }
          } else {
            return {
              ...state,
              tradeUpProducts: toMoveAlreadyExists,
              tradeUpProductsIDS: newTradeUpIDS,
           }
          }
      case 'TRADEUP_SET_SEARCH':
          return {
              ...state,
              searchInput: action.payload.searchField
           }
     case 'TRADEUP_SET_MIN':
          return {
              ...state,
              MinFloat: action.payload
           }
      case 'TRADEUP_SET_MAX':
          return {
              ...state,
              MaxFloat: action.payload
           }
      case 'TRADEUP_SET_POSSIBLE':
          return {
              ...state,
              possibleOutcomes: action.payload
           }
        case 'TRADEUP_RESET':
            return {
              ...initialState
            }

      

        case 'SIGN_OUT':
        return {
          ...initialState
        }



      default:
        return {...state}

    }
  };

  export default tradeUpReducer;
