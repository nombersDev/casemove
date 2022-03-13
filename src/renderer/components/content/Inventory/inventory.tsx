import { BrowserRouter as Router, Route } from 'react-router-dom';
import InventoryFilters from './inventoryFilters';
import InventoryRowsComponent from './inventoryRows';
import { useState } from 'react';
import { LoadingButton } from '../shared/animations';
import { RefreshIcon } from '@heroicons/react/solid';

function content() {
  const [getLoadingButton, setLoadingButton] = useState(false);
  setLoadingButton;

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }

  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-white  sm:truncate">
            Inventory
          </h1>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => refreshInventory()}
            className=" order-1 ml-3 inline-flex items-center px-4 py-2 border dark:hover:bg-dark-level-four dark:bg-dark-level-one border-none dark:border-opacity-0  text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0"
          >
            {getLoadingButton ? (
              <LoadingButton />
            ) : (
              <RefreshIcon
                className="h-4 w-4 text-gray-500 dark:text-dark-white"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
      {/* Pinned projects */}
      <InventoryFilters />

      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Storages
          </h2>
        </div>
      </div>

      {/* Projects table (small breakpoint and up) */}
      <div className="hidden sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200 dark:border-opacity-50">
          <InventoryRowsComponent />
        </div>
      </div>
    </>
  );
}
export default function inventoryContent() {
  return (
    <Router>
      <Route path="/" component={content} />
    </Router>
  );
}
