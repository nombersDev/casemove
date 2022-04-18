const initialState = {
    hideFull: false,
    activeStorages: [] as any,
    totalToMove: [] as any,
    totalItemsToMove: 0,
    searchInput: '',
    searchInputStorage: '',
    sortValue: 'Default',
    doCancel: false,
    sortBack: false,
  };

  const moveFromReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'MOVE_FROM_SET_FULL':
        return {
            ...state,
            hideFull: !state.hideFull
         } 
      case 'MOVE_FROM_SET_SORT_BACK':
          return {
              ...state,
              sortBack: !state.sortBack
           }
      case 'MOVE_FROM_ADD_TO':
        // Add to or remove from active storages
        let casketAlreadyExists = state.activeStorages.indexOf(action.payload.casketID) > -1;
        let chosenActiveCopy = state.activeStorages.slice();

        if (casketAlreadyExists) {
            chosenActiveCopy = chosenActiveCopy.filter(id => id != action.payload.casketID)
        } else {
            chosenActiveCopy.push(action.payload.casketID)
        }
        return {
            ...state,
            activeStorages: chosenActiveCopy
        }
        case 'MOVE_FROM_CLEAR':
          return {
            ...initialState
          }
       case 'MOVE_FROM_TOTAL_TO_ADD':
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
        case 'MOVE_FROM_ALL_CASKET_RESULTS':
        let allCasketResults = state.totalToMove.filter(row => row[1] != action.payload.casketID)

        let allCasketToRemoveTotal = 0
        allCasketResults.forEach(element => {
            allCasketToRemoveTotal += element[2].length
        });
        return {
            ...state,
            totalToMove: allCasketResults,
            totalItemsToMove: allCasketToRemoveTotal
        }

        case 'MOVE_FROM_SET_SEARCH':
          return {
              ...state,
              searchInput: action.payload.searchField
           }
           case 'MOVE_FROM_SET_SEARCH_STORAGE':
          return {
              ...state,
              searchInputStorage: action.payload.searchField
           } 
        case 'MOVE_FROM_SET_SORT':
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
        case 'MOVE_FROM_CLEAR_ALL':
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
