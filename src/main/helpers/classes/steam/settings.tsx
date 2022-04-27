const Store = require('electron-store');
const { safeStorage } = require('electron');
const axios = require('axios');
// import {Store} from 'electron-store'
// import { safeStorage } from 'electron';
// import { Axios } from 'axios';

import { DOMParser } from 'xmldom';
async function getURL(steamID) {
  return new Promise((resolve) => {
    axios
      .get(`http://steamcommunity.com/profiles/${steamID}/?xml=1`)
      .then(function (response) {
        const parser = new DOMParser();
        resolve(
          parser
            .parseFromString(response.data, 'text/xml')
            .getElementsByTagName('profile')[0]
            .getElementsByTagName('avatarMedium')[0]?.childNodes[0]?.nodeValue
        );
      });
  }).catch((error) => console.log(error.message));
}
// Define store
const store = new Store({
  name: 'casemoveEnc',
  watch: true,
  encryptionKey: 'this_only_obfuscates',
});

// Store user data
async function storeLoginKey(username, loginKey = null) {
  // Get account details
  let accountDetails = store.get('account');
  if (accountDetails == undefined) {
    accountDetails = {};
  }
  if (accountDetails[username] == undefined) {
    accountDetails[username] = {};
  }

  if (loginKey) {
    // Encrypt sensitive data
    const buffer = safeStorage.encryptString(loginKey);

    // Add to account details
    accountDetails[username]['safeLoginKey'] = buffer.toString('latin1')
  } else {
    if (accountDetails[username]['safeLoginKey']) {
      delete accountDetails[username]['safeLoginKey']
    }
  }

  // Set store
  console.log('saving loginkey')
  store.set({
    account: accountDetails,
  });
}

// Store user data
async function storeUserAccount(
  username,
  displayName,
  password,
  steamID,
  secretKey = null
) {
  // Get the profile picture
  let imageURL = undefined as any;
  try {
    imageURL = await getURL(steamID);
  } catch (error) {
    console.log(error);
  }




  // Get account details
  let accountDetails = store.get('account');
  if (accountDetails == undefined) {
    accountDetails = {};
  }

  if (accountDetails[username] == undefined) {
    accountDetails[username] = {};
  }

  // Add to account details
  accountDetails[username]['displayName'] = displayName;
  accountDetails[username]['imageURL'] = imageURL;
  // Encrypt sensitive data
  if (password) {
    const dictToWrite = {
      password: password,
      secretKey: secretKey,
    };
    const buffer = safeStorage.encryptString(JSON.stringify(dictToWrite));
    accountDetails[username]['safeData'] = buffer.toString('latin1');
  }

  // Set store
  console.log('Saving regular')
  store.set({
    account: accountDetails,
  });
}

async function setAccountPosition(username, newPosition) {
  let accountDetails = store.get('account');
  if (accountDetails == undefined) {
    accountDetails = {};
  }

  // Add to account details
  accountDetails[username]['position'] = newPosition;

  // Set store
  store.set({
    account: accountDetails,
  });
}

// Delete user data
async function deleteUserData(username) {
  let statusCode = 0;

  // Get account details
  let accountDetails = store.get('account');
  if (
    typeof accountDetails === 'object' &&
    Object.keys(accountDetails).includes(username)
  ) {
    delete accountDetails[username];

    store.set('account', accountDetails);
    statusCode = 1;
  }
  return statusCode;
}

// Get login details
async function getLoginDetails(username) {
  const secretData = safeStorage.decryptString(
    Buffer.from(store.get('account.' + username + '.safeData'), 'latin1')
  );
  return JSON.parse(secretData);
}
// Get login details
async function getSafeKey(username) {
  const secretData = safeStorage.decryptString(
    Buffer.from(store.get('account.' + username + '.safeLoginKey'), 'latin1')
  );
  return secretData;
}
// Get all account details
async function getAllAccountDetails() {
  return store.get('account');
}

async function setValue(stringToSet, valueToSet) {
  store.set(stringToSet, valueToSet);
}

async function getValue(stringToGet) {
  return store.get(stringToGet);
}

module.exports = {
  storeUserAccount,
  getLoginDetails,
  getAllAccountDetails,
  deleteUserData,
  setAccountPosition,
  storeLoginKey,
  getSafeKey,
  setValue,
  getValue,
};
export {
  storeUserAccount,
  getLoginDetails,
  getAllAccountDetails,
  deleteUserData,
  setAccountPosition,
  getSafeKey,
  storeLoginKey,
  setValue,
  getValue,
};
