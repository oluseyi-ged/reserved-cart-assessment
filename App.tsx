/**
 * ShopReserve - Reserved Cart Feature Assessment
 *
 * A React Native application demonstrating a cart reservation system
 * with real-time countdown timers for high-demand items.
 */

import RootNavigator from '@routes';
import React from 'react';
import {LogBox} from 'react-native';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './src/store';

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <KeyboardProvider>
            <RootNavigator />
          </KeyboardProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
