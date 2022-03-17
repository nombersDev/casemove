import { filterInventory } from "renderer/components/content/shared/inventoryFunctions"


const allButClear = (filterString: any, sortValue, inventoryFiltered) => {
    return {
        type: 'ALL_BUT_CLEAR',
        payload: {
            inventoryFilter: filterString,
            sortValue: sortValue,
            inventoryFiltered: inventoryFiltered

        }
    }
}
export const filterInventoryClearAll = () => {
    return {
        type: 'CLEAR_ALL'
    }
}
export const inventoryFilterSetSearch = (searchField) => {
  return {
      type: 'INVENTORY_FILTERS_SET_SEARCH',
      payload: {
          searchField: searchField
      }
  }
}

export const inventoryAddCategoryFilter = (filterToAdd) => {
  return {
      type: 'INVENTORY_ADD_CATEGORY_FILTER',
      payload: filterToAdd
  }
}


export async function filterInventoryAddOption(combinedInventory, state, filterString, prices, pricingSource ) {
    let filterAlreadyExists = state.inventoryFilter.indexOf(filterString) > -1;
    // make a copy of the existing array
    let chosenFiltersCopy = state.inventoryFilter.slice();

    if (filterAlreadyExists) {
        chosenFiltersCopy = chosenFiltersCopy.filter(id => id != filterString)
    } else {
        chosenFiltersCopy.push(filterString)
    }
    const filteredInv = await filterInventory(combinedInventory, chosenFiltersCopy, state.sortValue, prices, pricingSource)
    return allButClear(chosenFiltersCopy, state.sortValue, filteredInv)
}

export async function filterInventorySetSort(combinedInventory, state, sortValue, prices, pricingSource ) {
    const filteredInv = await filterInventory(combinedInventory, state.inventoryFilter, sortValue, prices, pricingSource)
    return allButClear(state.inventoryFilter, sortValue, filteredInv)
}
