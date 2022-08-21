import { Inventory } from "renderer/interfaces/states";
import { InventoryMatchingObject } from "./inventoryInterfaces";

const initialState: Inventory = {
    inventory: [],
    combinedInventory: [],
    storageInventory: [],
    storageInventoryRaw: [],
    totalAccountItems: 0,
    itemsLookUp: {}
};


export class InventoryActionsReducer {

    matchingObject: InventoryMatchingObject = {
        'INVENTORY_SET_INVENTORY': this.setInventory,
        'INVENTORY_STORAGES_ADD_TO': this.addStorageUnitsItems,
        'INVENTORY_STORAGES_CLEAR_CASKET': this.clearStorageUnitItems,
        'INVENTORY_STORAGES_SET_SORT_STORAGES': this.setSortStorageUnits,
        'INVENTORY_STORAGES_CLEAR_ALL': this.clearAllStorageUnits,
        'MOVE_FROM_CLEAR': this.clearAllStorageUnits,
        'SIGN_OUT': this.initialState

    }
    relevantFunction: Function
    state: Inventory
    action

    constructor(state = initialState, action: any) {
        this.relevantFunction = this.default
        if (action.type in this.matchingObject) {
            this.relevantFunction = this.matchingObject[action.type]
        }
        this.state = state
        this.action = action
    }

    // Default
    default() {
        return {
            ...this.state
        }
    }

    // Initial state
    initialState() {
        return {
            ...initialState
        }
    }



    // Set the inventory whenever it changes
    setInventory() {
        let storageTotal = 0

        this.action.payload.inventory.forEach(element => {
            storageTotal += 1
            if (element.item_url == "econ/tools/casket") {
                storageTotal += element.item_storage_total
            }
        });



        return {
            ...this.state,
            inventory: this.action.payload.inventory,
            combinedInventory: this.action.payload.combinedInventory,
            totalAccountItems: storageTotal
        }
    }

    // Add storage unit items
    addStorageUnitsItems() {
        const add_to_filtered = this.state.storageInventory?.filter(id => id.storage_id != this.action.payload.casketID) || []
        const add_to_filtered_raw = this.state.storageInventoryRaw?.filter(id => id.storage_id != this.action.pay) || []
        this.action.payload.storageData.forEach(storageRow => add_to_filtered.push(storageRow))
        this.action.payload.storageRowsRaw.forEach(storageRow => {
            add_to_filtered_raw.push(storageRow)
        })

        return {
            ...this.state,
            storageInventory: add_to_filtered,
            storageInventoryRaw: add_to_filtered_raw
        }
    }

    // Clear a caskets storage unit items
    clearStorageUnitItems() {
        const AddToFiltered = this.state.storageInventory.filter(id => id.storage_id != this.action.payload.casketID)
        const AddToFilteredRaw = this.state.storageInventoryRaw.filter(id => id.storage_id != this.action.payload.casketID)
        return {
            ...this.state,
            storageInventory: AddToFiltered,
            storageInventoryRaw: AddToFilteredRaw
          }
    }

    // Set storage unit sort
    setSortStorageUnits() {
        return {
            ...this.state,
            storageInventory: this.action.payload.storageData
          }
    }

    // Clear all storage units
    clearAllStorageUnits() {
        return {
            ...this.state,
            storageInventory: initialState.storageInventory,
            storageInventoryRaw: initialState.storageInventoryRaw
          }
    }

}

export function inventoryReducer(state = initialState, action) {
    return new InventoryActionsReducer(state, action).relevantFunction()
}

