const CC = require('currency-converter-lt');

async function setBackUp(currencyClass) {
  let rates = require('./backup/currency.json')
  currencyClass.setRates(rates.rates)
}

async function getLiveRates(currencyClass) {
  console.log('here')
    let currencyConverter = new CC({isDecimalComma:true});
    currencyConverter.from('USD').to('DKK').amount(100).convert().then((response) => {
      if (!response.toString().includes('.')) {
        currencyConverter = new CC();
      }
      currencyClass.setCurrencyClass(currencyConverter)
    }).catch(_error => {
       console.log('Error initilizing')
    } )
    console.log('here 2')
}

class currency {
  rates = {};
  currencyConverter

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
      if (this.currencyConverter == undefined) {
        resolve(this.rates[exchangeTo])
      }
      this.currencyConverter.from('USD').to(exchangeTo).amount(100).convert().then((response) => {
        resolve(response / 100)
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

