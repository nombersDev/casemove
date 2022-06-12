import { Fragment, useState } from 'react';
import { Menu, Transition, Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setColumns } from 'renderer/store/actions/settings';
import { classNames } from './inventoryFunctions';
import { moveFromReset } from 'renderer/store/actions/moveFromActions';

const columns = [
  { id: 1, name: 'Price' },
  { id: 2, name: 'Float' },
  { id: 3, name: 'Stickers/patches' },
  { id: 4, name: 'Storage' },
  { id: 5, name: 'Tradehold' },
  { id: 6, name: 'Rarity' },
  { id: 7, name: 'Collections' },
];
const inventoryColumns = [
  { id: 8, name: 'Moveable' },
  { id: 9, name: 'Inventory link' },
];
export default function ColumnsDropDown() {
  const settingsData = useSelector((state: any) => state.settingsReducer);

  const [activeColumns, setActiveColums] = useState(settingsData.columns);
  const dispatch = useDispatch();

  async function handleCheck(nameToUse) {
    const chosenActiveCopy = activeColumns.filter((id) => id != nameToUse);
    if (activeColumns.includes(nameToUse) == false) {
      chosenActiveCopy.push(nameToUse);
    }
    setActiveColums(chosenActiveCopy);
    dispatch(setColumns(chosenActiveCopy));
    window.electron.store.set('columns', chosenActiveCopy);

    window.electron.ipcRenderer.refreshInventory();
    dispatch(moveFromReset());

    console.log('Here');
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
        <Popover className="pl-4 relative inline-block text-left">
          <Popover.Button
            className={classNames(
              'focus:border-indigo-500 inline-flex justify-center w-full rounded-md border border-gray-300 dark:bg-dark-level-one dark:text-dark-white  shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
            )}
          >
            {activeColumns.length} Selected
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-top-right absolute right-0 mt-2 z-20 bg-white dark:bg-dark-level-three rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <form className="space-y-4">
                {columns.map((column, _optionIdx) => (
                  <div key={column.id} className="flex items-center">
                    <input
                      id={`person-${column.id}`}
                      name={`person-${column.id}`}
                      type="checkbox"
                      checked={activeColumns.includes(column.name)}
                      onClick={() => handleCheck(column.name)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-dark-white border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`person-${column.id}`}
                      className="ml-3 pr-6 text-sm font-medium dark:text-gray-400 text-gray-900 whitespace-nowrap"
                    >
                      {column.name
                        .replace('The ', '')
                        .replace(' Collection', '')}
                    </label>
                  </div>
                ))}
              </form>
              <div className="mt-3 relative dark:bg-dark-level-three ">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-dark-level-three text-sm text-gray-500">
                  Inventory only
                </span>
              </div>
            </div>
            <form className="space-y-4 mt-2">
                {inventoryColumns.map((column, _optionIdx) => (
                  <div key={column.id} className="flex items-center">
                    <input
                      id={`person-${column.id}`}
                      name={`person-${column.id}`}
                      type="checkbox"
                      checked={activeColumns.includes(column.name)}
                      onClick={() => handleCheck(column.name)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-dark-white border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`person-${column.id}`}
                      className="ml-3 pr-6 text-sm font-medium dark:text-gray-400 text-gray-900 whitespace-nowrap"
                    >
                      {column.name
                        .replace('The ', '')
                        .replace(' Collection', '')}
                    </label>
                  </div>
                ))}
              </form>

            </Popover.Panel>
          </Transition>
        </Popover>
      </Popover.Group>

    </Menu>
  );
}
