import { useSelector } from "react-redux";


export function RowStorage({itemRow}) { 
    const settingsData = useSelector((state: any) => state.settingsReducer);
    
    return (
        <>
          
          {settingsData.columns.includes('Storage') ?
      <td className="hidden md:table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 font-normal">
            {itemRow.storage_name}
          </div>
        </div>
      </td> : '' }
            
        </>
      );
}