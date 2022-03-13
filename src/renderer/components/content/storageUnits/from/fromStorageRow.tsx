import { LightningBoltIcon, TagIcon, XIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { moveFromAddRemove } from 'renderer/store/actions/moveFromActions';

function content({ projectRow }) {
  const [stickerHover, setStickerHover] = useState('');
  const dispatch = useDispatch();
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);

  let marketHashName = projectRow.item_name;
  if (projectRow.item_paint_wear != undefined) {
    marketHashName =
      projectRow.item_name + ' (' + projectRow.item_wear_name + ')';
  }

  async function returnField(fieldValue) {
    fieldValue = parseInt(fieldValue);
    let totalToGo = 1000 - inventory.inventory.length;
    for (const [, value] of Object.entries(fromReducer.totalToMove)) {
      let valued = value as any;
      console.log(valued);
      if (valued[0] != projectRow.item_id) {
        totalToGo -= valued[2].length;
      }
    }

    let returnValue = 0;
    let totalMax = projectRow.combined_QTY;
    if (projectRow.combined_QTY > totalToGo) {
      totalMax = totalToGo;
    }
    if (fieldValue > totalMax) {
      returnValue = totalMax;
    } else if (fieldValue < 0) {
      returnValue = 0;
    } else {
      if (isNaN(fieldValue)) {
        returnValue = 0;
      } else {
        returnValue = fieldValue;
      }
    }

    let listToReturn = [] as any;
    if (returnValue > 0) {
      listToReturn = projectRow.combined_ids.slice(0, returnValue);
    }

    dispatch(
      moveFromAddRemove(
        projectRow.storage_id,
        projectRow.item_id,
        listToReturn,
        projectRow.item_name
      )
    );
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const now = new Date();
  const isEmpty =
    fromReducer.totalToMove.filter((row) => row[0] == projectRow.item_id)
      .length == 0;
  console.log(projectRow);
  return (
    <>
      <td className="table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900 dark:text-dark-white">
        <div className="flex items-center space-x-3 lg:pl-2">
          <div
            className={classNames(
              projectRow.bgColorClass,
              'flex-shrink-0 w-2.5 h-2.5 rounded-full'
            )}
            aria-hidden="true"
          />
          <Link
            to={{
              pathname: `https://steamcommunity.com/market/listings/730/${marketHashName}`,
            }}
            target="_blank"
          >
            <div className="flex flex-shrink-0 -space-x-1">
              <img
                className="max-w-none h-11 w-11 dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300"
                src={
                  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                  projectRow.item_url +
                  '.png'
                }
              />
            </div>
          </Link>

          <span>
            <span className="flex">
              {projectRow.item_name !== '' ? (
                projectRow.item_customname !== null ? (
                  projectRow.item_customname
                ) : (
                  projectRow.item_name
                )
              ) : (
                <span>
                  <a
                    href="https://forms.gle/6qZ8N2ES8CdeavcVA"
                    target="_blank"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    An error occurred. Please report this here.
                  </a>
                  <br />
                  <button
                    className="px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(projectRow))
                    }
                  >
                    {' '}
                    COPY REF
                  </button>
                </span>
              )}
              {projectRow.item_name !== '' &&
              projectRow.item_customname !== null &&
              !projectRow.item_url.includes('casket') ? (
                <TagIcon className="h-3 w-3 ml-1" />
              ) : (
                ''
              )}
            </span>
            <span className="text-gray-500" title={projectRow.item_paint_wear}>
              {projectRow.item_customname !== null ? projectRow.item_name : ''}
              {projectRow.item_customname !== null &&
              projectRow.item_paint_wear !== undefined
                ? ' - '
                : ''}
              {projectRow.item_paint_wear !== undefined
                ? projectRow.item_wear_name
                : ''}
            </span>
          </span>
        </div>
      </td>
      <td className="table-cell px-6 py-3 text-sm text-gray-500 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 text-gray-500 dark:text-gray-400 font-normal">
            {pricesResult.prices[projectRow.item_name] == undefined ||
            projectRow.combined_QTY == 1
              ? new Intl.NumberFormat(settingsData.locale, {
                  style: 'currency',
                  currency: settingsData.currency,
                }).format(
                  pricesResult.prices[projectRow.item_name]?.[
                    settingsData?.source?.title
                  ] * settingsData.currencyPrice[settingsData.currency]
                )
              : new Intl.NumberFormat(settingsData.locale, {
                  style: 'currency',
                  currency: settingsData.currency,
                }).format(
                  Math.round(
                    projectRow.combined_QTY *
                      pricesResult.prices[projectRow.item_name]?.[
                        settingsData?.source?.title
                      ] *
                      settingsData.currencyPrice[settingsData.currency]
                  )
                )}
          </div>
        </div>
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 text-gray-500  text-xs font-normal">
            {pricesResult.prices[projectRow.item_name] == undefined
              ? ''
              : projectRow.combined_QTY == 1
              ? ''
              : new Intl.NumberFormat(settingsData.locale, {
                  style: 'currency',
                  currency: settingsData.currency,
                }).format(
                  pricesResult.prices[projectRow.item_name]?.[
                    settingsData?.source?.title
                  ] * settingsData.currencyPrice[settingsData.currency]
                )}
          </div>
        </div>
      </td>
      <td className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1">
            {projectRow.stickers?.map((sticker, index) => (
              <Link
                to={{
                  pathname: `https://steamcommunity.com/market/listings/730/${sticker.sticker_type} | ${sticker.sticker_name}`,
                }}
                target="_blank"
              >
                <img
                  key={index}
                  onMouseEnter={() =>
                    setStickerHover(index + projectRow.item_id)
                  }
                  onMouseLeave={() => setStickerHover('')}
                  className={classNames(
                    stickerHover == index + projectRow.item_id
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
      </td>
      <td className="hidden md:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 font-normal">
            {projectRow.storage_name}
          </div>
        </div>
      </td>

      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center font-normal">
        {projectRow.trade_unlock !== undefined
          ? Math.ceil(
              (projectRow.trade_unlock.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + ' days'
          : ''}
      </td>
      <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 font-normal">
            {projectRow.combined_QTY}
          </div>
        </div>
      </td>
      <td className="table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hover:text-gray-200 text-right">
        <div className="flex justify-center rounded-full drop-shadow-lg">
          <div>
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              autoComplete="off"
              value={
                isEmpty
                  ? ''
                  : fromReducer.totalToMove.filter(
                      (row) => row[0] == projectRow.item_id
                    )[0][2].length
              }
              placeholder="0"
              onChange={(e) => returnField(e.target.value)}
              className=" block w-full border rounded sm:text-sm text-gray-500 text-center border-gray-400 dark:bg-dark-level-two dark:text-dark-white"
            />
          </div>
        </div>
      </td>
      <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <button
          onClick={() => returnField(1000)}
          className={classNames(
            1000 - inventory.inventory.length - fromReducer.totalItemsToMove ==
              0
              ? 'pointer-events-none'
              : ''
          )}
        >
          <LightningBoltIcon
            className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-400"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => returnField(0)}
          className={classNames(isEmpty ? 'pointer-events-none hidden' : '')}
        >
          <XIcon
            className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400  "
            aria-hidden="true"
          />
        </button>
      </td>
      <td className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"></td>
    </>
  );
}
export default function StorageRow(projects) {
  return content(projects);
}
