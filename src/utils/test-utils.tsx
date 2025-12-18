import {configureStore} from '@reduxjs/toolkit';
import {mutationApi} from '@services/mutationApi';
import {queryApi} from '@services/queryApi';
import authReducer from '@slices/auth';
import loggedReducer from '@slices/logged';
import toastReducer from '@slices/toast';
import tokenReducer from '@slices/token';
import {render, RenderOptions} from '@testing-library/react-native';
import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';

const rootReducer = {
  token: tokenReducer,
  toast: toastReducer,
  auth: authReducer,
  logged: loggedReducer,
  [queryApi.reducerPath]: queryApi.reducer,
  [mutationApi.reducerPath]: mutationApi.reducer,
};

export function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(mutationApi.middleware, queryApi.middleware),
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  options: ExtendedRenderOptions = {},
) {
  const {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  } = options;

  function Wrapper({children}: {children: React.ReactNode}) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}

export * from '@testing-library/react-native';
