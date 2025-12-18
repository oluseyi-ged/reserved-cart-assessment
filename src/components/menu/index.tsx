/* eslint-disable react-native/no-inline-styles */
import {SizedBox, SvgIcon} from '@components';
import {HP, RS} from '@helpers';
import React, {useCallback} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch} from 'store';
import styles from './styles';

export const NavMenu = ({state, descriptors, navigation}: any) => {
  const insets = useSafeAreaInsets();
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  const {width} = Dimensions.get('window');

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const MenuIcons = useCallback(({label, status}: any) => {
    switch (label.toLowerCase()) {
      case 'settings':
        return (
          <View>
            <SvgIcon
              name={!status ? 'home-inactive' : 'home-active'}
              size={25}
            />
            <SizedBox height={6} />
            <Text style={[!status ? styles.navText : styles.navActive]}>
              Settings
            </Text>
          </View>
        );
      case 'transactions':
        return (
          <View>
            <SvgIcon
              name={!status ? 'home-inactive' : 'home-active'}
              size={25}
            />
            <SizedBox height={6} />
            <Text style={[!status ? styles.navText : styles.navActive]}>
              Transactions
            </Text>
          </View>
        );
      case 'wallet':
        return (
          <View>
            <SvgIcon
              name={!status ? 'home-inactive' : 'home-active'}
              size={25}
            />
            <SizedBox height={6} />
            <Text style={[!status ? styles.navText : styles.navActive]}>
              Wallet
            </Text>
          </View>
        );
      default:
        return (
          <View>
            <SvgIcon
              name={!status ? 'home-inactive' : 'home-active'}
              size={25}
            />
            <SizedBox height={6} />
            <Text style={[!status ? styles.navText : styles.navActive]}>
              Home
            </Text>
          </View>
        );
    }
  }, []);
  const dispatch = useAppDispatch();

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        paddingBottom: insets.bottom || RS(20),
        position: 'absolute',
        bottom: HP(Platform.OS === 'android' ? -2 : -1.5),
        borderTopWidth: 0.2,
        borderTopColor: '#6470CD',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <SystemBars style="dark" />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{justifyContent: 'center'}}>
            <View
              style={[
                {
                  alignItems: 'center',
                  paddingVertical: RS(10),
                  width: width / 4,
                },
              ]}>
              <MenuIcons label={label} status={isFocused} />
            </View>
            <View>
              <SizedBox height={1} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
