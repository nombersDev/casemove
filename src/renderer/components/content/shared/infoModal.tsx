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

  return (
    <>
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
            <div className="fixed inset-0 bg-black opacity-25" />
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
                    className="text-lg font-medium leading-6 text-dark-white"
                  >
                    The future of Casemove
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Casemove is still in development, however, this version of
                      Casemove will no longer receive any updates unless it
                      breaks completely. This version will be replaced by a new
                      version with a new code base in the future.
                      <br />
                      <br />
                      You can join the free beta for Skinledger which is
                      essentially the new version of Casemove, but with a lot
                      more features.
                      <br />
                      <br />
                      I understand this may be frustrating for some of you as I
                      know how much you love Casemove, but I promise you that I
                      will still maintain a free version of Casemove that allows
                      you to move items in the game. The new version of Casemove
                      will still have it's source code available on GitHub. It
                      won't have the same features that you're used to
                      currently, as many of these are too time consuming and
                      expensive to maintain for free.
                      <br />
                      <br />
                      Trade ups, buff pricing and fastmove have all been
                      disabled in this version of Casemove and you will need to
                      use Skinledger for this going forward.
                      <br />
                      <br />
                      Thanks for your understanding and if you have any
                      questions, please join the discord where I&apos;ll be
                      happy to answer them.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a href="https://skinledger.com" target="_blank">
                      <button
                        type="button"
                        className="focus:bg-indigo-700 group relative w-full flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                      >
                        Skinledger
                      </button>
                    </a>

                    <a href="https://discord.gg/n8QExYF7Qs" target="_blank">
                      <button
                        type="button"
                        className="focus:bg-indigo-700 group relative w-full flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                      >
                        Discord
                      </button>
                    </a>
                    <button
                      type="button"
                      className="focus:bg-indigo-700 group relative w-full flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                      onClick={closeModal}
                    >
                      Close modal
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
