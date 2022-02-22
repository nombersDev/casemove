import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setFastMove } from 'renderer/store/actions/settings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function settingsPage() {

  const dispatch = useDispatch();
  const [fastmove, setFastmove] = useState(false);
  async function getFastMove() {
    const newLocal = await window.electron.store.get('fastmove');
    if (newLocal == undefined) {
      await window.electron.store.set('fastmove', false)
      return
    }
    if (newLocal != fastmove) {
      setFastmove(newLocal)
    }
  }
  async function updateValue(keyToGet, stateToSet, stateToGet) {
    const correctValue = !stateToGet
    await window.electron.store.set(keyToGet, correctValue)
    stateToSet(correctValue)
    dispatch(setFastMove(correctValue))
    console.log(await window.electron.store.get(keyToGet))
  }

  getFastMove()

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
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
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
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-900">
                                Fastmove <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Decreases reliability and increases speed.
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Switch
                                    checked={fastmove}
                                    onChange={() => updateValue('fastmove', setFastmove, fastmove)}
                                    className={classNames(
                                      fastmove
                                        ? 'bg-indigo-600'
                                        : 'bg-gray-200',
                                      'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        fastmove
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          fastmove
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
                                          fastmove
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
                              <dt className="text-sm font-medium text-gray-900">
                                Dark mode <br />
                                <span className="text-gray-400">
                                  {' '}
                                  Coming soon
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0"></span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="mt-10 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Pricing
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            Coming soon
                          </p>
                        </div>

                        {/* Content area
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Language
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">English</span>
                                <span className="ml-4 flex-shrink-0">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    Update
                                  </button>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                              <dt className="text-sm font-medium text-gray-500">
                                Date format
                              </dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">DD-MM-YYYY</span>
                                <span className="ml-4 flex-shrink-0 flex items-start space-x-4">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    Update
                                  </button>
                                  <span
                                    className="text-gray-300"
                                    aria-hidden="true"
                                  >
                                    |
                                  </span>
                                  <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                  >
                                    Remove
                                  </button>
                                </span>
                              </dd>
                            </div>
                            <Switch.Group
                              as="div"
                              className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5"
                            >
                              <Switch.Label
                                as="dt"
                                className="text-sm font-medium text-gray-500"
                                passive
                              >
                                Automatic timezone
                              </Switch.Label>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Switch
                                  checked={automaticTimezoneEnabled}
                                  onChange={setAutomaticTimezoneEnabled}
                                  className={classNames(
                                    automaticTimezoneEnabled
                                      ? 'bg-purple-600'
                                      : 'bg-gray-200',
                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-auto'
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      automaticTimezoneEnabled
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                    )}
                                  />
                                </Switch>
                              </dd>
                            </Switch.Group>
                            <Switch.Group
                              as="div"
                              className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200"
                            >
                              <Switch.Label
                                as="dt"
                                className="text-sm font-medium text-gray-500"
                                passive
                              >
                                Auto-update applicant data
                              </Switch.Label>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Switch
                                  checked={autoUpdateApplicantDataEnabled}
                                  onChange={setAutoUpdateApplicantDataEnabled}
                                  className={classNames(
                                    autoUpdateApplicantDataEnabled
                                      ? 'bg-purple-600'
                                      : 'bg-gray-200',
                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-auto'
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      autoUpdateApplicantDataEnabled
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                    )}
                                  />
                                </Switch>
                              </dd>
                            </Switch.Group>
                          </dl>
                        </div> */}
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
