import StorageFilter from './toFilters';
import StorageRow from './toStorageRow';
import StorageSelectorContent from './toSelector';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { classNames, sortDataFunction } from '../../shared/filters/inventoryFunctions';
import { useState } from 'react';
import { BanIcon, FireIcon } from '@heroicons/react/solid';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { State } from 'renderer/interfaces/states';
import { RowHeader, RowHeaderCondition, RowHeaderPlain } from '../../Inventory/inventoryRows/headerRows';

function StorageUnits() {
  const inventory = useSelector((state: State) => state.inventoryReducer);
  const inventoryFilter = useSelector((state: State) => state.inventoryFiltersReducer);
  const toReducer = useSelector((state: State) => state.moveToReducer);
  const pricesResult = useSelector((state: State) => state.pricingReducer);
  const settingsData = useSelector((state: State) => state.settingsReducer);
  const [getStorage, setStorage] = useState(inventory.storageInventory);
  getStorage;
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  async function ultimateFire() {
    const runIndex = [] as any
    const relevantRows = document.getElementsByClassName(`findRow`);
    Array.from(relevantRows).forEach(function (element, index) {
      if (!element.classList.contains('hidden')) {
        runIndex.push(index)
      }
    });

    for (let index = 0; index < runIndex.length; index++) {
      const indexToRun = runIndex[index];

      // Actual run
      const htmlElement = document.getElementById(`fire-${indexToRun}`);
      if (htmlElement != undefined) {
        if (!htmlElement.classList.contains('hidden')) {
          htmlElement.click();
          await sleep(25);
        }
      }
    }
  }

  async function removeFire() {
    let i = 0;
    const htmlElements = document.getElementsByClassName('removeXButton');
    Array.from(htmlElements).forEach(function (element) {
      console.log(element);
    });
    while (true) {
      const htmlElement = document.getElementById(`removeX-${i}`);
      console.log(htmlElement);
      if (htmlElement != undefined) {
        htmlElement.click();
      } else {
        break;
      }
      i++;
    }
  }

  async function storageResult() {
    const storageResult = await sortDataFunction(
      toReducer.sortValue,
      inventory.combinedInventory,
      pricesResult.prices,
      settingsData?.source?.title
    );
    setStorage(storageResult);
  }
  storageResult();
  if (toReducer.sortBack == true) {
    getStorage.reverse()
  }


  let inventoryMoveable = searchFilter(getStorage, inventoryFilter, toReducer)
  inventoryMoveable = inventoryMoveable.filter(function (item) {
    return item[`item_moveable`] == true;
  });



  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50 ">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium dark:text-dark-white leading-6 mt-2 mb-2 text-gray-900 sm:truncate">
            Transfer to storage units
          </h1>
        </div>
      </div>
      {/* Storage units */}
      <StorageSelectorContent />

      <StorageFilter />

      {/* Projects table (small breakpoint and up) */}

      <div className="hidden sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200 dark:border-opacity-50 dark:text-gray-400">
          <table className="min-w-full">
          <thead className="dark:bg-dark-level-two bg-gray-50">
          <tr className={classNames(settingsData.os == 'win32' ? 'top-7' : 'top-0', 'border-gray-200 sticky')}>
                <RowHeader headerName='Product' sortName='Product name'/>
                <RowHeaderCondition headerName='Collection' sortName='Collection' condition='Collections'/>
                <RowHeaderCondition headerName='Price' sortName='Price' condition='Price'/>
                <RowHeaderCondition headerName='Stickers/Patches' sortName='Stickers' condition='Stickers/patches'/>
                <RowHeaderCondition headerName='Float' sortName='wearValue' condition='Float'/>
                <RowHeaderCondition headerName='Rarity' sortName='Rarity' condition='Rarity'/>
                <RowHeaderCondition headerName='Storage' sortName='StorageName' condition='Storage'/>
                <RowHeaderCondition headerName='Tradehold' sortName='tradehold' condition='Tradehold'/>
                <RowHeader headerName='QTY' sortName='QTY'/>
                <RowHeaderPlain headerName='Move' />

                <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50  dark:border-opacity-50 dark:bg-dark-level-two text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex">
                    <button
                      onClick={() => ultimateFire()}
                      className={classNames(
                        1000 -
                          toReducer.activeStoragesAmount -
                          toReducer.totalItemsToMove ==
                          0 ||
                          toReducer.totalToMove.length == inventoryFilters.inventoryFiltered.length
                          ? 'pointer-events-none text-gray-200 dark:text-gray-600'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      <FireIcon
                        className={classNames(
                          ' h-4 w-4 text-current dark:text-current hover:text-yellow-400 dark:hover:text-yellow-400'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => removeFire()}
                      className={classNames(
                        toReducer.totalToMove.length == 0
                          ? 'pointer-events-none text-gray-200 dark:text-gray-600'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      <BanIcon
                        className={classNames(
                          ' h-4 w-4 text-current dark:text-current hover:text-red-400 dark:hover:text-red-400'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <span className="md:hidden">move</span>
                </th>
                <th className="md:hidden table-cell px-6 py-2 border-b border-gray-200 bg-gray-50   dark:border-opacity-50 dark:bg-dark-level-two text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="md:hidden"></span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-500 dark:bg-dark-level-one">
              {inventoryMoveable.map((project, index) => (
                <tr
                  key={project.item_id}
                  className="hover:shadow-inner findRow"
                >
                  <StorageRow projectRow={project} index={index} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function ToContent() {
  return (
    <Router>
      <Route path="/" component={StorageUnits} />
    </Router>
  );
}
