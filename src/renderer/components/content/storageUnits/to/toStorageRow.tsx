import { LightningBoltIcon, XIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { moveToAddRemove } from 'renderer/store/actions/moveToActions';

function content({ projectRow }) {
  const dispatch = useDispatch();
  const toReducer = useSelector((state: any) => state.moveToReducer);

  async function returnField(fieldValue) {
    if (toReducer.activeStorages.length == 0) {
      return;
    }
    fieldValue = parseInt(fieldValue);
    let totalToGo = 1000 - toReducer.activeStoragesAmount;
    for (const [, value] of Object.entries(toReducer.totalToMove)) {
      let valued = value as any;
      console.log(valued);
      if (valued[0] != projectRow.item_id) {
        totalToGo -= valued[2].length;
      }
    }

    let returnValue = 0;
    let totalMax = projectRow.combined_QTY;
    if (projectRow.combined_QTY > totalToGo) {
      totalMax = totalToGo;
    }
    if (fieldValue > totalMax) {
      returnValue = totalMax;
    } else if (fieldValue < 0) {
      returnValue = 0;
    } else {
      if (isNaN(fieldValue)) {
        returnValue = 0;
      } else {
        returnValue = fieldValue;
      }
    }

    let listToReturn = [] as any;
    if (returnValue > 0) {
      listToReturn = projectRow.combined_ids.slice(0, returnValue);
    }

    dispatch(
      moveToAddRemove(
        projectRow.storage_id,
        projectRow.item_id,
        listToReturn,
        projectRow.item_name
      )
    );
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const now = new Date();
  const isEmpty =
    toReducer.totalToMove.filter((row) => row[0] == projectRow.item_id)
      .length == 0;

  return (
    <>
      <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900">
        <div className="flex items-center space-x-3 lg:pl-2">
          <div
            className={classNames(
              projectRow.bgColorClass,
              'flex-shrink-0 w-2.5 h-2.5 rounded-full'
            )}
            aria-hidden="true"
          />
          <div className="flex flex-shrink-0 -space-x-1">
            <img
              className="max-w-none h-11 w-11 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300"
              src={
                'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                projectRow.item_url +
                '.png'
              }
            />
          </div>
          <span>
            {projectRow.item_customname !== null
              ? projectRow.item_customname
              : projectRow.item_name}

            <br />
            <span
              className="text-gray-500"
              title={projectRow.item_paint_wear}
              
            >
              {projectRow.item_customname !== null ? projectRow.item_name : ''}
              {projectRow.item_customname !== null &&
              projectRow.item_paint_wear !== undefined
                ? ' - '
                : ''}
              {projectRow.item_paint_wear !== undefined
                ? projectRow.item_wear_name
                : ''}
              
            </span>
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-3 text-sm text-gray-500 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1">
            {projectRow.stickers?.map((sticker, index) => (
              <img
                key={index}
                className="max-w-none h-8 w-8 rounded-full ring-2 object-cover ring-transparent bg-gradient-to-t from-gray-100 to-gray-300"
                src={
                  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                  sticker.sticker_url +
                  '.png'
                }
                alt={sticker.sticker_name}
                title={sticker.sticker_name}
              />
            ))}
          </div>
        </div>
      </td>

      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center font-normal">
        {projectRow.trade_unlock !== undefined
          ? Math.ceil(
              (projectRow.trade_unlock.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + ' days'
          : ''}
      </td>
      <td className="table-cell px-6 py-3 text-sm text-gray-500 font-medium">
        <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
          <div className="flex flex-shrink-0 -space-x-1 font-normal">
            {projectRow.combined_QTY}
          </div>
        </div>
      </td>
      <td className="table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 hover:text-gray-200 text-right">
        <div className="flex justify-center rounded-full drop-shadow-lg">
          <div>
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              autoComplete="off"
              value={
                isEmpty
                  ? ''
                  : toReducer.totalToMove.filter(
                      (row) => row[0] == projectRow.item_id
                    )[0][2].length
              }
              placeholder="0"
              onChange={(e) => returnField(e.target.value)}
              className=" block w-full border rounded sm:text-sm text-gray-500 text-center border-gray-400"
            />
          </div>
        </div>
      </td>
      <td className={classNames(toReducer.activeStorages.length == 0 ? 'pointer-events-none' : '', "table-cell px-6 py-3 text-sm text-gray-500 font-medium")}>
        <button
          onClick={() => returnField(1000)}
          className={classNames(
            1000 -
              toReducer.activeStoragesAmount -
              toReducer.totalItemsToMove ==
              0
              ? 'pointer-events-none'
              : ''
          )}
        >
          <LightningBoltIcon
            className="h-4 w-4 text-gray-400 hover:text-yellow-400"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => returnField(0)}
          className={classNames(isEmpty ? 'pointer-events-none hidden' : '')}
        >
          <XIcon
            className="h-4 w-4 text-gray-400 hover:text-red-400  "
            aria-hidden="true"
          />
        </button>
      </td>
      <td className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"></td>
    </>
  );
}
export default function StorageRow(projects) {
  return content(projects);
}
