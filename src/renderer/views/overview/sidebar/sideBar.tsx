import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { tradeUpAddRemove } from 'renderer/store/actions/tradeUpActions';
import PossibleOutcomes from './possibleOutcomes';

export default function TradeUpSideBar() {
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const [itemHover, setItemHover] = useState('');
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

  return (
    <div>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 dark:bg-dark-level-two dark:border-opacity-50 items-center">
        <div className="flex justify-center items-center">
        <div className="">
              <div className="flex items-center flex-nowrap">
                {productsToUse.map((projectRow) => (
                  <div
                    className="flex flex-shrink-0 -space-x-1"
                    key={projectRow.item_id}
                  >
                    {projectRow.item_name == 'EMPTY' ? (
                      <div
                      className={classNames(
                        'max-w-none h-8 w-8 rounded-full  object-cover border border-gray-300 border-dashed rounded-full'
                      )}

                    />
                    ) : (
                      <button
                        title={projectRow.item_paint_wear?.toString()?.substr(0, 9)}
                        onClick={() => dispatch(tradeUpAddRemove(projectRow))}
                      >
                        <img
                          onMouseEnter={() => setItemHover(projectRow.item_id)}
                          onMouseLeave={() => setItemHover('')}
                          className={classNames(
                            itemHover == projectRow.item_id
                              ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                              : '',
                            'max-w-none h-8 w-8 transition duration-500 ease-in-out  dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300'
                          )}
                          src={
                            'https://raw.githubusercontent.com/steamdatabase/gametracking-csgo/108f1682bf7eeb1420caaf2357da88b614a7e1b0/csgo/pak01_dir/resource/flash/' +
                            projectRow.item_url +
                            '.png'
                          }
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
      <div className="px-4 py-5">
        <PossibleOutcomes />
      </div>
    </div>
  );
}
