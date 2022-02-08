const fs = require('fs');
const VDF = require('@node-steam/vdf');
const axios = require('axios');

const itemsLink =
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/scripts/items/items_game.txt';
const translationsLink =
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/resource/csgo_english.txt';

function fileCatcher(endNote) {
  return `${csgo_install_directory}${endNote}`;
}

async function getTranslations(items) {
  const returnValue = await axios.get(translationsLink).then((response) => {
    const finalDict = {};
    const data = response.data;
    var ks = data.split(/\n/);
    ks.forEach(function (value) {
      // Iterate hits
      var test = value.match(/"(.*?)"/g);
      if (test && test[1]) {

        finalDict[test[0].replaceAll('"', '').toLowerCase()] = test[1];
      }
    });
    return finalDict;
  });

  items.setTranslations(returnValue);
}

function updateItemsLoop(jsonData, keyToRun) {
  const returnDict = {}
  for (const [key, value] of Object.entries(jsonData['items_game'])) {
      if (key == keyToRun) {
          for (const [subKey, subValue] of Object.entries(value)) {
              returnDict[subKey] = subValue
          }
      }
  }
  return returnDict
}

async function updateItems(items) {
  const returnValue = await axios.get(itemsLink).then((response) => {
    const dict_to_write = {
      items: {},
      paint_kits: {},
      prefabs: {},
      sticker_kits: {},
    };
    const data = response.data;
    const jsonData = VDF.parse(data);
    dict_to_write['items'] = updateItemsLoop(jsonData, 'items');
    dict_to_write['paint_kits'] = updateItemsLoop(jsonData, 'paint_kits');
    dict_to_write['prefabs'] = updateItemsLoop(jsonData, 'prefabs');
    dict_to_write['sticker_kits'] = updateItemsLoop(jsonData, 'sticker_kits');
    dict_to_write['music_kits'] = updateItemsLoop(jsonData, 'music_definitions');
    dict_to_write['graffiti_tints'] = updateItemsLoop(jsonData, 'graffiti_tints');

    return dict_to_write;
  });
  items.setCSGOItems(returnValue);
}

class items {
  translation = {};
  csgoItems = {};
  constructor() {
    getTranslations(this);
    updateItems(this);
  }

  setCSGOItems(value) {
    this.csgoItems = value;
  }
  setTranslations(value) {
    this.translation = value;
  }

  handleError(callback, args) {
    try {
      return callback.apply(this, args);
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  inventoryConverter(inventoryResult, isCasket = false) {
    var returnList = [];

    for (const [key, value] of Object.entries(inventoryResult)) {
      if (value['def_index'] == undefined) {
        continue
      }
      let musicIndexBytes = getAttributeValueBytes(value, 166);
      if (musicIndexBytes) {
        value.music_index = musicIndexBytes.readUInt32LE(0);
      }
      let graffitiTint = getAttributeValueBytes(value, 233);
      if (graffitiTint) {
        value.graffiti_tint = graffitiTint.readUInt32LE(0);
      }
      if (
        (value['casket_id'] !== undefined && isCasket == false) ||
        ['17293822569110896676', '17293822569102708641'].includes(value['id'])
      ) {
        continue;
      }

      const returnDict = {};
      // URL
      const imageURL = this.handleError(this.itemProcessorImageUrl, [value]);
      // Check names
      returnDict['item_name'] = this.handleError(this.itemProcessorName, [
        value,
        imageURL,
      ]);
      if (returnDict['item_name'] == '') {
        console.log('Error');
        try {
          console.log(value, this.get_def_index(value['def_index']));
        }
        catch (err) {
          console.log(value)
        }
      }
      returnDict['item_customname'] = value['custom_name'];
      returnDict['item_url'] = imageURL;
      returnDict['item_id'] = value['id'];
      returnDict['position'] = 9999;
      if (value['position'] != null) {
        returnDict['position'] = value['position'];
      }

      // Check tradable after value
      if (value['tradable_after'] !== undefined) {
        const tradable_after_date = new Date(value['tradable_after']);
        const todaysDate = new Date();
        if (
          tradable_after_date >= todaysDate &&
          returnDict['item_name'].includes('Key') == false
        ) {
          returnDict['trade_unlock'] = tradable_after_date;
        }
      }

      if (value['casket_contained_item_count'] !== undefined) {
        returnDict['item_storage_total'] = value['casket_contained_item_count'];
      }

      // Check paint_wear value
      if (value['paint_wear'] !== undefined) {
        returnDict['item_wear_name'] = this.handleError(getSkinWearName, [
          value['paint_wear'],
        ]);
        returnDict['item_paint_wear'] = value['paint_wear'];
      }

      // Trade restrictions (maybe?)
      returnDict['item_origin'] = value['origin'];

      returnDict['item_moveable'] = this.handleError(
        this.itemProcessorCanBeMoved,
        [returnDict, value]
      );

      returnDict['item_has_stickers'] = this.handleError(
        this.itemProcessorHasStickersApplied,
        [returnDict, value]
      );
      returnDict['def_index'] = value['def_index']

      if (returnDict['item_has_stickers']) {
        const stickerList = [];
        for (const [stickersKey, stickersValue] of Object.entries(
          value['stickers']
        )) {
          stickerList.push(
            this.handleError(this.stickersProcessData, [stickersValue])


          );
        }
        returnDict['stickers'] = stickerList;
      } else {
        returnDict['stickers'] = [];
      }
      returnList.push(returnDict);
    }
    return returnList;
  }

  itemProcessorHasStickersApplied(returnDict, storageRow) {
    if (returnDict['item_url'].includes('econ/characters') || returnDict['item_url'].includes('econ/default_generated') || returnDict['item_url'].includes('weapons/base_weapons')) {
      if (storageRow['stickers'] !== undefined) {
        return true;
      }
    }
    return false
  }

  itemProcessorName(storageRow, imageURL) {
    const defIndexresult = this.get_def_index(storageRow['def_index']);

    // Music kit check
    if (storageRow['music_index'] !== undefined) {
      const musicKitIndex = storageRow['music_index'];
      const musicKitResult = this.getMusicKits(musicKitIndex);
      return this.getTranslation(musicKitResult['loc_name']);
    }



    // Main checks
    // Get first string

    if (defIndexresult['item_name'] !== undefined) {
      var baseOne = this.getTranslation(defIndexresult['item_name']);
    } else if (defIndexresult['prefab'] !== undefined) {
      const baseSkinName = this.getPrefab(defIndexresult['prefab'])[
        'item_name'
      ];
      var baseOne = this.getTranslation(baseSkinName);
    }

    // Get second string
    if (
      storageRow['stickers'] !== undefined &&
      imageURL.includes('econ/characters/') == false
    ) {
      var relevantStickerData = storageRow['stickers'][0];
      if (
        relevantStickerData['slot'] == 0 &&
        baseOne.includes('Coin') == false
      ) {
        var stickerDefIndex = this.getStickerDetails(
          relevantStickerData['sticker_id']
        );
        var baseTwo = this.getTranslation(stickerDefIndex['item_name']);
      }
    }
    if (storageRow['paint_index'] !== undefined) {
      var skinPatternName = this.getPaintDetails(storageRow['paint_index']);
      var baseTwo = this.getTranslation(skinPatternName['description_tag']);
    }

    // Get third string (wear name)
    if (storageRow['paint_wear'] !== undefined) {
      var baseThree = getSkinWearName(storageRow['paint_wear']);
    }

    if (baseOne) {
      var finalName = baseOne;
      if (baseTwo) {
        var finalName = `${baseOne} | ${baseTwo}`;
        if (baseThree) {
          var finalName = `${baseOne} | ${baseTwo}`;
        }
      }
    }

    if (storageRow['attribute'] !== undefined) {
      for (const [, value] of Object.entries(storageRow['attribute'])) {
        if (
          value['def_index'] == 140 &&
          finalName.includes('Souvenir') == false
        ) {
          var finalName = 'Souvenir ' + finalName;
        }
      }
      for (const [, value] of Object.entries(storageRow['attribute'])) {
        if (
          value['def_index'] == 80 &&
          finalName.includes('StatTrak™') == false
        ) {
          var finalName = 'StatTrak™ ' + finalName;
        }
      }
    }
    // Graffiti kit check
    if (storageRow['graffiti_tint'] !== undefined) {
      const graffitiKitIndex = storageRow['graffiti_tint'];
      const graffitiKitResult = capitalizeWords(this.getGraffitiKitName(graffitiKitIndex).replace('_', ' '));
      var finalName =  finalName + ' (' + graffitiKitResult + ')';
    }

    return finalName;
  }

  itemProcessorImageUrl(storageRow) {
    const defIndexresult = this.get_def_index(storageRow['def_index']);

    // Music kit check
    if (storageRow['music_index'] !== undefined) {
      const musicKitIndex = storageRow['music_index'];
      const localMusicKits = this.getMusicKits(musicKitIndex);
      return localMusicKits['image_inventory'];
    }

    // Rest of check

    // Check if it should use the full image_inventory
    if (defIndexresult['image_inventory'] !== undefined) {
      var imageInventory = defIndexresult['image_inventory'];
    }

    // Get second string
    if (storageRow['stickers'] !== undefined && imageInventory == undefined) {
      var relevantStickerData = storageRow['stickers'][0];
      if (relevantStickerData['slot'] == 0) {
        var stickerDefIndex = this.getStickerDetails(
          relevantStickerData['sticker_id']
        );
        if (stickerDefIndex['patch_material'] !== undefined) {
          var imageInventory = `econ/patches/${stickerDefIndex['patch_material']}`;
        } else if (stickerDefIndex['sticker_material'] !== undefined) {
          var imageInventory = `econ/stickers/${stickerDefIndex['sticker_material']}`;
        }
      }
    }
    // Weapons and knifes
    if (storageRow['paint_index'] !== undefined) {
      var skinPatternName = this.getPaintDetails(storageRow['paint_index']);
      var imageInventory = `econ/default_generated/${defIndexresult['name']}_${skinPatternName['name']}_light_large`;
    } else if (defIndexresult['baseitem'] == 1) {
      var imageInventory = `econ/weapons/base_weapons/${defIndexresult['name']}`;
    }

    return imageInventory;
  }
  itemProcessorCanBeMoved(returnDict, storageRow) {
    const defIndexresult = this.get_def_index(storageRow['def_index']);

    if (defIndexresult['prefab'] !== undefined) {
      if (defIndexresult['prefab'] == 'collectible_untradable') {
        return false;
      }
    }
    if (defIndexresult['item_name'] !== undefined) {
      if (
        returnDict['item_url'].includes('econ/status_icons/') &&
        returnDict['item_origin'] == 0
      ) {
        return false;
      }
      if (returnDict['item_url'].includes('econ/status_icons/service_medal_')) {
        return false;
      }

      if (returnDict['item_url'].includes('plusstars')) {
        return false;
      }
    }

    // If characters
    if (defIndexresult['attributes'] !== undefined) {
      for (const [key, value] of Object.entries(defIndexresult['attributes'])) {
        if (key == 'cannot trade' && value == 1) {
          return false;
        }
      }
    }
    if (
      returnDict['item_url'].includes('crate_key') &&
      storageRow['flags'] == 10
    ) {
      return false;
    }
    if (returnDict['item_url'].includes('weapons/base_weapons')) {
      return false;
    }
    return true;
  }
  stickersProcessData(relevantStickerData) {
    // Get second string
    var stickerDefIndex = this.getStickerDetails(
      relevantStickerData['sticker_id']
    );
    if (stickerDefIndex['patch_material'] !== undefined) {
      var imageInventory = `econ/patches/${stickerDefIndex['patch_material']}`;
      var stickerType = 'Patch';
    } else if (stickerDefIndex['sticker_material'] !== undefined) {
      var imageInventory = `econ/stickers/${stickerDefIndex['sticker_material']}`;
      var stickerType = 'Sticker';
    }
    const stickerDict = {
      sticker_name: this.getTranslation(stickerDefIndex['item_name']),
      sticker_url: imageInventory,
      sticker_type: stickerType,
    };
    return stickerDict;
  }

  get_def_index(def_index) {
    return this.csgoItems['items'][def_index];
  }

  getTranslation(csgoString) {
    let stringFormatted = csgoString.replace('#', '').toLowerCase();

    return this.translation[stringFormatted].replaceAll('"', '');
  }
  getPrefab(prefab) {
    return this.csgoItems['prefabs'][prefab.toString()];
  }

  getPaintDetails(paintIndex) {
    return this.csgoItems['paint_kits'][paintIndex];
  }

  getMusicKits(musicIndex) {
    return this.csgoItems['music_kits'][musicIndex];
  }

  getGraffitiKitName(graffitiID) {
    for (const [key, value] of Object.entries(this.csgoItems['graffiti_tints'])) {
      if (value.id == graffitiID) {
        return key
      }
    }
  }


  getStickerDetails(stickerID) {
    return this.csgoItems['sticker_kits'][stickerID];
  }

  checkIfAttributeIsThere(item, attribDefIndex) {
    let attrib = (item.attribute || []).find(
      (attrib) => attrib.def_index == attribDefIndex
    );
    return attrib ? true : false;
  }
}

function getSkinWearName(paintWear) {
  const skinWearValues = [0.07, 0.15, 0.37, 0.44, 1];
  const skinWearNames = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
  ];

  for (const [key, value] of Object.entries(skinWearValues)) {
    if (paintWear > value) {
      continue;
    }
    return skinWearNames[key];
  }
}

function getAttributeValueBytes(item, attribDefIndex) {
  let attrib = (item.attribute || []).find(
    (attrib) => attrib.def_index == attribDefIndex
  );
  return attrib ? attrib.value_bytes : null;
}

function capitalizeWords(string) {
  return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
module.exports = items;
