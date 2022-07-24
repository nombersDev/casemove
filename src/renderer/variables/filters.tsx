import { itemSubCategories } from "renderer/components/content/shared/categories";
import { Filter, FilterRequirement, Filters, FiltersRequirement } from "renderer/interfaces/filters";
import { ItemRow } from "renderer/interfaces/items";
import _ from "lodash";

export class FilterManager {
    filters: Filters = {}


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

    addFilters(keyToAddUnder: string, filterObjects: Array<FilterRequirement>, includeFilter: boolean): void {
        let arrayToAdd: Array<Filter> = []
        filterObjects.forEach(element => {
            if (!_.some(this.filters?.[keyToAddUnder], element)) {
                let finalFilter: Filter = {
                  ...element,
                  include: includeFilter
                }
                arrayToAdd.push(finalFilter)
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

    loadFilter(filterObject: FiltersRequirement, includeFilter: boolean, specialName: string = ''): void {

        for (const [key, value] of Object.entries(filterObject)) {
          let keyToUse = key
          if (specialName != '') {
            keyToUse = specialName
          }
          this.addFilters(keyToUse, value, includeFilter)
        }
    }

    excludeFilter(keyToAddUnder: string, filterLabel:string) {
      let filtered = this.filters?.[keyToAddUnder]?.filter(filter => filter.label != filterLabel)
      if (filtered.length > 0) {
        this.filters[keyToAddUnder] = [...filtered]
      }
    }
}
export const CharacteristicsFilter: FiltersRequirement = {
    Characteristics: [
        {
            label: 'Active tradehold',
            valueToCheck: 'trade_unlock',
            commandType: 'checkBooleanVariable'
        },
        {
            label: 'Custom name',
            valueToCheck: 'item_customname',
            commandType: 'checkBooleanVariable'
        },
        {
            label: 'Stickers/Patches applied',
            valueToCheck: 'item_has_stickers',
            commandType: 'checkBooleanVariable'
        },
        {
            label: 'Storage moveable',
            valueToCheck: 'item_moveable',
            commandType: 'checkBooleanVariable'
        },
        {
            label: 'Equipped CT',
            valueToCheck: 'equipped_ct',
            commandType: 'checkBooleanVariable'
        },
        {
            label: 'Equipped T',
            valueToCheck: 'equipped_t',
            commandType: 'checkBooleanVariable'
        }
    ]
}


export const ContainerFilter: FiltersRequirement = {
    Containers: [
        {
            label: 'Cases',
            valueToCheck: 'Case',
            commandType: 'checkNameAndContainer'
        },
        {
            label: 'Sticker Capsules',
            valueToCheck: 'Capsule',
            commandType: 'checkNameAndContainer'
        },
        {
            label: 'Patch Packs',
            valueToCheck: 'Patch',
            commandType: 'checkNameAndContainer'
        },
        {
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
