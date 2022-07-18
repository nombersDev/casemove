import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  DocumentDownloadIcon,
  FilterIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterInventoryClearAll,
  inventoryFilterSetSearch,
} from 'renderer/store/actions/filtersInventoryActions';
import { classNames } from '../shared/filters/inventoryFunctions';
import PricingAmount from '../shared/filters/pricingAmount';
import MoveLeft from '../shared/filters/inventoryAmount';
import AccountAmount from '../shared/filters/accountAmount';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { downloadReport } from 'renderer/functionsClasses/downloadReport';
import FiltersDisclosure from './filtersDisclosure';



function content() {
  const dispatch = useDispatch();
  const ReducerClass = new ReducerManager(useSelector)
  const inventoryFilters = ReducerClass.getStorage(ReducerClass.names.inventoryFilters)
  const inventory = ReducerClass.getStorage(ReducerClass.names.inventory)
  const pricesResult = ReducerClass.getStorage(ReducerClass.names.pricing)
  const settingsData = ReducerClass.getStorage(ReducerClass.names.settings)

  async function clear_all() {
    dispatch(filterInventoryClearAll());
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

  // Calculate inventory amount prices
  let totalAmount = 0 as any;
  let inventoryFilter = searchFilter(inventoryToUse, inventoryFilters, inventoryFilters)
  const PricesClass = new ConvertPrices(settingsData, pricesResult)
  inventoryFilter.forEach((projectRow) => {
    let itemRowPricing = PricesClass.getPrice(projectRow)
    if (itemRowPricing) {
      let individualPrice = projectRow.combined_QTY as number * itemRowPricing
      totalAmount += individualPrice = individualPrice ? individualPrice : 0
    }
  });
  totalAmount = totalAmount.toFixed(0);


  

  return (
    <div className="bg-white dark:bg-dark-level-one">
      {/* Filters */}

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative  grid items-center border-b dark:border-opacity-50"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className=" max-w-7xl flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group text-gray-700 font-medium flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {inventoryFilters.inventoryFilter.length} Filters
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400"
                onClick={() => clear_all()}
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
                value={inventoryFilters.searchInput}
                className="block w-full pb-0.5  focus:outline-none dark:text-dark-white pl-9 sm:text-sm border-gray-300 h-7 dark:bg-dark-level-one dark:rounded-none dark:bg-dark-level-one dark:rounded-none"
                placeholder="Search items"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(inventoryFilterSetSearch(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center divide-x divide-gray-200">
              <div className="pr-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => downloadReport(settingsData, pricesResult, inventoryToUse)}
                  className={classNames(
                    inventoryToUse.length == 0
                      ? 'pointer-events-none border-gray-100'
                      : 'hover:shadow-sm border-gray-200 ',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:bg-dark-level-three dark:border-none dark:border-opacity-0 dark:text-dark-white   text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                  )}
                >
                  <DocumentDownloadIcon
                    className="mr-3 h-4 w-4 text-gray-500 dark:text-dark-white"
                    aria-hidden="true"
                  />
                  Download
                </Link>
              </div>
              <div className="pl-3">
                <PricingAmount totalAmount={new Intl.NumberFormat(settingsData.locale, { style: 'currency', currency: settingsData.currency }).format(totalAmount)} />
              </div>
              <div className="pl-3">

                <MoveLeft totalAmount={inventory.inventory.length} textToWrite="Total" />
              </div>
              <div className="pl-3">

                <AccountAmount totalAmount={inventory.totalAccountItems} textToWrite="Total" />
              </div>
            </div>
          </div>
        </div>
        <FiltersDisclosure />


      </Disclosure>
    </div>
  );
}

export default function InventoryFilters() {
  return (
    <Router>
      <Route path="/" component={content} />
    </Router>
  );
}
