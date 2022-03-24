async function setCollections(currencyClass) {
  let collections = require('./backup/collections.json')

  const directory = {}
  for (const [key, value] of Object.entries(collections)) {
    // @ts-ignore
    const keys = Object.keys(value)
    keys.forEach(element => {
        directory[element] = key
    });
  }
  currencyClass.setCollections(collections, directory)
}

class tradeUps {
  collections = {};
  seenRates = {}
  directory = {}
  rarityLevels = {
      "Factory New": 0.07,
      "Minimal Wear": 0.15,
      "Field-Tested": 0.38,
      "Well-Worn": 0.45,
      "Battle-Scarred": 1
  }



  constructor() {
    setCollections(this)
  }

  // Setup backup
  setCollections(converter, dir) {
    this.collections = converter
    this.directory = dir
  }

  // Get rarity
  getRarity(min_wear, max_wear, averageFloat) {
    for (const [key, value] of Object.entries(this.rarityLevels)) {
        // @ts-ignore
        let chance = (value - min_wear) / (max_wear - min_wear)
        if (chance > averageFloat) {
            return key
        }
    }
    return "Battle-Scarred"
  }

  // Get possible outcomes
  getPossible(collection, quality) {
    let i = 1
    while (true) {
        let listOfPossibilites = []
        for (const [key, value] of Object.entries(this.collections[collection])) {
            // @ts-ignore
            if (value.best_quality == quality + i) {
                // @ts-ignore
                listOfPossibilites.push(key)
            }
        }

        if (listOfPossibilites.length > 0  ||  i + quality > 15) {
            return listOfPossibilites
        }
        i ++
    }
  }


  // Generate outcome
  getPotentitalOutcome(arrayOfItems) {
    return new Promise((resolve) => {
       if (arrayOfItems.length != 10) {
           resolve(false)
       }
       let finalResult = []
       let average = 0
       let possibleSkins = []
       let seenSkins = []

       arrayOfItems.forEach(element => {
           let collection = this.directory[element.item_name]
           let possible = this.getPossible(collection, parseInt(this.collections[collection][element.item_name].best_quality))
           possible.forEach(element => {
               if (!seenSkins.includes(element)) {
                   seenSkins.push(element)
               }
           });
           possibleSkins.push(...possible)
           average += element.item_paint_wear
       });


       average = average / 10

       seenSkins.forEach(element => {
           let relevantObject = this.collections[this.directory[element]][element]
           let skinRarity = this.getRarity(relevantObject['min-wear'], relevantObject['max-wear'], average)
           // @ts-ignore
           let percentageChance = 100 / (possibleSkins.length / possibleSkins.filter(function(item){ return item == element; }).length)
           let objectToWrite = {
            "item_name": element,
            "item_wear_name": skinRarity,
            "percentage": percentageChance.toFixed(2),
            "image": relevantObject['imageURL']
        }
           // @ts-ignore
           finalResult.push(objectToWrite)

       });

       resolve(finalResult)




      });

  }

}




module.exports = {
    tradeUps
  };
  export { tradeUps };

