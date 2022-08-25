
import { fetchItems } from '../../helpers/classes/steam/items/getCommands';
import { tradeUps } from '../../helpers/classes/steam/tradeup';
import { ItemRow } from '../../../renderer/interfaces/items';

var fetchItemClass = new fetchItems();
let tradeUpClass = new tradeUps();

export async function convertInventory(inventoryToRun: Array<ItemRow>): Promise<Array<ItemRow>> {
  return fetchItemClass.convertInventory(inventoryToRun).then((returnValue) => {
    return tradeUpClass.getTradeUp(returnValue).then((newReturnValue: any) => {
     return newReturnValue
    });
  });
}
