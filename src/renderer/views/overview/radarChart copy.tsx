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
import { Radar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {itemCategories} from 'renderer/components/content/shared/categories';

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

  let resultingData = {} as any;
  itemCategories.forEach((element) => {
    categoriesFixed.push(element.name);
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
          color: '#d6d3cd',
        },

      },
      title: {
          display: true,
          text: 'Items',
          color: '#d6d3cd'
      }
  },
    parsing: {
      key: 'nested.value',
    },
    legend: {
      position: 'top',
      labels: {
        fontColor: 'white',
      },
    },
    title: {
      display: true,
      text: 'Chart.js Radar Chart',
      fontColor: 'white',
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },

        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: 'white',
          showLabelBackdrop: false,
        },
      },
    },
  };

  // Go through inventory and find matching categories
  const inventory = useSelector((state: any) => state.inventoryReducer);
  inventory.combinedInventory.forEach(element => {
    if (resultingData[element.category]) {
      resultingData[element.category].inventory = resultingData?.[element.category]?.inventory + element.combined_QTY
    }
  });

  // Go through Storage Units
  inventory.storageInventory.forEach(element => {
    console.log(element)
    if (resultingData[element.category]) {
      resultingData[element.category].storageUnits = resultingData?.[element.category]?.storageUnits + element.combined_QTY
    }
  });

  // Convert inventory to chart data
  let inventoryDataToUse: Array<number> = [];
  let storageUnitDataToUse: Array<number> = [];

  categoriesFixed.forEach(category => {
    inventoryDataToUse.push(resultingData[category].inventory)
    storageUnitDataToUse.push(resultingData[category].storageUnits)
  });
  console.log(storageUnitDataToUse)


  const data = {
    labels: categoriesFixed,

    datasets: [
      {
        label: 'Inventory',
        data: inventoryDataToUse,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Storage Units',
        data: storageUnitDataToUse,
        backgroundColor: 'rgb(50, 91, 136, 0.2)',
        borderColor: 'rgb(50, 91, 136, 1)',
        borderWidth: 1,
      },

    ],
  };

  return (
    <>
      <Radar data={data} options={options} />
    </>
  );
}
