// configureStore.js

import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducers from './reducer'


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducers)

export default () => {
  let reduxStore = createStore(persistedReducer)
  if (process.env.NODE_ENV === 'development') {
    reduxStore = createStore(persistedReducer,
      // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  }
  
  let persistor = persistStore(reduxStore)
  return { reduxStore, persistor }
}