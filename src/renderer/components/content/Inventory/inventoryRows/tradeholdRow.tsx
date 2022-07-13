import { useSelector } from "react-redux";


export function RowTradehold({ itemRow }) {
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const now = new Date();

  return (
    <>

      {settingsData.columns.includes('Tradehold') ?
        <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center font-normal">
          {itemRow.trade_unlock !== undefined
            ? Math.ceil(
              (itemRow.trade_unlock.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
            ) + ' days'
            : ''}
        </td> : ''}

    </>
  );
}