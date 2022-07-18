import { ItemRow, ItemRowStorage } from "renderer/interfaces/items";
import { Prices, Settings } from "renderer/interfaces/states";
import { ConvertPricesFormatted } from "./prices";

async function handleDownload(storageData) {
    let csvContent =
      'Item Name,Item Custom Name,Price,Price Combined,Item Moveable,Storage Name,Tradehold,Category,Combined QTY,Item Wear Name,Item Paint Wear,Item Has Stickers/Patches,Stickers\n';
    var csv = storageData
      .map(function (d) {
        let storageName = d.storage_name;
        if (storageName == undefined) {
          storageName = '#Inventory';
        }
  
        let stickersData = d.stickers;
        if (stickersData != []) {
          let newStickers = [] as any;
          stickersData.forEach((element) => {
            newStickers.push(element.sticker_name);
          });
          stickersData = newStickers.join(';');
        }
        const returnDict = {
          item_name: d.item_name,
          item_customname: d.item_customname,
          price: d.item_price,
          price_combined: d.item_price_combined,
          item_moveable: d.item_moveable,
          storage_name: storageName,
          trade_unlock: d.trade_unlock,
          category: d.category,
          combined_QTY: d.combined_QTY,
          item_wear_name: d.item_wear_name,
          item_paint_wear: d.item_paint_wear,
          item_has_stickers: d.item_has_stickers,
          item_stickers: stickersData,
        };
        return JSON.stringify(Object.values(returnDict));
      })
      .join('\n')
      .replaceAll('null', '')
      .replace(/(^\[)|(\]$)/gm, '');
    csv = csvContent + csv;
    window.electron.ipcRenderer.downloadFile(csv);
  }
  
export async function downloadReport(settingsData: Settings, pricesReducer: Prices, itemArray: Array<ItemRow | ItemRowStorage> ) {
    const PricesClassFormatted = new ConvertPricesFormatted(settingsData, pricesReducer)
    itemArray.forEach((element: any) => {
        element.item_price = PricesClassFormatted.getFormattedPrice(element);
        element.item_price_combined = PricesClassFormatted.getFormattedPriceCombined(element);
    });

    handleDownload(itemArray);
}