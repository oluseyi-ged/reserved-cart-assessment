import {isURL} from '@utils';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface LazyImageProps {
  containerStyle?: any;
  url?: string;
  onPress?: () => void;
  onLoad?: (event: any) => void;
  style?: any;
  resizeMode?: string;
  loaderSize?: 'small' | 'large';
  testID?: string;
  accessibilityLabel?: string;
}

export const LazyImage = ({
  testID,
  containerStyle,
  url = '',
  onPress,
  onLoad,
  style,
  resizeMode,
  loaderSize = 'small',
  ...restProps
}: LazyImageProps) => {
  const validUrl = isURL(url);
  const [loaded, setLoaded] = useState(validUrl ? false : true);
  const handleLoading = event => {
    setLoaded(true);
    onLoad && onLoad(event);
  };
  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.base, containerStyle]}
      onPress={onPress}
      disabled={!onPress}>
      {validUrl ? (
        <FastImage
          style={[styles.base, style]}
          onLoad={handleLoading}
          source={{uri: url}}
          {...restProps}
        />
      ) : (
        <Image
          style={[styles.base, style]}
          source={{uri: url}}
          resizeMode="cover"
        />
      )}
      {!loaded && (
        <ActivityIndicator
          testID="loading_activity_indicator"
          color={LOADER_COLOR}
          style={styles.loader}
          size={loaderSize}
        />
      )}
    </TouchableOpacity>
  );
};

const BG_COLOR = 'rgba(240, 242, 245, 1)';
const LOADER_COLOR = 'rgba(55, 107, 251, 1)';

const styles = StyleSheet.create({
  base: {
    height: '100%',
    width: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG_COLOR,
  },
});
