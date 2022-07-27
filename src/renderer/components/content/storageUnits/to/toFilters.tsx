import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  ArchiveIcon,
  FilterIcon,
  SearchIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/solid';
// import MoveModal from '../../shared/modals & notifcations/modalMove';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from '../../shared/filters/inventoryFunctions';
import MoveModal from '../../shared/modals & notifcations/modalMove';
import { moveModalQuerySet } from 'renderer/store/actions/modalMove actions';
import {
  moveToClearAll,
  moveTosetSearchField,
  moveToSetStorageAmount,
} from 'renderer/store/actions/moveToActions';
import PricingAmount from '../../shared/filters/pricingAmount';
import InventoryFiltersDisclosure from '../../Inventory/filtersDisclosure';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { toGetFilterManager } from './toFilterSetup';
import { addMajorsFilters } from 'renderer/functionsClasses/filters/filters';
const ClassFilters = toGetFilterManager()

function content() {
  const dispatch = useDispatch();
  let ReducerClass = new ReducerManager(useSelector);
  const pricesResult = ReducerClass.getStorage(ReducerClass.names.pricing);
  const toReducer = ReducerClass.getStorage(ReducerClass.names.moveTo);
  const inventory = ReducerClass.getStorage(ReducerClass.names.inventory);
  const settingsData = ReducerClass.getStorage(ReducerClass.names.settings);

  const inventoryFilters = ReducerClass.getStorage(
    ReducerClass.names.inventoryFilters
  );

  async function moveItems() {
    let key = (Math.random() + 1).toString(36).substring(7);
    key;
    let totalCount = 0;
    let queryNew = [] as any;
    for (const [, element] of Object.entries(toReducer.totalToMove)) {
      let elemental = element as any;
      for (const [, itemID] of Object.entries(elemental[2])) {
        queryNew.push({
          payload: {
            name: elemental[3],
            number: toReducer.totalItemsToMove - totalCount,
            type: 'to',
            storageID: toReducer.activeStorages[0],
            itemID: itemID,
            isLast: toReducer.totalItemsToMove - totalCount == 1,
            key: key,
          },
        });
        totalCount++;
      }
    }
    dispatch(moveModalQuerySet(queryNew));
  }
  moveItems;

  // Storage count
  let storageRow = [{ item_storage_total: 0 }];
  if (toReducer.activeStorages.length != 0) {
    storageRow = inventory.inventory.filter(function (item) {
      if (item.item_id.includes(toReducer.activeStorages[0])) {
        return item;
      }
    });
  }
  if (
    storageRow[0]?.item_storage_total != toReducer?.activeStoragesAmount &&
    storageRow[0]?.item_storage_total != null
  ) {
    dispatch(moveToSetStorageAmount(storageRow[0].item_storage_total));
  }
  let inventoryFilter = searchFilter(
    inventory.inventory,
    inventoryFilters,
    toReducer
  );
  let totalAmount = 0 as any;
  let totalHighlighted = 0 as any;
  let classConvert = new ConvertPrices(settingsData, pricesResult);
  inventoryFilter.forEach((projectRow) => {
    // Get total highlighted
    let filtered = toReducer.totalToMove.filter(
      (row) => row[0] == projectRow.item_id
    );
    if (filtered.length > 0) {
      totalHighlighted +=
        classConvert.getPrice(projectRow) * filtered[0][2].length;
    }

    // Get total price
    totalAmount += classConvert.getPrice(projectRow, true);
  });
  totalHighlighted = totalHighlighted.toFixed(0);
  totalAmount = totalAmount.toFixed(0);
  addMajorsFilters(inventory.combinedInventory).then((returnValue) => {
    ClassFilters.loadFilter(returnValue, true)
  })

  return (
    <div className="bg-white mt-8 dark:bg-dark-level-one">
      {/* Filters */}

      <MoveModal />

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative grid items-center border-b dark:bg-dark-level-one dark:border-opacity-50"
      >
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group text-gray-700 font-medium flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {inventoryFilters.inventoryFilter.length - 1 == -1
                  ? 0
                  : inventoryFilters.inventoryFilter.length - 1}{' '}
                Filters
              </Disclosure.Button>
            </div>

            <div className="pl-6">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400"
                onClick={() => dispatch(moveToClearAll())}
              >
                Clear all
              </button>
            </div>

            <label htmlFor="search" className="sr-only">
              Search items
            </label>
            <div className="relative rounded-md focus:outline-none focus:outline-none">
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
                value={toReducer.searchInput}
                className="block w-full pb-0.5  focus:outline-none dark:text-dark-white pl-9 sm:text-sm border-gray-300 h-7 dark:bg-dark-level-one dark:rounded-none dark:bg-dark-level-one dark:rounded-none"
                placeholder="Search items"
                spellCheck="false"
                onChange={(e) => dispatch(moveTosetSearchField(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex items-center divide-x divide-gray-200">
              <div>
                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(totalAmount)}
                  pricingAmount={totalHighlighted}
                />
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <ArchiveIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  {1000 -
                    toReducer.activeStoragesAmount -
                    toReducer.totalItemsToMove <
                  0 ? (
                    <span className="text-red-500">
                      {1000 -
                        toReducer.activeStoragesAmount -
                        toReducer.totalItemsToMove}{' '}
                      left
                    </span>
                  ) : (
                    <span className="text-green-500">
                      {1000 -
                        toReducer.activeStoragesAmount -
                        toReducer.totalItemsToMove}{' '}
                      left
                    </span>
                  )}
                </span>
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <SwitchHorizontalIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-blue-500">
                    {toReducer.totalItemsToMove} Items
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => moveItems()}
                  className={classNames(
                    toReducer.totalItemsToMove == 0 ||
                      toReducer.activeStorages.length == 0 || 1000 -
                      toReducer.activeStoragesAmount -
                      toReducer.totalItemsToMove <
                    0
                      ? 'pointer-events-none border-gray-100 bg-dark-level-one'
                      : 'shadow-sm border-gray-200 bg-dark-level-three',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:border-none dark:border-opacity-0 dark:text-dark-white text-sm font-medium rounded-md text-gray-700 hover:bg-dark-level-four  sm:order-0 sm:ml-0'
                  )}
                >
                  Insert
                  <UploadIcon
                    className="ml-3 dark:text-dark-white h-4 w-4 text-gray-700"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <InventoryFiltersDisclosure ClassFilters={ClassFilters}  />
      </Disclosure>
    </div>
  );
}

export default function StorageFilter() {
  return content();
}
