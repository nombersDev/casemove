import {
  setColumns,
  setCurrencyRate,
  setCurrencyValue,
  setDevmode,
  setFastMove,
  setLocale,
  setOS,
  setPersonaState,
  setSourceValue,
} from 'renderer/store/actions/settings';
import {
  DispatchIPCBuildingObject,
  DispatchIPCHandleBuildingOptionsClass,
  DispatchStoreBuildingObject,
  DispatchStoreHandleBuildingOptionsClass,
} from 'shared/Interfaces.tsx/settingsInterface';

export class IPCCommunication {
  ipc = window.electron.ipcRenderer;
  store = window.electron.store;

  async get(command: Function) {
    return await command().then((returnValue) => {
      return returnValue;
    });
  }
  async storeGet(settingToGet: string) {
    return await this.store.get(settingToGet).then((returnValue) => {
      return returnValue;
    });
  }
}

// Dispatch Store
export class DispatchStore extends IPCCommunication {
  dispatch: Function;
  buildingObject: DispatchStoreHandleBuildingOptionsClass = {
    source: {
      name: 'pricing.source',
      action: setSourceValue,
    },
    personaState: {
      name: 'personaState',
      action: setPersonaState,
    },
    locale: {
      name: 'locale',
      action: setLocale
    },
    os: {
      name: 'os',
      action: setOS
    },
    columns: {
      name: 'columns',
      action: setColumns
    },
    devmode: {
      name: 'devmode.value',
      action: setDevmode
    },
    fastmove: {
      name: 'fastmove',
      action: setFastMove
    },
    currency: {
      name: 'currency',
      action: setCurrencyValue
    }
  };
  constructor(dispatch: Function) {
    super();
    this.dispatch = dispatch;
  }

  async run(buildingObject: DispatchStoreBuildingObject) {
    this.storeGet(buildingObject.name).then((returnValue) => {
      if (returnValue != undefined) {
        this.dispatch(buildingObject.action(returnValue));
      }
    });
  }
}

// Dispatch IPC
export class DispatchIPC extends IPCCommunication {
  dispatch: Function;
  buildingObject: DispatchIPCHandleBuildingOptionsClass = {
    currency: {
      endpoint: this.ipc.getCurrencyRate,
      action: setCurrencyRate,
    },
  };

  constructor(dispatch: Function) {
    super();
    this.dispatch = dispatch;
  }

  async run(buildingObject: DispatchIPCBuildingObject) {
    this.get(buildingObject.endpoint).then((returnValue) => {
      if (returnValue != undefined) {
        this.dispatch(buildingObject.action(returnValue));
      }
    });
  }
}
