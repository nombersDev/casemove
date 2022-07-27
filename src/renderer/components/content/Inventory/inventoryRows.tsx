
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { RequestPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import { classNames, sortDataFunction } from '../shared/filters/inventoryFunctions';
import RenameModal from '../shared/modals & notifcations/modalRename';
import { RowCollections } from './inventoryRows/collectionsRow';
import { RowFloat } from './inventoryRows/floatRow';
import { RowHeader, RowHeaderCondition, RowHeaderConditionNoSort } from './inventoryRows/headerRows';
import { RowLinkInventory } from './inventoryRows/inventoryLinkRow';
import { RowMoveable } from './inventoryRows/moveableRow';
import { RowPrice } from './inventoryRows/priceRow';
import { RowQTY } from './inventoryRows/QTYRow';
import { RowRarity } from './inventoryRows/rarityRow';
import { RowProduct } from './inventoryRows/rowName';
import { RowStickersPatches } from './inventoryRows/stickerPatchesRow';
import { RowStorage } from './inventoryRows/storageRow';
import { RowTradehold } from './inventoryRows/tradeholdRow';


function content() {
  const [getInventory, setInventory] = useState([] as any);
  const ReducerClass = new ReducerManager(useSelector)
  const currentState: State = ReducerClass.getStorage()
  const inventory = currentState.inventoryReducer
  const inventoryFilters = currentState.inventoryFiltersReducer
  const pricesResult = currentState.pricingReducer
  const settingsData = currentState.settingsReducer

  const dispatch = useDispatch();

  // Sort function

  let inventoryToUse = [] as any;
  if (
    inventoryFilters.inventoryFiltered.length == 0 &&
    inventoryFilters.inventoryFilter.length == 0
  ) {
    inventoryToUse = inventory.combinedInventory;
  } else {
    inventoryToUse = inventoryFilters.inventoryFiltered;
  }
  let PricingRequest = new RequestPrices(dispatch, settingsData, pricesResult)
  PricingRequest.handleRequestArray(inventoryToUse)

  async function storageResult() {
    let storageResult = await sortDataFunction(
      inventoryFilters.sortValue,
      inventoryToUse,
      pricesResult.prices,
      settingsData?.source?.title
    );

    setInventory(storageResult);
  }

  storageResult();
  if (inventoryFilters.sortBack == true) {
    getInventory.reverse();
  }

  let finalToUse = searchFilter(getInventory, inventoryFilters, inventoryFilters)

  return (
    <>
      <RenameModal />

      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Product details
          </h2>
        </div>
        <ul
          role="list"
          className="mt-3 border-t border-gray-200 divide-y divide-gray-100 dark:divide-gray-500"
        >
          {getInventory.map((project) => (
            <li key={project.item_id}>
              <a
                href="#"
                className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
              >
                <span className="flex items-center truncate space-x-3">
                  <span
                    className={classNames(
                      project.bgColorClass,
                      'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium truncate text-sm leading-6">
                    {project.item_name}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <table className="min-w-full">
        <thead>
          <tr
            className={classNames(
              settingsData.os == 'win32' ? 'top-7' : 'top-0',
              'border-gray-200 sticky'
            )}
          >

            <RowHeader headerName='Product' sortName='Product name' />
            <RowHeaderCondition headerName='Collection' sortName='Collection' condition='Collections' />
            <RowHeaderCondition headerName='Price' sortName='Price' condition='Price' />
            <RowHeaderCondition headerName='Stickers/Patches' sortName='Stickers' condition='Stickers/patches' />
            <RowHeaderCondition headerName='Float' sortName='wearValue' condition='Float' />
            <RowHeaderCondition headerName='Rarity' sortName='Rarity' condition='Rarity' />
            <RowHeaderCondition headerName='Storage' sortName='StorageName' condition='Storage' />
            <RowHeaderCondition headerName='Tradehold' sortName='tradehold' condition='Tradehold' />
            <RowHeader headerName='QTY' sortName='QTY' />
            <RowHeaderConditionNoSort headerName='Moveable' condition='Moveable' />
            <RowHeaderConditionNoSort headerName='Link' condition='Inventory link' />



          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 dark:bg-dark-level-one dark:divide-gray-500">
          {finalToUse.map((projectRow) => (
            <tr
              key={projectRow.item_id}

            >

              <RowProduct itemRow={projectRow}  />
              <RowCollections itemRow={projectRow} settingsData={settingsData} />
              <RowPrice itemRow={projectRow} settingsData={settingsData} pricesReducer={pricesResult} />
              <RowStickersPatches itemRow={projectRow} settingsData={settingsData} />
              <RowFloat itemRow={projectRow} settingsData={settingsData} />
              <RowRarity itemRow={projectRow} settingsData={settingsData} />
              <RowStorage itemRow={projectRow}  settingsData={settingsData}/>
              <RowTradehold itemRow={projectRow} settingsData={settingsData} />
              <RowQTY itemRow={projectRow} />
              <RowMoveable itemRow={projectRow} settingsData={settingsData} />
              <RowLinkInventory itemRow={projectRow} settingsData={settingsData} userDetails={currentState.authReducer}/>
              <td
                key={Math.random().toString(36).substr(2, 9)}
                className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"
              ></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function InventoryRowsComponent() {
  return content();
}
