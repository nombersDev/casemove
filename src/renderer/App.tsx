import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import 'tailwindcss/tailwind.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect,
} from 'react-router-dom';
import inventoryContent from './components/content/Inventory/inventory';
import {
  DownloadIcon,
  GiftIcon,
  InboxInIcon,
  RefreshIcon,
  SearchIcon,
  SelectorIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import {
  ArchiveIcon,
  DocumentDownloadIcon,
  XIcon,
  MenuAlt1Icon,
  BeakerIcon,
} from '@heroicons/react/outline';
import itemCategories from './components/content/shared/categories';
import { toMoveContext } from './context/toMoveContext';
import StorageUnitsComponent from './components/content/storageUnits/from/Content';
import LoginPage from './views/login/login';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from './store/actions/userStatsActions';
import { handleUserEvent } from './store/handleMessage';
import Logo from './components/content/shared/iconsLogo/logo 2';
import ToContent from './components/content/storageUnits/to/toHolder';
import { classNames } from './components/content/shared/inventoryFunctions';
import {
  filterInventorySetSort,
  inventoryAddCategoryFilter,
  inventoryAddRarityFilter,
} from './store/actions/filtersInventoryActions';
import settingsPage from './views/settings/settings';
import {
  setColumns,
  setCurrencyRate,
  setDevmode,
  setFastMove,
  setLocale,
  setOS,
  setSourceValue,
} from './store/actions/settings';
import { pricing_addPrice } from './store/actions/pricingActions';
import TitleBarWindows from './components/content/shared/titleBarWindows';
import TradeupPage from './views/tradeUp/tradeUp';
import itemRarities from './components/content/shared/rarities';
import { setTradeFoundMatch } from './store/actions/modalTrade';
import TradeResultModal from './components/content/shared/modals & notifcations/modalTradeResult';
DocumentDownloadIcon;

//{ name: 'Reports', href: '/reports', icon: DocumentDownloadIcon, current: false }
const navigation = [
  {
    name: 'Transfer | From',
    href: '/transferfrom',
    icon: DownloadIcon,
    current: false,
  },
  {
    name: 'Transfer | To',
    href: '/transferto',
    icon: UploadIcon,
    current: false,
  },
  { name: 'Inventory', href: '/inventory', icon: ArchiveIcon, current: false },
  { name: 'Trade up', href: '/tradeup', icon: BeakerIcon, current: false },
];

function AppContent() {
  SearchIcon;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSideMenuOption, setSideMenuOption] = useState(
    location.pathname
  );

  const [getToMoveContext, setToMoveContext] = useState({
    fromStorage: {},
  });
  const toMoveValue = useMemo(
    () => ({ getToMoveContext, setToMoveContext }),
    [getToMoveContext, setToMoveContext]
  );

  // Redux user details
  const userDetails = useSelector((state: any) => state.authReducer);
  const modalData = useSelector((state: any) => state.modalMoveReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const inventoryData = useSelector((state: any) => state.inventoryReducer);
  const tradeUpData = useSelector((state: any) => state.modalTradeReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const filterDetails = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );

  document.documentElement.classList.add('dark');

  function updateAutomation(itemHref) {
    setSideMenuOption(itemHref);
    setSidebarOpen(false);
  }

  if (currentSideMenuOption != location.pathname) {
    setSideMenuOption(location.pathname);
  }

  // Log out of session
  const dispatch = useDispatch();

  async function handleFilterData(combinedInventory) {
    if (
      filterDetails.inventoryFilter.length > 0 ||
      filterDetails.sortValue != 'Default'
    ) {
      console.log(
        combinedInventory,
        filterDetails.inventoryFilter,
        filterDetails.sortValue
      );
      dispatch(
        await filterInventorySetSort(
          inventoryData.inventory,
          combinedInventory,
          filterDetails,
          filterDetails.sortValue,
          pricesResult.prices,
          settingsData?.source?.title
        )
      );
    }
  }

  // First time setup
  async function setFirstTimeSettings() {
    if (settingsData.currencyPrice == {} || settingsData.source == undefined) {
      // OS
      await window.electron.store.get('os').then((returnValue) => {
        console.log('OS', returnValue);
        dispatch(setOS(returnValue));
      });

      // wear value
      await window.electron.store.get('columns').then((returnValue) => {
        console.log('columns', returnValue);
        if (returnValue != undefined) {
          dispatch(setColumns(returnValue));
        }
      });

      // Dev mode
      await window.electron.store.get('devmode.value').then((returnValue) => {
        console.log('devmode.value', returnValue);
        if (returnValue == undefined) {
          returnValue = false;
        }
        dispatch(setDevmode(returnValue));
      });

      // Currency rate
      if (userDetails.isLoggedIn) {
        await window.electron.ipcRenderer
        .getCurrencyRate()
        .then((returnValue) => {
          console.log('currencyrate', returnValue);
          dispatch(setCurrencyRate(returnValue[0], returnValue[1]));
        });
      }
      // Fastmove
      console.log('Getting settings');
      let storedFastMove = await window.electron.store.get('fastmove');
      if (storedFastMove == undefined) {
        storedFastMove = false;
      }
      dispatch(setFastMove(storedFastMove));
      // Source
      await window.electron.store.get('pricing.source').then((returnValue) => {
        let valueToWrite = returnValue;
        if (returnValue == undefined) {
          valueToWrite = {
            id: 1,
            name: 'Steam Community Market',
            title: 'steam_listing',
            avatar: 'https://steamcommunity.com/favicon.ico',
          };
        }
        dispatch(setSourceValue(valueToWrite));
      });

      await window.electron.store.get('locale').then((returnValue) => {
        dispatch(setLocale(returnValue));
      });
    }
  }

  // Forward user event to Store
  if (isListening == false) {

    setFirstTimeSettings();
    window.electron.ipcRenderer.userEvents().then((messageValue) => {
      handleSubMessage(messageValue, settingsData);
    });

    setIsListening(true);
  }

  async function handleSubMessage(messageValue, settingsData) {
    if (settingsData.fastMove && modalData.query.length > 0) {
      console.log('Command blocked', modalData.moveOpen, settingsData.fastMove);
      setIsListening(false);
      return;
    }
    const actionToTake = (await handleUserEvent(
      messageValue,
      settingsData
    )) as any;
    dispatch(actionToTake);
    if (messageValue[0] == 1) {
      await handleFilterData(actionToTake.payload.combinedInventory);
    }
    setIsListening(false);
  }

  async function logOut() {
    window.electron.ipcRenderer.logUserOut();
    dispatch(signOut());
  }

  async function retryConnection() {
    window.electron.ipcRenderer.retryConnection();
  }

  // Should update status
  const [shouldUpdate, setShouldUpdate] = useState(0);
  const [getVersion, setVersion] = useState('');
  async function getUpdate() {
    const doUpdate = await window.electron.ipcRenderer.needUpdate();
    console.log(doUpdate);
    setVersion('v' + doUpdate[1]);
    if (doUpdate[0] == true) {
      setShouldUpdate(1);
    }
  }
  if (shouldUpdate == 0) {
    setShouldUpdate(2);
    getUpdate();
  }

  // Pricing
  const [firstRun, setFirstRun] = useState(false);

  if (firstRun == false) {
    setFirstRun(true);
    window.electron.ipcRenderer.on('pricing', (message) => {
      console.log(message);
      dispatch(pricing_addPrice(message[0]));
    });
  }

  // Trade up
  async function handleTradeUp() {
    inventory.inventory.forEach((element) => {
      if (!tradeUpData.inventoryFirst.includes(element.item_id)) {
        dispatch(setTradeFoundMatch(element));
      }
    });
  }
  if (tradeUpData.inventoryFirst.length != 0) {
    handleTradeUp();
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}

      <TradeResultModal />
      {settingsData.os != 'win32' ? '' : <TitleBarWindows />}
      <div
        className={classNames(
          settingsData.os == 'win32' ? 'pt-7' : '',
          'min-h-full dark:bg-dark-level-one h-screen'
        )}
      >
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 dark:bg-dark-level-two lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div
                  className={classNames(
                    settingsData.os == 'win32' ? 'pt-7' : '',
                    'flex-shrink-0 flex items-center px-4'
                  )}
                >
                  <Logo />
                  <span className="">{shouldUpdate}</span>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            currentSideMenuOption.includes(item.href)
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                            userDetails.isLoggedIn ? '' : 'pointer-events-none',
                            'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                          onClick={() => updateAutomation(item.href)}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'mr-3 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <h3
                        className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        id="mobile-teams-headline"
                      >
                        Teams
                      </h3>
                      <div
                        className="mt-1 space-y-1"
                        role="group"
                        aria-labelledby="mobile-teams-headline"
                      >
                        {itemCategories.map((team) => (
                          <a
                            key={team.name}
                            href={team.href}
                            className="group flex items-center px-3 py-2 text-base leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                          >
                            <span
                              className={classNames(
                                team.bgColorClass,
                                'w-2.5 h-2.5 mr-4 rounded-full'
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate">{team.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col dark:bg-dark-level-two dark:border-opacity-50 lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
          <div
            className={classNames(
              settingsData.os == 'win32' ? 'pt-7' : '',
              'flex items-center flex-shrink-0 px-6'
            )}
          >
            <Logo />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            <Menu
              as="div"
              className={classNames(
                userDetails.isLoggedIn ? '' : 'pointer-events-none',
                'px-3 relative inline-block text-left'
              )}
            >
              <div>
                <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 dark:bg-dark-level-two hover:bg-gray-200 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-100">
                  <span className="flex w-full justify-between items-center">
                    <span className="flex min-w-0 items-center justify-between space-x-3">
                      {userDetails.userProfilePicture == null ? (
                        <svg
                          className="w-10 h-10 rounded-full flex-shrink-0 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <img
                          className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                          src={userDetails.userProfilePicture}
                          alt=""
                        />
                      )}

                      <span className="flex-1 flex flex-col min-w-0">
                        <span className="text-gray-900 dark:text-dark-white text-sm font-medium truncate">
                          {userDetails.displayName}
                        </span>
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-500">

                          <span
                            className={classNames(
                              userDetails.CSGOConnection
                                ? 'text-green-400'
                                : 'text-red-400',
                              'text-xs font-medium'
                            )}
                          ><div className='flex justify-between'>
                            <div>
                            {userDetails.CSGOConnection ? 'CSGO Online' : 'CSGO Offline'}
                            </div>

                            </div>
                            <div className='text-gray-500'>
                              {userDetails.walletBalance?.balance == 0 || userDetails.walletBalance == null ? '' : new Intl.NumberFormat(settingsData.locale, {
                  style: 'currency',
                  currency: userDetails.walletBalance?.currency || settingsData.currency,
                }).format(
                  userDetails.walletBalance?.balance || 0)}
                            </div>
                          </span>
                        </span>
                      </span>
                    </span>
                    <SelectorIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white dark:bg-dark-level-four ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-opacity-50 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 dark:bg-dark-level-three dark:text-dark-white'
                              : 'text-gray-700 dark:text-dark-white',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to=""
                          onClick={() => logOut()}
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900 dark:bg-dark-level-three dark:text-dark-white'
                              : 'text-gray-700 dark:text-dark-white',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Logout
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="px-3 mt-5">
              {userDetails.CSGOConnection == false &&
              userDetails.isLoggedIn == true ? (
                <button
                  type="button"
                  onClick={() => retryConnection()}
                  className="inline-flex items-center bg-green-200 px-6 shadow-md py-3 text-left text-base w-full font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-none focus:outline-none pl-9 sm:text-sm border-gray-300 rounded-md h-9 text-gray-400"
                >
                  <RefreshIcon
                    className="mr-3 h-4 w-4 text-green-900"
                    style={{ marginLeft: -25 }}
                    aria-hidden="true"
                  />
                  <span className="mr-3 text-green-900">Retry connection</span>
                </button>
              ) : shouldUpdate == 1 ? (
                <a
                  href="https://github.com/nombersDev/casemove/releases"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex items-center bg-green-200 px-6 shadow-md py-3 text-left text-base w-full font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-none focus:outline-none pl-9 sm:text-sm border-gray-300 rounded-md h-9 text-gray-400"
                  >
                    <InboxInIcon
                      className="mr-3 h-4 w-4 text-gray-500"
                      style={{ marginLeft: -22 }}
                      aria-hidden="true"
                    />
                    <span className="mr-3">Update ready</span>
                  </button>
                </a>
              ) : (
                <a
                  href="https://steamcommunity.com/tradeoffer/new/?partner=1033744096&token=29ggoJY7"
                  target="_blank"
                >
                  <button
                    type="button"
                    className="inline-flex  dark:text-dark-white items-center px-6 py-3 border border-gray-200 dark:bg-dark-level-three   dark:border-opacity-0  text-left text-base w-full font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none pl-9 sm:text-sm border-gray-300 rounded-md h-9 text-gray-400"
                  >
                    <GiftIcon
                      className="mr-3  h-4 w-4 text-gray-500"
                      style={{ marginLeft: -25 }}
                      aria-hidden="true"
                    />
                    <span className="mr-3">Support the project</span>
                  </button>
                </a>
              )}
            </div>
            {/* Navigation */}
            <nav className="px-3 mt-5">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      currentSideMenuOption.includes(item.href)
                        ? 'bg-gray-100 text-gray-900 dark:bg-opacity-10 dark:text-opacity-60'
                        : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:bg-opacity-10 dark:hover:text-opacity-60 ',
                      userDetails.isLoggedIn ? '' : 'pointer-events-none',
                      'group flex items-center px-2 py-2 dark:text-dark-white text-base leading-5 font-medium rounded-md'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => updateAutomation(item.href)}
                  >
                    <item.icon
                      className={classNames(
                        currentSideMenuOption.includes(item.href)
                          ? 'text-gray-500 dark:text-opacity-60'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6  dark:text-dark-white'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              {!currentSideMenuOption.includes('/tradeup') ? (
                <div className="mt-8">
                  {/* Secondary navigation */}
                  <h3
                    className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    id="desktop-teams-headline"
                  >
                    Storage categories
                  </h3>
                  <div
                    className="mt-1 space-y-1"
                    role="group"
                    aria-labelledby="desktop-teams-headline"
                  >
                    {itemCategories.map((team) => (
                      <div
                        className={classNames(
                          filterDetails.categoryFilter?.includes(
                            team.bgColorClass
                          )
                            ? 'bg-gray-200 dark:bg-dark-level-three'
                            : '',
                          'w-full'
                        )}
                      >
                        <button
                          key={team.name}
                          onClick={() =>
                            dispatch(
                              inventoryAddCategoryFilter(team.bgColorClass)
                            )
                          }
                          className={classNames(
                            userDetails.isLoggedIn == false
                              ? 'pointer-events-none'
                              : '',
                            'group flex items-center px-3 py-2 dark:text-dark-white text-sm font-medium text-gray-700 rounded-md'
                          )}
                        >
                          <span
                            className={classNames(
                              team.bgColorClass,
                              'w-2.5 h-2.5 mr-4 rounded-full'
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{team.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  {/* Secondary navigation */}
                  <h3
                    className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    id="desktop-teams-headline"
                  >
                    RARITY
                  </h3>
                  <div
                    className="mt-1 space-y-1"
                    role="group"
                    aria-labelledby="desktop-teams-headline"
                  >
                    {itemRarities.map((rarity) => (
                      <div
                        className={classNames(
                          filterDetails.rarityFilter?.includes(
                            rarity.bgColorClass
                          )
                            ? 'bg-gray-200 dark:bg-dark-level-three'
                            : '',
                          'w-full'
                        )}
                      >
                        <button
                          key={rarity.value}
                          onClick={() =>
                            dispatch(
                              inventoryAddRarityFilter(rarity.bgColorClass)
                            )
                          }
                          className={classNames(
                            userDetails.isLoggedIn == false
                              ? 'pointer-events-none'
                              : '',
                            'group flex items-center px-3 py-2 dark:text-dark-white text-sm font-medium text-gray-700 rounded-md'
                          )}
                        >
                          <span
                            className={classNames(
                              rarity.bgColorClass,
                              'w-2.5 h-2.5 mr-4 rounded-full'
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{rarity.value}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          <span className="text-xs pl-4 text-gray-500">{getVersion}</span>
        </div>
        {/* Main column */}
        <div className="lg:pl-64 flex flex-col">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden dark:bg-dark-level-two">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-1 items-center justify-end flex">
                <div className="px-3">
                  {userDetails.CSGOConnection == false &&
                  userDetails.isLoggedIn == true ? (
                    <button
                      type="button"
                      onClick={() => retryConnection()}
                      className="inline-flex items-center bg-green-200 px-6 shadow-md py-3 text-left text-base w-full font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none pl-9 sm:text-sm border-gray-300 rounded-md h-9 text-gray-400"
                    >
                      <RefreshIcon
                        className="mr-3 h-4 w-4 text-green-900 "
                        style={{ marginLeft: -25 }}
                        aria-hidden="true"
                      />
                      <span className="mr-3 text-green-900">
                        Retry connection
                      </span>
                    </button>
                  ) : shouldUpdate == 1 ? (
                    <a
                      href="https://steamcommunity.com/tradeoffer/new/?partner=1033744096&token=29ggoJY7"
                      target="_blank"
                    >
                      <button
                        type="button"
                        className="inline-flex items-center px-6 py-3 border border-gray-200 text-left text-base w-full font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none pl-9 sm:text-sm border-gray-300 rounded-md h-9 text-gray-400"
                      >
                        <InboxInIcon
                          className="mr-3 h-4 w-4 text-gray-500"
                          style={{ marginLeft: -22 }}
                          aria-hidden="true"
                        />
                        <span className="mr-3">Update ready</span>
                      </button>
                    </a>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu
                  as="div"
                  className={classNames(
                    userDetails.isLoggedIn ? '' : 'pointer-events-none',
                    'ml-3 relative'
                  )}
                >
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {userDetails.userProfilePicture == null ? (
                        <svg
                          className="w-10 h-10 rounded-full flex-shrink-0 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <img
                          className={classNames(
                            userDetails.CSGOConnection
                              ? 'border-2 border-solid border-green-400'
                              : 'border-4 border-solid border-red-400',
                            'w-10 h-10 bg-gray-300 rounded-full flex-shrink-0'
                          )}
                          src={userDetails.userProfilePicture}
                          alt=""
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to=""
                              onClick={() => logOut()}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Logout
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 dark:bg-dark-level-one">
            <Router>
              <Switch>
                <toMoveContext.Provider value={toMoveValue}>
                  {userDetails.isLoggedIn ? (
                    <Redirect exact from="/" to="/transferfrom" />
                  ) : (
                    <Redirect from="*" to="/signin" />
                  )}
                  {userDetails.isLoggedIn ? (
                    <Redirect exact from="/signin" to="/transferfrom" />
                  ) : (
                    ''
                  )}
                  <Route
                    path="/transferfrom"
                    component={StorageUnitsComponent}
                  />
                  <Route exact path="/transferto" component={ToContent} />
                  <Route path="/signin" component={LoginPage} />
                  <Route exact path="/inventory" component={inventoryContent} />
                  <Route exact path="/tradeup" component={TradeupPage} />
                  <Route exact path="/settings" component={settingsPage} />
                </toMoveContext.Provider>
              </Switch>
            </Router>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Route path="/" component={AppContent} />
    </Router>
  );
}
