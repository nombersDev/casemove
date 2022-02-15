const Store = require('electron-store');
const { safeStorage } = require('electron');
const axios = require('axios');
// import {Store} from 'electron-store'
// import { safeStorage } from 'electron';
// import { Axios } from 'axios';

import { DOMParser } from 'xmldom'
async function getURL(steamID) {
    return new Promise((resolve,) => {
        axios
        .get(`http://steamcommunity.com/profiles/${steamID}/?xml=1`)
        .then(function(response) {
        const parser = new DOMParser;
        resolve(parser.parseFromString(response.data,"text/xml").getElementsByTagName("profile")[0].getElementsByTagName("avatarMedium")[0].childNodes[0].nodeValue
		)
	    })
    }).catch(error => console.log(error.message));
}
// Define store
const store = new Store({
  name: 'casemoveEnc',
  watch: true,
  encryptionKey: 'this_only_obfuscates',
});

// Store user data
async function storeUserAccount(
  username,
  displayName,
  password,
  steamID,
  secretKey = null
) {

  // Get the profile picture
  let imageURL = undefined as any
  try {
    imageURL = await getURL(steamID)
  } catch(error) {
    console.log(error)
  }

  // Encrypt sensitive data
  const dictToWrite = {
    password: password,
    secretKey: secretKey,
  };
  const buffer = safeStorage.encryptString(JSON.stringify(dictToWrite));

  // Get account details
  let accountDetails = store.get('account')
  if (accountDetails == undefined) {
    accountDetails = {}
  }

  // Add to account details
  accountDetails[username] = {
    displayName: displayName,
    imageURL: imageURL,
    safeData: buffer.toString('latin1')
  }

  // Set store
  store.set({
    account: accountDetails
  })
}

// Delete user data
async function deleteUserData(username) {
  let statusCode = 0

  // Get account details
  let accountDetails = store.get('account')
  if (typeof accountDetails === 'object' && Object.keys(accountDetails).includes(username)) {
    delete accountDetails[username]

    store.set('account', accountDetails)
    statusCode = 1
  }
  return statusCode
}

// Get login details
async function getLoginDetails(username) {
  const secretData = safeStorage.decryptString(
    Buffer.from(store.get('account.' + username + '.safeData'), 'latin1')
  );
  return JSON.parse(secretData);
}

// Get all account details
async function getAllAccountDetails() {
  return store.get('account')
}

module.exports = {
  storeUserAccount,
  getLoginDetails,
  store,
  getAllAccountDetails,
  deleteUserData
};
export { storeUserAccount, getLoginDetails, store, getAllAccountDetails, deleteUserData };
