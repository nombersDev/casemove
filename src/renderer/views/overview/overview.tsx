
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
      <div>
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
