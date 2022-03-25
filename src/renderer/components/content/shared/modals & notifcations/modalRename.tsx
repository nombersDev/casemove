/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRenameModal } from 'renderer/store/actions/modalMove actions';

export default function RenameModal() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const dispatch = useDispatch();
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const modalData = useSelector((state: any) => state.modalRenameReducer);

  async function renameStorageUnit(newName) {
    console.log(modalData.modalPayload.casketID, newName);
    await window.electron.ipcRenderer.renameStorageUnit(
      modalData.modalPayload.itemID,
      newName
    );
    dispatch(closeRenameModal());
  }
  renameStorageUnit


  const [inputState, setInputState] = useState('');
  return (
    <Transition.Root show={modalData.renameOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(closeRenameModal())}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-opacity-85 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom dark:bg-dark-level-two bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-16 w-16">
                  <img
                    className="w-16 text-green-600"
                    src="https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/econ/tools/casket.png"
                  ></img>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  ></Dialog.Title>
                  <div className="pl-20 pr-20 mt-2">
                    <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 dark:focus-within:ring-indigo-800 dark:focus-within:border-indigo-800">
                      <label
                        htmlFor="name"
                        className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white dark:text-dark-white dark:bg-dark-level-two text-xs font-medium text-gray-900"
                      >
                        New name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full border-0 p-0 focus:outline-none text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm dark:bg-dark-level-two dark:text-dark-white"
                        placeholder={modalData.modalPayload.itemName}
                        onChange={(e) => setInputState(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={classNames(
                    inputState.length == 0
                      ? 'pointer-events-none	bg-indigo-300 dark:bg-dark-level-three'
                      : 'bg-indigo-600', settingsData.darkmode ? '' : 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white  sm:col-start-2 sm:text-sm'
                  )}
                  onClick={() => renameStorageUnit(inputState)}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className={classNames(settingsData.darkmode ? '' : 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500', "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-dark-level-two dark:text-dark-white sm:mt-0 sm:col-start-1 sm:text-sm")}
                  onClick={() => dispatch(closeRenameModal())}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
