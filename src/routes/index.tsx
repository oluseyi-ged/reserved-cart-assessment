/**
 * Navigation Setup for ShopReserve
 *
 * Simple navigation with two screens:
 * - ProductCatalog: Main screen showing products
 * - Cart: Cart screen with reservation timers
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import {ProductCatalog, CartScreen} from '@screens';

export type RootStackParamList = {
  ProductCatalog: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer
        onReady={() => {
          BootSplash.hide();
        }}>
        <Stack.Navigator
          initialRouteName="ProductCatalog"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="ProductCatalog" component={ProductCatalog} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default RootNavigator;
