/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions'
import { Overview, Settings } from 'renderer/interfaces/states'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerManager } from 'renderer/functionsClasses/reducerManager'
import { setOverview } from 'renderer/store/actions/settings'

interface params {
    optionsObject: any
    keyToUse: keyof Overview
}

export default function ListBoxOptions({optionsObject, keyToUse}: params) {
    
    const dispatch = useDispatch();
    const ReducerClass = new ReducerManager(useSelector);
    const settingsData: Settings = ReducerClass.getStorage(ReducerClass.names.settings)
    let selected = settingsData.overview[keyToUse]

    async function updateOverview(valueToset: any) {
        let newOverviewValue: Overview = settingsData.overview
        // @ts-ignore
        newOverviewValue[keyToUse] = valueToset

        dispatch(setOverview(newOverviewValue));
        window.electron.store.set('overview', newOverviewValue);
        window.electron.ipcRenderer.refreshInventory();
      }

  return (
    <Listbox value={selected} onChange={updateOverview}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="bg-dark-level-two relative w-full   shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm">
              <span className="block truncate">{optionsObject[selected]}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {Object.entries(optionsObject).map(([key, name]: any) => (
                  <Listbox.Option
                    key={name}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={key}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}