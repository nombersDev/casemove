import StorageFilter from './fromFilters';
import StorageRow from './fromStorageRow';
import StorageSelectorContent from './fromSelector';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sortDataFunction } from '../../shared/inventoryFunctions';
import { useState } from 'react';
import { moveFromSetSortOption } from 'renderer/store/actions/moveFromActions';
import { inventorySetStoragesData } from 'renderer/store/actions/inventoryActions';
import { SelectorIcon } from '@heroicons/react/solid';

function StorageUnits() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  const dispatch = useDispatch();
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const [getStorage, setStorage] = useState(inventory.storageInventory);


  async function onSortChange(sortValue) {
    dispatch(moveFromSetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      inventory.storageInventory,
      pricesResult.prices,
      settingsData?.source?.title
    );
    dispatch(inventorySetStoragesData(storageResult));
  }
  onSortChange
  async function storageResult() {
    let storageResult = await sortDataFunction(
      fromReducer.sortValue,
      inventory.storageInventory,
      pricesResult.prices,
      settingsData?.source?.title
    );

    setStorage(storageResult);
  }

  storageResult();
  if (fromReducer.sortBack == true) {
    getStorage.reverse()
  }

  return (
    <>
      {/* Storage units */}
      <StorageSelectorContent />

      <StorageFilter />

      {/* Projects table (small breakpoint and up) */}

      <div className="hidden sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200 dark:border-opacity-50">
          <table className="min-w-full">
            <thead className="dark:bg-dark-level-two bg-gray-50">
          <tr className={classNames(settingsData.os == 'win32' ? 'top-7' : 'top-0', 'border-gray-200 sticky')}>
                <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button onClick={() => onSortChange('Product name')}
                  className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                  <span className='flex justify-between'>Product  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>
                <th
                className="table-cell px-6 py-2 border-b border-gray-200 pointer-events-auto bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
                    <button onClick={() => onSortChange('Price')}
                     className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                      <span className='flex justify-between'>Price  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>
                <th
                className="hidden xl:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">

                  <button onClick={() => onSortChange('Stickers')}
                  className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>

                  <span className='flex justify-between'>Stickers/Patches  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>

                <th
                className="hidden md:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two">
                  <button onClick={() => onSortChange('StorageName')}
                  className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                  <span className='flex justify-between'>Storage  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>
                <th
                  className="hidden md:table-cell px-6 py-2 border-b bg-gray-50 border-gray-200 dark:border-opacity-50 dark:bg-dark-level-two  ">

                    <button onClick={() => onSortChange('tradehold')}
                  className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>

                  <span className='flex justify-between'>Tradehold  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>
                <th
                  className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 text-center dark:border-opacity-50 dark:bg-dark-level-two">
                  <button onClick={() => onSortChange('QTY')}
                  className='text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>

                  <span className='flex justify-between'>QTY  <SelectorIcon className='h-2'/></span>
                    </button>
                </th>
                <th
                  className="hidden md:table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two">
                  <button
                  className='text-gray-500 dark:text-gray-400 pointer-events-none tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400'>
                  Move
                    </button>
                </th>
                <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50  dark:border-opacity-50 dark:bg-dark-level-two text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="md:hidden">move</span>
                </th>
                <th className="md:hidden table-cell px-6 py-2 border-b border-gray-200 bg-gray-50   dark:border-opacity-50 dark:bg-dark-level-two text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="md:hidden"></span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-500 dark:text-gray-400 dark:bg-dark-level-one">
              {getStorage.map((project) => (
                <tr
                  key={project.item_id}
                  className={classNames(
                    project.item_name
                      ?.toLowerCase()
                      .includes(fromReducer.searchInput?.toLowerCase().trim()) ||
                      project.item_customname
                        ?.toLowerCase()
                        .includes(fromReducer.searchInput?.toLowerCase().trim()) ||
                        project.item_wear_name
                          ?.toLowerCase()
                          .includes(fromReducer.searchInput?.toLowerCase().trim())
                      ? ''
                      : 'hidden',
                    'hover:shadow-inner'
                  )}
                >
                  <StorageRow projectRow={project} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function FromMainComponent() {
  return (
    <Router>
      <Route path="/" component={StorageUnits} />
    </Router>
  );
}
