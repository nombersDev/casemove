import StorageFilter from './toFilters';
import StorageRow from './toStorageRow';
import StorageSelectorContent from './toSelector';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sortDataFunction } from '../../shared/inventoryFunctions';
import { useState } from 'react';

function StorageUnits() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const toReducer = useSelector((state: any) => state.moveToReducer);
  const [getStorage, setStorage] = useState(inventory.storageInventory);
  getStorage;

  async function storageResult() {
    const storageResult = await sortDataFunction(
      toReducer.sortValue,
      inventory.combinedInventory
    );
    setStorage(storageResult);
  }
  storageResult();

  const inventoryMoveable = getStorage.filter(function (item) {
    return item[`item_moveable`] == true;
  });

  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 mt-2 mb-2 text-gray-900 sm:truncate">
            Transfer to storage units
          </h1>
        </div>
      </div>
      {/* Storage units */}
      <StorageSelectorContent />

      <StorageFilter />

      {/* Projects table (small breakpoint and up) */}

      <div className="hidden sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className=" border-gray-200 sticky top-0">
                <th className="table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="lg:pl-2">Product</span>
                </th>

                <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stickers/Patches
                </th>
                <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tradehold
                </th>
                <th className="table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QTY
                </th>
                <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  move
                </th>
                <th className="table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="md:hidden">move</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {inventoryMoveable.map((project) => (
                <tr
                  key={project.item_id}
                  className={classNames(
                    project.item_name
                      ?.toLowerCase()
                      .includes(toReducer.searchInput.toLowerCase())
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

export default function ToContent() {
  return (
    <Router>
      <Route path="/" component={StorageUnits} />
    </Router>
  );
}
