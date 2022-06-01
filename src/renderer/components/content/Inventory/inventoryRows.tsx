import {
  CheckCircleIcon,
  ExternalLinkIcon,
  PencilIcon,
  SelectorIcon,
  TagIcon,
} from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { filterInventorySetSort } from 'renderer/store/actions/filtersInventoryActions';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import { pricing_add_to_requested } from 'renderer/store/actions/pricingActions';
import RenameModal from '../shared/modals & notifcations/modalRename';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const now = new Date();
function content() {
  const [stickerHover, setStickerHover] = useState('');
  const [itemHover, setItemHover] = useState('');
  const [getInventory, setInventory] = useState([] as any);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const userDetails = useSelector((state: any) => state.authReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);

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

  let inventoryToUse = [] as any;
  if (
    inventoryFilters.inventoryFiltered.length == 0 &&
    inventoryFilters.inventoryFilter.length == 0
  ) {
    inventoryToUse = inventory.combinedInventory;
  } else {
    inventoryToUse = inventoryFilters.inventoryFiltered;
  }
  let pricesToGet = [] as any;
  inventoryToUse.forEach((projectRow) => {
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
  if (inventoryToUse != getInventory) {
    if (
      inventoryFilters.sortBack == true &&
      inventoryToUse.reverse() != getInventory
    ) {
      setInventory(inventoryToUse);
    } else {
      setInventory(inventoryToUse);
    }
  }

  // async function setItemsPosition(item_id) {
  //   window.electron.ipcRenderer.OpenContainer([item_id])

 //  }
  // setItemsPosition

  return (
    <>
      <RenameModal />

      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Product details
          </h2>
        </div>
        <ul
          role="list"
          className="mt-3 border-t border-gray-200 divide-y divide-gray-100 dark:divide-gray-500"
        >
          {getInventory.map((project) => (
            <li key={project.item_id}>
              <a
                href="#"
                className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
              >
                <span className="flex items-center truncate space-x-3">
                  <span
                    className={classNames(
                      project.bgColorClass,
                      'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium truncate text-sm leading-6">
                    {project.item_name}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <table className="min-w-full">
        <thead>
          <tr
            className={classNames(
              settingsData.os == 'win32' ? 'top-7' : 'top-0',
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
            {settingsData.columns.includes('Collections') ?
                <th className="hidden xl:table-cell px-6 py-2 border-b border-gray-200 pointer-events-auto bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
                  <button
                    onClick={() => onSortChange('Collection')}
                    className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    <span className="flex justify-between">
                      Collection <SelectorIcon className="h-2" />
                    </span>
                  </button>
                </th> : '' }
            {settingsData.columns.includes('Price') ? (
              <th className="table-cell px-6 py-2 border-b border-gray-200 pointer-events-auto bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
                <button
                  onClick={() => onSortChange('Price')}
                  className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <span className="flex justify-between">
                    Price <SelectorIcon className="h-2" />
                  </span>
                </button>
              </th>
            ) : (
              ''
            )}

            {settingsData.columns.includes('Stickers/patches') ? (
              <th className="hidden xl:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
                <button
                  onClick={() => onSortChange('Stickers')}
                  className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <span className="flex justify-between">
                    Stickers/Patches <SelectorIcon className="h-2" />
                  </span>
                </button>
              </th>
            ) : (
              ''
            )}

            {settingsData.columns.includes('Float') ? (
              <th className="hidden xl:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
                <button
                  onClick={() => onSortChange('wearValue')}
                  className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <span className="flex justify-between">
                    Float <SelectorIcon className="h-2" />
                  </span>
                </button>
              </th>
            ) : (
              ''
            )}
            {settingsData.columns.includes('Rarity') ?
              <th className="hidden xl:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
                  <button
                    onClick={() => onSortChange('Rarity')}
                    className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    <span className="flex justify-between">
                    Rarity <SelectorIcon className="h-2" />
                    </span>
                  </button>
                </th> : '' }


            {settingsData.columns.includes('Tradehold') ? (
              <th className="hidden md:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two  ">
                <button
                  onClick={() => onSortChange('tradehold')}
                  className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  <span className="flex justify-between">
                    Tradehold <SelectorIcon className="h-2" />
                  </span>
                </button>
              </th>
            ) : (
              ''
            )}

            <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
              <button
                onClick={() => onSortChange('QTY')}
                className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <span className="flex justify-between">
                  QTY <SelectorIcon className="h-2" />
                </span>
              </button>
            </th>
            <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="text-gray-500 dark:text-gray-400 pointer-events-none tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Moveable
              </button>
            </th>
            <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button className="text-gray-500 dark:text-gray-400 pointer-events-none tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Link
              </button>
            </th>
            <th className="table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="md:hidden">Link</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 dark:bg-dark-level-one dark:divide-gray-500">
          {getInventory.map((projectRow) => (
            <tr
              key={projectRow.item_id}
              className={classNames(
                projectRow.item_name
                  ?.toLowerCase()
                  .includes(
                    inventoryFilters.searchInput?.toLowerCase().trim()
                  ) ||
                  projectRow.item_customname
                    ?.toLowerCase()
                    .includes(
                      inventoryFilters.searchInput?.toLowerCase().trim()
                    ) ||
                  projectRow.item_wear_name
                    ?.toLowerCase()
                    .includes(
                      inventoryFilters.searchInput?.toLowerCase().trim()
                    ) ||
                  inventoryFilters.searchInput == undefined
                  ? ''
                  : 'hidden',
                inventoryFilters.categoryFilter.length != 0
                  ? inventoryFilters.categoryFilter?.includes(
                      projectRow.bgColorClass
                    )
                    ? ''
                    : 'hidden'
                  : '',
                'hover:shadow-inner'
              )}
            >
              <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
                <div className="flex items-center space-x-3 lg:pl-2">
                  {/* Projects list (only on smallest breakpoint)
                            <div
                              className={classNames(project.bgColorClass, 'flex-shrink-0 w-2.5 h-2.5 rounded-full')}
                              aria-hidden="true"
                            /> */}
                  <div
                    className={classNames(
                      projectRow.bgColorClass,
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
                        to={{
                          pathname: `https://steamcommunity.com/market/listings/730/${
                            projectRow.item_paint_wear == undefined
                              ? projectRow.item_name.replaceAll('Holo/Foil', 'Holo-Foil')
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
                      {
                        settingsData.devmode ? <button
                        className="px-2.5 py-1.5 border border-gray-300 mr-3 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(projectRow)
                          )
                        }
                      >
                        {' '}
                        COPY REF
                      </button> : ''
                      }
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
              {settingsData.columns.includes('Collections') ?
      <td className="hidden xl:table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
      <div className="flex items-center">

        <span>
          <span className="flex dark:text-dark-white">
            {projectRow?.collection?.replace('The ', '')?.replace(' Collection', '')}

          </span>

        </span>
      </div>
    </td> : '' }
              {settingsData.columns.includes('Price') ? (
                <td key={ Math.random().toString(36).substr(2, 9) } className="table-cell px-6 py-3 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
                    <div className="flex flex-shrink-0 -space-x-1 text-gray-500 dark:text-gray-400 font-normal">
                      {projectRow.item_moveable
                        ? pricesResult.prices[projectRow.item_name] ==
                            undefined || projectRow.combined_QTY == 1
                          ? new Intl.NumberFormat(settingsData.locale, {
                              style: 'currency',
                              currency: settingsData.currency,
                            }).format(
                              pricesResult.prices[projectRow.item_name]?.[
                                settingsData?.source?.title
                              ] *
                                settingsData.currencyPrice[
                                  settingsData.currency
                                ]
                                ? pricesResult.prices[projectRow.item_name]?.[
                                    settingsData?.source?.title
                                  ] *
                                    settingsData.currencyPrice[
                                      settingsData.currency
                                    ]
                                : 0
                            )
                          :  new Intl.NumberFormat(settingsData.locale, {
                              style: 'currency',
                              currency: settingsData.currency,
                            }).format(
                                projectRow.combined_QTY *
                                  pricesResult.prices[projectRow.item_name]?.[
                                    settingsData?.source?.title
                                  ] *
                                  settingsData.currencyPrice[
                                    settingsData.currency
                                  ]
                            )
                        : ''}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
                    <div className="flex flex-shrink-0 -space-x-1 text-gray-500 text-xs font-normal">
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
                            ] *
                              settingsData.currencyPrice[settingsData.currency]
                          )}
                    </div>
                  </div>
                </td>
              ) : (
                ''
              )}
              {settingsData.columns.includes('Stickers/patches') ? (
                <td key={ Math.random().toString(36).substr(2, 9) } className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
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
              ) : (
                ''
              )}
              {settingsData.columns.includes('Float') ? (
                <td key={ Math.random().toString(36).substr(2, 9) } className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
                    <div className="flex flex-shrink-0 -space-x-1">
                      {projectRow.item_paint_wear?.toString()?.substr(0, 9)}
                    </div>
                  </div>
                </td>
              ) : (
                ''
              )}
              {settingsData.columns.includes('Rarity') ?
        <td key={ Math.random().toString(36).substr(2, 9) } className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
            <div className="flex flex-shrink-0 -space-x-1">
              {projectRow.rarityName}
            </div>
          </div>
        </td> : '' }

              {settingsData.columns.includes('Tradehold') ? (
                <td key={ Math.random().toString(36).substr(2, 9) } className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  {projectRow.trade_unlock !== undefined
                    ? Math.ceil(
                        (projectRow.trade_unlock.getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + ' days'
                    : ''}
                </td>
              ) : (
                ''
              )}
              <td key={ Math.random().toString(36).substr(2, 9) } className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <div className="flex items-center space-x-2 justify-center rounded-full  drop-shadow-lg">
                  <div className="flex flex-shrink-0 -space-x-1 font-normal">
                    {projectRow.combined_QTY}
                  </div>
                </div>
              </td>
              <td key={ Math.random().toString(36).substr(2, 9) } className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                <div className="flex justify-center rounded-full drop-shadow-lg">
                  {projectRow.item_moveable == true ? (
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    ''
                  )}
                </div>
              </td>
              <td key={ Math.random().toString(36).substr(2, 9) } className="table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 hover:text-gray-200 text-right">
                <div className="flex justify-center rounded-full drop-shadow-lg">
                  <Link
                    to={{
                      pathname: `https://steamcommunity.com/profiles/${userDetails.steamID}/inventory/#730_2_${projectRow.combined_ids[0]}`,
                    }}
                    target="_blank"
                  >
                    <ExternalLinkIcon
                      className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-100"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </td>


              <td key={ Math.random().toString(36).substr(2, 9) } className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"></td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function InventoryRowsComponent() {
  return content();
}
