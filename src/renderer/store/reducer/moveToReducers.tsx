import { MoveToReducer } from "renderer/interfaces/store";

const initialState: MoveToReducer = {
    doHide: false,
    hideFull: true,
    activeStorages: [],
    activeStoragesAmount: 0,
    totalToMove: [],
    totalItemsToMove: 0,
    searchInput: '',
    searchInputStorage: '',
    sortValue: 'Default',
    doCancel: false,
    sortBack: false,
  };

  const moveFromReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'MOVE_TO_SET_HIDE':
          return {
              ...state,
              doHide: !state.doHide
           } 
      
      case 'MOVE_TO_SET_FULL':
          return {
              ...state,
              hideFull: !state.hideFull
           } 
      case 'MOVE_TO_ADD_TO':
        // Add to or remove from active storages
        console.log(action.payload.casketID)
        let casketAlreadyExists = state.activeStorages.indexOf(action.payload.casketID) > -1;
        let chosenActiveCopy = state.activeStorages.slice();
        let storageAmount = 0
        if (casketAlreadyExists) {
            chosenActiveCopy = []
        } else {
            chosenActiveCopy = [action.payload.casketID]
            storageAmount = action.payload.casketVolume
        }
        console.log(chosenActiveCopy)
        return {
            ...state,
            activeStorages: chosenActiveCopy,
            activeStoragesAmount: storageAmount
            
        }
       case 'MOVE_TO_TOTAL_TO_ADD': 
        let toMoveAlreadyExists = state.totalToMove.filter(row => row[0] != action.payload.itemID)
        
        if (action.payload.toMove.length > 0) {
            toMoveAlreadyExists.push([action.payload.itemID, action.payload.casketID, action.payload.toMove, action.payload.itemName])
        }
        let newTotalItemsToMove = 0
        toMoveAlreadyExists.forEach(element => {
            newTotalItemsToMove += element[2].length
        });
        return {
            ...state,
            totalToMove: toMoveAlreadyExists,
            totalItemsToMove: newTotalItemsToMove
        }

        case 'SET_STORAGE_AMOUNT': 
        return {
          ...state, 
          activeStoragesAmount: action.payload.storageAmount
        }

        case 'MOVE_TO_SET_SEARCH':
          return {
              ...state,
              searchInput: action.payload.searchField
           } 
        
        case 'MOVE_TO_SET_SEARCH_STORAGE':
          return {
              ...state,
              searchInputStorage: action.payload.searchField
           } 
        case 'SET_SORT':
          if (state.sortValue == action.payload.sortValue) {
            return {
              ...state, 
              sortBack: !state.sortBack
            }
          } else {
            return {
              ...state,
              sortValue: action.payload.sortValue,
              sortBack: initialState.sortBack
           } 
          }
        case 'MOVE_TO_CLEAR_ALL':
          return {
              ...state,
              totalToMove: [] as any,
              totalItemsToMove: 0,
              searchInput: '',
              sortValue: 'Default'
           } 
        case 'DO_CANCEL':
            
          return {
              ...state,
              doCancel: action.payload.doCancel
           } 
        case 'SIGN_OUT': 
            return {
          ...initialState
        }


        
      default:
        return {...state}
      
    }
  };

  export default moveFromReducer;