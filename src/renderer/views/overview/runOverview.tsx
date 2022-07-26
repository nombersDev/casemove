import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  CollectionIcon,
  DatabaseIcon,
  DownloadIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  TagIcon,
} from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { downloadReport } from 'renderer/functionsClasses/downloadReport';
import { LoadButton } from 'renderer/components/content/loadStorageUnitsButton';
import ListBoxOptions from './overviewOptionsDropdown';
import { OverviewLeftCharts, OverviewRightCharts, OveviewBy } from 'renderer/variables/overviewOptions';
import RightGraph from './rightGraph';
import LeftGraph from './leftGraph';



function Content() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let ReducerClass = new ReducerManager(useSelector);
  let currentState: State = ReducerClass.getStorage();
  const userDetails = currentState.authReducer
  const settingsData = currentState.settingsReducer
  const inventory = currentState.inventoryReducer
  let hr = new Date().getHours();
  let goodMessage: string = 'Good Evening';

  if (hr >= 4 && hr < 12) {
    goodMessage = 'Good morning';
  } else if (hr == 12) {
    goodMessage = 'Good noon';
  } else if (hr >= 12 && hr <= 17) {
    goodMessage = 'Good afternoon';
  } else if (hr >= 0 && hr <= 3) {
    goodMessage = 'Wassup';
  }


  // Inventory prices
  const PricingClass = new ConvertPrices(settingsData, currentState.pricingReducer)
  let inventoryValue = 0
  inventory.combinedInventory.forEach(element => {
    const itemPrice = PricingClass.getPrice(element)
    if (!isNaN(itemPrice)) {
      inventoryValue += itemPrice * element.combined_QTY
    }
  });

  let storageUnitsValue = 0
  inventory.storageInventory.forEach(element => {
    const itemPrice = PricingClass.getPrice(element)
    if (!isNaN(itemPrice)) {
      storageUnitsValue += itemPrice * element.combined_QTY
    }
  });


  return (
    <>
      <div className="h-screen bg-dark-level-one">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              ></Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="">
          <main className="flex-1 pb-8 bg-dark-level-one">
            {/* Page header */}
            <div className="bg-dark-level-one shadow border-opacity-50 border-b border-gray-200">
              <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Profile */}
                    <div className="flex items-center">
                      <img
                        className="hidden h-16 w-16 rounded-full sm:block"
                        src={userDetails.userProfilePicture as string}
                        alt=""
                      />
                      <div>
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 rounded-full sm:hidden"
                            src={userDetails.userProfilePicture as string}
                            alt=""
                          />
                          <h1 className="ml-3 text-2xl font-bold leading-7  text-dark-white sm:leading-9 sm:truncate">
                            {goodMessage}, {userDetails.displayName}.
                          </h1>
                        </div>
                        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                          <dd className="mt-3 flex items-center mb-2 text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize text-dark-white">
                          <TagIcon
                              className="flex-shrink-0 mr-1.5 h-5 w- text-gray-400"
                              aria-hidden="true"
                            />
                            
                            <ListBoxOptions optionsObject={OveviewBy} keyToUse={'by'} />
                          </dd>
                          <dd className="flex mb-2 items-center text-sm text-gray-500 font-medium capitalize sm:mr-6 text-dark-white">
                            <PresentationChartBarIcon
                              className="flex-shrink-0 mr-1.5 h-5 w- text-gray-400"
                              aria-hidden="true"
                            />
                            <ListBoxOptions optionsObject={OverviewLeftCharts} keyToUse={'chartleft'} />
                          </dd>
                          <dd className="flex mb-2 items-center text-sm text-gray-500 font-medium capitalize sm:mr-3 text-dark-white">
                            <PresentationChartLineIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5  text-gray-400"
                              aria-hidden="true"
                            />
                            <ListBoxOptions optionsObject={OverviewRightCharts} keyToUse={'chartRight'} />
                          </dd>
                          <dt className="sr-only">Account status</dt>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                    <button
                      onClick={() => downloadReport(settingsData, currentState.pricingReducer, [...inventory.combinedInventory, ...inventory.storageInventory])}
                      className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-dark-white bg-dark-level-three hover:bg-dark-level-four"
                    >
                      {' '}
                      <DownloadIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-dark-white"
                        aria-hidden="true"
                      />
                      Download all
                    </button>

                    <LoadButton />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-dark-level-one">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card */}
                  <div
                    key="all card"
                    className="bg-dark-level-three overflow-hidden shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DatabaseIcon
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-dark-white truncate">
                              Total
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-green-500">
                                {new Intl.NumberFormat(settingsData.locale, {
                                  style: 'currency',
                                  currency: settingsData.currency,
                                  maximumFractionDigits: 0,
                                }).format(inventoryValue + storageUnitsValue)}
                              </div>
                              <div className="text-sm text-gray-500">
                                /{' '}
                                {new Intl.NumberFormat('en-US').format(
                                  inventory.totalAccountItems
                                )}{' '}
                                Items
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    key="Storage Units"
                    className="bg-dark-level-three overflow-hidden shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CollectionIcon
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-dark-white truncate">
                              Storage Units
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-green-500">
                                {new Intl.NumberFormat(settingsData.locale, {
                                  style: 'currency',
                                  currency: settingsData.currency,
                                  maximumFractionDigits: 0,
                                }).format(storageUnitsValue)}
                              </div>
                              <div className="text-sm text-gray-500">
                                /{' '}
                                {new Intl.NumberFormat('en-US').format(
                                  inventory.totalAccountItems -
                                  inventory.inventory.length
                                )}{' '}
                                Items
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    key="Inventory items"
                    className="bg-dark-level-three overflow-hidden shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ArchiveIcon
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-dark-white truncate">
                              Inventory
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-green-500">
                                {new Intl.NumberFormat(settingsData.locale, {
                                  style: 'currency',
                                  currency: settingsData.currency,
                                  maximumFractionDigits: 0,
                                }).format(inventoryValue)}
                              </div>
                              <div className="text-sm text-gray-500">
                                /{' '}
                                {new Intl.NumberFormat('en-US').format(
                                  inventory.inventory.length
                                )}{' '}
                                Items
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Activity table (small breakpoint and up) */}
              <div className="hidden sm:block">
                <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-rows-3 grid-flow-col gap-4 mt-2">
                    <div className="align-middle mw-5 pl-5 pr-5 overflow-x-auto row-span-3 overflow-hidden bg-dark-level-three">
                      <LeftGraph />
                    </div>
                    <div className="align-middle mw-5 overflow-x-auto row-span-3 pb-5 shadow overflow-hidden bg-dark-level-three">
                      <RightGraph />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
export default function App() {
  return (
    <Router>
      <Route path="/stats" component={Content} />
    </Router>
  );
}
