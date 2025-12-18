import {RF} from '@helpers';
import MaskedView from '@react-native-masked-view/masked-view';
import {family, palette} from '@theme';
import React, {FC} from 'react';
import {Text as RNText, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  children?: React.ReactNode;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  pg?: boolean;
  s?: boolean;
  size?: TextStyle['fontSize'];
  fontSize?: TextStyle['fontSize'];
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  italic?: boolean;
  weight?: TextStyle['fontWeight'];
  fontWeight?: TextStyle['fontWeight'];
  center?: boolean;
  color?: TextStyle['color'];
  opacity?: TextStyle['opacity'];
  font?: TextStyle['fontFamily'];
  fontFamily?: TextStyle['fontFamily'];
  align?: TextStyle['textAlign'];
  textAlign?: TextStyle['textAlign'];
  transform?: TextStyle['textTransform'];
  textTransform?: TextStyle['textTransform'];
  lineHeight?: TextStyle['lineHeight'];
  position?: TextStyle['position'];
  top?: TextStyle['top'];
  right?: TextStyle['right'];
  bottom?: TextStyle['bottom'];
  left?: TextStyle['left'];

  // Margin props
  m?: ViewStyle['margin'];
  margin?: ViewStyle['margin'];
  mt?: ViewStyle['marginTop'];
  marginTop?: ViewStyle['marginTop'];
  mr?: ViewStyle['marginRight'];
  marginRight?: ViewStyle['marginRight'];
  mb?: ViewStyle['marginBottom'];
  marginBottom?: ViewStyle['marginBottom'];
  ml?: ViewStyle['marginLeft'];
  marginLeft?: ViewStyle['marginLeft'];
  mx?: ViewStyle['marginHorizontal'];
  marginHorizontal?: ViewStyle['marginHorizontal'];
  mh?: ViewStyle['marginHorizontal'];
  my?: ViewStyle['marginVertical'];
  marginVertical?: ViewStyle['marginVertical'];
  mv?: ViewStyle['marginVertical'];

  // Padding props
  p?: ViewStyle['padding'];
  padding?: ViewStyle['padding'];
  pt?: ViewStyle['paddingTop'];
  paddingTop?: ViewStyle['paddingTop'];
  pr?: ViewStyle['paddingRight'];
  paddingRight?: ViewStyle['paddingRight'];
  pb?: ViewStyle['paddingBottom'];
  paddingBottom?: ViewStyle['paddingBottom'];
  pl?: ViewStyle['paddingLeft'];
  paddingLeft?: ViewStyle['paddingLeft'];
  px?: ViewStyle['paddingHorizontal'];
  paddingHorizontal?: ViewStyle['paddingHorizontal'];
  ph?: ViewStyle['paddingHorizontal'];
  py?: ViewStyle['paddingVertical'];
  paddingVertical?: ViewStyle['paddingVertical'];
  pv?: ViewStyle['paddingVertical'];

  style?: any;
  onPress?: any;
  numberOfLines?: number;
  gradient?: boolean;
  colors?: string[];
  testID?: string;
}

export const Text: FC<Props> = ({
  children,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  pg,
  s,
  size = 14,
  fontSize,
  italic,
  bold,
  semibold,
  weight,
  fontWeight,
  center,
  color = palette.madison,
  opacity,
  font,
  fontFamily = family.Regular,
  align,
  textAlign,
  transform,
  textTransform,
  lineHeight,
  position,
  top,
  right,
  bottom,
  left,

  // Margin
  m,
  margin,
  mt,
  marginTop,
  mr,
  marginRight,
  mb,
  marginBottom,
  ml,
  marginLeft,
  mx,
  mh,
  marginHorizontal,
  my,
  mv,
  marginVertical,

  // Padding
  p: padding,
  pt,
  paddingTop,
  pr,
  paddingRight,
  pb,
  paddingBottom,
  pl,
  paddingLeft,
  px,
  ph,
  paddingHorizontal,
  py,
  pv,
  paddingVertical,

  style,
  medium,
  onPress,
  numberOfLines,
  gradient = false,
  testID,
  colors = ['#8591EF', '#66F4D7'],
  ...props
}) => {
  const textStyle = StyleSheet.flatten([
    // Typography variants
    h1 && {fontSize: RF(38), fontFamily: family.Bold},
    h2 && {fontSize: RF(32), fontFamily: family.Bold},
    h3 && {fontSize: RF(28), fontFamily: family.Bold},
    h4 && {fontSize: RF(24), fontFamily: family.Medium},
    h5 && {fontSize: RF(18), fontFamily: family.Medium},
    h6 && {fontSize: RF(14), fontFamily: family.SemiBold},
    pg && {fontSize: RF(14), fontFamily: family.Regular},
    s && {fontSize: RF(12), fontFamily: family.Regular},

    // Text alignment
    center && {textAlign: 'center'},
    (align || textAlign) && {textAlign: textAlign || align},

    // Font weight
    (weight || fontWeight) && {fontWeight: fontWeight || weight},
    (transform || textTransform) && {
      textTransform: textTransform || transform,
    },

    // Font family
    (font || fontFamily) && {fontFamily: fontFamily || font},
    bold && {fontFamily: family.Bold},
    semibold && {fontFamily: family.SemiBold},
    medium && {fontFamily: family.Medium},
    (size || fontSize) && {fontSize: RF(fontSize || size || 14)},

    // Color and opacity
    color && {color},
    opacity && {opacity},

    // Line height
    lineHeight && {lineHeight},

    // Position
    position && {position},
    right !== undefined && {right},
    left !== undefined && {left},
    top !== undefined && {top},
    bottom !== undefined && {bottom},

    // Margin
    (m || margin) && {margin: margin || m},
    (mt || marginTop) && {marginTop: marginTop || mt},
    (mr || marginRight) && {marginRight: marginRight || mr},
    (mb || marginBottom) && {marginBottom: marginBottom || mb},
    (ml || marginLeft) && {marginLeft: marginLeft || ml},
    (mx || mh || marginHorizontal) && {
      marginHorizontal: marginHorizontal || mh || mx,
    },
    (my || mv || marginVertical) && {
      marginVertical: marginVertical || mv || my,
    },

    // Padding
    padding && {padding},
    (pt || paddingTop) && {paddingTop: paddingTop || pt},
    (pr || paddingRight) && {paddingRight: paddingRight || pr},
    (pb || paddingBottom) && {paddingBottom: paddingBottom || pb},
    (pl || paddingLeft) && {paddingLeft: paddingLeft || pl},
    (px || ph || paddingHorizontal) && {
      paddingHorizontal: paddingHorizontal || ph || px,
    },
    (py || pv || paddingVertical) && {
      paddingVertical: paddingVertical || pv || py,
    },

    // Custom style
    style,
  ]);

  if (gradient) {
    return (
      <MaskedView
        maskElement={
          <RNText
            testID={testID}
            numberOfLines={numberOfLines}
            style={[textStyle]}
            onPress={onPress}
            allowFontScaling={false}
            adjustsFontSizeToFit={false}
            maxFontSizeMultiplier={1.2}>
            {children}
          </RNText>
        }>
        <LinearGradient
          locations={[0, 0.8]}
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          <RNText
            testID={testID}
            numberOfLines={numberOfLines}
            style={[textStyle, {opacity: 0}]}>
            {children}
          </RNText>
        </LinearGradient>
      </MaskedView>
    );
  }

  return (
    <RNText
      testID={testID}
      ellipsizeMode="tail"
      allowFontScaling={false}
      adjustsFontSizeToFit={false}
      maxFontSizeMultiplier={1.2}
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={textStyle}
      {...props}>
      {children}
    </RNText>
  );
};
