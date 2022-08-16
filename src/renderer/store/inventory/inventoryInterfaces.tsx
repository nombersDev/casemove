import { ItemRow } from "renderer/interfaces/items";

// CONFIG
export interface InventoryMethods {
    'INVENTORY_SET_INVENTORY': string
    'INVENTORY_STORAGES_ADD_TO': string
    'INVENTORY_STORAGES_CLEAR_CASKET': string
    'INVENTORY_STORAGES_SET_SORT_STORAGES': string
    'INVENTORY_STORAGES_CLEAR_ALL': string
    'MOVE_FROM_CLEAR': string
}

export type InventoryMatchingObject = {
    [reducerType in keyof InventoryMethods]: Function;
};

export interface ActionInterface {
    type: keyof InventoryMethods
}

// ACTIONS
export interface SetInventory extends ActionInterface {
    payload: {
        inventory: Array<ItemRow>
        combinedInventory: Array<ItemRow>
    }
}

