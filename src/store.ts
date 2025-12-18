/**
 * Redux Store Configuration for ShopReserve
 *
 * Features:
 * - Redux Toolkit for simplified Redux setup
 * - Redux Persist for cart persistence across app restarts
 * - Server time offset tracking for accurate countdown synchronization
 *
 * Persistence Strategy:
 * - Cart items are persisted including timestamps
 * - On app restart, expiration is recalculated based on current time
 * - serverTimeOffset is persisted to maintain time sync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import {cartReducer} from '@slices';
import reactotron from '../ReactotronConfig';

const reducers = combineReducers({
  cart: cartReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart'], // Persist cart state
};

const persistedReducer = persistReducer(persistConfig, reducers);

const reactotronEnhancers: any = reactotron?.createEnhancer
  ? [reactotron.createEnhancer()]
  : [];

const rootReducer = (state: any, action: any) => {
  if (action.type === 'app/resetStore') {
    state = undefined;
  }
  return persistedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: __DEV__ ? reactotronEnhancers : [],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunkMiddleware),
});

const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
export {persistor};
