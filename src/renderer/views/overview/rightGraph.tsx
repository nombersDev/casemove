import { useSelector } from "react-redux";
import { ReducerManager } from "renderer/functionsClasses/reducerManager";
import { Settings } from "renderer/interfaces/states";
import EmptyField from "./EmptyField";
import ItemDistributionByVolume from "./categoryDistribution/categoryDistribution";

export default function RightGraph() {
    let ReducerClass = new ReducerManager(useSelector);
    let settingsData: Settings = ReducerClass.getStorage(ReducerClass.names.settings)

    let by = settingsData.overview.by
    let right = settingsData.overview.chartRight

    let returnObject = {
        itemDistribution: ItemDistributionByVolume
    }

    let Fitting = returnObject[right]
    if (Fitting == undefined) {
        Fitting = EmptyField
      }
    console.log(by)

   
  
 
  
    return (
      <>
      <Fitting />
      </>
    );
  }
  