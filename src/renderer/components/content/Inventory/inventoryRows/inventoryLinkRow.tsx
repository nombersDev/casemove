import { ExternalLinkIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function RowLinkInventory({ itemRow }) {
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const userDetails = useSelector((state: any) => state.authReducer);

  return (
    <>
      {settingsData.columns.includes('Inventory link') ? (
        <td
          key={Math.random().toString(36).substr(2, 9)}
          className="table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 hover:text-gray-200 text-right"
        >
          <div className="flex justify-center rounded-full drop-shadow-lg">
            <Link
              to={{
                pathname: `https://steamcommunity.com/profiles/${userDetails.steamID}/inventory/#730_2_${itemRow.combined_ids[0]}`,
              }}
              target="_blank"
            >
              <ExternalLinkIcon
                className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-100"
                aria-hidden="true"
              />
            </Link>
          </div>
        </td>
      ) : (
        ''
      )}

    </>
  );
}