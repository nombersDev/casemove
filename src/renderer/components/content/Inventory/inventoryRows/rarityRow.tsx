import { useSelector } from "react-redux";


export function RowRarity({itemRow}) { 
    const settingsData = useSelector((state: any) => state.settingsReducer);
    
    return (
        <>
          
          {settingsData.columns.includes('Rarity') ?
        <td className="hidden xl:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
            <div className="flex flex-shrink-0 -space-x-1">
              {itemRow.rarityName}
            </div>
          </div>
        </td> : '' }
            
        </>
      );
}