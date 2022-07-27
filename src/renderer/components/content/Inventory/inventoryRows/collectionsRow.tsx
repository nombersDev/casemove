
export function RowCollections({ itemRow, settingsData }) {
  return (
    <>
      {settingsData.columns.includes('Collections') ?
        <td className="hidden xl:table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
          <div className="flex items-center">

            <span>
              <span className="flex dark:text-dark-white">
                {itemRow?.collection?.replace('The ', '')?.replace(' Collection', '')}

              </span>

            </span>
          </div>
        </td> : ''}
    </>
  );
}