/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { classNames } from '../filters/inventoryFunctions';

export default function NotificationElement({
  success,
  titleToDisplay,
  textToDisplay,
  doShow,
  setShow,
}) {
  const settingsData = useSelector((state: any) => state.settingsReducer);
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className={classNames(settingsData.os == 'win32' ? 'pt-7' : '', "w-full flex flex-col items-center space-y-4 sm:items-end")}>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={doShow}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-sm dark:bg-dark-level-four w-full bg-white shadow-lg rounded-lg pointer-events-auto mt-0 lg:mt-0 md:mt-12 ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {success ? (
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircleIcon
                        className="h-6 w-6 text-red-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm  dark:text-dark-white font-medium text-gray-900">
                      {titleToDisplay}
                    </p>
                    <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">
                      {textToDisplay}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white dark:bg-dark-level-four rounded-md inline-flex text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
