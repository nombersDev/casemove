/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationCircleIcon, XIcon } from '@heroicons/react/outline'
// import { LoginIcon } from '@heroicons/react/solid'


export default function SteamCloseModal({ open, setOpen, loginWithouClosingSteam }) {
  async function confirm() {
    setOpen(false)
    await window.electron.ipcRenderer.closeSteam()
    loginWithouClosingSteam()
  }

  async function cancel() {
    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => cancel()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-dark-level-three px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className=" rounded-md text-gray-400 hover:text-gray-500"
                    onClick={() => cancel()}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12  sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon className="h-12 w-12 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-dark-white">
                      Steam is current running
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        You can continue to use the app, but it is recommended to close Steam as it can otherwise require a restart of your pc
                        before Valve allows you to connect to VAC secured servers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center  hover:bg-green-700 text-dark-white shadow-sm px-4 py-2 bg-green-700 text-base font-medium sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => confirm()}
                  >
                    Close and login
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full ml-2 mr-2 inline-flex justify-center  hover:bg-dark-level-four text-dark-white shadow-sm px-4 py-2 bg-dark-level-three text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      loginWithouClosingSteam()
                      setOpen(false)
                    }}
                  >
                    Login without closing
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center  hover:bg-dark-level-four text-dark-white shadow-sm px-4 py-2 bg-dark-level-three text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => cancel()}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
