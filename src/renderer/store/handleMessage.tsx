
// 1: Inventory changed
// 2: User log in / log out
// 3: CSGO Connection

import combineInventory from "renderer/components/content/shared/filters/inventoryFunctions"
import { setInventoryAction } from "./inventory/inventoryActions"
import { setConnection, setGC, signOut, setWalletBalance } from "./actions/userStatsActions"

export async function handleLogonSuccess(message) {
    console.log(message)
}

export async function handleUserEvent(message, settings) {
    const statusCode = message[0]
    const description = message[1]
    switch (statusCode) {
        case 1:
            const subMessage = message[2]
            return setInventoryAction({inventory: subMessage[1], combinedInventory: await combineInventory(subMessage[1], settings)})

        case 2:
            if (description == 'disconnected') {
                return setConnection(false)
            }
            if (description == 'reconnected') {
                return setConnection(true)
            }
            if (description == 'fatalError') {
                return signOut()
            }
            return

        case 3:
            if (description == 'disconnectedFromGC') {
                return setGC(false)
            } else {
                return setGC(true)
            }
        case 4:
            return setWalletBalance(description)
        default:
            return

    }
}

