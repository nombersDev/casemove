import { getValue, setValue } from "./settings";

const axios = require('axios');
require('dotenv').config();
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const pricingEmitter = new MyEmitter();
async function getPrices(cas) {
  const url = 'https://prices.csgotrader.app/latest/prices_v6.json';
  axios.get(url).then(function (response) {
    cas.setPricing(response.data);
  });
}

let currencyCodes = {
  1: 'USD',
  2: 'GBP',
  3: 'EUR',
  4: 'CHF',
  5: 'RUB',
  6: 'PLN',
  7: 'BRL',
  8: 'JPY',
  9: 'NOK',
  10: 'IDR',
  11: 'MYR',
  12: 'PHP',
  13: 'SGD',
  14: 'THB',
  15: 'VND',
  16: 'KRW',
  17: 'TRY',
  18: 'UAH',
  19: 'MXN',
  20: 'CAD',
  21: 'AUD',
  22: 'NZD',
  23: 'CNY',
  24: 'INR',
  25: 'CLP',
  26: 'PEN',
  27: 'COP',
  28: 'ZAR',
  29: 'HKD',
  30: 'TWD',
  31: 'SAR',
  32: 'AED',
  33: 'SEK',
  34: 'ARS',
  35: 'ILS',
  36: 'BYN',
  37: 'KZT',
  38: 'KWD',
  39: 'QAR',
  40: 'CRC',
  41: 'UYU',
  42: 'BGN',
  43: 'HRK',
  44: 'CZK',
  45: 'DKK',
  46: 'HUF',
  47: 'RON',
};

// import { DOMParser } from 'xmldom'
// RUN PROGRAMS
class runItems {
  steamUser;
  seenItems;
  packageToSend;
  header;
  currency;
  headers;
  prices;

  constructor(steamUser) {
    this.steamUser = steamUser;
    this.seenItems = {};
    this.packageToSend = {};
    getPrices(this);
    getValue('pricing.currency').then((returnValue) => {
      if (returnValue == undefined) {
        setValue('pricing.currency', currencyCodes[steamUser.wallet.currency])
      }
    })


  }
  async setPricing(pricingData) {
    this.prices = pricingData;
  }
  async makeSinglerequest(itemRow) {
    let itemNamePricing = itemRow.item_name;
    if (itemRow.item_wear_name !== undefined) {
      itemNamePricing = itemRow.item_name + ' (' + itemRow.item_wear_name + ')';
    }

    if (this.prices[itemNamePricing] !== undefined) {
      let pricingDict = {
        buff163: this.prices[itemNamePricing]?.buff163.starting_at?.price,
        steam_listing: this.prices[itemNamePricing]?.steam?.last_7d,
        skinport: this.prices[itemNamePricing]?.skinport?.starting_at,
        bitskins: this.prices[itemNamePricing]?.bitskins?.price,
      };

      pricingEmitter.emit('result', pricingDict, itemRow);
    }
  }
  async handleItem(itemRow) {
    if (itemRow.item_name !== undefined && itemRow.item_moveable == true) {
      this.makeSinglerequest(itemRow);
    }
  }
}
module.exports = {
  runItems,
  pricingEmitter,
};
export { runItems, pricingEmitter };
