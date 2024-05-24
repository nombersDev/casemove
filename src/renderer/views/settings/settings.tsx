import { Listbox, Switch, Transition } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/outline';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColumnsDropDown from 'renderer/components/content/shared/dropdownRows';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { DispatchIPC } from 'renderer/functionsClasses/rendererCommands/admin';
import {
  setCurrencyValue,
  setDevmode,
  setSteamLoginShow,
} from 'renderer/store/actions/settings';

const sources = [
  {
    id: 1,
    name: 'Steam Community Market',
    title: 'steam_listing',
    isLocked: false,
    avatar: 'https://steamcommunity.com/favicon.ico',
  },
  {
    id: 2,
    name: 'Buff 163',
    title: 'buff163',
    isLocked: true,
    avatar:
      'https://g.fp.ps.netease.com/market/file/59b156975e6027bce06e8f6ceTyFGdsj',
  },
  {
    id: 3,
    name: 'Float ',
    title: 'float',
    isLocked: true,
    avatar: 'https://csfloat.com/assets/n-mini-logo.png',
  },
];
const currencyCode = [
  'AFN',
  'ALL',
  'DZD',
  'AOA',
  'ARS',
  'AMD',
  'AWG',
  'AUD',
  'AZN',
  'BSD',
  'BHD',
  'BBD',
  'BDT',
  'BZD',
  'BMD',
  'BTN',
  'BOB',
  'BAM',
  'BWP',
  'BRL',
  'BND',
  'BGN',
  'BIF',
  'XPF',
  'KHR ',
  'CAD',
  'CVE',
  'KYD',
  'CLP',
  'CLF',
  'CNY',
  'COP',
  'CDF',
  'CRC',
  'HRK',
  'CZK',
  'DKK',
  'DJF',
  'DOP',
  'XCD',
  'EGP',
  'ETB',
  'FJD',
  'GMD',
  'GBP',
  'GEL',
  'GHS',
  'GTQ',
  'GNF',
  'GYD',
  'HTG',
  'HNL',
  'HKD',
  'HUF',
  'ISK',
  'INR',
  'IDR',
  'IRR',
  'IQD',
  'ILS',
  'JMD',
  'JPY',
  'JOD',
  'KZT',
  'KES',
  'KWD',
  'KGS',
  'LAK',
  'LBP',
  'LSL',
  'LRD',
  'LYD',
  'MOP',
  'MKD',
  'MGA',
  'MWK',
  'MYR',
  'MVR',
  'MUR',
  'MXN',
  'MDL',
  'MAD',
  'MZN',
  'MMK',
  'NAD',
  'NPR',
  'ANG',
  'NZD',
  'NIO',
  'NGN',
  'NOK',
  'OMR',
  'PKR',
  'PAB',
  'PGK',
  'PYG ',
  'PHP',
  'PLN',
  'QAR',
  'RON',
  'RUB',
  'RWF',
  'SVC',
  'SAR',
  'RSD',
  'SCR',
  'SLL',
  'SGD',
  'SBD',
  'SOS',
  'ZAR',
  'KRW',
  'VES',
  'LKR',
  'SDG',
  'SRD',
  'SZL',
  'SEK',
  'CHF',
  'TJS',
  'TZS',
  'THB',
  'TOP',
  'TTD',
  'TND',
  'TRY',
  'TMT',
  'UGX',
  'UAH',
  'AED',
  'USD',
  'UYU',
  'UZS',
  'VND',
  'XOF',
  'YER',
  'ZMW',
  'ETH',
  'EUR',
  'LTC',
  'TWD',
  'PEN',
];
export default function settingsPage() {
  const dispatch = useDispatch();
  const settingsData = useSelector((state: any) => state.settingsReducer);

  // Fastmove
  async function updateShowSteamLogin() {
    const correctValue = !(await window.electron.store.get('steamLogin'));
    setShowSteamLogin(correctValue);
    await window.electron.store.set('steamLogin', correctValue);
    dispatch(setSteamLoginShow(correctValue));
  }
  const [showSteamLogin, setShowSteamLogin] = useState(
    settingsData.steamLoginShow
  );

  // Fastmove

  // Dark mode
  async function updateDevMode() {
    const correctValue = !(await window.electron.store.get('devmode.value'));
    setDevModeStatus(correctValue);
    await window.electron.store.set('devmode.value', correctValue);
    dispatch(setDevmode(correctValue));
  }
  const [devModeStatus, setDevModeStatus] = useState(settingsData.devmode);

  // Pricing - currency
  async function updateCurrency(valueToSet) {
    setCurrency(valueToSet);
    dispatch(setCurrencyValue(valueToSet));
    window.electron.store.set('pricing.currency', valueToSet);
    const IPCClass = new DispatchIPC(dispatch);
    IPCClass.run(IPCClass.buildingObject.currency);
  }
  const [currency, setCurrency] = useState(settingsData.currency);

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
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate dark:text-dark-white">
              Settings
            </h1>
          </div>
        </div>

        {/* Content area */}
        <div className="">
          <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                <div className="pb-16">
                  <div className="px-4 sm:px-6 md:px-0">
                    <div className="py-6">
                      {/* Description list with inline editing */}
                      <div className="divide-y divide-gray-200">
                        <div className="">
                          <h3 className="text-lg pt-5 leading-6 font-medium text-gray-900 dark:text-dark-white">
                            General settings
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            Toggles the general application settings
                          </p>
                          <dl className="divide-y divide-gray-200 dark:divide-opacity-50">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Show close popup <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Shows a popup when you login and steam is open
                                  to close it.
                                </span>
                              </dt>

                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Switch
                                    checked={showSteamLogin}
                                    onChange={() => updateShowSteamLogin()}
                                    className={classNames(
                                      showSteamLogin
                                        ? 'bg-indigo-600 dark:bg-indigo-700'
                                        : 'bg-gray-200',
                                      'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        showSteamLogin
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          showSteamLogin
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 12 12"
                                        >
                                          <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={classNames(
                                          showSteamLogin
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-indigo-600"
                                          fill="currentColor"
                                          viewBox="0 0 12 12"
                                        >
                                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                      </span>
                                    </span>
                                  </Switch>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Fastmove <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Increases the speed, moving might fail more
                                  often.
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <p className="text-dark-white">
                                    Skinledger only
                                  </p>
                                  <LockClosedIcon className="h-5 w-5 text-dark-white" />
                                  <Switch
                                    checked={window.electron.store.get(
                                      'fastmove'
                                    )}
                                    className={classNames(
                                      false
                                        ? 'bg-indigo-600 dark:bg-indigo-700'
                                        : 'bg-gray-200',
                                      'relative inline-flex mr-3 opacity-50 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        false
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          false
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 12 12"
                                        >
                                          <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={classNames(
                                          false
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-indigo-600"
                                          fill="currentColor"
                                          viewBox="0 0 12 12"
                                        >
                                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                      </span>
                                    </span>
                                  </Switch>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Dev mode <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Gives addtional dev features
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Switch
                                    checked={devModeStatus}
                                    onChange={() => updateDevMode()}
                                    className={classNames(
                                      devModeStatus
                                        ? 'bg-indigo-600 dark:bg-indigo-700'
                                        : 'bg-gray-200',
                                      'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        devModeStatus
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          devModeStatus
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 12 12"
                                        >
                                          <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={classNames(
                                          devModeStatus
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-indigo-600"
                                          fill="currentColor"
                                          viewBox="0 0 12 12"
                                        >
                                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                      </span>
                                    </span>
                                  </Switch>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Columns <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Select which columns to display
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <ColumnsDropDown />
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="mt-10 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-white">
                            Pricing
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            Set the pricing variables
                          </p>
                          <dl className="divide-y divide-gray-200 dark:divide-opacity-50">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Source <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Select your pricing source
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Listbox
                                    value={{
                                      id: 1,
                                      name: 'Steam Community Market',
                                      title: 'steam_listing',
                                      isLocked: false,
                                      avatar:
                                        'https://steamcommunity.com/favicon.ico',
                                    }}
                                  >
                                    {({ open }) => (
                                      <>
                                        <div className="mt-1 relative">
                                          <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-dark-level-one dark:text-dark-white focus:border-indigo-500 sm:text-sm">
                                            <span className="flex items-center">
                                              <img
                                                src={
                                                  'https://steamcommunity.com/favicon.ico'
                                                }
                                                alt=""
                                                className="flex-shrink-0 h-6 w-6 rounded-full"
                                              />
                                              <span className="ml-3 block truncate">
                                                Steam Community Market
                                              </span>
                                            </span>
                                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                              <SelectorIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          </Listbox.Button>

                                          <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                          >
                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-level-three shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                              {sources.map((source) => (
                                                <Listbox.Option
                                                  key={source.id}
                                                  className={({ active }) =>
                                                    classNames(
                                                      active
                                                        ? 'text-white bg-indigo-600 dark:bg-indigo-700'
                                                        : 'text-gray-900 dark:text-dark-white',
                                                      'cursor-default select-none relative py-2 pl-3 pr-9'
                                                    )
                                                  }
                                                  value={source}
                                                >
                                                  {({ selected, active }) => (
                                                    <>
                                                      <div
                                                        className={classNames(
                                                          'flex items-center',
                                                          source.isLocked
                                                            ? 'opacity-50'
                                                            : ''
                                                        )}
                                                      >
                                                        {source.isLocked ? (
                                                          <LockClosedIcon className="h-5 w-5 mr-2" />
                                                        ) : null}
                                                        <img
                                                          src={source.avatar}
                                                          alt=""
                                                          className="flex-shrink-0 h-6 w-6 rounded-full"
                                                        />
                                                        <span
                                                          className={classNames(
                                                            selected
                                                              ? 'font-semibold'
                                                              : 'font-normal',
                                                            'ml-3 block truncate'
                                                          )}
                                                        >
                                                          {source.name}
                                                        </span>
                                                        {source.isLocked ? (
                                                          <span className="text-xs text-gray-400 ml-2">
                                                            Skinledger
                                                          </span>
                                                        ) : null}
                                                      </div>

                                                      {selected ? (
                                                        <span
                                                          className={classNames(
                                                            active
                                                              ? 'text-white'
                                                              : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                          )}
                                                        >
                                                          <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                          />
                                                        </span>
                                                      ) : null}
                                                    </>
                                                  )}
                                                </Listbox.Option>
                                              ))}
                                            </Listbox.Options>
                                          </Transition>
                                        </div>
                                      </>
                                    )}
                                  </Listbox>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900 dark:text-dark-white">
                                Currency <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Prices will be converted into this currency
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <div>
                                    <select
                                      id="location"
                                      name="location"
                                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-dark-level-one dark:text-dark-white"
                                      value={currency}
                                      onChange={(e) =>
                                        updateCurrency(e.target.value)
                                      }
                                    >
                                      {currencyCode.sort().map((code) => (
                                        <option key={code}>{code}</option>
                                      ))}
                                    </select>
                                  </div>
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
