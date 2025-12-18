import {Block, SvgIcon} from '@components';
import {LazyImage} from '@components/lazy-image';
import {RF, RS} from '@helpers';
import {useNavigation} from '@react-navigation/native';
import {family, palette} from '@theme';
import React from 'react';
import {StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';

const PROFILE_SIZE = RS(180);
const LARGE_SIZE = RS(90);
const MEDIUM_SIZE = RS(65);
const SMALL_SIZE = RS(50);
const LIST_SIZE = RS(45);
const LITTLE_SIZE = RS(40);
const MINI_SIZE = RS(24);
const INITIALS_BG_COLOR = palette.offWhite;

interface AvatarProps {
  textStyle?: TextStyle;
  style?: any;
  url?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  size?: 'large' | 'medium' | 'small' | 'list' | 'tiny' | 'profile' | 'mini';
  shape?: 'square' | 'circle' | 'round';
  onPress?: () => void;
  name?: string;
  id?: number;
  nav?: boolean;
  role?: string;
  showOrg?: boolean;
  type?: string;
  bg?: string;
  flag?: string;
  gender?: 'male' | 'female' | string;
}

export const Avatar = ({
  textStyle,
  style,
  url = '',
  resizeMode = 'cover',
  size = 'medium',
  shape = 'square',
  onPress,
  name,
  id,
  bg,
  flag,
  gender,
  nav = false,
}: AvatarProps) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (nav) {
      navigation.push('Profile', {id});
    } else if (onPress) {
      onPress();
    }
  };

  const getAvatarIcon = () => {
    if (gender?.toLowerCase() === 'male') {
      return 'male-avatar';
    } else if (gender?.toLowerCase() === 'female') {
      return 'female-avatar';
    } else {
      return 'null-avatar';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'profile':
        return PROFILE_SIZE * 0.6;
      case 'large':
        return LARGE_SIZE * 0.6;
      case 'medium':
        return MEDIUM_SIZE * 0.6;
      case 'small':
        return SMALL_SIZE * 0.6;
      case 'list':
        return LIST_SIZE * 0.6;
      case 'tiny':
        return LITTLE_SIZE * 0.6;
      case 'mini':
        return MINI_SIZE * 0.6;
      default:
        return MEDIUM_SIZE * 0.6;
    }
  };

  if (
    url === 'null' ||
    url === 'undefined' ||
    url === null ||
    url === undefined ||
    !url?.length ||
    url === '' ||
    typeof url !== 'string'
  ) {
    return (
      <Block position="relative">
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.container,
            sizeStyle[size],
            shapeStyle(shape, size),
            style,
            styles.initialsContainer,
            {backgroundColor: bg || INITIALS_BG_COLOR},
          ]}>
          <SvgIcon name={getAvatarIcon()} size={getIconSize()} />
        </TouchableOpacity>
        {flag ? (
          <SvgIcon
            name={flag}
            size={RS(9)}
            containerStyle={{
              position: 'absolute',
              bottom: 0,
              right: RS(10),
            }}
          />
        ) : null}
      </Block>
    );
  }

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        {url && typeof url === 'string' && url.trim() !== '' ? (
          <LazyImage
            containerStyle={[sizeStyle[size], shapeStyle(shape, size), style]}
            url={url}
            resizeMode={resizeMode}
          />
        ) : (
          <View
            style={[
              styles.container,
              sizeStyle[size],
              shapeStyle(shape, size),
              style,
              styles.initialsContainer,
              {backgroundColor: bg || INITIALS_BG_COLOR},
            ]}>
            <SvgIcon name={getAvatarIcon()} size={getIconSize()} />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

const sizeStyle = StyleSheet.create({
  profile: {
    height: PROFILE_SIZE,
    width: PROFILE_SIZE,
  },
  large: {
    height: LARGE_SIZE,
    width: LARGE_SIZE,
  },
  medium: {
    height: MEDIUM_SIZE,
    width: MEDIUM_SIZE,
  },

  small: {
    height: SMALL_SIZE,
    width: SMALL_SIZE,
  },
  tiny: {
    height: LITTLE_SIZE,
    width: LITTLE_SIZE,
  },
  mini: {
    height: MINI_SIZE,
    width: MINI_SIZE,
  },
  list: {
    height: LIST_SIZE,
    width: LIST_SIZE,
  },
});

const shapeStyle = (shape, size) => {
  switch (shape) {
    case 'circle':
      return {borderRadius: 0.5 * sizeStyle[size].height, overflow: 'hidden'};
    case 'round':
      return {borderRadius: 0.25 * sizeStyle[size].height, overflow: 'hidden'};
    default:
      return {borderRadius: 0};
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer: {
    backgroundColor: INITIALS_BG_COLOR,
  },
  initialsText: {
    color: '#1D2667',
    fontFamily: family.Bold,
    fontSize: RF(16),
  },
  locView: {
    flexDirection: 'row',
    gap: RS(8),
  },
  nameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RS(14),
  },
});
