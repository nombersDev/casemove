import combineInventory, { sortDataFunctionTwo } from "renderer/components/content/shared/filters/inventoryFunctions";
import { filterItemRows } from "renderer/functionsClasses/filters/custom";
import { DispatchIPC, DispatchStore } from "renderer/functionsClasses/rendererCommands/admin"
import { State } from "renderer/interfaces/states";
import { SignInActionPackage } from "renderer/interfaces/store/authReducerActionsInterfaces"
import { inventory_setFiltered } from "renderer/store/actions/filtersInventoryActions";
import { setInventoryAction } from "renderer/store/actions/inventoryActions";
import { signIn } from "renderer/store/actions/userStatsActions";
import { getURL } from "renderer/store/helpers/userStatusHelper";
import { LoginCommandReturnPackage } from "shared/Interfaces.tsx/store"
async function getProfilePicture(steamID: string): Promise<string> {
  try {
    const profilePicture = await getURL(steamID);
    return profilePicture as string;
  } catch (error) {
    return 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/econ/characters/customplayer_tm_separatist.png';
  }
}
export async function handleSuccess(returnSuccessPackage: LoginCommandReturnPackage, dispatch: Function, currentState: State) {
  // Get Redux values
  const StoreClass = new DispatchStore(dispatch)
  const IPCClass = new DispatchIPC(dispatch)

  // Source
  StoreClass.run(StoreClass.buildingObject.source)
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
    inventory_setFiltered(
      currentState.inventoryFiltersReducer.inventoryFilter,
      currentState.inventoryFiltersReducer.sortValue,
      filteredInv
    )
  );
}
