import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from '../inventoryFunctions';
import { setTradeMoveResult } from 'renderer/store/actions/modalTrade';
import { tradeUpResetPossible } from 'renderer/store/actions/tradeUpActions';

export default function TradeResultModal() {
  const dispatch = useDispatch();
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const modalData = useSelector((state: any) => state.modalTradeReducer);

  let devMode = false;

  async function setDone() {
    dispatch(setTradeMoveResult())
    dispatch(tradeUpResetPossible())
  }


  return (
    <Transition.Root show={devMode ? true : modalData.openResult} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(setTradeMoveResult())}
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
                <div className='flex items-center justify-center'>
              <img
                          className="max-w-none h-16 w-16 dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300"
                          src={
                            'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                            modalData.rowToMatch?.item_url +
                            '.png'
                          }
                        /></div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-white
                  ">
                    {modalData.rowToMatch.item_name} 
                  </Dialog.Title>
                  <div className="mt-2 dark:text-gray-400 text-lg">
                   Trade Up Contract Reward
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className={classNames(settingsData.darkmode ? '' : 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500', "dark:bg-dark-level-two dark:text-dark-white mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm")}
                  onClick={() => setDone()}
                >
                  Done
                </button>
              </div>
              </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
