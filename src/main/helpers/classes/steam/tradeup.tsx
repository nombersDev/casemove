async function setCollections(currencyClass) {
  let collections = require('./backup/collections.json');

  const directory = {};
  for (const [key, value] of Object.entries(collections)) {
    // @ts-ignore
    const keys = Object.keys(value);
    keys.forEach((element) => {
      directory[element] = key;
    });
  }
  currencyClass.setCollections(collections, directory);
}

class tradeUps {
  collections = {};
  seenRates = {};
  directory = {};
  rarityLevels = {
    'Factory New': 0.07,
    'Minimal Wear': 0.15,
    'Field-Tested': 0.38,
    'Well-Worn': 0.45,
    'Battle-Scarred': 1,
  };

  constructor() {
    setCollections(this);
  }

  // Setup backup
  setCollections(converter, dir) {
    this.collections = converter;
    this.directory = dir;
  }

  // Get rarity
  getRarity(min_wear, max_wear, averageFloat) {
    let c = (max_wear - min_wear) * averageFloat
    for (const [key, value] of Object.entries(this.rarityLevels)) {
      // @ts-ignore
      let chance = (value - min_wear) / (max_wear - min_wear);
      if (chance > averageFloat) {
        return [key, c + parseFloat(min_wear)];
      }
    }
    return ['Battle-Scarred', c + parseFloat(min_wear)];
  }

  // Get possible outcomes
  getPossible(collection, quality) {
    let i = 1;
    while (true) {
      let listOfPossibilites = [];
      for (const [key, value] of Object.entries(this.collections[collection])) {
        // @ts-ignore
        if (value.best_quality == quality + i) {
          // @ts-ignore
          listOfPossibilites.push(key);
        }
      }

      if (listOfPossibilites.length > 0 || i + quality > 15) {
        return listOfPossibilites;
      }
      i++;
    }
  }

  getTradeUp(arrayOfItems: Array<any>) {
    return new Promise((resolve) => {
      arrayOfItems.forEach((element) => {
        let itemName = element.item_name.replace('StatTrak™ ', '')
        let collection = this.directory[itemName];
        element['tradeUpConfirmed'] = false;

        if (collection != undefined) {
          let possible =
            this.collections?.[collection][itemName]?.trade_up;
          element['tradeUpConfirmed'] = possible;
          element['collection'] = collection
        }
      });

      resolve(arrayOfItems);
    });
  }

  // Generate outcome
  getPotentitalOutcome(arrayOfItems) {
    return new Promise((resolve) => {
      // if (arrayOfItems.length != 10) {
      //   resolve(false);
      // }
      let finalResult = [];
      let average = 0;
      let possibleSkins = [];
      let seenSkins = [];
      let isStattrak = false;
      // Check if stattrak
      if (arrayOfItems[0].item_name.includes('StatTrak™')) {
        isStattrak = true;
      }

      arrayOfItems.forEach((element) => {
        if (isStattrak) {
          element.item_name = element.item_name.replace('StatTrak™ ', '');
        }
        let collection = this.directory[element.item_name];
        let possible = this.getPossible(
          collection,
          parseInt(this.collections[collection][element.item_name].best_quality)
        );
        possible.forEach((element) => {
          if (!seenSkins.includes(element)) {
            seenSkins.push(element);
          }
        });
        possibleSkins.push(...possible);
        average += element.item_paint_wear;
      });

      average = average / arrayOfItems.length;

      seenSkins.forEach((element) => {
        let relevantObject = this.collections[this.directory[element]][element];
        let skinRarity = this.getRarity(
          relevantObject['min-wear'],
          relevantObject['max-wear'],
          average
        );
        let floatChance = skinRarity[1]
        // @ts-ignore
        skinRarity = skinRarity[0]
        // @ts-ignore
        let percentageChance =
          100 /
          (possibleSkins.length /
            possibleSkins.filter(function (item) {
              return item == element;
            }).length);

        let item_name = element as any;
        if (isStattrak) {
          item_name = 'StatTrak™ ' + item_name;
        }
        let objectToWrite = {
          item_name: item_name,
          item_wear_name: skinRarity,
          percentage: percentageChance.toFixed(2),
          image: relevantObject['imageURL'],
          float_chance: floatChance
        };
        // @ts-ignore
        finalResult.push(objectToWrite);
      });

      resolve(finalResult);
    });
  }
}

module.exports = {
  tradeUps,
};
export { tradeUps };
