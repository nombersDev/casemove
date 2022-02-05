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


export async function filterInventoryAddOption(combinedInventory, state, filterString ) {
    let filterAlreadyExists = state.inventoryFilter.indexOf(filterString) > -1;
    // make a copy of the existing array
    let chosenFiltersCopy = state.inventoryFilter.slice();

    if (filterAlreadyExists) {
        chosenFiltersCopy = chosenFiltersCopy.filter(id => id != filterString)
    } else {
        chosenFiltersCopy.push(filterString)
    }
    const filteredInv = await filterInventory(combinedInventory, chosenFiltersCopy, state.sortValue)
    return allButClear(chosenFiltersCopy, state.sortValue, filteredInv)
}

export async function filterInventorySetSort(combinedInventory, state, sortValue ) {
    const filteredInv = await filterInventory(combinedInventory, state.inventoryFilter, sortValue)
    return allButClear(state.inventoryFilter, sortValue, filteredInv)
}
