import { Menu, Transition, Switch } from '@headlessui/react';
import { DotsVerticalIcon, RefreshIcon, SearchIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import {
  moveToAddCasketToStorages,
  moveToClearAll,
  moveToSetFull,
  moveToSetHide,
  moveTosetSearchFieldStorage,
} from 'renderer/store/actions/moveToActions';
import EmptyComponent from '../../shared/emptyState';
import { classNames } from '../../shared/filters/inventoryFunctions';
import RenameModal from '../../shared/modals & notifcations/modalRename';
moveToClearAll


function content() {
  const dispatch = useDispatch();

  const inventory = useSelector((state: any) => state.inventoryReducer);
  const toSelector = useSelector((state: any) => state.moveToReducer);

  // Clear all filters

  // This will return and convert a specific units data
  async function getStorageData(storageID, casketVolume) {
    dispatch(moveToAddCasketToStorages(storageID, casketVolume));
    // dispatch(moveToClearAll());
  }

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }

  // Sort run
  function sortRun(valueOne, ValueTwo, useNaN = false) {
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    if (useNaN && isNaN(valueOne)) {
      return -1;
    }
    return 0;
  }

  let inventoryToUse = inventory.inventory;



  return (
    <div className="px-4 sm:px-6 lg:px-8 dark:bg-dark-level-one">
      <RenameModal />
      <div className="border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between ">

      <div className='flex items-center' >
        <h2 className="text-gray-500 text-xs font-medium uppercase mr-3 tracking-wide">
          Storage units
        </h2>
        <label htmlFor="search" className="sr-only">
              Search storages
            </label>
            <div className="relative rounded-md dark:border-opacity-50 border-gray-200 border-l-2 focus:outline-none focus:outline-none">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                aria-hidden="true"
              >
                <SearchIcon
                  className="mr-3 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={toSelector.searchInputStorage}
                className="block w-full pb-0.5  focus:outline-none dark:text-dark-white pl-9 sm:text-sm border-gray-300 h-7 dark:bg-dark-level-one dark:rounded-none dark:bg-dark-level-one dark:rounded-none"
                placeholder="Search storages"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(moveTosetSearchFieldStorage(e.target.value))
                }
              />
            </div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0 sm:ml-4">
          <Link
            to=""
            type="button"
            className="focus:outline-none focus:bg-dark-level-four order-1 ml-3  order-1 inline-flex items-center px-4 py-2 hover:border hover:shadow-sm dark:hover:bg-dark-level-four  text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 sm:order-0 sm:ml-0"
            onClick={() => refreshInventory()}
          >
            <RefreshIcon className="h-4 w-4 text-gray-500 dark:text-dark-white" aria-hidden="true" />
          </Link>
          <span className="mr-3 text-gray-500 text-xs dark:text-dark-white font-medium uppercase tracking-wide">
            Hide empty
          </span>
          <Switch
            checked={toSelector.doHide}
            onChange={() => dispatch(moveToSetHide())}
            className={classNames(
              toSelector.doHide ? 'bg-indigo-600 dark:bg-indigo-700' : 'bg-gray-200',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
          >
            <span
              className={classNames(
                toSelector.doHide ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            >
              <span
                className={classNames(
                  toSelector.doHide
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
                  toSelector.doHide
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
          <span className="mr-3  ml-3 text-gray-500 text-xs dark:text-dark-white font-medium uppercase tracking-wide">
            Hide full
          </span>
          <Switch
            checked={toSelector.hideFull}
            onChange={() => dispatch(moveToSetFull())}
            className={classNames(
              toSelector.hideFull ? 'bg-indigo-600 dark:bg-indigo-700' : 'bg-gray-200',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
          >
            <span
              className={classNames(
                toSelector.hideFull ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            >
              <span
                className={classNames(
                  toSelector.hideFull
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
                  toSelector.hideFull
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
      {inventoryToUse.filter(function (row) {
        if (!row.item_url?.includes('casket')) {
          return false; // skip
        }
        if (row.item_storage_total == 0 && toSelector.doHide) {
          return false; // skip
        }
        if (toSelector.searchInputStorage != '' && !row?.item_customname?.toLowerCase()?.includes(toSelector.searchInputStorage)) {
          return false; // skip
        }
        if (row.item_storage_total == 1000 && toSelector.hideFull) {
          return false; // skip
        }
        return true;
      }).length != 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"
        >
          {inventoryToUse
            .filter(function (row) {
              if (!row.item_url.includes('casket')) {
                return false; // skip
              }
              if (toSelector.searchInputStorage != '' && !row?.item_customname?.toLowerCase()?.includes(toSelector.searchInputStorage)) {
                return false; // skip
              }
              if (row.item_storage_total == 0 && toSelector.doHide) {
                return false; // skip
              }
              if (row.item_storage_total == 1000 && toSelector.hideFull) {
                return false; // skip
              }
              return true;
            }).sort(function (a, b) {
              let a_customName = a.item_customname
              let b_customName = b.item_customname
              if (a_customName == undefined) {
                a_customName = '0000'
              }
              if (b_customName == undefined) {
                b_customName = '0000'
              }
              return sortRun(a_customName, b_customName);
            })
            .map((project) => (
              <li
                key={project.item_id}
                className={classNames(
                  'pointer-events-auto relative col-span-1 flex shadow-sm rounded-md'
                )}
              >
                <Link
                  to=""
                  className={classNames(
                    project.item_customname != null ? '' : 'pointer-events-none'
                  )}
                  onClick={() =>
                    getStorageData(project.item_id, project.item_storage_total)
                  }
                  key={project.item_id}
                >
                  <div
                    className={classNames(
                      toSelector.activeStorages.includes(project.item_id)
                          ? 'border-green-300 '
                          : 'border-gray-200 ',
                      'flex-shrink-0 h-full  flex items-center justify-center w-16 dark:border-opacity-50 text-white border-t border-l border-b rounded-l-md dark:bg-dark-level-two'
                    )}
                  >
                    <img
                      className={classNames(
                        toSelector.activeStorages.includes(project.item_id)
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
                </Link><div className={classNames(
                        toSelector.activeStorages.includes(project.item_id)
                          ? 'border-green-300'
                          : 'border-gray-200',
                        'flex-1 dark:bg-dark-level-two dark:border-opacity-50 flex items-center justify-between border-t border-r border-b bg-white rounded-r-md truncate'
                      )}>
                  <Link
                    to=""
                    onClick={() =>
                      getStorageData(
                        project.item_id,
                        project.item_storage_total
                      )
                    }
                    className={classNames(
                      project.item_customname != null
                        ? ''
                        : 'pointer-events-none'
                    )}
                    key={project.item_id}
                  >
                    <div className="flex-1 px-4 py-2 text-sm truncate dark:text-dark-white">
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
