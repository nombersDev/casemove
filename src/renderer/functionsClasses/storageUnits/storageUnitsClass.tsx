import combineInventory from 'renderer/components/content/shared/filters/inventoryFunctions';
import { ItemRow, ItemRowStorage } from 'renderer/interfaces/items';
import { State } from 'renderer/interfaces/states';
import { addStorageInventoryData } from 'renderer/store/actions/inventoryActions';
import { moveFromAddCasketToStorages } from 'renderer/store/actions/moveFromActions';
import { RequestPrices } from '../prices';


export class HandleStorageData {
  dispatch: Function;
  state: State
  constructor(dispatch: Function, state: State) {
    this.dispatch = dispatch;
    this.state = state;
  }

  async addStorage(storageRow: ItemRow) {

    // Adding the casket ID
    this.dispatch(moveFromAddCasketToStorages(storageRow.item_id));

    // Fetch the storage unit data
    let storageResult = await this._getStorageUnitData(
      storageRow
    );
    const ClassRequest = new RequestPrices(this.dispatch, this.state.settingsReducer, this.state.pricingReducer)
    ClassRequest.handleRequestArray(storageResult.combinedStorages)

    console.log(storageResult)
    this.dispatch(
      addStorageInventoryData(
        storageResult.rawStorages,
        storageResult.combinedStorages,
        storageRow.item_id,
        this.state.moveFromReducer.sortValue
      )
    );
  }

  // Get storage unit
  async _getStorageUnitData(
    storageRow: ItemRow
  ){
    console.log(storageRow.item_id, storageRow.item_customname)
    let storageResult = await window.electron.ipcRenderer.getStorageUnitData(
      storageRow.item_id, storageRow.item_customname
    );
    let returnData: Array<ItemRowStorage> = storageResult[1]

    let finalReturnData = await combineInventory(returnData, this.state.settingsReducer, {
      storage_id: storageRow.item_id,
      storage_name: storageRow.item_customname
    }) as Array<ItemRowStorage>;

    returnData.forEach(element => {
      element.storage_id = storageRow.item_id
      element.storage_name = storageRow.item_customname as string
    });

    return {
      combinedStorages: finalReturnData,
      rawStorages: returnData
    }
  }
}
