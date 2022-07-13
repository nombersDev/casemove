
import { inventorySetStoragesData } from "renderer/store/actions/inventoryActions";
import { SetSortOption } from "renderer/store/actions/moveFromActions";
import { sortDataFunction } from "../../shared/filters/inventoryFunctions";

export async function onSortChange(dispatch: Function, sortValue: string, states: any) {
    dispatch(SetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      states.inventoryReducer.storageInventory,
      states.pricingReducer.prices,
      states.settingsReducer?.source?.title
    );
    dispatch(inventorySetStoragesData(storageResult));
  }