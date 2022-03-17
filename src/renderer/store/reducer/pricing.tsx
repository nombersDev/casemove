const initialState = {
  prices: {} as any,
  storageAmount: 0
};

const pricingReducer = (state = initialState, action) => {
  switch (action.type) {


    case 'PRICING_ADD_STORAGE_TOTAL':
      console.log(action.payload.storageAmount)
      return {
        ...state,
        storageAmount: state.storageAmount + action.payload.storageAmount,
      };
    case 'PRICING_ADD_TO':
      let currentPrices = state.prices;
      action.payload.itemRows.forEach(element => {
        currentPrices[element.item_name] = element.pricing;
      });
      console.log(currentPrices)
      return {
        ...state,
        prices: currentPrices,
      };
    case 'PRICING_REMOVE':
      let removeCurrentPrices = state.prices;

      if (removeCurrentPrices[action.payload.itemName] !== undefined) {
        delete removeCurrentPrices[action.payload.itemName];
      }
      return {
        ...state,
        prices: removeCurrentPrices,
      };
    case 'PRICING_CLEAR':
      return {
        ...initialState,
      };
      case 'MOVE_FROM_CLEAR':
        return {
          ...state,
          storageAmount: initialState.storageAmount
        }

    case 'SIGN_OUT':
      return {
        ...initialState,
      };
    default:
      return { ...state };
  }
};

export default pricingReducer;
