import {toUpperCaseFirstLetter} from '@utils';
import {camelCase} from 'lodash';
import React, {FunctionComponent} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import * as config from '../../assets/svgs';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type Props = {
  onPress?: () => void;
  name: string;
  size?: number;
  height?: number;
  width?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  [x: string]: any;
  disable?: boolean;
  testID?: string;
};

export const SvgIcon: FunctionComponent<Props> = ({
  onPress,
  name,
  size,
  containerStyle,
  height,
  width,
  testID,
  ...otherProps
}) => {
  const pascalCaseName = name?.length
    ? toUpperCaseFirstLetter(camelCase(name))
    : 'Warning';
  // @ts-ignore
  const iconClass = config[pascalCaseName] || config.Warning;

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={onPress}
        style={[styles.container, containerStyle]}>
        {React.createElement(iconClass, {
          backgroundColor: 'transparent',
          height: height || size,
          width: width || size,
          ...otherProps,
        })}
      </TouchableOpacity>
    );
  } else {
    return (
      <View testID={testID} style={[styles.container, containerStyle]}>
        {React.createElement(iconClass, {
          backgroundColor: 'transparent',
          height: height || size,
          width: width || size,
          ...otherProps,
        })}
      </View>
    );
  }
};
