const initialState = {
    displayName: null,
    CSGOConnection: false,
    userProfilePicture: null,
    steamID: null,
    isLoggedIn: false,
    hasConnection: false
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGN_IN':
          return {
              ...state,
              displayName: action.payload.displayName,
              CSGOConnection: action.payload.CSGOConnection,
              userProfilePicture: action.payload.userProfilePicture,
              steamID: action.payload.steamID,
              isLoggedIn: true,
              hasConnection: true
          }
      case 'SIGN_OUT': 
          return {
            ...initialState
          }
      
      case 'SET_CONNECTION':
        return {
          ...state,
          hasConnection: action.payload.hasConnection
        }

      case 'SET_GC':
        return {
          ...state,
          CSGOConnection: action.payload.CSGOConnection
        }
      case 'LOGOUT': 
        return {
          ...initialState
        }
      default:
        return state
      
    }
  };

  export default authReducer;
  