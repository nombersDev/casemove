import { SignInActionPackage } from "renderer/interfaces/store/authReducerActionsInterfaces"



export const signIn = (forwardPackage: SignInActionPackage) => {
    return {
        type: 'SIGN_IN',
        payload: forwardPackage
    }
}

export const signOut = () => {
    return {
        type: 'SIGN_OUT'
    }
}

export const setConnection = (connectionStatus: boolean) => {
    return {
        type: 'SET_CONNECTION',
        payload: {
            hasConnection: connectionStatus
        }
    }
}
export const setWalletBalance = (walletBalance) => {
    return {
        type: 'SET_WALLET_BALANCE',
        payload: walletBalance
    }
}
export const setGC = (connectionStatus: boolean) => {
    return {
        type: 'SET_GC',
        payload: {
            CSGOConnection: connectionStatus
        }

   }
}
