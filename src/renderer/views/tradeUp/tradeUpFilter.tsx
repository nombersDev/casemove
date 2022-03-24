import { SearchIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { tradeUpSetMax, tradeUpSetMin, tradeUpSetSearch } from 'renderer/store/actions/tradeUpActions';

export default function TradeUpFilters() {
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const dispatch = useDispatch();
  let totalFloat = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalFloat += element.item_paint_wear;
  });
  totalFloat = totalFloat / tradeUpData.tradeUpProducts.length;

  let productsToUse = [...tradeUpData.tradeUpProducts];
  while (true) {
    if (productsToUse.length != 10) {
      productsToUse.push({ item_name: 'EMPTY' });
    } else {
      break;
    }
  }
  console.log(productsToUse);
  async function updateMin(valueToSet) {
    if (valueToSet < tradeUpData.MaxFloat) {
      dispatch(tradeUpSetMin(valueToSet))
    }
  }
  async function updateMax(valueToSet) {
    if (valueToSet > tradeUpData.MinFloat) {
      dispatch(tradeUpSetMax(valueToSet))
    }
  }


  return (
    <div>
      <div className="py-5 border-b border-gray-200 dark:bg-dark-level-one dark:border-opacity-50 items-center">
        <div className="flex justify-between">
        <div className="max-w-7xl flex h-8 items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">

            <div className="">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-400"
                onClick={() => console.log()}
              >
                Clear all
              </button>
            </div>

            <label htmlFor="search" className="sr-only">
              Search items
            </label>
            <div className="relative rounded-md focus:outline-none focus:outline-none">
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
                value={tradeUpData.searchInput}
                className="block w-full pb-0.5  focus:outline-none dark:text-dark-white pl-9 sm:text-sm border-gray-300 h-7 dark:bg-dark-level-one dark:rounded-none dark:bg-dark-level-one dark:rounded-none"
                placeholder="Search items"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(tradeUpSetSearch(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex ">
          <div className="hidden xl:block max-w-7xl flex h-8 items-center space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div className="">
            <div className="flex items-center justify-end">
            <p className="text-gray-500 dark:text-gray-400 pr-3">{tradeUpData.MinFloat} min </p>

            <input type="range" min="0" max="1" value={tradeUpData.MinFloat} step="0.01" onChange={(e) => updateMin(e.target.value)} className="bg-dark-level-three h-2 appearance-none" />
            </div>
            <div className="flex items-center justify-end">
            <p className="text-gray-500 dark:text-gray-400 pr-3">{tradeUpData.MaxFloat} max </p>
            <input type="range" min="0" max="1" value={tradeUpData.MaxFloat} step="0.01" onChange={(e) => updateMax(e.target.value)} className="bg-dark-level-three h-2 appearance-none" />
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
