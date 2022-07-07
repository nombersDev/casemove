
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RunOverview from './runOverview';

function overviewContent() {
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  let totalFloat = 0;
  let totalPrice = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalFloat += element.item_paint_wear;
    totalPrice +=
      pricesResult.prices[element.item_name + element.item_wear_name || '']?.['steam_listing'] *
      settingsData.currencyPrice[settingsData.currency];
  });
  totalFloat = totalFloat / tradeUpData.tradeUpProducts.length;
  let totalEV = 0;
  tradeUpData.possibleOutcomes.forEach((element) => {
    let individualPrice =
      pricesResult?.prices[element.item_name + element.item_wear_name || '']?.['steam_listing'] * settingsData.currencyPrice[settingsData.currency];
    totalEV += individualPrice * (element.percentage / 100);
    console.log(
      element,
      element.percentage,
      individualPrice * (element.percentage / 100)
    );
  });
  totalEV
  totalPrice

  return (
    <>
      {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Page title & actions
        <div className="border-b border-gray-200 px-4 h-14  py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate dark:text-dark-white">
              Overview
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">


          </div>
        </div>
*/}
        {/* Content area */}

        <div className="">
          <div
            className="h-screen"
          >
          <RunOverview />

          </div>
        </div>
      </div>
    </>
  );
}
export default function OverviewPage() {
  return (
    <Router>
      <Route path="/" component={overviewContent} />
    </Router>
  );
}
