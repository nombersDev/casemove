import { onSortChange } from "./functions";
import { useDispatch, useSelector } from "react-redux";
import { SelectorIcon } from "@heroicons/react/solid";

// Row header with sort option
export function RowHeader({ headerName, sortName }) {
    const dispatch = useDispatch();
    const states = useSelector((state: any) => state);


    return (
        <>
            <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                    onClick={() => onSortChange(dispatch, sortName, states)}
                    className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                    <span className="flex justify-between">
                        {headerName} <SelectorIcon className="h-2" />
                    </span>
                </button>
            </th>
        </>
    );
}

// Row header sort and condition
export function RowHeaderCondition({ headerName, sortName, condition }) {
    const dispatch = useDispatch();
    const states = useSelector((state: any) => state);


    return (
        <>

            {states.settingsReducer.columns.includes(condition) ?
                <th className="table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                        onClick={() => onSortChange(dispatch, sortName, states)}
                        className="text-gray-500 dark:text-gray-400 tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                        <span className="flex justify-between">
                            {headerName} <SelectorIcon className="h-2" />
                        </span>
                    </button>
                </th> : ''}
        </>
    );
}

// Row header sort and condition
export function RowHeaderConditionNoSort({ headerName, condition }) {
    const states = useSelector((state: any) => state);

    return (
        <>

            {states.settingsReducer.columns.includes(condition) ?
                <RowHeaderPlain headerName={headerName} />
                : ''}
        </>
    );
}

// Row header plain
export function RowHeaderPlain({ headerName }: { headerName: string }) {

    return (
        <>

            <th className="hidden md:table-cell px-6 py-2 border-b border-gray-200 bg-gray-50 dark:border-opacity-50 dark:bg-dark-level-two">
                <button className="text-gray-500 dark:text-gray-400 pointer-events-none tracking-wider uppercase text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    {headerName}
                </button>
            </th>
        </>
    );
}