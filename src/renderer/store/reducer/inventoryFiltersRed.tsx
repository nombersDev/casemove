const initialState = {
  inventoryFilter: ['1item_moveable'] as any,
  sortValue: 'Default',
  inventoryFiltered: [] as any,
  searchInput: '',
  sortBack: false
};

const inventoryFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_BUT_CLEAR':
      if (state.sortValue == action.payload.sortValue) {
        return {
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
          sortBack: !state.sortBack
        }
      } else {
        return {
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
          sortBack: initialState.sortBack
        }
      }

    case 'CLEAR_ALL':
      return {
        ...initialState,
        inventoryFilter: []
      }
    case 'MOVE_FROM_CLEAR':
      return {
        ...initialState
      }
    case 'INVENTORY_FILTERS_SET_SEARCH':
      return {
        ...state,
        searchInput: action.payload.searchField
      }
    case 'SIGN_OUT':
      return {
        ...initialState
      }
    default:
      return { ...state }

  }
};

export default inventoryFiltersReducer;
