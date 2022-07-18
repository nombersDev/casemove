
export interface Filter {
    include: boolean
    label: string
    valueToCheck: string
    commandType: 'checkBooleanVariable' | 'checkURL' | 'checkName'  | 'checkMajor' | 'checkNameAndContainer'
}

export interface Filters {
    [key: string]: Array<Filter>
}