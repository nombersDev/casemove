import { Overview } from "renderer/interfaces/states"
import { CurrencyReturnValue } from "shared/Interfaces.tsx/IPCReturn"

export const setFastMove = (valueToSet) => {
    return {
        type: 'SETTINGS_SET_FASTMOVE',
        payload: valueToSet
    }
}
export const setColumns = (valueToSet) => {
  return {
      type: 'SETTINGS_SET_COLUMNS',
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
export const setCurrencyRate = (returnPackage: CurrencyReturnValue) => {
  return {
      type: 'SETTINGS_ADD_CURRENCYPRICE',
      payload: {
        currency: returnPackage.currency,
        rate: returnPackage.rate
      }
  }
}
export const setOS = (os) => {
  return {
      type: 'SETTINGS_SET_OS',
      payload: os
  }
}
export const setSteamLoginShow = (loginShow) => {
  return {
      type: 'SETTINGS_SET_STEAMLOGINSHOW',
      payload: loginShow
  }
}
export const setDevmode = (devmode) => {
  return {
      type: 'SETTINGS_SET_DEVMODE',
      payload: devmode
  }
}
export const setOverview = (newObject: Overview) => {
  return {
      type: 'SETTINGS_SET_OVERVIEW',
      payload: newObject
  }
}