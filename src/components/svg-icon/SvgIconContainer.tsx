import {palette} from '@theme';
import React from 'react';
import {ViewStyle} from 'react-native';
import {Props, SvgIcon} from '.';

export default function SvgIconContainer({
  name,
  size = 18,
  containerSize = 40,
  color,
  props,
  containerStyles,
  onPress,
}: {
  name: string;
  size?: number;
  containerSize?: number;
  color?: string;
  onPress?: () => void;
  props?: Props;
  containerStyles?: ViewStyle;
}) {
  return (
    <SvgIcon
      name={name}
      size={size}
      containerStyle={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: color || palette.white,
        ...containerStyles,
      }}
      onPress={onPress}
      {...props}
    />
  );
}
