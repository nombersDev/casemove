const initialState = {
    tradeUpProducts: [] as any,
    possibleOutcomes: [] as any
  };

  const tradeUpReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TRADEUP_ADD_REMOVE':
          let toMoveAlreadyExists = state.tradeUpProducts.filter(row => row.item_id != action.payload.item_id)
          console.log(action.payload.item_id, toMoveAlreadyExists)
          if (toMoveAlreadyExists.length == state.tradeUpProducts.length) {
            toMoveAlreadyExists.push(action.payload)
          }
          if (toMoveAlreadyExists.length != 10) {
            return {
              ...state,
              tradeUpProducts: toMoveAlreadyExists,
              possibleOutcomes: initialState.possibleOutcomes
           } 
          } else {
            return {
              ...state,
              tradeUpProducts: toMoveAlreadyExists
           } 
          }

      case 'TRADEUP_SET_POSSIBLE':
          return {
              ...state,
              possibleOutcomes: action.payload
           } 
     
        
        case 'TRADEUP_RESET': 
        return {
          ...state,
          possibleOutcomes: initialState.possibleOutcomes
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