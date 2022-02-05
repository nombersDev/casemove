import { HashRouter as Router, Route } from 'react-router-dom';
import FromMainComponent from './fromHolder';

function StorageUnits() {
  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 mt-2 mb-2 text-gray-900 sm:truncate">
            Transfer from storage units
          </h1>
        </div>
      </div>
      <FromMainComponent />
    </>
  );
}

export default function StorageUnitsComponent() {
  return (
    <Router>
      <Route path="/transferfrom" component={StorageUnits} />
    </Router>
  );
}
