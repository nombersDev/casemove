
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { ItemRow } from 'renderer/interfaces/items';
Chart

function runArray(arrayToRun: Array<ItemRow>, objectToUse: any) {
  objectToUse = getObject(arrayToRun, objectToUse)
  var items = Object.keys(objectToUse).map(function (key) {
    return [key, objectToUse[key]];
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  return items
}

function getObject(arrayToRun: Array<ItemRow>, objectToUse: any) {
  arrayToRun = arrayToRun.filter(itemRow => itemRow.item_moveable);


  arrayToRun.forEach(element => {
    if (objectToUse[element.item_name] == undefined) {
      objectToUse[element.item_name] = element.combined_QTY
    }
    else {
      objectToUse[element.item_name] = objectToUse[element.item_name] + element.combined_QTY
    }
  });
  return objectToUse
}

export default function BarAppOverall() {

  // Bar options
  // @ts-ignore
  const options = {
    plugins: {
      legend: {
        labels: {
          display: 'true',
          color: '#d6d3cd',
        },
        
        textDirection: 'ltr'

      },
      title: {
        display: true,
        text: 'Overall',
        color: '#d6d3cd'
      }
    },
    
  };

  // Go through inventory and find matching categories
  let Reducer = new ReducerManager(useSelector)
  const inventory = Reducer.getStorage(Reducer.names.inventory)

  // Convert inventory to chart data

  let seenNamesOverall: any = {}
  let seenNamesInventory: any = {}
  let seenNamesStorage: any = {}

  let overallData = runArray([...inventory.combinedInventory, ...inventory.storageInventory], seenNamesOverall);
  let inventoryData = getObject(inventory.combinedInventory, seenNamesInventory);
  let storageData = getObject(inventory.storageInventory, seenNamesStorage);

  console.log(overallData, inventoryData, storageData)


  const data = {
    labels: overallData.slice(0, 5).map(itemRow => itemRow[0]),


    datasets: [
      {
        label: 'Inventory',
        data: overallData.map(itemRow => inventoryData[itemRow[0]]),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Storage Units',
        data: overallData.map(itemRow => storageData[itemRow[0]]),
        backgroundColor: 'rgb(50, 91, 136, 0.2)',
        borderColor: 'rgb(50, 91, 136, 1)',
        borderWidth: 1,
      },
    ],
  };
  // @ts-ignore
  return (
    <>

      <Bar data={data} height="518" width="517" options={options} />
    </>
  );
}
