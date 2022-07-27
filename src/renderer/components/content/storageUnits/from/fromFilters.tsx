import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  ArchiveIcon,
  DocumentDownloadIcon,
  FilterIcon,
  SaveAsIcon,
  SearchIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  moveFromClearAll,
  moveFromsetSearchField,
} from 'renderer/store/actions/moveFromActions';
import MoveModal from '../../shared/modals & notifcations/modalMove';
import { moveModalQuerySet } from 'renderer/store/actions/modalMove actions';
import PricingAmount from '../../shared/filters/pricingAmount';
import { downloadReport } from 'renderer/functionsClasses/downloadReport';
import { classNames } from '../../shared/filters/inventoryFunctions';

import StorageFilterDisclosure from './storageFilterDisclosure';
import { fromGetFilterManager } from './fromFilterSetup';
import { addMajorsFilters } from 'renderer/functionsClasses/filters/filters';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
const ClassFilters = fromGetFilterManager();

// ClassFilters.loadFilter(CharacteristicsFilter, true, 'Include');
// ClassFilters.loadFilter(CharacteristicsFilter, false, 'Exclude');
// ClassFilters.loadFilter(ContainerFilter, true);

function content() {
  const dispatch = useDispatch();
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );

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
    dispatch(moveModalQuerySet(queryNew));
  }
  // Calculate storage amount prices
  let totalAmount = 0 as any;
  let storageDataToUse = inventoryFilters.storageFiltered;
  if (
    storageDataToUse.length == 0 &&
    inventoryFilters.storageFilter.length == 0
  ) {
    storageDataToUse = inventory.storageInventory;
  }
  let inventoryFilter = searchFilter(
    storageDataToUse,
    inventoryFilters,
    fromReducer
  );

  let totalHighlighted = 0 as any;

  inventoryFilter.forEach((projectRow) => {
    let filtered = fromReducer.totalToMove.filter(
      (row) => row[0] == projectRow.item_id
    );
    if (filtered.length > 0) {
      totalHighlighted +=
        pricesResult.prices[
          projectRow.item_name + projectRow.item_wear_name || ''
        ]?.[settingsData.source.title] *
        settingsData.currencyPrice[settingsData.currency] *
        filtered[0][2].length;
    }
    let individualPrice =
      projectRow.combined_QTY *
      pricesResult.prices[
        projectRow.item_name + projectRow.item_wear_name || ''
      ]?.[settingsData.source.title] *
      settingsData.currencyPrice[settingsData.currency];
    totalAmount += individualPrice = individualPrice ? individualPrice : 0;
  });
  totalHighlighted = totalHighlighted.toFixed(0);
  totalAmount = totalAmount.toFixed(0);
  addMajorsFilters(inventoryFilter).then((returnValue) => {
    ClassFilters.loadFilter(returnValue, true);
  });

  return (
    <div className="bg-white mt-8">
      {/* Filters */}

      <MoveModal />

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative grid items-center border-b dark:bg-dark-level-one dark:border-opacity-50 "
      >
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group text-gray-700 font-medium flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {inventoryFilters.storageFilter.length == 0
                  ? inventoryFilters.storageFilter.length + ' Filters'
                  : inventoryFilters.storageFilter.length + ' Filter'}
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400"
                onClick={() => dispatch(moveFromClearAll())}
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
                value={fromReducer.searchInput}
                className="block w-full pb-0.5  focus:outline-none dark:text-dark-white pl-9 sm:text-sm border-gray-300 h-7 dark:bg-dark-level-one dark:rounded-none dark:bg-dark-level-one dark:rounded-none"
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
                  onClick={() =>
                    downloadReport(settingsData, pricesResult, inventoryFilter)
                  }
                  className={classNames(
                    inventory.storageInventory.length == 0
                      ? 'pointer-events-none border-gray-100'
                      : 'hover:shadow-sm border-gray-200 ',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:bg-dark-level-three dark:border-none dark:border-opacity-0 dark:text-dark-white   text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                  )}
                >
                  <DocumentDownloadIcon
                    className="mr-3 h-4 dark:text-dark-white w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  Download
                </Link>
              </div>
              <div className="pl-3">
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
                      ? 'pointer-events-none border-gray-100 bg-dark-level-one'
                      : 'shadow-sm border-gray-200 bg-dark-level-three',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:border-none dark:border-opacity-0 dark:text-dark-white text-sm font-medium rounded-md text-gray-700 hover:bg-dark-level-four  sm:order-0 sm:ml-0'
                  )}
                >
                  Move
                  <SaveAsIcon
                    className="ml-3 dark:text-dark-white h-4 w-4 text-gray-700"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <StorageFilterDisclosure ClassFilters={ClassFilters} />
      </Disclosure>
    </div>
  );
}

export default function StorageFilter() {
  return content();
}
