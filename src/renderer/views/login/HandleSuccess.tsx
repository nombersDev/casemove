import combineInventory, { sortDataFunctionTwo } from "renderer/components/content/shared/filters/inventoryFunctions";
import { filterItemRows } from "renderer/functionsClasses/filters/custom";
import { DispatchIPC, DispatchStore } from "renderer/functionsClasses/rendererCommands/admin"
import { State } from "renderer/interfaces/states";
import { SignInActionPackage } from "renderer/interfaces/store/authReducerActionsInterfaces"
import { inventorySetFilter } from "renderer/store/actions/filtersInventoryActions";
import { setInventoryAction } from "renderer/store/inventory/inventoryActions";
import { signIn } from "renderer/store/actions/userStatsActions";
import { getURL } from "renderer/store/helpers/userStatusHelper";
import { LoginCommandReturnPackage } from "shared/Interfaces.tsx/store"
import { createCSGOImage } from "../../functionsClasses/createCSGOImage";
async function getProfilePicture(steamID: string): Promise<string> {
  try {
    const profilePicture = await getURL(steamID);
    return profilePicture as string;
  } catch (error) {
    return createCSGOImage("econ/characters/customplayer_tm_separatist");
  }
}
export async function handleSuccess(returnSuccessPackage: LoginCommandReturnPackage, dispatch: Function, currentState: State) {
  // Get Redux values
  const StoreClass = new DispatchStore(dispatch)
  const IPCClass = new DispatchIPC(dispatch)

  // Locale
  StoreClass.run(StoreClass.buildingObject.locale)

  // Currency
  IPCClass.run(IPCClass.buildingObject.currency)
  await new Promise((r) => setTimeout(r, 2500));


  // Create a store object
  let signInPackage: SignInActionPackage = {
    userProfilePicture: await getProfilePicture(returnSuccessPackage.steamID),
    displayName: returnSuccessPackage.displayName,
    CSGOConnection: returnSuccessPackage.haveGCSession,
    steamID: returnSuccessPackage.steamID,
    wallet: returnSuccessPackage.walletToSend
  }

  // Get the profile picture

  dispatch(signIn(signInPackage))

  // Inventory
  let combinedInventory = await combineInventory(
    returnSuccessPackage.csgoInventory,
    currentState.settingsReducer
  )
  dispatch(
    setInventoryAction({
      inventory: returnSuccessPackage.csgoInventory,
      combinedInventory
    })
  );

  // Filtered inventory
  let filteredInv = await filterItemRows(
    combinedInventory,
    currentState.inventoryFiltersReducer.inventoryFilter
  );
  filteredInv = await sortDataFunctionTwo(
    currentState.inventoryFiltersReducer.sortValue,
    filteredInv,
    currentState.pricingReducer.prices,
    currentState.settingsReducer?.source?.title
  );

  dispatch(
    inventorySetFilter(
      currentState.inventoryFiltersReducer.inventoryFilter,
      currentState.inventoryFiltersReducer.sortValue,
      filteredInv
    )
  );
}
