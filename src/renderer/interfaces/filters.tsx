
export interface FilterRequirement {
    label: string
    valueToCheck: string
    commandType: 'checkBooleanVariable' | 'checkURL' | 'checkName'  | 'checkMajor' | 'checkNameAndContainer'
}
export interface Filter extends FilterRequirement{
  include: boolean
}

export interface Filters {
    [key: string]: Array<Filter>
}

export interface ClassOptionFilter {
  [key: string]: FilterRequirement
}

export interface FiltersRequirement {
  [key: string]: Array<FilterRequirement>

}
