import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
} from '@heroicons/react/solid'
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
  { id: 6, name: 'Rarity'},
  { id: 7, name: 'Collections'}
]


export default function ColumnsDropDown() {
  const settingsData = useSelector((state: any) => state.settingsReducer);


  const [activeColumns, setActiveColums] = useState(settingsData.columns);
  const dispatch = useDispatch();

  async function handleCheck(nameToUse) {
    const chosenActiveCopy = activeColumns.filter(id => id != nameToUse)
    if (activeColumns.includes(nameToUse) == false) {
      chosenActiveCopy.push(nameToUse)
    }
    setActiveColums(chosenActiveCopy)
    dispatch(setColumns(chosenActiveCopy))
    window.electron.store.set('columns', chosenActiveCopy);
    
    window.electron.ipcRenderer.refreshInventory();
    dispatch(moveFromReset())
    
    console.log('Here')
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="focus:border-indigo-500 inline-flex justify-center w-full rounded-md border border-gray-300 dark:bg-dark-level-one dark:text-dark-white  shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          {settingsData.columns.length} Selected
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items  className="origin-top-right z-20 dark:bg-dark-level-three shadow-lg max-h-56 rounded-md py-1  absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div className="py-1">
          {columns.map((column, personIdx) => (
            <Menu.Item>
              {({ active }) => (

          <div key={personIdx} className={classNames(
            active
            ? 'bg-gray-100 text-gray-900 dark:bg-dark-level-two dark:text-dark-white'
            : 'text-gray-700 dark:text-dark-white dark:bg-dark-level-three',
            'relative flex items-start dark:hover:bg-level-one px-4 py-2 text-sm '
          )} >
            <div className="min-w-0 flex-1 text-sm">
              <label htmlFor={`person-${column.id}`} className="font-medium dark:text-dark-white text-gray-700 select-none">
                {column.name}
              </label>
            </div>
            <div className="ml-3 flex items-center h-5">
              <input
                id={`person-${column.id}`}
                name={`person-${column.id}`}
                type="checkbox"
                checked={activeColumns.includes(column.name)}
                onClick={() => handleCheck(column.name)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 dark:text-dark-white border-gray-300 rounded"
              />
            </div>
          </div>

          )}

          </Menu.Item>
          ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
