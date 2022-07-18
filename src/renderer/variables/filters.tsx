import { itemSubCategories } from "renderer/components/content/shared/categories";
import { Filter, Filters } from "renderer/interfaces/filters";
import { ItemRow } from "renderer/interfaces/items";
import _ from "lodash";

export class FilterManager {
    filters: Filters = {}
    addedArray: Array<Filter> = []


    addFilter(keyToAddUnder: string, filterObject: Filter): void {
        if (this.filters?.[keyToAddUnder] != undefined) {
            let oldArray = this.filters[keyToAddUnder]
            oldArray.push(filterObject)
            this.filters[keyToAddUnder] = oldArray
        }
        else {
            this.filters[keyToAddUnder] = [filterObject]
        }
    }

    addFilters(keyToAddUnder: string, filterObjects: Array<Filter>): void {
        let arrayToAdd: Array<Filter> = []
        filterObjects.forEach(element => {
            if (!_.some(this.addedArray, element)) {
                this.addedArray.push(element)
                arrayToAdd.push(element)
            }
        });
        if (arrayToAdd.length > 0) {
            if (this.filters?.[keyToAddUnder] != undefined) {
                this.filters[keyToAddUnder] = [...this.filters?.[keyToAddUnder], ...arrayToAdd]
            }
            else {
                this.filters[keyToAddUnder] = [...arrayToAdd]
            }
        }
        

    }

    loadFilter(filterObject: Filters): void {

        for (const [key, value] of Object.entries(filterObject)) {
            this.addFilters(key, value)
        }
    }

}
export const CharacteristicsFilter: Filters = {
    Characteristics: [
        {
            include: true,
            label: 'Active tradehold',
            valueToCheck: 'trade_unlock',
            commandType: 'checkBooleanVariable'
        },
        {
            include: true,
            label: 'Custom name',
            valueToCheck: 'item_customname',
            commandType: 'checkBooleanVariable'
        },
        {
            include: true,
            label: 'Stickers/Patches applied',
            valueToCheck: 'item_has_stickers',
            commandType: 'checkBooleanVariable'
        },
        {
            include: true,
            label: 'Storage moveable',
            valueToCheck: 'item_moveable',
            commandType: 'checkBooleanVariable'
        },
        {
            include: true,
            label: 'Equipped CT',
            valueToCheck: 'equipped_ct',
            commandType: 'checkBooleanVariable'
        },
        {
            include: true,
            label: 'Equipped T',
            valueToCheck: 'equipped_t',
            commandType: 'checkBooleanVariable'
        }
    ]
}


export const ContainerFilter: Filters = {
    Containers: [
        {
            include: true,
            label: 'Cases',
            valueToCheck: 'Case',
            commandType: 'checkNameAndContainer'
        },
        {
            include: true,
            label: 'Sticker Capsules',
            valueToCheck: 'Capsule',
            commandType: 'checkNameAndContainer'
        },
        {
            include: true,
            label: 'Patch Packs',
            valueToCheck: 'Patch',
            commandType: 'checkNameAndContainer'
        },
        {
            include: true,
            label: 'Pins Capsule',
            valueToCheck: 'Pins Capsule',
            commandType: 'checkNameAndContainer'
        }
    ]
}

export async function addMajorsFilters(itemArray: Array<ItemRow>) {
    let returnArray: Array<Filter> = []
    let seenMajors: Array<string> = []
    itemArray.forEach(itemRow => {
        seenMajors.push(itemRow.major)
    });

    Object.values(itemSubCategories.majors).forEach(major => {
        if (seenMajors.includes(major.name)) {
            returnArray.push({
                include: true,
                label: major.name,
                valueToCheck: major.key,
                commandType: 'checkMajor'
            })
        }


    });

    return {
        Majors: returnArray
    }
}