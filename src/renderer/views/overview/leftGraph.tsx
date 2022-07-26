import { useSelector } from "react-redux";
import { ReducerManager } from "renderer/functionsClasses/reducerManager";
import { Settings } from "renderer/interfaces/states";
import EmptyField from "./EmptyField";
import OverallVolume from "./leftGraph/barChartOverall";

export default function LeftGraph() {
    let ReducerClass = new ReducerManager(useSelector);
    let settingsData: Settings = ReducerClass.getStorage(ReducerClass.names.settings)

    let by = settingsData.overview.by
    let left = settingsData.overview.chartleft

    let returnObject = {
        overall: {
            volume: OverallVolume,
            price: OverallVolume
        }
    }

    let Fitting = returnObject[left][by]
    if (Fitting == undefined) {
      Fitting = EmptyField
    }
    console.log(Fitting)

   
  
 
  
    return (
      <>
      <Fitting />
      </>
    );
  }
  