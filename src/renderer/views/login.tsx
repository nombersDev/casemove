import { LockClosedIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingButton } from 'renderer/components/content/shared/animations';
import combineInventory from 'renderer/components/content/shared/inventoryFunctions';
import NotificationElement from 'renderer/components/content/shared/modals & notifcations/notification';
import { setInventoryAction } from 'renderer/store/actions/inventoryActions';
import { signIn } from 'renderer/store/actions/userStatsActions';
import { getURL } from 'renderer/store/helpers/userStatusHelper';

export default function LoginPage() {
  // Usestate
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [doShow, setDoShow] = useState(false);
  const [wasSuccess, setWasSuccess] = useState(false);
  const [titleToDisplay, setTitleToDisplay] = useState('test');
  const [textToDisplay, setTextToDisplay] = useState('test');
  const [storePassword, setStorePassword] = useState(false);
  const [getLoadingButton, setLoadingButton] = useState(false);
  setStorePassword;
  // Handle login
  const dispatch = useDispatch();
  // Return 1 = Success
  // Return 2 = Steam Guard
  // Return 3 = Steam Guard wrong
  // Return 4 = Wrong password
  // Return 5 = Playing elsewhere

  async function openNotification(success, title, text) {
    setWasSuccess(success);
    setTitleToDisplay(title);
    setTextToDisplay(text);
    setDoShow(true);
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoadingButton(true);
    let responseCode = 1;
    responseCode = 1;
    const responseStatus = await window.electron.ipcRenderer.loginUser(
      username,
      password,
      storePassword,
      authCode
    );
    responseCode = responseStatus[0];
    // Notification
    switch (responseCode) {
      case 1:
        openNotification(
          true,
          'Logged in successfully!',
          'The app has successfully logged you in. Happy storaging.'
        );
        break;
      case 2:
        openNotification(
          false,
          'Steam Guard error!',
          'Steam Guard might be required. Try again.'
        );
        break;
      case 3:
        openNotification(
          false,
          'Wrong Steam Guard code',
          'Got the wrong Steam Guard code. Try again.'
        );
        break;

      case 4:
        openNotification(
          false,
          'Unknown error',
          'Could be wrong credentials, a network error or something else.'
        );
        setUsername('');
        setPassword('');
        break;

      case 5:
        openNotification(
          false,
          'Playing elsewhere',
          'You were logged in but the account is currently playing elsewhere. Close the session and try again.'
        );
        break;
    }
    // If success login
    if (responseCode == 1) {
      let returnPackage = {
        steamID: responseStatus[1][0],
        displayName: responseStatus[1][1],
        CSGOConnection: responseStatus[1][2],
      };
      await new Promise((r) => setTimeout(r, 2500));
      try {
        const profilePicture = await getURL(returnPackage.steamID);
        returnPackage['userProfilePicture'] = profilePicture;
      } catch (error) {
        returnPackage['userProfilePicture'] =
          'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/econ/characters/customplayer_tm_separatist.png';
      }

      dispatch(signIn(returnPackage));
      const combined = await combineInventory(responseStatus[1][3]);
      dispatch(
        setInventoryAction({
          inventory: responseStatus[1][3],
          combinedInventory: combined,
        })
      );
    } else {
      setAuthCode('');
    }
    setLoadingButton(false);
  }

  return (
    <>
      <div className="min-h-full flex items-center  pt-32 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://store.cloudflare.steamstatic.com/public/shared/images/email/logo_footer.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connect to Steam
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The application needs to have an active Steam connection to manage
              your CSGO items.
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  value={username}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  value={password}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div className="">
                <label htmlFor="authcode" className="sr-only">
                  Authcode
                </label>
                <input
                  id="authcode"
                  name="authcode"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="authcode (optional)"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/*

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  onChange={() => setStorePassword}
                />

                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
      */}
              </div>

              <div className="text-sm">
                <a
                  href="https://help.steampowered.com/en/wizard/HelpWithLogin"
                  target="_blank"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(e) => onSubmit(e)}
                type="button"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {getLoadingButton ? (
                    <LoadingButton />
                  ) : (
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <NotificationElement
        success={wasSuccess}
        titleToDisplay={titleToDisplay}
        textToDisplay={textToDisplay}
        doShow={doShow}
        setShow={() => {
          setDoShow(false);
        }}
      />
    </>
  );
}
