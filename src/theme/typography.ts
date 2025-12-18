import {Platform} from 'react-native';

/*
Available font weights

300 Light
400 Regular
500 Medium
600 SemiBold
700 Bold
*/

export const family = {
  Light: Platform.select({
    ios: 'Outfit-Light', // The font family name
    android: 'Outfit-Light', // The file name
  }),
  XLight: Platform.select({
    ios: 'Outfit-ExtraLight', // The font family name
    android: 'Outfit-ExtraLight', // The file name
  }),
  Bold: Platform.select({
    ios: 'Outfit-Bold', // The font family name
    android: 'Outfit-Bold', // The file name
  }),
  Regular: Platform.select({
    ios: 'Outfit-Regular', // The font family name
    android: 'Outfit-Regular', // The file name
  }),
  Medium: Platform.select({
    ios: 'Outfit-Medium', // The font family name
    android: 'Outfit-Medium', // The file name
  }),
  SemiBold: Platform.select({
    ios: 'Outfit-SemiBold', // The font family name
    android: 'Outfit-SemiBold', // The file name
  }),
};
