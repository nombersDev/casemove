import { BeakerIcon, PencilIcon, SelectorIcon, TagIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { classNames } from 'renderer/components/content/shared/inventoryFunctions';
import itemRarities from 'renderer/components/content/shared/rarities';
//import { sortDataFunction } from 'renderer/context/inventoryFiltersContext';
import { filterInventorySetSort } from 'renderer/store/actions/filtersInventoryActions';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import { pricing_add_to_requested } from 'renderer/store/actions/pricingActions';
import { tradeUpAddRemove } from 'renderer/store/actions/tradeUpActions';


function content() {
  const [stickerHover, setStickerHover] = useState('');
  const [itemHover, setItemHover] = useState('');
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);

  const dispatch = useDispatch();

  // Sort function
  async function onSortChange(sortValue) {
    dispatch(
      await filterInventorySetSort(
        inventory.inventory,
        inventory.combinedInventory,
        inventoryFilters,
        sortValue,
        pricesResult.prices,
        settingsData?.source?.title
      )
    );
  }

  // Convert to dict for easier match
    let finalList = {};
    inventory.inventory.forEach(element => {
      if (finalList[element.item_name] == undefined) {
        finalList[element.item_name] = [element]
      } 
      else {
        let listToUse = finalList[element.item_name];
        listToUse.push(element)
        finalList[element.item_name] = listToUse
        
      }
    });

    // Inventory to use
    let finalInventoryToUse = [] as any;
    let seenNames = [] as any;
    inventoryFilters.inventoryFiltered.forEach((projectRow) => {
      if (finalList[projectRow.item_name] != undefined && seenNames.includes(projectRow.item_name) == false) {
        finalInventoryToUse = [...finalInventoryToUse, ...finalList[projectRow.item_name]]
        seenNames.push(projectRow.item_name)
      }
    })


    finalInventoryToUse = finalInventoryToUse.filter(function (item) {
    if (!item.tradeUpConfirmed) {
      return false;
    }
    if (tradeUpData.MinFloat > item.item_paint_wear || tradeUpData.MaxFloat < item.item_paint_wear) {
      return false;
    }
    if (tradeUpData.tradeUpProductsIDS.includes(item.item_id)) {
      return false;
    }
    if (tradeUpData.collections.length > 0 && !tradeUpData.collections.includes(item?.collection)) {
      return false;
    }
    if (tradeUpData.options.includes('Hide equipped')) {
      if (item.equipped_t || item.equipped_ct) {
        return false;
      }
    }
    if (tradeUpData.tradeUpProducts.length != 0) {
      let restrictRarity = tradeUpData.tradeUpProducts[0].rarityName
      let restrictStattrak = tradeUpData.tradeUpProducts[0].stattrak
      if (item.rarityName != restrictRarity) {
        return false
      }
      if (item.stattrak != restrictStattrak) {
        return false
      }
    }

    if (item.tradeUp) {
      return true;
    }
    return false;
  });

  let itemR = {}
  itemRarities.forEach(element => {
    itemR[element.value] = element.bgColorClass
  });
  finalInventoryToUse.forEach(element => {
    element['rarityColor'] =itemR[element.rarityName]
  });



  // Prices
  let pricesToGet = [] as any;
  finalInventoryToUse.forEach((projectRow) => {
    if (
      pricesResult.prices[projectRow.item_name] == undefined &&
      pricesResult.productsRequested.includes(projectRow.item_name) == false
    ) {
      pricesToGet.push(projectRow);
    }
  });
  if (pricesToGet.length > 0) {
    window.electron.ipcRenderer.getPrice(pricesToGet);
    dispatch(pricing_add_to_requested(pricesToGet));
  }

  // SORT Fix for prices
    function sortRunAlt(valueOne, ValueTwo) {
      if (isNaN(valueOne)) {
        valueOne = -90000000000
      }
      if (isNaN(ValueTwo)) {
        ValueTwo = -90000000000
      }
      if (valueOne < ValueTwo) {
        return -1;
      }
      if (valueOne > ValueTwo) {
        return 1;
      }
  
      return 0;
    }
  
    
    
    
    if (inventoryFilters.sortValue == 'Price'){
      finalInventoryToUse.sort(function (a, b) {
        return sortRunAlt(
          pricesResult.prices[a.item_name]?.[settingsData?.source?.title],
          pricesResult.prices[b.item_name]?.[settingsData?.source?.title]
        );
      });
  }
    const isFull = tradeUpData.tradeUpProducts.length == 10
    if (inventoryFilters.sortBack) {
      finalInventoryToUse.reverse()
    }
    



  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr
            className={classNames(
              settingsData.os == 'win32' ? 'top-0' : 'top-0',
              'border-gray-200 sticky'
            )}
          >
            <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <button
                onClick={() => onSortChange('Product name')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  Product <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>
            <th className="hidden xl:table-cell px-6 py-2 border-b border-gray-200 pointer-events-auto bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
              <button
                onClick={() => onSortChange('Collection')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  Collection <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>

            <th className="hidden xl:table-cell px-6 py-2 border-b border-gray-200 pointer-events-auto bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
              <button
                onClick={() => onSortChange('Price')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  Price <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>

            <th className="hidden 2xl:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
              <button
                onClick={() => onSortChange('Stickers')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  Stickers/Patches <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>

            <th className="hidden lg:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
              <button
                onClick={() => onSortChange('wearValue')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  Float <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>
            <th className="hidden lg:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
            <span className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Move
                </span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 dark:bg-dark-level-one dark:divide-gray-500">
          {finalInventoryToUse.map((projectRow) => (
            <tr
              key={projectRow.item_id}
              className={classNames(
                projectRow.item_name
                  ?.toLowerCase()
                  .includes(
                    tradeUpData.searchInput?.toLowerCase().trim()
                  ) ||
                  projectRow.item_customname
                    ?.toLowerCase()
                    .includes(
                      tradeUpData.searchInput?.toLowerCase().trim()
                    ) ||
                  projectRow.item_wear_name
                    ?.toLowerCase()
                    .includes(
                      tradeUpData.searchInput?.toLowerCase().trim()
                    ) ||
                    tradeUpData.searchInput == undefined
                  ? ''
                  : 'hidden',
                  inventoryFilters.rarityFilter.length != 0
                  ? inventoryFilters.rarityFilter?.includes(
                      projectRow.rarityColor
                    )
                    ? ''
                    : 'hidden'
                  : '',
                'hover:shadow-inner'
              )}
            >
              <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
                <div className="flex items-center space-x-3 lg:pl-2">
                  <div
                    className={classNames(
                      projectRow.rarityColor,
                      'flex-shrink-0 w-2.5 h-2.5 rounded-full'
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-shrink-0 -space-x-1">
                    {projectRow.item_moveable != true ? (
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
                    ) : (
                      <Link
                        to={
                          {
                          pathname: `https://steamcommunity.com/market/listings/730/${
                            projectRow.item_paint_wear == undefined
                              ? projectRow.item_name
                              : projectRow.item_name +
                                ' (' +
                                projectRow.item_wear_name +
                                ')'
                          }`,
                        }}
                        target="_blank"
                      >
                        <div className="flex flex-shrink-0 -space-x-1">
                          <img
                            onMouseEnter={() =>
                              setItemHover(projectRow.item_id)
                            }
                            onMouseLeave={() => setItemHover('')}
                            className={classNames(
                              itemHover == projectRow.item_id
                                ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                                : '',
                              'max-w-none h-11 w-11 transition duration-500 ease-in-out  dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300'
                            )}
                            src={
                              'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                              projectRow.item_url +
                              '.png'
                            }
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                  <span>
                    <span className="flex dark:text-dark-white">
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
                              navigator.clipboard.writeText(
                                JSON.stringify(projectRow)
                              )
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
                        <TagIcon className="h-3 w-3  ml-1" />
                      ) : (
                        ''
                      )}
                      {projectRow.equipped_t ? (
                        <span className='ml-1 h-3 leading-3 pl-1 pr-1 text-white  dark:text-dark-white text-center font-medium	 bg-dark-level-four rounded-full   text-xs'> T </span>
                      ) : (
                        ''
                      )}
                      {projectRow.equipped_ct ? (
                        <span className='ml-1 h-3 leading-3 pl-1 pr-1 text-center  text-white dark:text-dark-white font-medium	 bg-dark-level-four rounded-full   text-xs'> CT </span>
                      ) : (
                        ''
                      )}

                      {projectRow.item_url.includes('casket') ? (
                        <Link
                          to=""
                          className="text-gray-500"
                          onClick={() =>
                            dispatch(
                              setRenameModal(
                                projectRow.item_id,
                                projectRow.item_customname !== null
                                  ? projectRow.item_customname
                                  : projectRow.item_name
                              )
                            )
                          }
                        >
                          <PencilIcon className="h-4 w-5 pb-1" />
                        </Link>
                      ) : (
                        ''
                      )}
                    </span>
                    <span
                      className="text-gray-500 "
                      title={projectRow.item_paint_wear}
                    >
                      {projectRow.item_customname !== null
                        ? projectRow.item_storage_total !== undefined
                          ? projectRow.item_name +
                            ' (' +
                            projectRow.item_storage_total +
                            ')'
                          : projectRow.item_name
                        : ''}

                      {projectRow.item_customname !== null &&
                      projectRow.item_paint_wear !== undefined
                        ? ' - '
                        : ''}

                      {projectRow.item_paint_wear !== undefined
                        ? projectRow.item_wear_name
                        : ''}
                      {/*
                      {isShown == project.item_id  && project.item_paint_wear !== undefined?
                        <div>{project.item_paint_wear}</div>
                       : ''} */}
                    </span>
                  </span>
                </div>
              </td>
              <td className="hidden xl:table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
                <div className="flex items-center">

                  <span>
                    <span className="flex dark:text-dark-white">
                      {projectRow.collection.replace('The ', '').replace(' Collection', '')}

                    </span>

                  </span>
                </div>
              </td>

              {settingsData.columns.includes('Price') ? (
                <td className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
                    <div className="flex flex-shrink-0 -space-x-1 text-gray-500 dark:text-gray-400 font-normal">
                    {pricesResult.prices[projectRow.item_name] == undefined
                        ? ''
                        : new Intl.NumberFormat(settingsData.locale, {
                            style: 'currency',
                            currency: settingsData.currency,
                          }).format(
                            pricesResult.prices[projectRow.item_name]?.[
                              settingsData?.source?.title
                            ] *
                              settingsData.currencyPrice[settingsData.currency]
                          )}
                    </div>
                  </div>

                </td>
              ) : (
                ''
              )}
              <td className="hidden 2xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
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

              <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-normal ">
              {projectRow.item_paint_wear?.toString()?.substr(0, 9)}
              </td>
              <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className={classNames(isFull ? 'hidden' : '', 'flex justify-center')}>
          <button
          onClick={() => dispatch(tradeUpAddRemove(projectRow))}

          >
            <BeakerIcon
              className={classNames(
                'text-gray-400 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-400 h-5'
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </td>

              <td className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function TradeUpPicker() {
  return content();
}
