import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  ChevronDownIcon,
  SearchIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/solid';
// import MoveModal from '../../shared/modals & notifcations/modalMove';
import { useDispatch, useSelector } from 'react-redux';
import { classNames, sortDataFunction } from '../../shared/inventoryFunctions';
import { inventorySetStoragesData } from 'renderer/store/actions/inventoryActions';
import MoveModal from '../../shared/modals & notifcations/modalMove';
import { moveModalQuerySet } from 'renderer/store/actions/modalMove actions';
import {
  doCancel,
  moveToClearAll,
  moveTosetSearchField,
  moveToSetSortOption,
  moveToSetStorageAmount,
} from 'renderer/store/actions/moveToActions';
doCancel;
const sortOptions = [
  { name: 'Default' },
  { name: 'Category' },
  { name: 'Product name' },
  { name: 'QTY' },
];

function content() {
  const dispatch = useDispatch();
  const toReducer = useSelector((state: any) => state.moveToReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);

  async function onSortChange(sortValue) {
    dispatch(moveToSetSortOption(sortValue));
    const storageResult = await sortDataFunction(
      sortValue,
      inventory.storageInventory
    );
    console.log(storageResult);
    dispatch(inventorySetStoragesData(storageResult));
  }
  async function moveItems() {
    let key = (Math.random() + 1).toString(36).substring(7);
    key;
    let totalCount = 0;
    let queryNew = [] as any;
    for (const [, element] of Object.entries(toReducer.totalToMove)) {
      let elemental = element as any;
      for (const [, itemID] of Object.entries(elemental[2])) {
        queryNew.push({
          payload: {
            name: elemental[3],
            number: toReducer.totalItemsToMove - totalCount,
            type: 'to',
            storageID: toReducer.activeStorages[0],
            itemID: itemID,
            isLast: toReducer.totalItemsToMove - totalCount == 1,
            key: key,
          },
        });
        totalCount++;
      }
    }
    dispatch(moveModalQuerySet(queryNew));
  }
  moveItems;

  // Storage count
  let storageRow = [{item_storage_total: 0}]
  if (toReducer.activeStorages.length != 0) {
    storageRow = inventory.inventory.filter(function (item) {
      if (item.item_id.includes(toReducer.activeStorages[0])) {
        return item
      }
    });
  }
  console.log(storageRow)
  if (storageRow[0].item_storage_total != toReducer.activeStoragesAmount && storageRow[0].item_storage_total != null) {
    dispatch(moveToSetStorageAmount(storageRow[0].item_storage_total))

  }

  return (
    <div className="bg-white mt-8">
      {/* Filters */}

      <MoveModal />

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative z-10 grid items-center border-b"
      >
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div className="">
              <Menu as="div" className="relative inline-block ">
                <div className="flex items-center divide-x divide-gray-200">
                  <div>
                    <Menu.Button className="group inline-flex justify-center items-center text-gray-500 hover:text-gray-900">
                      {toReducer.sortValue == 'Default'
                        ? 'Sort'
                        : toReducer.sortValue}
                      <ChevronDownIcon
                        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <Link
                              to=""
                              className={classNames(
                                option.name == toReducer.sortValue
                                  ? 'font-medium text-gray-900 pointer-events-none'
                                  : 'text-gray-500',
                                active && option.name != toReducer.sortValue
                                  ? 'bg-gray-100'
                                  : '',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() => onSortChange(option.name)}
                            >
                              {option.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-gray-500"
                onClick={() => dispatch(moveToClearAll())}
              >
                Clear all
              </button>
            </div>

            <label htmlFor="search" className="sr-only">
              Search items
            </label>
            <div className="relative rounded-md">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                aria-hidden="true"
              >
                <SearchIcon
                  className="mr-3 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                spellCheck="false"
                value={toReducer.searchInput}
                className="block w-full pb-0.5  focus:outline-none  pl-9 sm:text-sm border-gray-300 rounded-md h-9"
                placeholder="Search items"
                onChange={(e) => dispatch(moveTosetSearchField(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex items-center divide-x divide-gray-200">
              <div>
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <ArchiveIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-green-500">
                    {1000 -
                      toReducer.activeStoragesAmount -
                      toReducer.totalItemsToMove}{' '}
                    left
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <SwitchHorizontalIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-blue-500">
                    {toReducer.totalItemsToMove} Items
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => moveItems()}
                  className={classNames(
                    toReducer.totalItemsToMove == 0 ||
                      toReducer.activeStorages.length == 0
                      ? 'pointer-events-none border-gray-100'
                      : 'shadow-sm border-gray-200',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border   text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-100 sm:order-0 sm:ml-0'
                  )}
                >
                  Insert
                  <UploadIcon
                    className="ml-3 h-4 w-4 text-gray-700"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default function StorageFilter() {
  return content();
}
