import {
  characteristics,
  containers,
  FilterManager,
} from 'renderer/functionsClasses/filters/filters';

export function toGetFilterManager() {
  const ClassFilters = new FilterManager();
  // Add characteristics
  Object.values(characteristics).forEach((filter) => {
    if (filter.label != 'Storage moveable') {
      ClassFilters.addFilter('Include', filter, true);
    }
  });

  // Add characteristics
  Object.values(characteristics).forEach((filter) => {
    if (filter.label != 'Storage moveable') {
      ClassFilters.addFilter('Exclude', filter, false);
    }
  });
  // Add Containers
  Object.values(containers).forEach((filter) => {

    ClassFilters.addFilter('Containers', filter, true);
  });
  return ClassFilters;
}
