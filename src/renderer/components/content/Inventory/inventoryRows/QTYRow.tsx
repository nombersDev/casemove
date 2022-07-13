
export function RowQTY({ itemRow }) {

  return (
    <>
      <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 font-normal">
            {itemRow.combined_QTY}
          </div>
        </div>
      </td>
    </>
  );
}