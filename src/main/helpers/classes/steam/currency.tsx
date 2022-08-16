const CC = require('currency-converter-lt');

async function setBackUp(currencyClass) {
  let rates = require('./backup/currency.json')
  currencyClass.setRates(rates.rates)
}

async function getLiveRates(currencyClass) {
  console.log('here')
    let currencyConverter = new CC({isDecimalComma:true});
    currencyConverter.from('USD').to('EUR').amount(100).convert().then((response) => {
      console.log(response)

      let secondConverter = new CC();
      secondConverter.from('USD').to('EUR').amount(100).convert().then((secondResponse) => {
        if (response < secondResponse) {
          currencyClass.setCurrencyClass(currencyConverter)
        } else {
          currencyClass.setCurrencyClass(secondConverter)
        }
      })
    }).catch(_error => {
       console.log('Error initilizing')
    } )
    console.log('here 2')
}

class currency {
  rates = {};
  currencyConverter
  seenRates = {}

  constructor() {
    setBackUp(this)
    getLiveRates(this)
  }

  // Setup backup
  setRates(rates) {
    this.rates = rates
  }

  // Setup for live rates
  setCurrencyClass(converter) {
    this.currencyConverter = converter
  }


  getRate(exchangeTo) {
    return new Promise((resolve) => {
      if (this.seenRates[exchangeTo] != undefined) {
        resolve(this.seenRates[exchangeTo])
      }
      if (this.currencyConverter == undefined) {
        resolve(this.rates[exchangeTo])
      }
      this.currencyConverter.from('USD').to(exchangeTo).amount(100).convert().then((response) => {
        let rate = response / 100
        if (typeof rate === 'number' && !Number.isNaN(rate)) {
          this.seenRates[exchangeTo] = rate
          resolve(rate)
        } else {
          resolve(this.rates[exchangeTo])
        }
      }).catch(error => {
        console.log('error occurred', error)
        resolve(this.rates[exchangeTo])
      })
    });
  }
}

// const currencyClass = new currency()

// sleep time expects milliseconds
//function sleep (time) {
//  return new Promise((resolve) => setTimeout(resolve, time));
//}

// Usage!
//sleep(5000).then(() => {
//    currencyClass.getRate('EUR').then((returnValue) => {
//      console.log(returnValue)
//    })
//});


module.exports = {
  currency
};
export { currency };

