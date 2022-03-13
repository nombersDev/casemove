// FILTERS & FUNCTIONS
export async function filterInventory(
  combinedInventory,
  filtersData,
  sortData
) {
  const thisInventory = [] as any;
  // First Categories
  for (const [, value] of Object.entries(filtersData)) {
    let valued = value as String;
    let command = valued.substring(0, 1);
    valued = valued.substring(1);

    // Second filter
    if (command == '2') {
      console.log(valued);
      const tempInventory = combinedInventory.filter(function (item) {
        return item.item_url.includes([`${valued}`]);
      });

      for (const [, value] of Object.entries(tempInventory)) {
        thisInventory.push(value);
      }
      console.log(tempInventory);
    }
  }

  if (thisInventory.length !== 0) {
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
  combinedInventory = await sortDataFunction(sortData, combinedInventory);

  return combinedInventory;
}

// Sort the inventory / storage results
export async function sortDataFunction(sortValue, inventory) {
  // Check
  if (sortValue == 'Storages') {
    inventory.sort(function (a, b) {
      if (a.item_customname < b.item_customname) {
        return -1;
      }
      if (a.item_customname > b.item_customname) {
        return 1;
      }
      return 0;
    });
    return inventory;
  }
  // First sort by Name
  inventory.sort(function (a, b) {
    if (a.item_name < b.item_name) {
      return -1;
    }
    if (a.item_name > b.item_name) {
      return 1;
    }
    return 0;
  });
  console.log('HERE', sortValue);
  // Return Default
  if (sortValue == 'Default') {
    inventory.sort(function (a, b) {
      if (a.position < b.position) {
        return -1;
      }
      if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
    return inventory;
  }

  // Sort products
  if (sortValue == 'Category') {
    inventory.sort(function (a, b) {
      if (a.category < b.category) {
        return -1;
      }
      if (a.category > b.category) {
        return 1;
      }
      return 0;
    });
    return inventory;
  }
  if (sortValue == 'QTY') {
    inventory.sort(function (a, b) {
      if (a.combined_QTY > b.combined_QTY) {
        return -1;
      }
      if (a.combined_QTY < b.combined_QTY) {
        return 1;
      }
      return 0;
    });
  }
  return inventory;
}
