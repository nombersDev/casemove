import { useState } from "react";
import { Link } from "react-router-dom";
import { classNames } from "../../shared/filters/inventoryFunctions";

export function RowStickersPatches({itemRow, settingsData}) { 
    const [stickerHover, setStickerHover] = useState('');
    
    return (
        <>
          
          {settingsData.columns.includes('Stickers/patches') ?
        <td className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
            <div className="flex flex-shrink-0 -space-x-1">
              {itemRow.stickers?.map((sticker, index) => (
                <Link
                  to={{
                    pathname: `https://steamcommunity.com/market/listings/730/${sticker.sticker_type} | ${sticker.sticker_name}`,
                  }}
                  target="_blank"
                >
                  <img
                    key={index}
                    onMouseEnter={() =>
                      setStickerHover(index + itemRow.item_id)
                    }
                    onMouseLeave={() => setStickerHover('')}
                    className={classNames(
                      stickerHover == index + itemRow.item_id
                        ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                        : '',
                      'max-w-none h-8 w-8 rounded-full hover:shadow-sm text-black hover:bg-gray-50 transition duration-500 ease-in-out hover:text-white hover:bg-green-600 ring-2 object-cover ring-transparent bg-gradient-to-t from-gray-100 to-gray-300 dark:from-gray-300 dark:to-gray-400'
                    )}
                    src={
                      'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                      sticker.sticker_url +
                      '.png'
                    }
                    alt={sticker.sticker_name}
                    title={sticker.sticker_name}
                  />
                </Link>
              ))}
            </div>
          </div>
        </td> : '' }
            
        </>
      );
}