import {SizedBox} from '@components/sized-box';
import {SvgIcon} from '@components/svg-icon';
import {Text} from '@components/text';
import {RH, RS, RW} from '@helpers';
import {palette} from '@theme';
import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';

interface IButton extends TouchableOpacityProps {
  color?: ViewStyle['backgroundColor'];
  outlined?: boolean;
  radius?: ViewStyle['borderRadius'];
  flex?: ViewStyle['flex'];
  row?: boolean;
  justify?: ViewStyle['justifyContent'];
  justifyContent?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  alignItems?: ViewStyle['alignItems'];
  shadow?: {
    color?: ViewStyle['shadowColor'];
    offset?: ViewStyle['shadowOffset'];
    opacity?: ViewStyle['shadowOpacity'];
    radius?: ViewStyle['shadowRadius'];
  };
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  right?: ViewStyle['right'];
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  textStyle?: TextStyle;
  disabled?: boolean;
  vibrate?: number | number[];
  style?: any;
  onPress?: () => void;
  loading?: boolean;
  iconName?: string;
  initIcon?: string;
  iconSize?: number;
  title;
  iconContainerStyle?: ViewStyle;
}

export const Button = ({
  color = palette.cornFlower,
  outlined,
  radius = 500,
  flex,
  row,
  justify = 'center',
  justifyContent,
  align = 'center',
  alignItems,
  shadow,
  height = RH(54),
  width,
  position,
  style,
  top,
  right,
  bottom,
  left,
  vibrate,
  disabled,
  onPress,
  iconName,
  initIcon,
  iconSize,
  activeOpacity = 0.8,
  loading,
  title,
  textStyle,
  iconContainerStyle,
  ...props
}: IButton) => {
  const borderColor = outlined ? palette.burnt : color;

  const buttonStyle = StyleSheet.flatten([
    outlined
      ? {
          borderWidth: 1,
          borderColor,
          backgroundColor: 'transparent',
        }
      : {backgroundColor: color},
    radius !== undefined && {borderRadius: radius},
    flex !== undefined && {flex},
    row && {flexDirection: 'row'},
    justify !== undefined && {justifyContent: justify},
    justifyContent !== undefined && {justifyContent},
    align !== undefined && {alignItems: align},
    alignItems !== undefined && {alignItems},
    shadow !== undefined && {...shadow},
    {minHeight: height || 50},
    {minWidth: width || 50},
    position !== undefined && {position},
    top !== undefined && {top},
    right !== undefined && {right},
    bottom !== undefined && {bottom},
    left !== undefined && {left},
    disabled && {opacity: 0.5},
  ]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      if (vibrate !== undefined) {
        Vibration.vibrate(vibrate);
      }
    }
  }, [vibrate, onPress]);

  return (
    <TouchableOpacity
      // @ts-ignore
      style={[buttonStyle, style]}
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={handlePress}
      {...props}>
      {loading ? (
        <ActivityIndicator color={outlined ? palette.burnt : palette.white} />
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: RS(10)}}>
          {initIcon ? (
            <View style={[styles.iconContainer, iconContainerStyle]}>
              <SvgIcon
                name={initIcon}
                size={iconSize || 20}
                color={outlined ? palette.burnt : palette.white}
              />
              <SizedBox width={RW(12)} />
            </View>
          ) : null}
          <Text
            center
            size={18}
            medium
            color={outlined ? palette.burnt : palette.white}
            style={textStyle}>
            {title}
          </Text>
          {iconName ? (
            <View style={[styles.iconContainer, iconContainerStyle]}>
              <SvgIcon
                name={iconName}
                size={iconSize || 20}
                color={outlined ? palette.burnt : palette.white}
              />
              <SizedBox width={RW(12)} />
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};
