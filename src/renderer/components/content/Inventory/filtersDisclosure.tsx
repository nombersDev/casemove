import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterInventoryAddOption,
} from 'renderer/store/actions/filtersInventoryActions';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { Filter } from 'renderer/interfaces/filters';
import { addMajorsFilters, CharacteristicsFilter, ContainerFilter, FilterManager } from 'renderer/variables/filters';
import _ from 'lodash';
import { State } from 'renderer/interfaces/states';

const ClassFilters = new FilterManager()

ClassFilters.loadFilter(CharacteristicsFilter)
ClassFilters.loadFilter(ContainerFilter)

export default function FiltersDisclosure() {
  const dispatch = useDispatch();
  const ReducerClass = new ReducerManager(useSelector)
  const currentState: State = ReducerClass.getStorage()

  const inventoryFilters = currentState.inventoryFiltersReducer
  const inventory = currentState.inventoryReducer
  const pricesResult = currentState.pricingReducer
  const settingsData = currentState.settingsReducer
  addMajorsFilters(inventory.combinedInventory).then((returnValue) => {
    ClassFilters.loadFilter(returnValue)
  })
  // Update selected filter
  async function addRemoveFilter(filterValue: Filter) {
    dispatch(
      await filterInventoryAddOption(currentState,
        filterValue
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
    <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="mx-auto grid grid-cols-1 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8 ">
            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-3 md:gap-x-6">
            {Object.entries(ClassFilters.filters).map(([key, filterObject]) => (
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
                          inventoryFilters.inventoryFilter.filter(filt => _.isEqual(filt, filter)).length > 0
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
