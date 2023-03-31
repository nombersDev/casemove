import { PencilIcon, TagIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setRenameModal } from "renderer/store/actions/modalMove actions";
import { createCSGOImage } from "../../../../functionsClasses/createCSGOImage";
import { classNames } from "../../shared/filters/inventoryFunctions";



export function RowProduct({ itemRow }) {
  const dispatch = useDispatch();
  const [itemHover, setItemHover] = useState(false);
  let marketHashName = itemRow.item_name;
  if (itemRow.item_paint_wear != undefined) {
    marketHashName =
    itemRow.item_name + ' (' + itemRow.item_wear_name + ')';
  }

  return (
    <>
      <td className="table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-gray-900 dark:text-dark-white">
        <div className="flex items-center space-x-3 lg:pl-2">
          <div
            className={classNames(
              itemRow.bgColorClass,
              'flex-shrink-0 w-2.5 h-2.5 rounded-full'
            )}
            aria-hidden="true"
          />
          <Link
            to={{
              pathname: `https://steamcommunity.com/market/listings/730/${marketHashName.replaceAll('Holo/Foil', 'Holo-Foil')}`,
            }}
            target="_blank"
          >
            <div className="flex flex-shrink-0 -space-x-1">
              <img
                onMouseEnter={() => setItemHover(true)}
                onMouseLeave={() => setItemHover(false)}
                className={classNames(
                  itemHover
                    ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                    : '',
                  'max-w-none h-11 w-11 transition duration-500 ease-in-out  dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300'
                )}
                src={
                 createCSGOImage(itemRow.item_url)
                }
              />
            </div>
          </Link>

          <span>
            <span className="flex">
              {itemRow.item_name !== '' ? (
                itemRow.item_customname !== null ? (
                  itemRow.item_customname
                ) : (
                  itemRow.item_name
                )
              ) : (
                <span>
                  <a
                    href="https://forms.gle/6qZ8N2ES8CdeavcVA"
                    target="_blank"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    An error occurred. Please report this here.
                  </a>
                  <br />
                  <button
                    className="px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(itemRow))
                    }
                  >
                    {' '}
                    COPY REF
                  </button>
                </span>
              )}
              {itemRow.item_name !== '' &&
                      itemRow.item_customname !== null &&
                      !itemRow.item_url.includes('casket') ? (
                        <TagIcon className="h-3 w-3  ml-1" />
                      ) : (
                        ''
                      )}
                      {itemRow.equipped_t ? (
                        <span className="ml-1 h-3 leading-3 pl-1 pr-1 text-white  dark:text-dark-white text-center font-medium	 bg-dark-level-four rounded-full   text-xs">
                          {' '}
                          T{' '}
                        </span>
                      ) : (
                        ''
                      )}
                      {itemRow.equipped_ct ? (
                        <span className="ml-1 h-3 leading-3 pl-1 pr-1 text-center  text-white dark:text-dark-white font-medium	 bg-dark-level-four rounded-full   text-xs">
                          {' '}
                          CT{' '}
                        </span>
                      ) : (
                        ''
                      )}

                      {itemRow.item_url.includes('casket') ? (
                        <Link
                          to=""
                          className="text-gray-500"
                          onClick={() =>
                            dispatch(
                              setRenameModal(
                                itemRow.item_id,
                                itemRow.item_customname !== null
                                  ? itemRow.item_customname
                                  : itemRow.item_name
                              )
                            )
                          }
                        >
                          <PencilIcon className="h-4 w-5 pb-1" />
                        </Link>
                      ) : (
                        ''
                      )}
            </span>
            <span className="text-gray-500" title={itemRow.item_paint_wear}>
              {itemRow.item_customname !== null ? itemRow.item_name : ''}
              {itemRow.item_customname !== null &&
                itemRow.item_paint_wear !== undefined
                ? ' - '
                : ''}
              {itemRow.item_paint_wear !== undefined
                ? itemRow.item_wear_name
                : ''}
            </span>
          </span>
        </div>
      </td>
    </>
  );
}
