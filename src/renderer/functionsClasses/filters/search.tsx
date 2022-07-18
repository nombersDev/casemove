
import { ItemRow } from "renderer/interfaces/items";
import { InventoryFilters, MoveFromReducer, MoveToReducer } from "renderer/interfaces/states";


export function searchFilter(itemsArray: Array<ItemRow>, inventoryFilters: InventoryFilters, chosenReducer: InventoryFilters  | MoveFromReducer  | MoveToReducer): Array<ItemRow> {
  return itemsArray.filter(function (row) {

        if (
          inventoryFilters.categoryFilter.length != 0 ) {
           if (!inventoryFilters.categoryFilter?.includes(row.bgColorClass as string)) {
             return false
           }
          }
        if (
          row.item_name
            ?.toLowerCase()
            .trim()
            .includes(chosenReducer.searchInput?.toLowerCase().trim())
        ) {
          return true; // skip
        }
        if (
          row.item_wear_name
            ?.toLowerCase()
            .trim()
            .includes(chosenReducer.searchInput?.toLowerCase().trim())
        ) {
          return true; // skip
        }
        if (
          row.item_customname
            ?.toLowerCase()
            .trim()
            .includes(chosenReducer.searchInput?.toLowerCase().trim())
        ) {
          return true; // skip
        }
        if (chosenReducer.searchInput == undefined) {
          return true; // skip
        }
        return false;
      });
}