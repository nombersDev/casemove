import { Filter } from "renderer/interfaces/filters";
import { ItemRow } from "renderer/interfaces/items";


class CheckFilter {
    itemRow: ItemRow
    filter: Filter

    constructor(itemRow: ItemRow, filter: Filter) {
        this.itemRow = itemRow
        this.filter = filter
    }

    // Check if string is in URL
    CheckVariableIncludes(variableName: string): boolean {
        return this.itemRow?.[variableName]?.includes(this.filter.valueToCheck)
    }

    // Check if variable exists and boolean
    checkBooleanVariable(): boolean {
        return this.itemRow?.[this.filter.valueToCheck] || false
    }

    // Check if Container and sub value
    checkContainerSubValue(variableName: string): boolean {
        return this.itemRow.category == 'Containers' && this.CheckVariableIncludes(variableName) || false
    }

}



function filterLogic(itemRow: ItemRow, IndividualFilter: Filter): boolean {
    const FilterClass = new CheckFilter(itemRow, IndividualFilter)
    let returnValue: boolean = false;
    switch (IndividualFilter.commandType) {
        case 'checkBooleanVariable':
            returnValue = FilterClass.checkBooleanVariable()
            break

        case 'checkName':
            returnValue = FilterClass.CheckVariableIncludes('item_name')
            break

        case 'checkURL':
            returnValue = FilterClass.CheckVariableIncludes('item_url')
            break

        case 'checkMajor':
            returnValue = FilterClass.CheckVariableIncludes('major')
            break

        case 'checkNameAndContainer':
            returnValue = FilterClass.checkContainerSubValue('item_name')
            break

        case 'checkCapsule':
            returnValue = FilterClass.checkContainerSubValue('item_name')
            if (itemRow.item_name.includes('Challengers') || itemRow.item_name.includes('Legends') || itemRow.item_name.includes('Contenders')) {
                if (!itemRow.item_name.includes('Patch')) {
                    returnValue = true;

                }
            }

            break;

        default:
            break
    }
    if (IndividualFilter.include) {
        return returnValue
    } else {
        return !returnValue
    }
}

export async function filterItemRows(arrayToFilter: Array<ItemRow>, filters: Array<Filter>): Promise<Array<ItemRow>> {
    let returnArray = arrayToFilter;

    filters.forEach(filt => {

        returnArray = returnArray.filter(itemRow => {
            return filterLogic(itemRow, filt)
        });
    });

    return returnArray
}