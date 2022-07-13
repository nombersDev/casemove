import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  DocumentDownloadIcon,
  FilterIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterInventoryAddOption,
  filterInventoryClearAll,
  inventoryFilterSetSearch,
} from 'renderer/store/actions/filtersInventoryActions';
import { classNames, downloadReport } from '../shared/filters/inventoryFunctions';
import PricingAmount from '../shared/filters/pricingAmount';
import MoveLeft from '../shared/filters/inventoryAmount';
import AccountAmount from '../shared/filters/accountAmount';
import { searchFilter } from 'renderer/functionsClasses/itemsFilters';
import { ConvertPrices, ConvertPricesFormatted } from 'renderer/functionsClasses/prices';
const filters = {
  onlyMoveable: [
    { value: '1trade_unlock', label: 'Active tradehold' },
    { value: '1item_customname', label: 'Custom name' },
    { value: '1item_has_stickers', label: 'Stickers/Patches applied' },
    { value: '1item_moveable', label: 'Storage moveable' },
  ],
  type: [
    { value: '2characters', label: 'Agents' },
    { value: '2status_icons', label: 'Collectible & Passes' },
    { value: '2weapon_cases', label: 'Containers' },
    { value: '2music_kits', label: 'Music kits' },
    { value: '2patches', label: 'Patches' },
    { value: '2default_generated', label: 'Skins & Knives' },
    { value: '2stickers', label: 'Stickers' },
    { value: '2tools', label: 'Tools' },
  ],
  exclude: [
    { value: '3trade_unlock:', label: 'Active tradehold' },
    { value: '3econ/tools/casket', label: 'Storage Units' },
  ],
};


function content() {
  const dispatch = useDispatch();
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);

  // Update selected filter
  async function addRemoveFilter(filterValue: string) {
    dispatch(
      await filterInventoryAddOption(
        inventory.inventory,
        inventory.combinedInventory,
        inventoryFilters,
        filterValue,
        pricesResult.prices,
        settingsData?.source?.title
      )
    );
  }


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


  // Download function
  const PricesClassFormatted = new ConvertPricesFormatted(settingsData, pricesResult)
  async function sendDownload() {
    inventoryFilter.forEach((element: any) => {
      element.item_price = PricesClassFormatted.getFormattedPrice(element);
      element.item_price_combined = PricesClassFormatted.getFormattedPriceCombined(element);
    });

    downloadReport(inventoryFilter);
  }

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
                  onClick={() => sendDownload()}
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

        <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="mx-auto grid grid-cols-1 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8 ">
            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-3 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium dark:text-dark-white">Characteristics</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.onlyMoveable.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`price-${optionIdx}`}
                        name="price[]"
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        onClick={() => addRemoveFilter(option.value)}
                        checked={
                          inventoryFilters.inventoryFilter.includes(
                            option.value
                          )
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          e;
                        }}
                      />
                      <label
                        htmlFor={`price-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600 dark:text-gray-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium dark:text-dark-white">Type</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.type.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`type-${optionIdx}`}
                        name="type[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        onClick={() => addRemoveFilter(option.value)}
                        checked={
                          inventoryFilters.inventoryFilter.includes(
                            option.value
                          )
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          e;
                        }}
                      />
                      <label
                        htmlFor={`type-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600 dark:text-gray-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium dark:text-dark-white">Exclude</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.exclude.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`exclude-${optionIdx}`}
                        name="exclude[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        onClick={() => addRemoveFilter(option.value)}
                        checked={
                          inventoryFilters.inventoryFilter.includes(
                            option.value
                          )
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          e;
                        }}
                      />
                      <label
                        htmlFor={`exclude-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600 dark:text-gray-400"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </Disclosure.Panel>
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
