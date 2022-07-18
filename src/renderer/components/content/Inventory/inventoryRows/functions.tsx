
import { State } from "renderer/interfaces/states";
import { inventorySetSortStorage } from "renderer/store/actions/inventoryActions";
import { SetSortOption } from "renderer/store/actions/moveFromActions";
import { sortDataFunction } from "../../shared/filters/inventoryFunctions";

export async function onSortChange(dispatch: Function, sortValue: string, states: State) {
    dispatch(SetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      states.inventoryReducer.storageInventory,
      states.pricingReducer.prices,
      states.settingsReducer?.source?.title
    );
    dispatch(inventorySetSortStorage(storageResult));
  }