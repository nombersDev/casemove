import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { PersistGate } from 'redux-persist/integration/react'
import returnVar from './store/configureStore'

const myVar = returnVar()


declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      },
      ipcRenderer: any
    }
    
  }
}

render(

  <Provider store={myVar.reduxStore}>
    <PersistGate loading={null} persistor={myVar.persistor}>
     <App />
     </PersistGate>
  </Provider>
, document.getElementById("root"));