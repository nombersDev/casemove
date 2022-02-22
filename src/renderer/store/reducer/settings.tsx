const initialState = {
    fastMove: false
  };

  const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SETTINGS_SET_FASTMOVE':
          return {
              ...state,
              fastMove: action.payload
          }

      default:
        return {...state}

    }
  };

  export default settingsReducer;
