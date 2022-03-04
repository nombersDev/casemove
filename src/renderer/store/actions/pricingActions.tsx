export const pricing_addPrice = (priceResult, itemName) => {
    return {
        type: 'PRICING_ADD_TO',
        payload: {
            price: priceResult,
            itemName: itemName
        }
    }
}
export const pricing_removePrice = (priceResult, itemName) => {
  return {
      type: 'PRICING_REMOVE',
      payload: {
          price: priceResult,
          itemName: itemName
      }
  }
}
export const pricing_add_storage_total = (amountToAdd) => {
  return {
      type: 'PRICING_ADD_STORAGE_TOTAL',
      payload: {
        storageAmount: amountToAdd
      }
  }
}
export const pricing_clearAll = () => {
  return {
      type: 'PRICING_CLEAR'
  }
}
