const initialState = {
    tradeUpProducts: [] as any,
    tradeUpProductsIDS: [] as any,
    possibleOutcomes: [] as any,
    searchInput: '',
    MinFloat: '0',
    MaxFloat: '1',
    collections: [] as any,
    options: ["Hide equipped"] as any,
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
      
      case 'TRADEUP_ADDREMOVE_COLLECTION':
          let collectionAlreadyExists = state.collections.filter(row => row != action.payload)
          if (collectionAlreadyExists.length == state.collections.length) {
            collectionAlreadyExists.push(action.payload)
          }
          return {
            ...state,
            collections: collectionAlreadyExists
          }
      
      case 'TRADEUP_ADDREMOVE_OPTION':
          let optionAlready = state.options.filter(row => row != action.payload)
          if (optionAlready.length == state.options.length) {
            optionAlready.push(action.payload)
          }
          return {
            ...state,
            options: optionAlready
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
              ...initialState,
              collections: state.collections
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
