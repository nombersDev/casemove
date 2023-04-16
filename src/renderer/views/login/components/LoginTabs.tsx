import { LockClosedIcon, QrcodeIcon, WifiIcon } from '@heroicons/react/solid';
import { LoginMethod } from '../types/LoginMethod';
import { classNames } from '../../../components/content/shared/filters/inventoryFunctions';

interface TabProps {
  name: string;
  icon: any;
  key: LoginMethod;
}

const tabs: TabProps[] = [
  { name: 'QR', icon: QrcodeIcon, key: 'QR' },
  { name: 'Webtoken', icon: WifiIcon, key: 'WEBTOKEN' },
  { name: 'Regular', icon: LockClosedIcon, key: 'REGULAR' },
];

type LoginTabsProps = {
  selectedTab: LoginMethod;
  setSelectedTab: (tab: LoginMethod) => void;
};

export default function LoginTabs({
  selectedTab,
  setSelectedTab,
}: LoginTabsProps) {
  const defaultValue: LoginMethod = 'REGULAR';
  return (
    <div className="bg-dark-level-one px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.key === defaultValue)?.name}
          >
            {tabs.map((tab) => (
              <option key={tab.name} >{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex place-content-center">
            <ul
              role="list"
              className="flex  flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
            >
              {tabs.map((tab) => (
                <li key={tab.name}>
                  <button
                      onClick={() => setSelectedTab(tab.key)} className={classNames(tab.key === selectedTab ? 'bg-dark-level-three' : '', 'flex px-3 py-1 pointer place-content-center h-full items-center rounded-md')}>
                    <tab.icon className={classNames(tab.key === selectedTab ? 'text-dark-white' : "text-gray-400", 'h-6 w-6 pr-2')}/>
                    <span
                      className={
                        tab.key === selectedTab ? 'text-dark-white' : 'text-gray-400'
                      }
                    >
                      {tab.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
