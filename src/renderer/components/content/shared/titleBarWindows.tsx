import TitleBarClose from "./iconsLogo/close";
import TitleBarMaximize from "./iconsLogo/maximize";
import TitleBarMinimize from "./iconsLogo/minimize";

export default function TitleBarWindows() {

  async function sendAction(whichOption) {
    window.electron.ipcRenderer.handleWindowsActions(whichOption)
  }
  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 dark:border-opacity-50 bg-white lg:fixed dark:bg-dark-level-two flex justify-end dark:text-dark-white titleBarCustom absolute w-full z-10">
      <div className="dark:text-dark-white">
      <button
        
        type="button"
        className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white hover:bg-gray-100 dark:hover:bg-gray-800 titleButtons"
        onClick={() => sendAction('min')}
      >
      <TitleBarMinimize />
      </button>
      </div>
      <div className="dark:text-dark-white">
      <button
        type="button"
        className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white hover:bg-gray-100 dark:hover:bg-gray-800 titleButtons "
        onClick={() => sendAction('max')}
      >
      <TitleBarMaximize />
      </button>
      </div>
      <div className="dark:text-dark-white">
      <button
        type="button"
        className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 pb-1 border hover:text-white border-transparent text-xs font-medium shadow-sm text-white hover:bg-red-500 hover:text-white titleButtons text-gray-800 dark:text-dark-white"
        onClick={() => sendAction('close')}
      >
      <TitleBarClose />
      </button>
      </div>
      </div>
    </>
  );
}
