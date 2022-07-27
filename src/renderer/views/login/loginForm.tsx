import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
  ExternalLinkIcon,
  KeyIcon,
  LockClosedIcon,
  WifiIcon,
} from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingButton } from 'renderer/components/content/shared/animations';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import NotificationElement from 'renderer/components/content/shared/modals & notifcations/notification';
import SteamLogo from 'renderer/components/content/shared/steamLogo';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import {
  HandleLoginObjectClass,
  LoginCommand,
  LoginCommandReturnPackage,
  LoginNotificationObject,
  LoginOptions,
} from 'shared/Interfaces.tsx/store';
import ConfirmModal from './confirmLoginModal';
import { handleSuccess } from './HandleSuccess';

const loginResponseObject: LoginNotificationObject = {
  loggedIn: {
    success: true,
    title: 'Logged in successfully!',
    text: 'The app has successfully logged you in. Happy storaging.',
  },
  steamGuardError: {
    success: false,
    title: 'Steam Guard error!',
    text: 'Steam Guard might be required. Try again.',
  },
  steamGuardCodeIncorrect: {
    success: false,
    title: 'Wrong Steam Guard code',
    text: 'Got the wrong Steam Guard code. Try again.',
  },
  defaultError: {
    success: false,
    title: 'Unknown error',
    text: 'Could be wrong credentials, a network error, the account playing another game or something else. ',
  },
  playingElsewhere: {
    success: false,
    title: 'Playing elsewhere',
    text: 'You were logged in but the account is currently playing elsewhere.',
  },
  wrongLoginToken: {
    success: false,
    title: 'Wrong login token',
    text: 'Got the wrong login token.',
  },
  webtokenNotJSON: {
    success: false,
    title: 'Not a JSON string',
    text: 'Did you copy the entire string? Try again.',
  },
  webtokenNotLoggedIn: {
    success: false,
    title: 'Not logged in',
    text: 'Please log in to the browser and try again.',
  },
};

export default function LoginForm({ isLock, replaceLock, runDeleteUser }) {
  // Usestate
  isLock;
  replaceLock;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [open, setOpen] = useState(false);
  const [sharedSecret, setSharedSecret] = useState('');
  const [clientjstoken, setClientjstoken] = useState('');
  const [doShow, setDoShow] = useState(false);
  const [wasSuccess, setWasSuccess] = useState(false);
  const [titleToDisplay, setTitleToDisplay] = useState('test');
  const [textToDisplay, setTextToDisplay] = useState('test');
  const [storePassword, setStorePassword] = useState(false);
  const [getLoadingButton, setLoadingButton] = useState(false);
  const [secretEnabled, setSecretEnabled] = useState(false);

  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();
  // Handle login
  const dispatch = useDispatch();

  async function openNotification(keyValue: keyof LoginOptions) {
    setWasSuccess(loginResponseObject?.[keyValue]?.success);
    setTitleToDisplay(loginResponseObject?.[keyValue]?.title);
    setTextToDisplay(loginResponseObject?.[keyValue]?.text);
    setDoShow(true);
  }

  class HandleLogin {
    command: keyof LoginOptions;
    relevantFunction: Function;
    handleObject: HandleLoginObjectClass = {
      webtokenNotLoggedIn: this.handleWebTokenNotLoggedIn,
      webtokenNotJSON: this.handlewebtokenNotJson,
      wrongLoginToken: this.handleWrongLoginToken,
      steamGuardError: this.handleSteamGuardError,
      defaultError: this.handleUnknownError,
      steamGuardCodeIncorrect: this.handleWrongSteamGuard,
      playingElsewhere: this.handlePlayingElsewhere,
      loggedIn: this.handleSuccesLogin,
    };
    constructor(command: keyof LoginOptions) {
      this.command = command;
      this.relevantFunction = this.handleObject[this.command];
    }

    async handlewebtokenNotJson() {
      openNotification(this.command);
      setLoadingButton(false);
      setClientjstoken('');
    }

    async handleWebTokenNotLoggedIn() {
      openNotification(this.command);
      setLoadingButton(false);
      setClientjstoken('');
    }

    async handleSteamGuardError() {
      openNotification(this.command);
    }
    async handleUnknownError() {
      openNotification(this.command);
      setUsername('');
      setPassword('');
    }

    async handleWrongLoginToken() {
      replaceLock();
      if (isLock) {
        runDeleteUser(isLock);
      } else {
        runDeleteUser(username);
      }
    }

    async handlePlayingElsewhere() {
      setOpen(true);
      openNotification(this.command);
    }

    async handleWrongSteamGuard() {
      openNotification(this.command);
    }

    async handleSuccesLogin() {
      openNotification(this.command);
    }
  }

  async function handleError() {
    setAuthCode('');
    setLoadingButton(false);
  }
  async function validateWebToken() {
    let clientjstokenToSend = clientjstoken as any;
    // Validate web token
    if (webToken) {
      // Is json string?
      try {
        clientjstokenToSend = JSON.parse(clientjstoken);
      } catch {
        openNotification('webtokenNotJSON');
        setLoadingButton(false);
        setClientjstoken('');
        return;
      }

      // Is logged in?
      if (!clientjstokenToSend.logged_in) {
        openNotification('webtokenNotLoggedIn');
        setLoadingButton(false);
        setClientjstoken('');
        return;
      }
    } else {
      clientjstokenToSend = '';
    }
    return clientjstokenToSend;
  }

  let hasChosenAccountLoginKey = false;
  if (isLock.length == 2 && isLock[1] != undefined) {
    hasChosenAccountLoginKey = true;
  }
  hasChosenAccountLoginKey;
  isLock = isLock[0];
  async function onSubmit() {
    setLoadingButton(true);

    let clientjstokenToSend = await validateWebToken();
    let usernameToSend = username as any;
    let passwordToSend = password as any;
    let storePasswordToSend = storePassword as any;
    if (isLock != '') {
      usernameToSend = isLock;
      passwordToSend = null;
      storePasswordToSend = true;
    }
    const responseStatus: LoginCommand =
      await window.electron.ipcRenderer.loginUser(
        usernameToSend,
        passwordToSend,
        clientjstokenToSend != '' ? false : storePasswordToSend,
        authCode,
        sharedSecret,
        clientjstokenToSend
      );

    // Notification and react
    const HandleClass = new HandleLogin(responseStatus.responseStatus);
    HandleClass.relevantFunction();
    if (responseStatus.responseStatus == 'loggedIn') {
      handleSuccess(
        responseStatus.returnPackage as LoginCommandReturnPackage,
        dispatch,
        currentState
      );
    } else {
      handleError();
    }
  }
  async function updateUsername(value) {
    setUsername(value);
    if (isLock != '') {
      replaceLock();
    }
  }
  async function updatePassword(value) {
    setPassword(value);
    if (isLock != '') {
      replaceLock();
    }
  }

  const [seenOnce, setOnce] = useState(false);
  const [webToken, setWebToken] = useState(false);
  const [sendSubmit, shouldSubmit] = useState(false);
  if (seenOnce == false) {
    document.addEventListener('keyup', ({ key }) => {
      if (key == 'Enter') {
        shouldSubmit(true);
      }
    });
    setOnce(true);
  }

  if (sendSubmit) {
    onSubmit();
    shouldSubmit(false);
  }
  console.log(sendSubmit);

  async function handleSubmit(e) {
    e.preventDefault();
  }
  // setOpen(true)

  return (
    <>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        setLoadingButton={setLoadingButton}
      />
      <div className="min-h-full flex items-center  pt-32 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div>
            <SteamLogo />
            <h2 className="mt-6 text-center dark:text-dark-white text-3xl font-extrabold text-gray-900">
              {!webToken ? 'Connect to Steam' : 'Connect from browser'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {!webToken
                ? 'The application needs to have an active Steam connection to manage your CSGO items. You should not have any games open on the Steam account.'
                : 'Open the URL by clicking on the button, or by copying it to the clipboard. You should be logged into the account you wish to connect Casemove with. Paste the entire string below.'}
            </p>
          </div>

          <form className="mt-8 mb-6" onSubmit={(e) => handleSubmit(e)}>
            <input type="hidden" name="remember" defaultValue="true" />
            {!webToken ? (
              <div className="rounded-md mb-6">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    onChange={(e) => updateUsername(e.target.value)}
                    spellCheck={false}
                    required
                    value={isLock == '' ? username : isLock}
                    className="appearance-none dark:bg-dark-level-one dark:text-dark-white dark:bg-dark-level-one  dark:border-opacity-50 rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                  />
                </div>
                {!hasChosenAccountLoginKey ? (
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      spellCheck={false}
                      name="password"
                      type="password"
                      onChange={(e) => updatePassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      value={isLock == '' ? password : '~{nA?HJjb]7hB7-'}
                      className="appearance-none dark:text-dark-white rounded-none dark:bg-dark-level-one  dark:border-opacity-50 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                ) : (
                  ''
                )}
                {!hasChosenAccountLoginKey ? (
                  <div>
                    <label htmlFor="authcode" className="sr-only">
                      Steam Guard
                    </label>
                    <input
                      id="authcode"
                      name="authcode"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      spellCheck={false}
                      required
                      className="appearance-none rounded-none dark:bg-dark-level-one dark:text-dark-white dark:border-opacity-50 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Authcode (optional)"
                    />
                  </div>
                ) : (
                  <div className="pt-1 flex items-center">
                    <LockClosedIcon className="h-4 mr-1 w-4 dark:text-gray-500" />
                    <span className="dark:text-gray-500 sm:text-sm mt-0.5 ">
                      Password and Steam Guard code not required
                    </span>
                  </div>
                )}

                {!hasChosenAccountLoginKey ? (
                  <div className={classNames(secretEnabled ? '' : 'hidden')}>
                    <label htmlFor="secret" className="sr-only">
                      SharedSecret
                    </label>
                    <input
                      id="secret"
                      name="secret"
                      value={sharedSecret}
                      onChange={(e) => setSharedSecret(e.target.value)}
                      spellCheck={false}
                      required
                      className="appearance-none rounded-none dark:bg-dark-level-one dark:text-dark-white dark:border-opacity-50 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Shared Secret (If you don't know what this is, leave it empty.)"
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              <div className="rounded-md mb-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClipboardCheckIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                    spellCheck={false}
                      type="text"
                      name="clientjs"
                      id="clientjs"
                      value={clientjstoken}
                      onChange={(e) => setClientjstoken(e.target.value)}
                      className="bg-dark-level-one focus:border-green-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border border-gray-300 border-opacity-50 focus:outline-none text-dark-white "
                      placeholder="Paste data"
                    />
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://steamcommunity.com/chat/clientjstoken`
                      )
                    }
                    type="button"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 border-opacity-50 text-sm font-medium text-gray-700 bg-dark-level-two hover:bg-dark-level-three focus:outline-none focus:border-green-500  "
                  >
                    <ClipboardCopyIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </button>
                  <Link
                    to={{
                      pathname: `https://steamcommunity.com/chat/clientjstoken`,
                    }}
                    target="_blank"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 border-opacity-50 text-sm font-medium rounded-r-md text-gray-700 bg-dark-level-two hover:bg-dark-level-three focus:outline-none focus:border-green-500  "
                  >
                    <ExternalLinkIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            )}
            {!hasChosenAccountLoginKey ? (
              <div
                className={classNames(
                  !webToken ? '' : 'hidden',
                  'flex items-center justify-between'
                )}
              >
                <div className="flex items-center">
                  {isLock == '' ? (
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      defaultChecked={storePassword}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={() => setStorePassword(!storePassword)}
                    />
                  ) : !hasChosenAccountLoginKey ? (
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={true}
                      className=" pointer-events-none h-4 w-4 text-indigo-600 focus:ring-indigo-500 dark:text-opacity-50 border-gray-300 rounded"
                      onChange={() => setStorePassword(!storePassword)}
                    />
                  ) : (
                    ''
                  )}

                  {isLock == '' ? (
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900 dark:text-dark-white"
                    >
                      Remember for later
                    </label>
                  ) : !hasChosenAccountLoginKey ? (
                    <label
                      htmlFor="remember-me"
                      className="ml-2 pointer-events-none block text-sm text-gray-900 dark:text-opacity-50 dark:text-dark-white"
                    >
                      Remember for later
                    </label>
                  ) : (
                    ''
                  )}
                </div>
                {!hasChosenAccountLoginKey ? (
                  <div className="flex items-center">
                    <label
                      htmlFor="sharedSecret"
                      className="mr-2 block text-sm text-gray-900 dark:text-dark-white"
                    >
                      Show secret field
                    </label>
                    <input
                      id="sharedSecret"
                      name="sharedSecret"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={() => setSecretEnabled(!secretEnabled)}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}

            <div className="flex justify-between mt-6">
              <button
                className=" group text-dark-white relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dark-level-two hover:bg-dark-level-three "
                onClick={() => setWebToken(!webToken)}
                type="button"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {webToken ? (
                    <KeyIcon
                      className="h-5 w-5 text-dark-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <WifiIcon
                      className="h-5 w-5 text-dark-white"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="pl-3">
                  {!webToken ? 'Browser' : 'Credentials'}
                </span>
              </button>

              <button
                className="focus:bg-indigo-700 group relative w-full flex justify-center py-2 px-4 ml-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                onClick={() => onSubmit()}
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
