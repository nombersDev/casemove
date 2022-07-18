import { sortDataFunction } from "renderer/components/content/shared/filters/inventoryFunctions"
import { Filter } from "renderer/interfaces/filters"
import { State } from "renderer/interfaces/states"
import _ from 'lodash';
import { filterItemRows } from "renderer/functionsClasses/filters/custom";

export const allButClear = (filterString: any, sortValue, inventoryFiltered) => {
    return {
        type: 'ALL_BUT_CLEAR',
        payload: {
            inventoryFilter: filterString,
            sortValue: sortValue,
            inventoryFiltered: inventoryFiltered

        }
    }
}
export const inventory_setFiltered = (filterString: any, sortValue, inventoryFiltered) => {
    return {
        type: 'SET_FILTERED',
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
export const inventoryAddRarityFilter = (filterToAdd) => {
  return {
      type: 'INVENTORY_ADD_RARITY_FILTER',
      payload: filterToAdd
  }
}
export async function filterInventoryAddOption(currentState: State, newFilter: Filter) {
    let newFilterState = [] as Array<Filter>;
    let wasSeen: boolean = false;
    currentState.inventoryFiltersReducer.inventoryFilter.forEach(element => {
        if (!_.isEqual(element, newFilter)) {
            newFilterState.push(element)
            
        } else {
            wasSeen = true;
        }
    });

    if (!wasSeen) {
        newFilterState.push(newFilter)
    }
    let filteredInv = await filterItemRows(currentState.inventoryReducer.combinedInventory, newFilterState)
    filteredInv = await sortDataFunction(currentState.inventoryFiltersReducer.sortValue, filteredInv, currentState.pricingReducer.prices, currentState.settingsReducer?.source?.title)
    return inventory_setFiltered(newFilterState, currentState.inventoryFiltersReducer.sortValue, filteredInv)
}

export async function filterInventorySetSort(currentState: State, newSort: string) {
    let inventoryData = sortDataFunction(newSort, currentState.inventoryReducer.inventory, currentState.pricingReducer.prices, currentState.settingsReducer?.source?.title)
    return allButClear(currentState.inventoryFiltersReducer.inventoryFilter, newSort, inventoryData)
}
