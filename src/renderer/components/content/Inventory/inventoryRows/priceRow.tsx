import { useSelector } from "react-redux";
import { ConvertPricesFormatted } from "renderer/functionsClasses/prices";


export function RowPrice({itemRow}) { 
    const pricesResult = useSelector((state: any) => state.pricingReducer);
    const settingsData = useSelector((state: any) => state.settingsReducer);
    const PricesClass = new ConvertPricesFormatted(settingsData, pricesResult)
    const price = PricesClass.getPrice(itemRow)
    const formattedPrice = PricesClass.getFormattedPrice(itemRow)
    const formattedPriceCombined = PricesClass.getFormattedPriceCombined(itemRow)
    
    return (
        <>
          
          {settingsData.columns.includes('Price') ?
          <td className="table-cell px-6 py-3 text-sm text-gray-500 font-medium">
            <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
              <div className="flex flex-shrink-0 -space-x-1 text-gray-500 dark:text-gray-400 font-normal">
                {formattedPriceCombined}
              </div>
            </div>
            <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
              <div className="flex flex-shrink-0 -space-x-1 text-gray-500  text-xs font-normal">
                {!price
                  ? ''
                  : itemRow.combined_QTY == 1
                  ? ''
                  : formattedPrice}
              </div>
            </div>
          </td> : '' }
            
        </>
      );
}