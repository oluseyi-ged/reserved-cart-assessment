import {Text} from '@components/text';
import {RF, RS} from '@helpers';
import {palette} from '@theme';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  labelPosition?: 'left' | 'right';
  fluid?: boolean;
  customStyle?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor = '#7567F5',
  inactiveColor = '#EEEEEE',
  thumbColor = palette.white,
  size = 'small',
  label,
  labelPosition = 'right',
  fluid,
  customStyle,
}) => {
  const switchSizes = {
    small: {width: 32, height: 20, thumbSize: 14},
    medium: {width: 40, height: 23, thumbSize: 18},
    large: {width: 50, height: 30, thumbSize: 22},
  };

  const {width, height, thumbSize} = switchSizes[size];
  const trackColor = value ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={[fluid ? {} : styles.container, customStyle]}
      activeOpacity={disabled ? 1 : 0.7}
      onPress={() => (!disabled ? onValueChange(!value) : {})}>
      {label && labelPosition === 'left' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.track,
          {
            width,
            height,
            backgroundColor: trackColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              backgroundColor: thumbColor,
              transform: [{translateX: value ? width - thumbSize - 4 : 0}],
            },
          ]}
        />
      </View>
      {label && labelPosition === 'right' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F3F4F6',
    borderRadius: RS(40),
    paddingHorizontal: RS(8),
    paddingVertical: RS(6),
  },
  track: {
    borderRadius: RS(999),
    justifyContent: 'center',
    padding: RS(2),
  },
  thumb: {
    borderRadius: RS(999),
  },
  label: {
    marginHorizontal: RS(8),
    fontSize: RF(16),
  },
});
