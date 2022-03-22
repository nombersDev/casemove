import { RefreshIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "renderer/components/content/shared/animations";
import { classNames } from "renderer/components/content/shared/inventoryFunctions";
import TradeUpPicker from "./inventoryPickers";

export default function settingsPage() {
  const [getLoadingButton, setLoadingButton] = useState(false);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  setLoadingButton

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }


  return (
    <>
      {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Page title & actions */}
        <div className="border-b border-gray-200 px-4  py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate dark:text-dark-white">
              Trade up contracts
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => refreshInventory()}
            className={classNames(settingsData.darkmode ? 'focus:outline-none focus:bg-dark-level-four' : 'focus:outline-none focus:bg-gray-100', 'order-1 ml-3  order-1 inline-flex items-center px-4 py-2 hover:border hover:shadow-sm dark:hover:bg-dark-level-four  text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 sm:order-0 sm:ml-0')}

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

        {/* Content area */}

        <div className="">
        <div className="flex-1 relative z-0 flex  h-screen-fixed">
            <main className="flex-1 relative z-0 overflow-y-auto absolute">
              {/* Start main area*/}
              <div className="inset-0">
                <TradeUpPicker />
              </div>
              {/* End main area */}
            </main>
            <aside className="hidden absolute relative xl:flex xl:flex-col flex-shrink-0 w-96 border-l dark:border-opacity-50  border-gray-200 overflow-y-auto">
              {/* Start secondary column (hidden on smaller screens) */}
              <div className="inset-0 py-6 px-4 sm:px-6 lg:px-8">
              </div>
              {/* End secondary column */}
            </aside>
          </div>

        </div>
      </div>
    </>
  );
}
