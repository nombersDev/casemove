import { CheckCircleIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";

export function RowMoveable({itemRow}) { 
    const settingsData = useSelector((state: any) => state.settingsReducer);
    
    return (
        <>
          {settingsData.columns.includes('Moveable') ? (
                <td
                  key={Math.random().toString(36).substr(2, 9)}
                  className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right"
                >
                  <div className="flex justify-center rounded-full drop-shadow-lg">
                    {itemRow.item_moveable == true ? (
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </td>
              ) : (
                ''
              )}
            
        </>
      );
}