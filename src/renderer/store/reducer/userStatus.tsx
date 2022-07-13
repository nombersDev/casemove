import { AuthReducer } from "renderer/interfaces/store";

const initialState: AuthReducer = {
    displayName: null ,
    CSGOConnection: false,
    userProfilePicture: null ,
    steamID: null,
    isLoggedIn: false ,
    hasConnection: false,
    walletBalance: {
      hasWallet: false,
      currency: '',
      balance: 0
    }
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
              hasConnection: true,
              walletBalance: action.payload.wallet
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
      case 'SET_WALLET_BALANCE':
        return {
          ...state,
          walletBalance: action.payload
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
