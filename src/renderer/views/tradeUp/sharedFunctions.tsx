

import itemRarities from 'renderer/components/content/shared/rarities';

export async function createInventoryFilter(inventory, tradeUpData) {
    let inventoryToUse = [...inventory.inventory];
    let collections = [] as any;


    inventoryToUse = inventoryToUse.filter(function (item) {
        if (!item.tradeUpConfirmed) {
            return false;
        }
        if (tradeUpData.MinFloat > item.item_paint_wear || tradeUpData.MaxFloat < item.item_paint_wear) {
            return false;
        }
        if (tradeUpData.tradeUpProductsIDS.includes(item.item_id)) {
            return false;
        }
        if (tradeUpData.tradeUpProducts.length != 0) {
            let restrictRarity = tradeUpData.tradeUpProducts[0].rarityName
            let restrictStattrak = tradeUpData.tradeUpProducts[0].stattrak
            if (item.rarityName != restrictRarity) {
                return false
            }
            if (item.stattrak != restrictStattrak) {
                return false
            }
        }

        if (item.tradeUp) {
            return true;
        }
        return false;
    });

    let itemR = {}
    itemRarities.forEach(element => {
        itemR[element.value] = element.bgColorClass
    });
    inventoryToUse.forEach(element => {
        console.log(element, collections.includes(element['collection']))
        if (element['collection'] != undefined && collections.includes(element['collection']) == false) {
            collections.push(element['collection'])
        }
        element['rarityColor'] = itemR[element.rarityName]
    });
    return inventoryToUse
}
