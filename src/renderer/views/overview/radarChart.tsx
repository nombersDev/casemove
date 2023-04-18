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
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {itemCategories} from 'renderer/components/content/shared/categories';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';


ChartJS.register(
  RadialLinearScale,
  PointElement,
  LinearScale,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const categoriesRGB = {
  characters: "rgba(255, 99, 132, 0.2)",
  status_icons: "rgba(153, 102, 255, 0.2)",
  weapon_cases: "rgba(54, 162, 235, 0.2)",
  patches: "rgba(99, 102, 241, 0.2)",
  music_kits: "rgba(107, 114, 128, 0.2)",
  default_generated: "rgba(75, 192, 192, 0.2)",
  stickers: "rgba(255, 206, 86, 0.2)",
  tools: "rgba(255, 159, 64, 0.2)"
};
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

  // Radar options
  const options = {
    plugins: {
      legend: {
        labels: {
          position: 'right',
          color: '#d6d3cd',
        },

      },
      title: {
          display: true,
          text: 'Item distribution',
          color: '#d6d3cd'
      },
      datalabels: {
        formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
                sum += data;
            });
            let percentage = (value*100 / sum).toFixed(2)+"%";
            return percentage;
        },
        color: '#fff',
        display: 'auto'
    }
  }
  };

  const ReducerClass = new ReducerManager(useSelector)
  let PricingConverter = new ConvertPrices(ReducerClass.getStorage(ReducerClass.names.settings), ReducerClass.getStorage(ReducerClass.names.pricing))
  PricingConverter
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
  let inventoryDataToUse: Array<number> = [];
  let finalDataToUse: Array<number> = [];
  let storageUnitDataToUse: Array<number> = [];
  let rgbColorsToUse: Array<string> = [];
  let rgbColorsToUseBorder: Array<string> = [];

  categoriesFixed.forEach(category => {
    inventoryDataToUse.push(resultingData[category].inventory)
    finalDataToUse.push(resultingData[category].inventory + resultingData[category].storageUnits)
    storageUnitDataToUse.push(resultingData[category].storageUnits)
    rgbColorsToUse.push(categoriesColors[category])
    console.log(category, categoriesColors[category])
    rgbColorsToUseBorder.push(categoriesColors[category]?.replace('0.2', '1'))
  });
  console.log(rgbColorsToUse)


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
      <Pie data={data} plugins={
        // @ts-ignore
        [ChartDataLabels]}  options={options}/>
    </>
  );
}
