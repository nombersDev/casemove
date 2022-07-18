import { CollectionIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerManager } from "renderer/functionsClasses/reducerManager";
import { getAllStorages } from "renderer/functionsClasses/storageUnits/storageUnitsFunctions";
import { State } from "renderer/interfaces/states";
import { LoadingButton } from "./shared/animations";
import { classNames } from "./shared/filters/inventoryFunctions";

export function LoadButton() {
    let ReducerClass = new ReducerManager(useSelector);
    let currentState: State = ReducerClass.getStorage();
    const dispatch = useDispatch();
    // Get all storage unit data
    async function getAllStor() {
        setLoadingButton(true)
        getAllStorages(dispatch, currentState).then(() => {
            setLoadingButton(false)
        })
    }

    const [getLoadingButton, setLoadingButton] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => getAllStor()}
                className={classNames(currentState.moveFromReducer.activeStorages.length == 0 || getLoadingButton ? 'bg-green-700' : 'bg-dark-level-three', "inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-dark-white hover:bg-dark-level-four")}
            >
                {' '}

                {getLoadingButton ? (
                    <LoadingButton
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-dark-white"
                        aria-hidden="true"
                    />
                ) : (
                    <CollectionIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-dark-white"
                        aria-hidden="true"
                    />
                )}
                {currentState.moveFromReducer.activeStorages.length != 0 ? currentState.moveFromReducer.activeStorages.length + " Storage units loaded" : "Load storage units"}
            </button>
        </>
    );
}
