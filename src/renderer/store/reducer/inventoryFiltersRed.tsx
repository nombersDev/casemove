import { InventoryFilters } from '../../interfaces/states';

const initialState: InventoryFilters = {
  inventoryFilter: [
    {
      include: true,
      label: 'Storage moveable',
      valueToCheck: 'item_moveable',
      commandType: 'checkBooleanVariable',
    },
  ],
  storageFilter: [],
  sortValue: 'Default',
  inventoryFiltered: [],
  storageFiltered: [],
  searchInput: '',
  sortBack: false,
  categoryFilter: [],
  rarityFilter: [],
};

const inventoryFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTERED':
      return {
        ...state,
        inventoryFilter: action.payload.inventoryFilter,
        sortValue: action.payload.sortValue,
        inventoryFiltered: action.payload.inventoryFiltered,
      };
    case 'SET_FILTERED_STORAGE':
      return {
        ...state,
        storageFiltered: action.payload.storageFiltered,
        storageFilter: action.payload.storageFilter,
      };
    case 'ALL_BUT_CLEAR':
      if (state.sortValue == action.payload.sortValue) {
        return {
          ...state,
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
          sortBack: !state.sortBack,
        };
      } else {
        return {
          ...state,
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
        };
      }
    case 'INVENTORY_STORAGES_CLEAR_CASKET':
      const AddToFiltered = state.storageFiltered.filter(
        (id) => id.storage_id != action.payload.casketID
      );

      return {
        ...state,
        storageFiltered: AddToFiltered
      };
    case 'INVENTORY_STORAGES_SET_SORT_STORAGES':
      return {
        ...state,
        storageFiltered: action.payload.storageFiltered,
      };
    case 'CLEAR_ALL':
      return {
        ...initialState,
        inventoryFilter: [],
      };
    case 'MOVE_FROM_CLEAR':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
      };

    case 'MOVE_FROM_CLEAR_ALL':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
        storageFiltered: initialState.storageFiltered,
        storageFilter: initialState.storageFilter
      };
    case 'MOVE_TO_CLEAR_ALL':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
        inventoryFilter: initialState.inventoryFilter
      };

    case 'INVENTORY_ADD_CATEGORY_FILTER':
      let newFilters = state.categoryFilter;
      if (newFilters.includes(action.payload)) {
        newFilters.splice(newFilters.indexOf(action.payload), 1);
      } else {
        newFilters = [...newFilters, action.payload];
      }
      return {
        ...state,
        categoryFilter: newFilters,
      };
    case 'INVENTORY_ADD_RARITY_FILTER':
      console.log(action.payload);
      let newRarity = state.rarityFilter;
      if (newRarity.includes(action.payload)) {
        newRarity.splice(newRarity.indexOf(action.payload), 1);
      } else {
        newRarity = [...newRarity, action.payload];
      }
      return {
        ...state,
        rarityFilter: newRarity,
      };
    case 'INVENTORY_FILTERS_SET_SEARCH':
      return {
        ...state,
        searchInput: action.payload.searchField,
      };
    case 'SET_SORT':
      if (state.sortValue == action.payload.sortValue) {
        return {
          ...state,
          sortBack: !state.sortBack,
        };
      } else {
        return {
          ...state,
          sortValue: action.payload.sortValue,
          sortBack: initialState.sortBack,
        };
      }
    case 'SIGN_OUT':
      return {
        ...initialState,
      };
    default:
      return { ...state };
  }
};

export default inventoryFiltersReducer;
