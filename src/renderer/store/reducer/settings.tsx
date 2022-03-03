const initialState = {
  fastMove: false,
  currency: 'USD',
  locale: 'EN-GB',
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETTINGS_SET_FASTMOVE':
      return {
        ...state,
        fastMove: action.payload,
      };
    case 'SETTINGS_SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
      };
    case 'SETTINGS_SET_SOURCE':
      return {
        ...state,
        source: action.payload,
      };
      case 'SETTINGS_SET_LOCALE':
      return {
        ...state,
        locale: action.payload,
      };

    default:
      return { ...state };
  }
};

export default settingsReducer;
