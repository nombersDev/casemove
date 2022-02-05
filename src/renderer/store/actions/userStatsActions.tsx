export const signIn = (forwardPackage: any) => {
    return {
        type: 'SIGN_IN',
        payload: {
            displayName: forwardPackage.displayName,
            CSGOConnection: forwardPackage.CSGOConnection,
            userProfilePicture: forwardPackage.userProfilePicture,
            steamID: forwardPackage.steamID,
            hasConnection: forwardPackage.hasConnection
        }
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

export const setGC = (connectionStatus: boolean) => {
    return {
        type: 'SET_GC',
        payload: {
            CSGOConnection: connectionStatus
        }
    }
}