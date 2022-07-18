import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  CheckCircleIcon,
  CollectionIcon,
  ScaleIcon,
  VariableIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PricingAmount from 'renderer/components/content/shared/filters/pricingAmount';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import TradeModal from 'renderer/components/content/shared/modals & notifcations/modalTrade';
import { setTradeMove } from 'renderer/store/actions/modalTrade';
import TradeUpPicker from './inventoryPickers';
import TradeUpSideBar from './sidebar/sideBar';
import TradeUpFilters from './filter/tradeUpFilter';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { useState } from 'react';
import { getAllStorages } from 'renderer/functionsClasses/storageUnits/storageUnitsFunctions';
import { LoadingButton } from 'renderer/components/content/shared/animations';

function settingsContent() {
  let ReducerClass = new ReducerManager(useSelector);
  let currentState: State = ReducerClass.getStorage();
  const tradeUpData = currentState.tradeUpReducer
  const settingsData = currentState.settingsReducer

  const dispatch = useDispatch();
  const PricingClass = new ConvertPrices(settingsData, currentState.pricingReducer)
  const [getLoadingButton, setLoadingButton] = useState(false);
  async function getAllStor() {
    setLoadingButton(true)
    getAllStorages(dispatch, currentState).then(() => {
      setLoadingButton(false)
    })
  }



  let totalFloat = 0;
  let totalPrice = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalFloat += element.item_paint_wear as number;
    totalPrice += PricingClass.getPrice(element)
  });
  totalFloat = totalFloat / tradeUpData.tradeUpProducts.length;
  let totalEV = 0;
  tradeUpData.possibleOutcomes.forEach((element) => {
    let individualPrice = PricingClass.getPrice(element);
    totalEV += individualPrice * (element.percentage / 100);
  });

  return (
    <>
      <TradeModal />

      <div>
        {/* Page title & actions */}
        <div className="border-b border-gray-200 px-4 h-14  py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate dark:text-dark-white">
              Trade up contracts
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <div className="flex items-center"></div>
              </div>

              <div className="ml-4 mt-4 flex-shrink-0 flex">


                <PricingAmount
                  totalAmount={totalFloat.toString()?.substr(0, 9)}
                  IconToUse={VariableIcon}
                  colorOf={'text-gray-500'}
                />
                <span className="text-blue-500 pl-2 border-l border-gray-200 dark:border-gray-400" />

                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(totalPrice)}
                  IconToUse={ArrowCircleUpIcon}
                  colorOf={'text-red-500'}
                />


                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(totalEV)}
                  IconToUse={ArrowCircleDownIcon}
                  colorOf={'text-green-500'}
                />
                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(-(totalPrice - totalEV))}
                  colorOf={'text-yellow-500'}
                />
                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                  }).format(
                    (((100 / totalPrice) * totalEV))
                  ) + '  %'}
                  colorOf={'text-yellow-500'}
                  IconToUse={ScaleIcon}

                />

                <span className="flex items-center text-gray-500 text-xs font-medium">
                  <span className="text-blue-500 pl-2 pr-2 border-l border-gray-200 dark:border-gray-400">
                    <button
                      type="button"
                      onClick={() => getAllStor()}
                      className={classNames(currentState.moveFromReducer.activeStorages.length == 0 || getLoadingButton ? 'bg-green-700' : 'bg-dark-level-three',

                        'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:border-opacity-0 dark:text-dark-white text-sm font-medium hover:bg-dark-level-four rounded-md text-gray-700 focus:outline-none sm:order-0 sm:ml-0'
                      )}
                    >
                      {currentState.moveFromReducer.activeStorages.length != 0 ? currentState.moveFromReducer.activeStorages.length + " Storage units loaded" : "Load storage units"}
                      {getLoadingButton ? (
                        <LoadingButton
                          className="ml-3 dark:text-dark-white h-4 w-4 text-gray-700"
                          aria-hidden="true"
                        />
                      ) : (
                        <CollectionIcon
                          className="ml-3 dark:text-dark-white h-4 w-4 text-gray-700"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </span>
                  <span className="text-blue-500 pl-2 border-l border-gray-200 dark:border-gray-400">
                    <button
                      type="button"
                      onClick={() => dispatch(setTradeMove())}
                      className={classNames(
                        tradeUpData.tradeUpProducts.length == 0
                          ? ' border-gray-100 dark:bg-dark-level-two pointer-events-none '
                          : 'shadow-sm border-gray-200 dark:bg-dark-level-three dark:border-none',
                        'order-1 ml-3 inline-flex items-center px-4 py-2 border dark:border-opacity-0 dark:text-dark-white text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                      )}
                    >
                      {'Edit & review'}
                      <CheckCircleIcon
                        className="ml-3 dark:text-dark-white h-4 w-4 text-gray-700"
                        aria-hidden="true"
                      />
                    </button>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}

        <div className="">
          <div
            className={classNames(
              settingsData.os != 'win32'
                ? 'h-screen-tradeup'
                : 'h-screen-tradeup-windows',
              'flex-1 relative z-0 flex  h-screen-fixed '
            )}
          >
            <main className="flex-1 relative z-0 overflow-y-auto absolute">
              {/* Start main area*/}
              <div className="inset-0">
                <TradeUpFilters />
                <TradeUpPicker />
              </div>
              {/* End main area */}
            </main>
            <aside className="hidden absolute relative lg:flex lg:flex-col bg-gray-50 flex-shrink-0 w-96 border-l dark:border-opacity-50  border-gray-200 overflow-y-auto dark:bg-dark-level-one">
              {/* Start secondary column (hidden on smaller screens) */}
              <div className="">
                <TradeUpSideBar />
              </div>
              {/* End secondary column */}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
export default function TradeupPage() {
  return (
    <Router>
      <Route path="/" component={settingsContent} />
    </Router>
  );
}
