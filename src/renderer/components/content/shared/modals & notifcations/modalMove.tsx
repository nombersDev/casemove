/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelModal,
  closeMoveModal,
  modalResetStorageIdsToClearFrom,
  moveModalAddToFail,
  moveModalResetPayload,
  moveModalUpdate,
} from 'renderer/store/actions/modalMove actions';
import { moveToClearAll } from 'renderer/store/actions/moveToActions';
import {
  moveFromClearAll,
  moveFromReset,
} from 'renderer/store/actions/moveFromActions';

export default function MoveModal() {
  // const [hasRun, setRun] = useState(false);
  const [seenID, setID] = useState('');
  const [seenStorage, setStorage] = useState('');
  const dispatch = useDispatch();
  const modalData = useSelector((state: any) => state.modalMoveReducer);
  async function cancelMe() {
    dispatch(closeMoveModal());
    dispatch(cancelModal(modalData.modalPayload['key']));

    dispatch(closeMoveModal());
    if (modalData.modalPayload['type'] == 'to') {
      dispatch(moveToClearAll());
    }
    if (modalData.modalPayload['type'] == 'from') {
      window.electron.ipcRenderer.moveFromStorageUnit(
        modalData.modalPayload['storageID'],
        modalData.modalPayload['itemID']
      );
      dispatch(moveFromClearAll());
    }
    dispatch(modalResetStorageIdsToClearFrom());
    dispatch(moveModalResetPayload());
  }

  const fastMode = true;

  async function runModal() {
    if (modalData.moveOpen) {
      if (modalData.doCancel.includes(modalData.modalPayload['key']) == false) {
        if (modalData.modalPayload['type'] == 'to') {
          console.log(
            'Sending to command',
            modalData.modalPayload['storageID']
          );
          if (fastMode) {
            window.electron.ipcRenderer.moveToStorageUnit(
              modalData.modalPayload['storageID'],
              modalData.modalPayload['itemID'],
              fastMode
            );
            await new Promise(r => setTimeout(r, 25));
          } else {
            try {
              await window.electron.ipcRenderer.moveToStorageUnit(
                modalData.modalPayload['storageID'],
                modalData.modalPayload['itemID'],
                fastMode
              );
            } catch {
              dispatch(moveModalAddToFail());
            }
          }
        
          dispatch(moveModalUpdate());
          if (modalData.modalPayload['isLast']) {
            dispatch(moveToClearAll());
          }
        }
        if (modalData.modalPayload['type'] == 'from') {
          if (fastMode) {
            window.electron.ipcRenderer.moveFromStorageUnit(
              modalData.modalPayload['storageID'],
              modalData.modalPayload['itemID']
            );
            await new Promise(r => setTimeout(r, 25));

          } else {
            try {
              await window.electron.ipcRenderer.moveFromStorageUnit(
               modalData.modalPayload['storageID'],
               modalData.modalPayload['itemID']
             );
             // await new Promise(r => setTimeout(r, 25));
           } catch {
             dispatch(moveModalAddToFail());
           }

          }
          
          dispatch(moveModalUpdate());
        }

      }
    }
  }
  if (
    Object.keys(modalData.modalPayload).length !== 0 &&
    seenID != modalData.modalPayload.itemID
  ) {
    console.log('Running');
    // setRun(true)
    console.log(
      modalData.modalPayload !== {},
      Object.keys(modalData.modalPayload).length
    );
    console.log(
      Object.keys(modalData.modalPayload),
      modalData.modalPayload,
      modalData.modalPayload.itemID
    );
    if (modalData.modalPayload.storageID != seenStorage) {
      dispatch(moveFromReset());
    }
    setStorage;
    setID(modalData.modalPayload.itemID);
    runModal();
  }
  const devMode = false;

  return (
    <Transition.Root
      show={
        modalData.doCancel.includes(modalData.modalPayload['key'])
          ? false
          : Object.keys(modalData.modalPayload).length == 0
          ? devMode
          : modalData.moveOpen
      }
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => cancelMe()}
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center  justify-center h-14 w-14 rounded-full bg-blue-500">
                  <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-blue-500 opacity-75"></span>
                  <span className="text-white">
                    {modalData.modalPayload['number']}
                  </span>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {modalData.modalPayload['name']}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please wait while the app moves your items.
                    </p>

                    {modalData.totalFailed == 0 ? (
                      ''
                    ) : (
                      <p className="text-sm text-red-500">
                        Total failed: {modalData.totalFailed}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <span className="mr-3 text-gray-500 dark:text-dark-white text-xs font-medium uppercase tracking-wide">

          </span>


              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => cancelMe()}
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-wrap content-center items-center justify-center mr-3 mt-2 text-gray-400 dark:text-dark-white text-xs font-medium uppercase tracking-wide">

          {/* This element is to trick the browser into centering the modal contents.
            <div>
              ENABLE FAST MODE
            </div> */}




          </div>
            </div>

          </Transition.Child>

        </div>
      </Dialog>
    </Transition.Root>
  );
}
