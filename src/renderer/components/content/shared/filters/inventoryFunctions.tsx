import { ItemRow, ItemRowStorage } from 'renderer/interfaces/items';
import { State } from 'renderer/interfaces/states';
import { filterInventorySetSort } from 'renderer/store/actions/filtersInventoryActions';
import {itemCategories, itemSubCategories} from '../categories';



// Will get the categories
async function getCategory(toLoopThrough: Array<ItemRow | ItemRowStorage>, additionalObjectToAdd: any = {}) {
  let returnArray: Array<ItemRow | ItemRowStorage> = [];
  let itemIdsFiltered: Array<string> = [];

  for (const [_, value] of Object.entries(itemCategories)) {
    let result = toLoopThrough.filter(itemRow => itemRow.item_url.includes(value.value));
    result = result.map(function(el) {
      itemIdsFiltered.push(el.item_id)
      let o = Object.assign({}, el);
      o.category = value.name
      o.bgColorClass = value.bgColorClass

      // Major
      const majorRegex = new RegExp('(?:' + Object.keys(itemSubCategories.majors).join('|') + ')', 'g')
      const majorMatch = el.item_name.match(majorRegex);
      if (majorMatch) {
        o.major = majorMatch[0]
      }

      // Additional keys to add
      for (const [keyToAdd, valueToAdd] of Object.entries(additionalObjectToAdd)) {
        o[keyToAdd] = valueToAdd
      }
      return o;
    })


    returnArray.push(...result)
  }

  // If any items are left behind - ie doesn't fit in a category, we add it back to the array.
  if (toLoopThrough.length != returnArray.length) {

    returnArray.push(...toLoopThrough.filter(itemRow => !itemIdsFiltered.includes(itemRow.item_id)));
  }
  return returnArray

}

// This will combine the inventory when specific conditions match
export default function combineInventory(thisInventory: Array<ItemRow | ItemRowStorage>, settings: any, additionalObjectToAdd: any = {}) {

  const seenProducts = [] as any;
  const newInventory = [] as any;

  for (const [, value] of Object.entries(thisInventory)) {
    let valued = value;

    // Create a string that matches the conditions
    let wearName = valued['item_wear_name']  || 0
    let valueConditions =
      valued['item_name'] +
      valued['item_customname'] +
      valued['item_url'] +
      valued['trade_unlock'] +
      valued['item_moveable'] +
      valued['item_has_stickers'] +
      wearName +
      valued['stickers'];

    if (valued['item_paint_wear'] != undefined && settings.columns.includes('Float')) {
      valueConditions = valueConditions + valued['item_paint_wear'];
    }

    // Filter the inventory
    if (seenProducts.includes(valueConditions) == false) {
      let length = thisInventory.filter(function (item) {
        let wearName = item['item_wear_name']  || 0
        let itemConditions =
          item['item_name'] +
          item['item_customname'] +
          item['item_url'] +
          item['trade_unlock'] +
          item['item_moveable'] +
          item['item_has_stickers'] +
          wearName +
          item['stickers'];
        if (item['item_paint_wear'] != undefined && settings.columns.includes('Float')) {
          itemConditions = itemConditions + item['item_paint_wear'];
        }

        return itemConditions == valueConditions;
      });

      // Get all ids
      let valuedList = [] as any;
      for (const [, filteredValue] of Object.entries(length)) {
        let filteredValued = filteredValue

        valuedList.push(filteredValued['item_id']);
      }

      let newDict = length[0];
      newDict['combined_ids'] = valuedList;
      newDict['combined_QTY'] = valuedList.length;
      newInventory.push(newDict);

      // Push the seen conditions to avoid duplicates
      seenProducts.push(valueConditions);
    }
  }
  return getCategory(newInventory, additionalObjectToAdd).then((returnValue) => {
    return returnValue
  })
}

export async function filterInventoryd(
  combinedInventory,
  filtersData,
  sortData,
  prices,
  pricingSource
) {
  const thisInventory = [] as any;
  // First Categories
  let totalTwo = 0;
  console.log(filtersData);
  for (const [, value] of Object.entries(filtersData)) {
    let valued = value as String;
    let command = valued.substring(0, 1);
    valued = valued.substring(1);

    // Second filter
    if (command == '2') {
      totalTwo += 1;
      const tempInventory = combinedInventory.filter(function (item) {
        return item.item_url.includes([`${valued}`]);
      });

      for (const [, value] of Object.entries(tempInventory)) {
        thisInventory.push(value);
      }
    }
  }

  if (totalTwo > 0) {
    combinedInventory = thisInventory;
  }

  // First and third check

  for (const [, value] of Object.entries(filtersData)) {
    let valued = value as String;
    let command = valued.substring(0, 1);
    valued = valued.substring(1);
    let secondValued = valued.slice(0, -1);

    // First filter
    if (command == '1') {
      combinedInventory = combinedInventory.filter(function (item) {
        if (valued == 'trade_unlock' && item[`${valued}`] != null) {
          return true;
        }
        if (valued == 'item_customname' && item[`${valued}`] != null) {
          return true;
        }
        return item[`${valued}`] == true;
      });
    }
    if (command == '3') {
      combinedInventory = combinedInventory.filter(function (item) {
        if (secondValued == 'trade_unlock' && item[`${secondValued}`] == null) {
          return true;
        }
        if (valued == 'econ/tools/casket') {
          return item.item_url.includes([`${valued}`]) == false;
        }
        return false;
      });
    }
    if (command == '4') {
      combinedInventory = combinedInventory.filter(function (item) {
        if (valued == 'econ/tools/casket') {
          return item.item_url.includes([`${valued}`]) == true;
        }
        return false;
      });
    }
  }
  combinedInventory = await sortDataFunction(
    sortData,
    combinedInventory,
    prices,
    pricingSource
  );

  return combinedInventory;
}
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Sort function
export async function onSortChange(dispatch: Function, currentState: State, sortValue: string) {
  dispatch(
    await filterInventorySetSort(
      currentState,
      sortValue
    )
  );
}

export async function sortDataFunction(
  sortValue,
  inventory,
  prices,
  pricingSource
) {
  function sortRun(valueOne, ValueTwo, useNaN = false) {
    if (valueOne == undefined) {
      valueOne = -90000000000
    }
    if (ValueTwo == undefined) {
      ValueTwo = -90000000000
    }
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    if (useNaN && isNaN(valueOne)) {
      return -1;
    }
    return 0;
  }
  function sortRunAlt(valueOne, ValueTwo) {
    if (isNaN(valueOne)) {
      valueOne = -90000000000
    }
    if (isNaN(ValueTwo)) {
      ValueTwo = -90000000000
    }
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    return 0;
  }

  // Check
  if (sortValue == 'Storages') {
    inventory.sort(function (a, b) {
      return sortRun(a.item_customname, b.item_customname);
    });
    return inventory;
  }
  // First sort by Name
  inventory.sort(function (a, b) {
    return sortRun(
      a.item_name.replaceAll('★', '').replaceAll(' ', ''),
      b.item_name.replaceAll('★', '').replaceAll(' ', '')
    );
  });
  switch (sortValue) {
    case 'Default':
      inventory.sort(function (a, b) {
        return sortRun(a.item_id, b.item_id);
      });
      return inventory;

    case 'Category':
      inventory.sort(function (a, b) {
        return sortRun(a.category, b.category);
      });
      return inventory;

    case 'QTY':
      inventory.sort(function (a, b) {
        return -sortRun(a.combined_QTY, b.combined_QTY);
      });
      return inventory;

    case 'Price':
      inventory.sort(function (a, b) {
        return sortRunAlt(
          prices[a.item_name  + a.item_wear_name || '']?.[pricingSource] * a.combined_QTY,
          prices[b.item_name  + b.item_wear_name || '']?.[pricingSource] * b.combined_QTY
        );
      });
      return inventory;

    case 'Stickers':
      inventory.sort(function (a, b) {
        return -sortRun(a?.stickers?.length, b?.stickers?.length);
      });
      return inventory;

    case 'wearValue':
      inventory.sort(function (a, b) {
        return -sortRun(a.item_paint_wear, b.item_paint_wear, true);
      });
      return inventory;

    case 'Collection':
      inventory.sort(function (a, b) {
        if (b == undefined) {
          return -1
        }
        return sortRun(a.collection?.toLowerCase(), b.collection?.toLowerCase(), true);
      });
      return inventory;

    case 'Rarity':
      inventory.sort(function (a, b) {
        var valueAToTest = a.rarity;
        var valueBToTest = b.rarity;
        if (valueAToTest == undefined) {
          valueAToTest = 99;
        }

        if (valueBToTest == undefined) {
          valueBToTest = 99;
        }

        return sortRun(valueAToTest, valueBToTest, true);
      });
      return inventory;

    case 'StorageName':
      inventory.sort(function (a, b) {
        return sortRun(a?.storage_name, b?.storage_name);
      });
      return inventory;

    case 'tradehold':
      const now = new Date();
      inventory.sort(function (a, b) {
        return sortRun(
          a?.trade_unlock?.getTime() - now.getTime(),
          b?.trade_unlock?.getTime() - now.getTime(),
          true
        );
      });
      return inventory;

    default:
      return inventory;
  }
}

export function sortDataFunctionTwo(
  sortValue,
  inventory,
  prices,
  pricingSource
) {
  function sortRun(valueOne, ValueTwo, useNaN = false) {
    if (valueOne == undefined) {
      valueOne = -90000000000
    }
    if (ValueTwo == undefined) {
      ValueTwo = -90000000000
    }
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    if (useNaN && isNaN(valueOne)) {
      return -1;
    }
    return 0;
  }
  function sortRunAlt(valueOne, ValueTwo) {
    if (isNaN(valueOne)) {
      valueOne = -90000000000
    }
    if (isNaN(ValueTwo)) {
      ValueTwo = -90000000000
    }
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    return 0;
  }

  // Check
  if (sortValue == 'Storages') {
    inventory.sort(function (a, b) {
      return sortRun(a.item_customname, b.item_customname);
    });
    return inventory;
  }
  // First sort by Name
  inventory.sort(function (a, b) {
    return sortRun(
      a.item_name.replaceAll('★', '').replaceAll(' ', ''),
      b.item_name.replaceAll('★', '').replaceAll(' ', '')
    );
  });
  switch (sortValue) {
    case 'Default':
      inventory.sort(function (a, b) {
        return sortRun(a.item_id, b.item_id);
      });
      return inventory;

    case 'Category':
      inventory.sort(function (a, b) {
        return sortRun(a.category, b.category);
      });
      return inventory;

    case 'QTY':
      inventory.sort(function (a, b) {
        return -sortRun(a.combined_QTY, b.combined_QTY);
      });
      return inventory;

    case 'Price':
      inventory.sort(function (a, b) {
        return sortRunAlt(
          prices[a.item_name  + a.item_wear_name || '']?.[pricingSource] * a.combined_QTY || 1,
          prices[b.item_name  + b.item_wear_name || '']?.[pricingSource] * b.combined_QTY || 1
        );
      });
      return inventory;

    case 'Stickers':
      inventory.sort(function (a, b) {
        return -sortRun(a?.stickers?.length, b?.stickers?.length);
      });
      return inventory;

    case 'wearValue':
      inventory.sort(function (a, b) {
        return -sortRun(a.item_paint_wear, b.item_paint_wear, true);
      });
      return inventory;

    case 'Collection':
      inventory.sort(function (a, b) {
        if (b == undefined) {
          return -1
        }
        return sortRun(a.collection?.toLowerCase(), b.collection?.toLowerCase(), true);
      });
      return inventory;

    case 'Rarity':
      inventory.sort(function (a, b) {
        var valueAToTest = a.rarity;
        var valueBToTest = b.rarity;
        if (valueAToTest == undefined) {
          valueAToTest = 99;
        }

        if (valueBToTest == undefined) {
          valueBToTest = 99;
        }

        return sortRun(valueAToTest, valueBToTest, true);
      });
      return inventory;

    case 'StorageName':
      inventory.sort(function (a, b) {
        return sortRun(a?.storage_name, b?.storage_name);
      });
      return inventory;

    case 'tradehold':
      const now = new Date();
      inventory.sort(function (a, b) {
        return sortRun(
          a?.trade_unlock?.getTime() - now.getTime(),
          b?.trade_unlock?.getTime() - now.getTime(),
          true
        );
      });
      return inventory;

    default:
      return inventory;
  }
}