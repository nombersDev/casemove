import { LightningBoltIcon, XIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RequestPrices } from 'renderer/functionsClasses/prices';
import { Store } from 'renderer/interfaces/store';
import { moveToAddRemove } from 'renderer/store/actions/moveToActions';
import { pricing_add_to_requested } from 'renderer/store/actions/pricingActions';
import { RowCollections } from '../../Inventory/inventoryRows/collectionsRow';
import { RowFloat } from '../../Inventory/inventoryRows/floatRow';
import { RowPrice } from '../../Inventory/inventoryRows/priceRow';
import { RowQTY } from '../../Inventory/inventoryRows/QTYRow';
import { RowRarity } from '../../Inventory/inventoryRows/rarityRow';
import { RowProduct } from '../../Inventory/inventoryRows/rowName';
import { RowStickersPatches } from '../../Inventory/inventoryRows/stickerPatchesRow';
import { RowStorage } from '../../Inventory/inventoryRows/storageRow';
import { RowTradehold } from '../../Inventory/inventoryRows/tradeholdRow';
import { classNames } from '../../shared/filters/inventoryFunctions';

function content({ projectRow, index }: {projectRow: any, index: number}) {
  const dispatch = useDispatch();
  const toReducer = useSelector((state: Store) => state.moveToReducer);
  const pricesResult = useSelector((state: Store) => state.pricingReducer);
  const settingsData = useSelector((state: Store) => state.settingsReducer);

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

  let PricingClass = new RequestPrices(dispatch, settingsData, pricesResult)
  PricingClass.handleRequested(projectRow)

  const isEmpty =
    toReducer.totalToMove.filter((row) => row[0] == projectRow.item_id)
      .length == 0;
  let pricesToGet = [] as any
  if (pricesResult.prices[projectRow.item_name + projectRow.item_wear_name || ''] == undefined && pricesResult.productsRequested.includes(projectRow.item_name + projectRow.item_wear_name || '') == false) {
    pricesToGet.push(projectRow)
  }
  if (pricesToGet.length > 0) {
    window.electron.ipcRenderer.getPrice(pricesToGet)
    dispatch(pricing_add_to_requested(pricesToGet))
  }

  let totalFieldValue = 0
  if (isEmpty == false) {
    totalFieldValue = toReducer.totalToMove.filter(
      (row) => row[0] == projectRow.item_id
    )[0][2].length
  }

  return (
    <>
      <RowProduct itemRow={projectRow} />
      <RowCollections itemRow={projectRow} />
      <RowPrice itemRow={projectRow} />
      <RowStickersPatches itemRow={projectRow} />
      <RowFloat itemRow={projectRow} />
      <RowRarity itemRow={projectRow} />
      <RowStorage itemRow={projectRow} />
      <RowTradehold itemRow={projectRow} />
      <RowQTY itemRow={projectRow} />

      <td className="table-cell px-6 py-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <div className='flex justify-center'>
          <button
            onClick={() => returnField(1000)}
            id={`fire-${index}`}
            className={classNames(
              1000 -
                toReducer.activeStoragesAmount -
                toReducer.totalItemsToMove ==
                0 || totalFieldValue == projectRow.combined_QTY
                ? 'pointer-events-none hidden'
                : ''
            )}
          >
            <LightningBoltIcon
              className={classNames(isEmpty ? "h-5 w-5" : 'h-4 w-4', "text-gray-400 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-400")}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className='flex justify-center'>
          <button
            onClick={() => returnField(0)}
            id={`removeX-${index}`}
            className={classNames(isEmpty ? 'pointer-events-none hidden' : '')}
          >
            <XIcon
              className={classNames(1000 -
                toReducer.activeStoragesAmount -
                toReducer.totalItemsToMove ==
                0 || totalFieldValue == projectRow.combined_QTY ? "h-5 w-5" : 'h-4 w-4', "text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400  ")}
              aria-hidden="true"
            />
          </button>
        </div>
      </td>
      <td className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium dark:bg-dark-level-one"></td>
    </>
  );
}
export default function StorageRow(projects) {
  return content(projects);
}
