

import { State } from "renderer/interfaces/states";
import { inventorySetSortStorage } from "renderer/store/inventory/inventoryActions";
import { SetSortOption } from "renderer/store/actions/moveFromActions";
import { sortDataFunction } from "../../shared/filters/inventoryFunctions";

export async function onSortChange(dispatch: Function, sortValue: string, currentState: State) {
    dispatch(SetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      currentState.inventoryReducer.storageInventory,
      currentState.pricingReducer.prices, currentState.settingsReducer?.source?.title
    );
    const storageResultFiltered = await sortDataFunction(
      sortValue,
      currentState.inventoryFiltersReducer.storageFiltered,
      currentState.pricingReducer.prices, currentState.settingsReducer?.source?.title
    );
    dispatch(inventorySetSortStorage(storageResult, storageResultFiltered));
  }
