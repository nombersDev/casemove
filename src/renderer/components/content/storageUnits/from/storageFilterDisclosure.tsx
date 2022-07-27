import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { Filter, Filters } from 'renderer/interfaces/filters';
import _ from 'lodash';
import { State } from 'renderer/interfaces/states';
import { storageInventoryAddOption } from 'renderer/store/actions/filtersInventoryActions';



export default function StorageFilterDisclosure({ClassFilters}) {
  const dispatch = useDispatch();
  const ReducerClass = new ReducerManager(useSelector)
  const currentState: State = ReducerClass.getStorage()


  const inventoryFilters = currentState.inventoryFiltersReducer
  const inventory = currentState.inventoryReducer
  const pricesResult = currentState.pricingReducer
  const settingsData = currentState.settingsReducer


  // Update selected filter
  async function addRemoveFilter(filterValue: Filter) {
    dispatch(
      await storageInventoryAddOption(currentState,
        filterValue
      )
    );
  }


  let inventoryToUse = [] as any;
  let filteredToUse = inventoryFilters.storageFiltered;
  let filterToUse = inventoryFilters.storageFilter;

  if (
    filteredToUse.length == 0 &&
    filterToUse.length == 0
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

  let totalSeen = 0;
  let ignoreCategories: Array<Filter> = []

  Object.entries(ClassFilters.filters as Filters).map(([_key, filterObject]) => {
    filterObject.map((filter, _optionIdx) => {
      if (filterToUse.filter(filt => _.isEqual(filt, filter)).length > 0) {
        totalSeen += 1
        ignoreCategories.push(filter)
      }
    });
  });
  let categoriesToRemove: Array<Filter> = []
  if (filterToUse.length > totalSeen) {
    filterToUse.forEach(element => {
      if (!_.some(ignoreCategories, element) && element.label != 'Storage moveable') {
        categoriesToRemove.push(element)
      }
    });
  }
  categoriesToRemove.forEach(element => {
    addRemoveFilter(element)
  });




  return (
    <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="mx-auto grid grid-cols-1 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8 ">
            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-3 md:gap-x-6">
            {Object.entries(ClassFilters.filters as Filters).map(([key, filterObject]) => (
              <fieldset>
              <legend className="block font-medium dark:text-dark-white">{key}</legend>
              <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                {filterObject.map((filter, optionIdx) => (
                  <div
                      key={filter.label + filter.include}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`${filter.label + filter.include}-${optionIdx}`}
                        name="price[]"
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        onClick={() => addRemoveFilter(filter)}
                        checked={
                          filterToUse.filter(filt => _.isEqual(filt, filter)).length > 0
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          e;
                        }}
                      />
                      <label
                        htmlFor={`${filter.label + filter.include}-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600 dark:text-gray-400"
                      >
                        {filter.label}
                      </label>
                    </div>
                ))}

                    </div>
              </fieldset>
                  ))}

            </div>
          </div>
        </Disclosure.Panel>
  );
}
