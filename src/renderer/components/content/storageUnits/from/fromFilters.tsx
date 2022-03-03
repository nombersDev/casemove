import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  ChevronDownIcon,
  DocumentDownloadIcon,
  SaveAsIcon,
  SearchIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  moveFromClearAll,
  moveFromsetSearchField,
  moveFromSetSortOption,
} from 'renderer/store/actions/moveFromActions';
import {
  downloadReport,
  sortDataFunction,
} from '../../shared/inventoryFunctions';
import { inventorySetStoragesData } from 'renderer/store/actions/inventoryActions';
import MoveModal from '../../shared/modals & notifcations/modalMove';
import { moveModalQuerySet } from 'renderer/store/actions/modalMove actions';
import PricingAmount from '../../shared/filters/pricingAmount';

const sortOptions = [
  { name: 'Default' },
  { name: 'Category' },
  { name: 'Product name' },
  { name: 'QTY' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function content() {
  const dispatch = useDispatch();
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);

  // States

  async function onSortChange(sortValue) {
    dispatch(moveFromSetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      inventory.storageInventory
    );
    dispatch(inventorySetStoragesData(storageResult));
  }

  async function moveItems() {
    let key = (Math.random() + 1).toString(36).substring(7);
    let totalCount = 0;
    let queryNew = [] as any;
    for (const [, element] of Object.entries(fromReducer.totalToMove)) {
      let elemental = element as any;
      for (const [, itemID] of Object.entries(elemental[2])) {
        queryNew.push({
          payload: {
            name: elemental[3],
            number: fromReducer.totalItemsToMove - totalCount,
            type: 'from',
            storageID: elemental[1],
            itemID: itemID,
            isLast: fromReducer.totalItemsToMove - totalCount == 1,
            key: key,
          },
        });
        totalCount++;
      }
    }
    console.log(queryNew);
    dispatch(moveModalQuerySet(queryNew));
  }
  // Calculate storage amount prices
  let totalAmount = 0 as any;
  let inventoryFilter = inventory.storageInventory.filter(function (row) {
    if (
      row.item_name
        ?.toLowerCase()
        .trim()
        .includes(fromReducer.searchInput?.toLowerCase().trim())
    ) {
      return true; // skip
    }
    if (
      row.item_wear_name
        ?.toLowerCase()
        .trim()
        .includes(fromReducer.searchInput?.toLowerCase().trim())
    ) {
      return true; // skip
    }
    if (
      row.item_customname
        ?.toLowerCase()
        .trim()
        .includes(fromReducer.searchInput?.toLowerCase().trim())
    ) {
      return true; // skip
    }
    if (fromReducer.searchInput == undefined) {
      return true; // skip
    }
    return false;
  });


  inventoryFilter.forEach((projectRow) => {
    try {
      totalAmount +=
        projectRow.combined_QTY *
        pricesResult.prices[projectRow.item_name]?.[settingsData.source.title];
    } catch {
      totalAmount += 0;
    }
  });
  totalAmount = totalAmount.toFixed(0);

  // Send download
  async function sendDownload() {
    inventoryFilter.forEach((element) => {
      element['item_price'] =
        pricesResult.prices[element.item_name]?.[settingsData.source.title];
      element['item_price_combined'] =
        element.combined_QTY *
        pricesResult.prices[element.item_name]?.[settingsData.source.title];
    });
    downloadReport(inventoryFilter);
  }

  return (
    <div className="bg-white mt-8">
      {/* Filters */}

      <MoveModal />

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative z-10 grid items-center border-b dark:bg-dark-level-one dark:border-opacity-50"
      >
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div className="">
              <Menu as="div" className="relative inline-block ">
                <div className="flex items-center divide-x divide-gray-200">
                  <div>
                    <Menu.Button className="group inline-flex justify-center items-center text-gray-500 hover:text-gray-900">
                      {fromReducer.sortValue == 'Default'
                        ? 'Sort'
                        : fromReducer.sortValue}
                      <ChevronDownIcon
                        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <Link
                              to=""
                              className={classNames(
                                option.name == fromReducer.sortValue
                                  ? 'font-medium text-gray-900 pointer-events-none'
                                  : 'text-gray-500',
                                active && option.name != fromReducer.sortValue
                                  ? 'bg-gray-100'
                                  : '',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() => onSortChange(option.name)}
                            >
                              {option.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-gray-500"
                onClick={() => dispatch(moveFromClearAll())}
              >
                Clear all
              </button>
            </div>

            <label htmlFor="search" className="sr-only">
              Search items
            </label>
            <div className="relative rounded-md">
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
                value={fromReducer.searchInput}
                className="block w-full pb-0.5  focus:outline-none  pl-9 sm:text-sm border-gray-300 rounded-md h-9"
                placeholder="Search items"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(moveFromsetSearchField(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex items-center divide-x divide-gray-200">
              <div className="pr-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => sendDownload()}
                  className={classNames(
                    inventory.storageInventory.length == 0
                      ? 'pointer-events-none border-gray-100'
                      : 'hover:shadow-sm border-gray-200 ',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border   text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                  )}
                >
                  <DocumentDownloadIcon
                    className="mr-3 h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  Download
                </Link>
              </div>
              <div className="pl-3">
                <PricingAmount totalAmount={totalAmount}/>
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <ArchiveIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-green-500">
                    {1000 -
                      inventory.inventory.length -
                      fromReducer.totalItemsToMove}{' '}
                    left
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <SwitchHorizontalIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-blue-500">
                    {fromReducer.totalItemsToMove} Items
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => moveItems()}
                  className={classNames(
                    fromReducer.totalItemsToMove == 0
                      ? 'pointer-events-none border-gray-100'
                      : 'shadow-sm border-gray-200',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border   text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                  )}
                >
                  Move
                  <SaveAsIcon
                    className="ml-3 h-4 w-4 text-gray-700"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default function StorageFilter() {
  return content();
}
