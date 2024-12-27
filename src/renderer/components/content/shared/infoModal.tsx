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
                    Casemove has been replaced by Skinledger
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Casemove is no longer being maintained. Skinledger is the
                      new version of Casemove. Prices, images and items will
                      break in Casemove eventually. The free version of
                      Skinledger allows you the same features you currently have
                      in Casemove.
                      <br />
                      <br />
                      The app also has a lot more features than Casemove, such
                      as:
                      <br />
                      <br />
                      - Pricing sources: Buff, Youpin, CSFloat and live steam
                      market prices
                      <br />
                      - Move directly between different storage units
                      <br />
                      - Trade up contracts with blueprints and automations
                      <br />
                      - Automation rules for moving items to storage units
                      <br />
                      - Buying storage units from the in-game store
                      <br />
                      - Steam Market: create listing, instant searching, buy
                      order tools and more
                      <br />
                      - Better trade offer tools
                      <br />
                      <br />A lot more features!
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href="https://skinledger.com"
                      target="_blank"
                      className="w-full flex"
                    >
                      <button
                        type="button"
                        className="focus:bg-indigo-700 w-full group relative flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 129.36 18.13"
                          fill="currentColor"
                          className="inline-block h-6 w-auto"
                        >
                          <path d="M34.06 14.38c-1.26 0-2.31-.28-3.14-.85-.83-.56-1.34-1.42-1.53-2.56l1.93-.46c.11.55.29.99.54 1.31.26.32.57.55.96.68.38.13.8.2 1.24.2.66 0 1.16-.13 1.52-.38.36-.26.53-.58.53-.99s-.17-.7-.5-.89c-.34-.19-.83-.34-1.49-.46l-.69-.12c-.67-.12-1.28-.3-1.83-.52-.55-.23-.99-.54-1.31-.95s-.48-.92-.48-1.55c0-.94.35-1.67 1.05-2.19.7-.52 1.62-.78 2.78-.78s2.03.25 2.75.76c.72.5 1.18 1.19 1.4 2.05l-1.93.54c-.12-.6-.38-1.03-.77-1.28s-.87-.37-1.45-.37-1.01.1-1.33.31c-.32.21-.48.5-.48.88 0 .4.16.7.47.89.32.19.74.33 1.28.42l.7.12c.71.12 1.36.29 1.95.5.59.22 1.06.52 1.4.93s.51.94.51 1.61c0 .99-.37 1.77-1.11 2.32-.74.55-1.73.83-2.98.83ZM40.57 14.1V0h2.08v8.04h.32l3.91-3.87h2.76l-5.02 4.81 5.18 5.12h-2.74l-4.09-4.13h-.32v4.13h-2.08ZM52.72 2.82c-.4 0-.74-.13-1.02-.39s-.41-.6-.41-1.02.14-.76.41-1.02c.28-.26.61-.39 1.02-.39s.76.13 1.03.39.4.6.4 1.02-.14.76-.4 1.02c-.27.26-.61.39-1.03.39ZM51.67 14.1V4.17h2.08v9.93h-2.08ZM56.83 14.1V4.17h2.03v1.49h.32c.19-.4.52-.78 1.01-1.13.48-.35 1.2-.52 2.16-.52.75 0 1.42.17 2 .5.58.34 1.04.81 1.38 1.42s.5 1.35.5 2.21v5.96h-2.08V8.3c0-.86-.21-1.49-.64-1.9-.43-.41-1.02-.61-1.77-.61-.86 0-1.55.28-2.07.85-.52.56-.78 1.38-.78 2.46v5.02h-2.08ZM69.22 14.1V0h2.08v14.1h-2.08ZM78.93 14.38c-1.01 0-1.89-.21-2.64-.63s-1.34-1.02-1.76-1.79c-.42-.77-.63-1.67-.63-2.69v-.24c0-1.03.21-1.94.63-2.71.42-.77 1-1.37 1.74-1.79.75-.42 1.61-.63 2.59-.63s1.79.21 2.51.63c.72.42 1.28 1.01 1.68 1.76s.6 1.63.6 2.64v.79h-7.64c.03.87.32 1.57.88 2.09s1.25.78 2.09.78c.78 0 1.37-.17 1.76-.52.4-.35.7-.75.92-1.21l1.71.89c-.19.38-.46.77-.82 1.19-.36.42-.82.77-1.4 1.05s-1.32.42-2.22.42Zm-2.9-6.27h5.5c-.05-.75-.32-1.34-.81-1.76s-1.12-.63-1.89-.63-1.41.21-1.9.63c-.49.42-.79 1.01-.9 1.76ZM90.25 14.38c-.82 0-1.58-.2-2.28-.6-.7-.4-1.26-.98-1.68-1.74s-.63-1.67-.63-2.75v-.3c0-1.06.21-1.97.63-2.74.42-.77.97-1.35 1.67-1.75.7-.4 1.46-.6 2.3-.6.64 0 1.18.08 1.62.24.44.16.8.37 1.08.61.28.25.5.51.65.78h.32V0H96v14.1h-2.03v-1.41h-.32c-.26.43-.64.82-1.16 1.17-.52.35-1.26.52-2.23.52Zm.58-1.81c.9 0 1.64-.29 2.23-.87.58-.58.88-1.4.88-2.48v-.18c0-1.06-.29-1.88-.87-2.46-.58-.58-1.32-.87-2.24-.87s-1.62.29-2.21.87-.88 1.4-.88 2.46v.18c0 1.07.29 1.9.88 2.48.58.58 1.32.87 2.21.87ZM98.57 9.19v-.3c0-1.05.21-1.94.63-2.68s.98-1.31 1.68-1.71c.7-.4 1.46-.6 2.3-.6.97 0 1.71.18 2.23.54.52.36.9.75 1.14 1.17h.32V4.18h2.01v11.97c0 .6-.18 1.09-.53 1.45-.36.36-.84.54-1.46.54h-6.69v-1.81h6.04c.39 0 .58-.2.58-.6v-3.16h-.32c-.15.24-.36.49-.62.75-.27.26-.62.46-1.06.62-.44.16-.98.24-1.64.24-.83 0-1.6-.2-2.31-.59a4.32 4.32 0 0 1-1.68-1.71c-.42-.75-.63-1.63-.63-2.67Zm5.18 3.16c.9 0 1.64-.29 2.23-.86s.88-1.36.88-2.37v-.18c0-1.03-.29-1.83-.87-2.39-.58-.56-1.32-.84-2.24-.84s-1.62.28-2.21.84-.88 1.35-.88 2.39v.18c0 1.01.29 1.8.88 2.37s1.32.86 2.21.86ZM116.5 14.38c-1.01 0-1.89-.21-2.64-.63s-1.34-1.02-1.76-1.79c-.42-.77-.63-1.67-.63-2.69v-.24c0-1.03.21-1.94.63-2.71.42-.77 1-1.37 1.74-1.79.75-.42 1.61-.63 2.59-.63s1.79.21 2.51.63c.72.42 1.28 1.01 1.68 1.76s.6 1.63.6 2.64v.79h-7.64c.03.87.32 1.57.88 2.09s1.25.78 2.09.78c.78 0 1.37-.17 1.76-.52.4-.35.7-.75.92-1.21l1.71.89c-.19.38-.46.77-.82 1.19-.36.42-.82.77-1.4 1.05s-1.32.42-2.22.42Zm-2.9-6.27h5.5c-.05-.75-.32-1.34-.81-1.76s-1.12-.63-1.89-.63-1.41.21-1.9.63c-.49.42-.79 1.01-.9 1.76ZM123.71 14.1V4.17h2.03v1.17h.32c.16-.42.42-.72.78-.92.35-.19.8-.29 1.32-.29h1.19V6h-1.27c-.67 0-1.22.18-1.65.55-.43.37-.64.94-.64 1.7v5.84h-2.08ZM21.04 1.5l2.82 4.17h-11.7L9.48 9.18H4.24L10.1 1.5h10.94zM2.82 16.34 0 12.17h11.7l2.68-3.52h5.24l-5.86 7.69H2.82z"></path>
                        </svg>
                      </button>
                    </a>
                    <div className="flex gap-2 w-full justify-center">
                      <a
                        href="https://discord.gg/n8QExYF7Qs"
                        target="_blank"
                        className="w-full"
                      >
                        <button
                          type="button"
                          className="focus:bg-indigo-700 w-full group relative w-full flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
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
