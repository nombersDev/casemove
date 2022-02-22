import { combineReducers } from "redux";
import inventoryReducer from "./inventory";
import authReducer from "./userStatus";
import inventoryFiltersReducer from './inventoryFiltersRed'
import modalMoveReducer from './modalMove'
import modalRenameReducer from './modalRename'
import moveFromReducer from './moveFromReducers'
import moveToReducer from './moveToReducers'
import settingsReducer from "./settings";

const rootReducers = combineReducers({
    authReducer,
    inventoryReducer,
    inventoryFiltersReducer,
    modalMoveReducer,
    modalRenameReducer,
    moveFromReducer,
    moveToReducer,
    settingsReducer
})

export default rootReducers;

export type RootState = ReturnType<typeof rootReducers>
