export const setFastMove = (valueToSet) => {
    return {
        type: 'SETTINGS_SET_FASTMOVE',
        payload: valueToSet
    }
}
export const setCurrencyValue = (valueToSet) => {
  return {
      type: 'SETTINGS_SET_CURRENCY',
      payload: valueToSet
  }
}
export const setLocale = (valueToSet) => {
  return {
      type: 'SETTINGS_SET_LOCALE',
      payload: valueToSet
  }
}
export const setSourceValue = (valueToSet) => {
  return {
      type: 'SETTINGS_SET_SOURCE',
      payload: valueToSet
  }
}
export const setCurrencyRate = (currency, rate) => {
  return {
      type: 'SETTINGS_ADD_CURRENCYPRICE',
      payload: {
        currency: currency,
        rate: rate
      }
  }
}
export const setOS = (os) => {
  return {
      type: 'SETTINGS_SET_OS',
      payload: os
  }
}
export const setDarkMode = (darkmode) => {
  return {
      type: 'SETTINGS_SET_DARKMODE',
      payload: darkmode
  }
}