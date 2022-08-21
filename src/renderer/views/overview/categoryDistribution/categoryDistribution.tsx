import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  LinearScale,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { itemCategories } from 'renderer/components/content/shared/categories';
import { categoriesRGB } from './categoriesRGB';
import PieChart from '../charts/pieChart';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { Settings } from 'renderer/interfaces/states';


ChartJS.register(
  RadialLinearScale,
  PointElement,
  LinearScale,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function getData(ReducerClass, by) {
  let categoriesFixed: Array<string> = [];
  let categoriesColors: any = {};

  let resultingData = {} as any;
  itemCategories.forEach((element) => {
    categoriesFixed.push(element.name);
    categoriesColors[element.name] = categoriesRGB[element.value]
    resultingData[element.name] = {
      inventory: 0,
      storageUnits: 0
    }
  });

  let PricingConverter = new ConvertPrices(ReducerClass.getStorage(ReducerClass.names.settings), ReducerClass.getStorage(ReducerClass.names.pricing))
  // Go through inventory and find matching categories
  const inventory = ReducerClass.getStorage(ReducerClass.names.inventory)
  inventory.combinedInventory.forEach(element => {
    if (resultingData[element.category]) {
      if (by == 'price') {

        resultingData[element.category].inventory += PricingConverter.getPrice(element, true) * element.combined_QTY
      }
      if (by == 'volume') {
        resultingData[element.category].inventory = resultingData?.[element.category]?.inventory + element.combined_QTY
      }

    }
  });

  // Go through Storage Units
  inventory.storageInventory.forEach(element => {
    if (resultingData[element.category]) {
      if (by == 'price') {

        resultingData[element.category].storageUnits += PricingConverter.getPrice(element, true) * element.combined_QTY
      }
      if (by == 'volume') {
        resultingData[element.category].storageUnits = resultingData?.[element.category]?.storageUnits + element.combined_QTY
      }
    }
  });

  // Convert inventory to chart data
  let finalDataToUse: Array<number> = [];
  let rgbColorsToUse: Array<string> = [];
  let rgbColorsToUseBorder: Array<string> = [];

  categoriesFixed.forEach(category => {
    finalDataToUse.push(resultingData[category].inventory + resultingData[category].storageUnits)
    rgbColorsToUse.push(categoriesColors[category])
    rgbColorsToUseBorder.push(categoriesColors[category]?.replace('0.2', '1'))
  });

  return {
    labels: categoriesFixed,
    data: finalDataToUse,
    backgroundColor: rgbColorsToUse,
    borderColor: rgbColorsToUseBorder
  }

}
export default function ItemDistributionByVolume() {
  const ReducerClass = new ReducerManager(useSelector)
  let settingsData: Settings = ReducerClass.getStorage(ReducerClass.names.settings);

  let returnObject: any = {
    labels: [],
    data: [],
    backgroundColor: [],
    borderColor: []
  }

  switch (settingsData.overview.by) {
    case 'price':
      returnObject = getData(ReducerClass, settingsData.overview.by);
      break

    case 'volume':
      returnObject = getData(ReducerClass, settingsData.overview.by);
      break
    default:
      break;
  }





  const data = {
    labels: returnObject.labels,

    datasets: [
      {
        label: 'Inventory',
        data: returnObject.data,
        backgroundColor: returnObject.backgroundColor,
        borderColor: returnObject.borderColor,
        borderWidth: 1,
      }

    ],
  };

  return (
    <>
      <PieChart data={data} headerName='Category distribution' />
    </>
  );
}
