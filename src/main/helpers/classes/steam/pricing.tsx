import { getValue, setValue } from './settings';

const axios = require('axios');
require('dotenv').config();
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const pricingEmitter = new MyEmitter();

// Get latest prices, if fail use backup

async function getPricesBackup(cas) {
  const pricesBackup = require('./backup/prices.json');
  cas.setPricing(pricesBackup);
}
async function getPrices(cas) {
  const url = 'https://prices.csgotrader.app/latest/prices_v6.json';
  axios
    .get(url)
    .then(function (response) {
      console.log(
        'prices, response',
        typeof response === 'object',
        response !== null
      );
      if (typeof response === 'object' && response !== null) {
        cas.setPricing(response.data, 'normal');
      } else {
        getPricesBackup(cas);
      }
    })
    .catch(function (error) {
      console.log('Error prices', error);
      getPricesBackup(cas);
    });
}

const dopplers = {
  418: 'Phase 1',
  419: 'Phase 2',
  420: 'Phase 3',
  421: 'Phase 4',
  415: 'Ruby',
  416: 'Sapphire',
  417: 'Black Pearl',
  569: 'Phase 1',
  570: 'Phase 2',
  571: 'Phase 3',
  572: 'Phase 4',
  568: 'Emerald',
  618: 'Phase 2',
  619: 'Sapphire',
  617: 'Black Pearl',
  852: 'Phase 1',
  853: 'Phase 2',
  854: 'Phase 3',
  855: 'Phase 4',
  1119: 'Emerald',
  1120: 'Phase 1',
  1121: 'Phase 2',
  1122: 'Phase 3',
  1123: 'Phase 4',
};

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
        setValue('pricing.currency', currencyCodes[steamUser.wallet.currency]);
      }
    });
  }
  async setPricing(pricingData, commandFrom) {
    console.log('pricingSet', commandFrom);
    this.prices = pricingData;
  }
  async makeSinglerequest(itemRow) { 
    let itemNamePricing = itemRow.item_name.replaceAll(
      '(Holo/Foil)',
      '(Holo-Foil)'
    ); 
    if (itemRow.item_wear_name !== undefined) {
      itemNamePricing = itemRow.item_name + ' (' + itemRow.item_wear_name + ')';
      if (!this.prices[itemNamePricing] && this.prices[itemRow.item_name]) {
        itemNamePricing = itemRow.item_name;
      }
    }

    if (this.prices[itemNamePricing] !== undefined) {

      const phaseName = dopplers[itemRow.item_paint_index];

      let buffPrice = this.prices[itemNamePricing]?.buff163.starting_at?.price;

      if (phaseName) {
        buffPrice = this.prices[itemNamePricing]?.buff163.starting_at?.doppler[phaseName]; 
      }
      
      let pricingDict = {
        buff163: buffPrice,
        steam_listing: this.prices[itemNamePricing]?.steam?.last_90d,
        skinport: this.prices[itemNamePricing]?.skinport?.starting_at,
        bitskins: this.prices[itemNamePricing]?.bitskins?.price,
      };
      if (this.prices[itemNamePricing]?.steam?.last_30d) {
        pricingDict.steam_listing =
          this.prices[itemNamePricing]?.steam?.last_30d;
      }
      if (this.prices[itemNamePricing]?.steam?.last_7d) {
        pricingDict.steam_listing =
          this.prices[itemNamePricing]?.steam?.last_7d;
      }

      if (this.prices[itemNamePricing]?.steam?.last_24h) {
        pricingDict.steam_listing =
          this.prices[itemNamePricing]?.steam?.last_24h;
      }
      if (
        this.prices[itemNamePricing]?.steam?.last_7d == 0 &&
        this.prices[itemNamePricing]?.buff163.starting_at?.price > 2000
      ) {
        pricingDict.steam_listing = this.prices[itemNamePricing]?.buff163.starting_at?.price * 0.8;
      }
      itemRow['pricing'] = pricingDict;
      return itemRow;
    } else {
      let pricingDict = {
        buff163: 0,
        steam_listing: 0,
        skinport: 0,
        bitskins: 0,
      };
      itemRow['pricing'] = pricingDict;
      return itemRow;
    }
  }
  async handleItem(itemRow) {
    let returnRows = [] as any;
    itemRow.forEach((element) => {
      if (element.item_name !== undefined && element.item_moveable == true) {
        this.makeSinglerequest(element).then((returnValue) => {
          returnRows.push(returnValue);
        });
      }
    });
    pricingEmitter.emit('result', itemRow);
  }

  async handleTradeUp(itemRow) {
    let returnRows = [] as any;
    itemRow.forEach((element) => {
      this.makeSinglerequest(element).then((returnValue) => {
        returnRows.push(returnValue);
      });
    });
    pricingEmitter.emit('result', itemRow);
  }
}
module.exports = {
  runItems,
  pricingEmitter,
  currencyCodes,
};
export { runItems, pricingEmitter, currencyCodes };
