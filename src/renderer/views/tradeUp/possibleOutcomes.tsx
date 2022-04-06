import { CashIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { classNames } from 'renderer/components/content/shared/inventoryFunctions';
import { tradeUpSetPossible } from 'renderer/store/actions/tradeUpActions';

const rarityShort = {
  'Factory New': 'FN',
  'Minimal Wear': 'MW',
  'Field-Tested': 'FT',
  'Well-Worn': 'WW',
  'Battle-Scarred': 'BS',
};

export default function PossibleOutcomes() {
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const [outcomesRequested, setOutcomesRequested] = useState(false);
  const dispatch = useDispatch();

  let totalPrice = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalPrice += pricesResult.prices[element.item_name]?.['steam_listing'];
  });
  totalPrice;

  tradeUpData.possibleOutcomes.forEach((element) => {
    element['profit_cal'] =
      (100 / (totalPrice * 100)) *
      (pricesResult?.prices[element.item_name]?.['steam_listing'] * 100);
  });
  tradeUpData.possibleOutcomes.sort(function (a, b) {
    var keyA = a.profit_cal,
      keyB = b.profit_cal;
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });

  // Get outcomes
  if (
    tradeUpData.tradeUpProducts.length == 10 &&
    tradeUpData.possibleOutcomes.length == 0
  ) {
    if (outcomesRequested == false) {
      setOutcomesRequested(true);
      window.electron.ipcRenderer
        .getPossibleOutcomes(tradeUpData.tradeUpProducts)
        .then((messageValue) => {
          dispatch(tradeUpSetPossible(messageValue));
        });
    }
  }

  if (outcomesRequested && tradeUpData.tradeUpProducts.length != 10) {
    setOutcomesRequested(false)
  }

  return (
    <div>
      <h2 className="text-gray-500  text-xs font-medium uppercase tracking-wide dark:text-gray-400">
        Possible outcomes
      </h2>
      {tradeUpData.possibleOutcomes.length != 0 ? (
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 ">
          {tradeUpData.possibleOutcomes.map((project, index) => (
            <li key={index} className="col-span-1 flex shadow-sm rounded-md">
              <Link
                to={{
                  pathname:
                    'https://steamcommunity.com/market/listings/730/' +
                    project.item_name +
                    ' (' +
                    project.item_wear_name +
                    ')',
                }}
                target="_blank"
              >
                <div className=" from-gray-100 to-gray-300 dark:from-gray-300 dark:to-gray-400 flex-shrink-0 h-full  flex items-center justify-center w-16 dark:border-opacity-50 text-white border-t border-l border-b border-gray-200 rounded-l-md dark:bg-dark-level-two bg-gradient-to-t">
                  <img
                    className="max-w-none h-11 w-11  object-cover"
                    src={project.image}
                  />
                </div>
              </Link>
              <div className="flex-1 dark:bg-dark-level-two dark:border-opacity-50 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                <div className="flex-1 px-4 py-2 text-sm truncate">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium hover:text-gray-600 dark:text-dark-white">
                      {project.item_name}
                    </span>
                    <span
                      className={classNames(
                        project?.profit_cal > 100
                          ? 'bg-green-500'
                          : 'bg-red-500',
                        'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                      )}
                      aria-hidden="true"
                    />
                    
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">
                      {project.percentage} % |{' '}
                      {rarityShort[project.item_wear_name]} |{' '}
                      {project.float_chance.toString()?.substr(1, 8)}
                    </p>
                    <div className="flex items-center">
                      <p className="text-gray-500">
                        <CashIcon className="w-4 text-gray-500 h-4 mr-1" />
                      </p>
                      <p className="text-gray-500">
                        {new Intl.NumberFormat(settingsData.locale, {
                          style: 'decimal',
                          maximumFractionDigits: 2,
                        }).format(project?.profit_cal)}{' '}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 ">
          <li key={9999} className="col-span-1 flex shadow-sm rounded-md">
            <div className=" flex-shrink-0 h-full  flex items-center justify-center w-16 dark:border-opacity-50 text-white border-t border-l border-b border-gray-200 rounded-l-md border-dotted dark:bg-dark-level-two border-r">
              <div className="max-w-none h-11 w-11  object-cover" />
            </div>
            <div className="flex-1 dark:bg-dark-level-two border-dotted dark:border-opacity-50 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium hover:text-gray-600 dark:text-dark-white">
                    Add 10 to see the results
                  </span>
                </div>
                <div className="flex justify-start">
                  <p className="text-gray-500"></p>
                  <div className="flex items-center">
                    <p className="text-gray-500">
                      Prices are the SCM 7 day average
                    </p>
                    <p className="text-gray-500"></p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
