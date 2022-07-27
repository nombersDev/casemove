import {
  characteristics,
  containers,
  FilterManager,
} from 'renderer/functionsClasses/filters/filters';

export function InventoryGetFilterManager() {
  const ClassFilters = new FilterManager();
  // Add characteristics
  Object.values(characteristics).forEach((filter) => {

    ClassFilters.addFilter('Include', filter, true);
  });
  Object.values(characteristics).forEach((filter) => {

    ClassFilters.addFilter('Exclude', filter, false);
  });

  // Add Containers
  Object.values(containers).forEach((filter) => {

    ClassFilters.addFilter('Containers', filter, true);
  });

  return ClassFilters;
}
