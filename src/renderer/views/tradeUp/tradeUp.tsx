import { BeakerIcon, CheckCircleIcon, VariableIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { HashRouter as Router, Route } from 'react-router-dom';
import PricingAmount from "renderer/components/content/shared/filters/pricingAmount";
import { classNames } from "renderer/components/content/shared/inventoryFunctions";
import TradeUpPicker from "./inventoryPickers";
import TradeUpSideBar from "./sideBar";

function settingsContent() {
  
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
    const pricesResult = useSelector((state: any) => state.pricingReducer);
    const settingsData = useSelector((state: any) => state.settingsReducer);
    
    let totalFloat = 0
    let totalPrice = 0
    tradeUpData.tradeUpProducts.forEach(element => {
        totalFloat += element.item_paint_wear
        console.log(element)
        totalPrice += pricesResult.prices[element.item_name]?.[settingsData?.source?.title] * settingsData.currencyPrice[settingsData.currency] 
    });
    totalFloat = totalFloat / tradeUpData.tradeUpProducts.length


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
        {/* Page title & actions */}
        <div className="border-b border-gray-200 px-4  py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-opacity-50">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate dark:text-dark-white">
              Trade up contracts
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <div className="flex items-center">
          
           
            
          </div>
        </div>
        
        <div className="ml-4 mt-4 flex-shrink-0 flex">
        <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
        <VariableIcon
      className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 "
      aria-hidden="true"
    />{' '}
    <span className="text-green-500 mr-2 uppercase">
      {totalFloat.toString()?.substr(0, 9)}
    </span>
              
          
    </span>
        
        <PricingAmount totalAmount={new Intl.NumberFormat(settingsData.locale, {
                              style: 'currency',
                              currency: settingsData.currency,
                            }).format(totalPrice)}/>
          <span className="flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
    <BeakerIcon
      className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
      aria-hidden="true"
    />{' '}
    <span className="text-blue-500 mr-2">
      {tradeUpData.tradeUpProducts.length} Items
    </span>
    
    <span className="text-blue-500 pl-2 border-l border-gray-400">
        <CheckCircleIcon 
      className={classNames(tradeUpData.tradeUpProducts.length == 10 ? 'text-green-500' : 'text-gray-500', "flex-none w-5 h-5 group-hover:text-gray-500")} aria-hidden="true"/>
      
      </span>
    </span>
        </div>
      </div>
          
        </div>
        </div>

        {/* Content area */}

        <div className="">
        <div className="flex-1 relative z-0 flex  h-screen-fixed ">
            <main className="flex-1 relative z-0 overflow-y-auto absolute">
              {/* Start main area*/}
              <div className="inset-0">
                <TradeUpPicker />
              </div>
              {/* End main area */}
            </main>
            <aside className="hidden absolute relative xl:flex xl:flex-col bg-gray-50 flex-shrink-0 w-96 border-l dark:border-opacity-50  border-gray-200 overflow-y-auto dark:bg-dark-level-one">
              {/* Start secondary column (hidden on smaller screens) */}
              <div className="">
              <TradeUpSideBar />
              </div>
              {/* End secondary column */}
            </aside>
          </div>

        </div>
      </div>
    </>
  );
}
export default function TradeupPage() {
  return (
    <Router>
      <Route path="/tradeup" component={settingsContent} />
    </Router>
  );
}
