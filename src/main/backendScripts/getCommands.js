var axios = require('axios');
var items = require('./index');

// RUN PROGRAMS
class fetchItems {
  itemsClass = items;
  constructor() {
    this.itemsClass = new items();
  }

  async convertInventory(inventory) {
    const responseFiltered = this.itemsClass.inventoryConverter(
      inventory,
      false
    );
    return responseFiltered;
  }
  async convertStorageData(inventory) {
    const responseFiltered = this.itemsClass.inventoryConverter(
      inventory,
      true
    );
    return responseFiltered;
  }
}
module.exports = {
  fetchItems,
};
