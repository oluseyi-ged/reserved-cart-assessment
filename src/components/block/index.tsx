import {SizedBox} from '@components';
import {RH, RS} from '@helpers';
import React, {FC, useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'react-native-status-bar-height';

interface Props {
  flex?: ViewStyle['flex'];
  row?: boolean;
  justify?: ViewStyle['justifyContent'];
  justifyContent?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  alignItems?: ViewStyle['alignItems'];
  alignSelf?: ViewStyle['alignSelf'];
  content?: ViewStyle['alignContent'];
  alignContent?: ViewStyle['alignContent'];
  wrap?: ViewStyle['flexWrap'];
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  right?: ViewStyle['right'];
  gap?: number;
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  color?: ViewStyle['backgroundColor'];
  outlined?: boolean;
  card?: boolean;
  radius?: ViewStyle['borderRadius'];
  overflow?: ViewStyle['overflow'];
  safe?: boolean;
  scroll?: boolean;
  scrollIn?: boolean;
  shadow?: {
    color?: ViewStyle['shadowColor'];
    offset?: ViewStyle['shadowOffset'];
    opacity?: ViewStyle['shadowOpacity'];
    radius?: ViewStyle['shadowRadius'];
  };
  // Padding props
  p?: number;
  ph?: number;
  pv?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  // Margin props
  m?: number;
  mh?: number;
  mv?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
  bg?: string;
  onPress?: any;
  transparent?: boolean;
  refreshControl?: any;
  ref?: any;
  testID?: any;
  showScrollbar?: boolean;
  contentContainerStyle?: ViewStyle;
  disabled?: boolean;
  isScrollable?: boolean;
  backgroundImage?: any;
  overlayColor?: string;
  backgroundScroll?: boolean;
  bounce?: boolean;
  imageStyle?: any;
  activeOpacity?: number;
  scrollEventThrottle?: number;
}

export const Block: FC<Props> = ({
  children,
  style,
  flex,
  showScrollbar = false,
  row,
  justify,
  scrollIn,
  justifyContent,
  align,
  gap,
  alignItems,
  alignSelf,
  content,
  alignContent,
  wrap,
  width,
  height,
  position,
  top,
  right,
  bottom,
  left,
  onPress,
  color,
  outlined,
  card,
  radius,
  overflow,
  safe,
  scroll,
  shadow,
  bg,
  refreshControl,
  transparent = bg?.length ? false : true,
  testID,
  ref,
  contentContainerStyle,
  disabled,
  isScrollable = true,
  backgroundImage,
  overlayColor,
  imageStyle,
  backgroundScroll = false,
  bounce = false,
  activeOpacity,
  scrollEventThrottle,
  // Padding props
  p,
  ph,
  pv,
  pt,
  pb,
  pl,
  pr,
  // Margin props
  m,
  mh,
  mv,
  mt,
  mb,
  ml,
  mr,
  ...props
}) => {
  const blockStyle = StyleSheet.flatten([
    flex !== undefined && {flex},
    row && {flexDirection: 'row' as const},
    justify !== undefined && {justifyContent: justify},
    justifyContent !== undefined && {justifyContent},
    align !== undefined && {alignItems: align},
    alignItems !== undefined && {alignItems},
    alignSelf !== undefined && {alignSelf},
    content !== undefined && {alignContent: content},
    alignContent !== undefined && {alignContent},
    wrap !== undefined && {flexWrap: wrap},
    width !== undefined && {width},
    height !== undefined && {height},
    position !== undefined && {position},
    top !== undefined && {top},
    right !== undefined && {right},
    bottom !== undefined && {bottom},
    left !== undefined && {left},
    color !== undefined && {backgroundColor: color},
    gap !== undefined && {gap: RS(gap)},
    // Padding
    p !== undefined && {padding: RS(p)},
    ph !== undefined && {paddingHorizontal: RS(ph)},
    pv !== undefined && {paddingVertical: RS(pv)},
    pt !== undefined && {paddingTop: RS(pt)},
    pb !== undefined && {paddingBottom: RS(pb)},
    pl !== undefined && {paddingLeft: RS(pl)},
    pr !== undefined && {paddingRight: RS(pr)},
    // Margin
    m !== undefined && {margin: RS(m)},
    mh !== undefined && {marginHorizontal: RS(mh)},
    mv !== undefined && {marginVertical: RS(mv)},
    mt !== undefined && {marginTop: RS(mt)},
    mb !== undefined && {marginBottom: RS(mb)},
    ml !== undefined && {marginLeft: RS(ml)},
    mr !== undefined && {marginRight: RS(mr)},
    outlined && {
      borderWidth: 1,
      borderColor: color,
      backgroundColor: 'transparent',
    },
    card && {
      backgroundColor: 'white',
      borderRadius: RS(16),
      padding: RS(10),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: RS(7),
      },
      shadowOpacity: 0.07,
      shadowRadius: RS(4),
      elevation: 2,
    },
    radius !== undefined && {borderRadius: radius},
    bg !== undefined && !transparent && {backgroundColor: bg},
    overflow !== undefined && {overflow},
    shadow !== undefined && {...shadow},
    style,
  ]);

  const snapToOffsets = [RH(125), RH(225), RH(325), RH(425), RH(525), RH(625)];

  const [snapToOffsetsEnabled, setSnapToOffsetsEnabled] = useState(false);

  const insets = useSafeAreaInsets();
  const idleHeight = getStatusBarHeight();

  const backdropStyle = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: '#05081A',
      overflow: 'hidden',
      minHeight: height,
      paddingTop: insets.top, // Don't scale safe area insets
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const renderContent = () => (
    <>
      {overlayColor ? (
        <TouchableOpacity
          disabled={!onPress || disabled}
          style={[backdropStyle.overlay, {backgroundColor: overlayColor}]}
          onPress={() => {
            Keyboard.dismiss();
            if (onPress) {
              onPress();
            }
          }}></TouchableOpacity>
      ) : null}
      <View testID={testID} ref={ref} style={[blockStyle]} {...props}>
        {children}
      </View>
    </>
  );

  if (backgroundImage) {
    const backgroundContent = (
      <ImageBackground
        source={backgroundImage}
        imageStyle={imageStyle}
        resizeMode="cover"
        style={[backdropStyle.backdrop, style]}>
        {renderContent()}
      </ImageBackground>
    );

    if (backgroundScroll) {
      return (
        <KeyboardAwareScrollView
          bottomOffset={RH(50)}
          contentContainerStyle={contentContainerStyle}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          ref={ref}
          style={[blockStyle, {backgroundColor: bg || '#05081A'}]}
          showsVerticalScrollIndicator={showScrollbar}
          alwaysBounceVertical={bounce}
          bounces={bounce}
          scrollEventThrottle={scrollEventThrottle}
          testID="aware_scroll_view_container"
          {...props}>
          {backgroundContent}
          {/* <SizedBox height={100} /> */}
        </KeyboardAwareScrollView>
      );
    }

    return backgroundContent;
  }

  if (safe) {
    return (
      <View
        testID={testID}
        ref={ref}
        style={[
          {
            paddingTop: insets.top, // Don't scale safe area insets
            paddingBottom: insets.bottom, // Don't scale safe area insets
            flex: flex ?? 1,
            backgroundColor: bg,
          },
        ]}
        {...props}>
        <KeyboardAwareScrollView
          bottomOffset={RH(50)}
          contentContainerStyle={{flexGrow: 1}}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          style={blockStyle}
          testID="aware_scroll_view_container"
          alwaysBounceVertical={bounce}
          bounces={bounce}
          showsVerticalScrollIndicator={false}
          {...props}>
          {children}
          {/* <SizedBox height={100} /> */}
        </KeyboardAwareScrollView>
      </View>
    );
  }

  if (scroll) {
    return (
      <View
        testID={testID}
        style={{flex: 1, backgroundColor: bg, paddingTop: insets.top}}
        {...props}>
        <KeyboardAwareScrollView
          bottomOffset={RH(50)}
          contentContainerStyle={contentContainerStyle}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          ref={ref}
          showsVerticalScrollIndicator={showScrollbar}
          style={blockStyle}
          testID="aware_scroll_view_container"
          scrollEventThrottle={scrollEventThrottle}
          alwaysBounceVertical={bounce}
          bounces={bounce}
          {...props}>
          {children}
          <SizedBox height={RH(100)} />
        </KeyboardAwareScrollView>
      </View>
    );
  }

  if (scrollIn) {
    return (
      <KeyboardAwareScrollView
        bottomOffset={RH(50)}
        contentContainerStyle={contentContainerStyle}
        disableScrollOnKeyboardHide={false}
        enabled={true}
        bounces={bounce}
        scrollEnabled={isScrollable}
        snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        refreshControl={refreshControl}
        style={blockStyle}
        testID="aware_scroll_view_container"
        {...props}>
        {children}
        <SizedBox height={RH(100)} />
      </KeyboardAwareScrollView>
    );
  }

  const handlePress = () => {
    Keyboard.dismiss();
    if (onPress) {
      onPress();
    }
  };

  if (!onPress) {
    return (
      <View testID={testID} ref={ref} style={blockStyle} {...props}>
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      hitSlop={{top: RS(10), bottom: RS(10), left: RS(10), right: RS(10)}}
      testID={testID}
      ref={ref}
      disabled={disabled}
      onPress={handlePress}
      activeOpacity={activeOpacity}
      style={blockStyle}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};
