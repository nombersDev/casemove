import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { ItemRow } from 'renderer/interfaces/items';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { Prices, Settings } from 'renderer/interfaces/states';
import {
  ConvertPrices,
  ConvertPricesFormatted,
} from 'renderer/functionsClasses/prices';
Chart;

function runArray(
  arrayToRun: Array<ItemRow>,
  objectToUse: any,
  by: string,
  PricingConverter
) {
  objectToUse = getObject(arrayToRun, objectToUse, by, PricingConverter);
  var items = Object.keys(objectToUse).map(function (key) {
    return [key, objectToUse[key]];
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  return items;
}

function getObject(
  arrayToRun: Array<ItemRow>,
  objectToUse: any,
  by: string,
  PricingConverter
) {
  arrayToRun = arrayToRun.filter((itemRow) => itemRow.item_moveable);

  arrayToRun.forEach((element) => {
    if (objectToUse[element.item_name] == undefined) {
      switch (by) {
        case 'price':
          objectToUse[element.item_name] =
            PricingConverter.getPrice(element, true) * element.combined_QTY;
          break;
        case 'volume':
          objectToUse[element.item_name] = element.combined_QTY;
          break;
        default:
          break;
      }
    } else {
      switch (by) {
        case 'price':
          objectToUse[element.item_name] =
            objectToUse[element.item_name] +
            PricingConverter.getPrice(element, true) * element.combined_QTY;
          break;
        case 'volume':
          objectToUse[element.item_name] =
            objectToUse[element.item_name] + element.combined_QTY;
          break;
        default:
          break;
      }
    }
  });
  return objectToUse;
}

export default function OverallVolume() {
  // Go through inventory and find matching categories
  let Reducer = new ReducerManager(useSelector);
  let settingsData: Settings = Reducer.getStorage(Reducer.names.settings);
  let pricingData: Prices = Reducer.getStorage(Reducer.names.pricing);
  let PricingConverter = new ConvertPrices(settingsData, pricingData);
  const inventory = Reducer.getStorage(Reducer.names.inventory);

  // Convert inventory to chart data

  let seenNamesOverall: any = {};
  let seenNamesInventory: any = {};
  let seenNamesStorage: any = {};

  let inventoryFiltered = searchFilter(
    inventory.combinedInventory,
    Reducer.getStorage(Reducer.names.inventoryFilters),
    undefined
  );

  let storageFiltered = searchFilter(
    inventory.storageInventory,
    Reducer.getStorage(Reducer.names.inventoryFilters),
    undefined
  );

  let overallData = runArray(
    [...inventoryFiltered, ...storageFiltered],
    seenNamesOverall,
    settingsData.overview.by,
    PricingConverter
  );
  let inventoryData = getObject(
    inventoryFiltered,
    seenNamesInventory,
    settingsData.overview.by,
    PricingConverter
  );
  let storageData = getObject(
    storageFiltered,
    seenNamesStorage,
    settingsData.overview.by,
    PricingConverter
  );
  const converter = new ConvertPricesFormatted(settingsData, pricingData)


  const title = (tooltipItems) => {
    if (settingsData.overview.by == 'price') {
      return tooltipItems.dataset.label + ': ' + converter.formatPrice(tooltipItems.raw);
    }
    return tooltipItems.dataset.label + ': ' + tooltipItems.raw;
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: title,
        },
      },
      legend: {
        labels: {
          color: '#d6d3cd',
        },

        textDirection: 'ltr',
      },
      title: {
        display: true,
        text: 'Overall',
        color: '#d6d3cd',
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#d6d3cd',
          maxRotation: 90,
          minRotation: 90,
          scaleStepWidth: 1,
        },
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
      },
    },
  };

  const data = {
    labels: overallData.slice(0, 20).map((itemRow) => itemRow[0]?.slice(0, 40)),

    datasets: [
      {
        label: 'Inventory',
        data: overallData.map((itemRow) => inventoryData[itemRow[0]]),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Storage Units',
        data: overallData.map((itemRow) => storageData[itemRow[0]]),
        backgroundColor: 'rgb(50, 91, 136, 0.2)',
        borderColor: 'rgb(50, 91, 136, 1)',
        borderWidth: 1,
      },
    ],
  };
  // @ts-ignore
  return (
    <>
      <Bar data={data} width="518" height="400" options={options} />
    </>
  );
}
