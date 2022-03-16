import { Menu, Transition, Switch } from '@headlessui/react';
import { CheckIcon, DotsVerticalIcon, RefreshIcon, XIcon } from '@heroicons/react/solid';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  addStorageInventoryData,
  clearStorageIDData,
} from 'renderer/store/actions/inventoryActions';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import {
  moveFromAddCasketToStorages,
  moveFromRemoveCasket,
  moveFromSetHide,
} from 'renderer/store/actions/moveFromActions';
import { LoadingButton } from '../../shared/animations';
import EmptyComponent from '../../shared/emptyState';
import {
  classNames,
  getStorageUnitData,
} from '../../shared/inventoryFunctions';
import RenameModal from '../../shared/modals & notifcations/modalRename';

function content() {
  const dispatch = useDispatch();
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const localHide = fromReducer.doHide;


  const [getLoadingButton, setLoadingButton] = useState(false);
  const [storageLoading, setStorageLoading] = useState(false);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const fromSelector = useSelector((state: any) => state.moveFromReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);

  // Clear all filters

  // This will return and convert a specific units data
  async function getStorageData(storageID, storageName) {
    if (storageLoading == true) {
      return;
    }
    setLoadingButton(true);
    setStorageLoading(true);
    if (fromSelector.activeStorages.includes(storageID)) {
      dispatch(moveFromAddCasketToStorages(storageID));
      dispatch(clearStorageIDData(storageID));
      dispatch(moveFromRemoveCasket(storageID));
    } else {
      dispatch(moveFromAddCasketToStorages(storageID));
      let storageResult = await getStorageUnitData(storageID, storageName, pricesResult.prices);

      dispatch(
        addStorageInventoryData(storageResult, storageID, fromReducer.sortValue)
      );
    }
    setLoadingButton(false);
    setStorageLoading(false);
  }

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }

  // Get all storage unit data
  async function getAllStorages() {
    const casketResults = await inventory.inventory.filter(function (row) {
      if (!row.item_url.includes('casket')) {
        return false; // skip
      }
      if (row.item_storage_total == 0 && localHide) {
        return false; // skip
      }
      return true;
    });
    for (const [_key, project] of Object.entries(casketResults)) {
      let projectRow = project as any;
      if (!fromReducer.activeStorages.includes(projectRow.item_id)) {
        await getStorageData(projectRow.item_id, projectRow.item_customname);
      }
    }
  }

  // Get all storage unit data
  async function unMarkAllStorages() {
    const casketResults = await inventory.inventory.filter(function (row) {
      if (!row.item_url.includes('casket')) {
        return false; // skip
      }
      if (row.item_storage_total == 0 && localHide) {
        return false; // skip
      }
      return true;
    });
    for (const [_key, project] of Object.entries(casketResults)) {
      let projectRow = project as any;
      if (fromReducer.activeStorages.includes(projectRow.item_id)) {
        await getStorageData(projectRow.item_id, projectRow.item_customname);
      }
    }
  }


  // Get prices for storage units
  let totalDict = {} as any
  inventory.storageInventory.forEach((projectRow) => {
    if (totalDict[projectRow.storage_id] == undefined) {
      totalDict[projectRow.storage_id] = 0
    }
    
    let pricingAmount = totalDict[projectRow.storage_id]
    pricingAmount += projectRow.combined_QTY * pricesResult.prices[projectRow.item_name]?.[settingsData.source.title] * settingsData.currencyPrice[settingsData.currency]
    totalDict[projectRow.storage_id] = pricingAmount
  });
  console.log(totalDict)



  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <RenameModal />
      <div className="border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between ">
        <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
          Storage units
        </h2>
        <div className="mt-4 flex items-center sm:mt-0 sm:ml-4">
          <Link
            to=""
            type="button"
            onClick={() => getAllStorages()}
            className={classNames(settingsData.darkmode ? 'focus:outline-none focus:bg-dark-level-four' : 'focus:outline-none focus:bg-gray-100', 'order-1 ml-3  order-1 inline-flex items-center px-4 py-2 hover:border hover:shadow-sm dark:hover:bg-dark-level-four  text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 sm:order-0 sm:ml-0')}

          >

            <CheckIcon
                    className=" h-4 w-4 text-gray-700 dark:text-dark-white "
                    aria-hidden="true"
                  />
          </Link>
          <Link
            to=""
            type="button"
            onClick={() => unMarkAllStorages()}
            className={classNames(settingsData.darkmode ? 'focus:outline-none focus:bg-dark-level-four' : 'focus:outline-none focus:bg-gray-100', 'order-1 ml-3  order-1 inline-flex items-center px-4 py-2 hover:border hover:shadow-sm dark:hover:bg-dark-level-four  text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 sm:order-0 sm:ml-0')}

          >

            <XIcon
                    className="h-4 w-4 text-gray-700 dark:text-dark-white"
                    aria-hidden="true"
                  />
          </Link>

          <Link
            to=""
            type="button"
            className="order-last inline-flex  items-center px-4 py-2 border border-transparent dark:hover:bg-dark-level-four hover:bg-gray-50 focus:outline-none"
            onClick={() => refreshInventory()}
          >
            {getLoadingButton ? (
              <LoadingButton />
            ) : (
              <RefreshIcon
                className="h-4 w-4 text-gray-500 dark:text-dark-white"
                aria-hidden="true"
              />
            )}
          </Link>
          <span className="mr-3 text-gray-500 dark:text-dark-white text-xs font-medium uppercase tracking-wide">
            Hide empty
          </span>
          <Switch
            checked={localHide}
            onChange={() => dispatch(moveFromSetHide())}
            className={classNames(
              localHide ? 'bg-indigo-600 dark:bg-indigo-700' : 'bg-gray-200',
              'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
          >
            <span
              className={classNames(
                localHide ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white  shadow transform ring-0 transition ease-in-out duration-200'
              )}
            >
              <span
                className={classNames(
                  localHide
                    ? 'opacity-0 ease-out duration-100'
                    : 'opacity-100 ease-in duration-200',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  localHide
                    ? 'opacity-100 ease-in duration-200'
                    : 'opacity-0 ease-out duration-100',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
        </div>
      </div>
      {inventory.inventory.filter(function (row) {
        if (!row.item_url.includes('casket')) {
          return false; // skip
        }
        if (row.item_storage_total == 0 && localHide) {
          return false; // skip
        }
        return true;
      }).length != 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"
        >
          {inventory.inventory
            .filter(function (row) {
              if (!row.item_url.includes('casket')) {
                return false; // skip
              }
              if (row.item_storage_total == 0 && localHide) {
                return false; // skip
              }
              return true;
            })
            .map((project) => (
              <li
                key={project.item_id}
                className={classNames(
                  getLoadingButton
                    ? 'pointer-events-none	'
                    : 'pointer-events-auto',
                  'relative col-span-1  flex shadow-sm rounded-md'
                )}
              >
                <Link
                  to=""
                  className={classNames(
                    project.item_customname != null ? '' : 'pointer-events-none'
                  )}
                  onClick={() =>
                    getStorageData(project.item_id, project.item_customname)
                  }
                  key={project.item_id}
                >
                  <div
                    className={classNames(
                      'flex-shrink-0 h-full  flex items-center justify-center w-16 dark:border-opacity-50 text-white border-t border-l border-b border-gray-200 rounded-l-md dark:bg-dark-level-two'
                    )}
                  >
                    <img
                      className={classNames(
                        fromSelector.activeStorages.includes(project.item_id)
                          ? ''
                          : 'opacity-50 dark:opacity-40',
                        'max-w-none h-11 w-11  object-cover'
                      )}
                      src={
                        'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                        project.item_url +
                        '.png'
                      }
                    />
                  </div>
                </Link>
                <div className="flex-1 dark:bg-dark-level-two dark:border-opacity-50 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                  <Link
                    to=""
                    onClick={() =>
                      getStorageData(project.item_id, project.item_customname)
                    }
                    className={classNames(
                      project.item_customname != null
                        ? ''
                        : 'pointer-events-none'
                    )}
                    key={project.item_id}
                  >
                    <div className="flex-1 px-4 py-2 text-sm dark:text-dark-white truncate">
                      {project.item_customname != null ? (
                        project.item_customname
                      ) : (
                        <Link
                          to=""
                          onClick={() =>
                            dispatch(
                              setRenameModal(
                                project.item_id,
                                project.item_customname !== null
                                  ? project.item_customname
                                  : project.item_name
                              )
                            )
                          }
                          className={classNames(
                            'block text-sm text-blue-800 pointer-events-auto	'
                          )}
                        >
                          {' '}
                          Activate me
                        </Link>
                      )}
                      <p className="text-gray-500">
                        {project.item_storage_total} Items
                        {totalDict[project.item_id] != undefined ? ' | ' +new Intl.NumberFormat(settingsData.locale, { style: 'currency', currency: settingsData.currency, minimumFractionDigits: 0 }).format(totalDict[project.item_id].toFixed(0)): project.storage_id}
                      </p>
                    </div>
                  </Link>
                  <Menu as="div" className="flex-shrink-0 pr-2">
                    <Menu.Button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <DotsVerticalIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="z-10 mx-3 origin-top-right absolute dark:bg-dark-level-three right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to=""
                                onClick={() =>
                                  dispatch(
                                    setRenameModal(
                                      project.item_id,
                                      project.item_customname !== null
                                        ? project.item_customname
                                        : project.item_name
                                    )
                                  )
                                }
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900 dark:bg-dark-level-four'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm dark:text-dark-white'
                                )}
                              >
                                {' '}
                                Rename
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <EmptyComponent />
      )}
    </div>
  );
}

export default function StorageSelectorContent() {
  return content();
}
