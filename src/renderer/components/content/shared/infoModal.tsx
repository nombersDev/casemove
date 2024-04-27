/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
// LOL
/* eslint-disable react/jsx-filename-extension */
// Eww why did I ever have this rule :(((
/* eslint-disable import/prefer-default-export */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function InfoModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-dark-level-two p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    The future of Casemove
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Casemove is still in development, however, this version of
                      Casemove will no longer receive any updates unless it
                      breaks completely. This also means that you won&apos;t be
                      able to see any Copenhagen, Anubis, Kilowatt or other new
                      items in this app until I relaunch the app with an
                      entirely new design during the summer.
                      <br />
                      <br />
                      If you want access to the latest items, you can join the
                      free beta for Skinledger which is essentially the new
                      version of Casemove, but with a lot more features.
                      <br />
                      <br />
                      I understand this may be frustrating for some of you as I
                      know how much you love Casemove, but I promise you that I
                      will still maintain a free version of Casemove that allows
                      you to move items in the game.
                      <br />
                      <br />
                      Thanks for your understanding and if you have any
                      questions, please join the discord where I&apos;ll be
                      happy to answer them.
                    </p>
                  </div>

                  <div className="mt-4">
                    <a href="https://skinledger.com">
                      <button
                        type="button"
                        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Check out skinledger
                      </button>
                    </a>
                    <a href="https://discord.gg/n8QExYF7Qs">
                      <button
                        type="button"
                        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Join the discord
                      </button>
                    </a>
                    <button
                      type="button"
                      className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
