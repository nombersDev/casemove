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
import {itemCategories} from 'renderer/components/content/shared/categories';
import { categoriesRGB } from './categoriesRGB';
import PieChart from './pieChart';


ChartJS.register(
  RadialLinearScale,
  PointElement,
  LinearScale,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


export default function RadarApp() {
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


  // Go through inventory and find matching categories
  const inventory = useSelector((state: any) => state.inventoryReducer);
  inventory.combinedInventory.forEach(element => {
    if (resultingData[element.category]) {
      resultingData[element.category].inventory = resultingData?.[element.category]?.inventory + element.combined_QTY
    }
  });

  // Go through Storage Units
  inventory.storageInventory.forEach(element => {
    if (resultingData[element.category]) {
      resultingData[element.category].storageUnits = resultingData?.[element.category]?.storageUnits + element.combined_QTY
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


  const data = {
    labels: categoriesFixed,

    datasets: [
      {
        label: 'Inventory',
        data: finalDataToUse,
        backgroundColor: rgbColorsToUse,
        borderColor: rgbColorsToUseBorder,
        borderWidth: 1,
      }

    ],
  };

  return (
    <>
    <PieChart data={data} headerName='string'/>
    </>
  );
}
