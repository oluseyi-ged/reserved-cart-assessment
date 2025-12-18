import {SizedBox} from '@components/sized-box';
import {SvgIcon} from '@components/svg-icon';
import {RF, RH, RS} from '@helpers';
import {family} from '@theme';
import React, {useEffect} from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, Vibration, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const BUTTON_WIDTH = Dimensions.get('screen').width - 48;
const SWIPE_RANGE = BUTTON_WIDTH - 74;

type SwipeButtonPropsType = {
  onSwipe: () => void;
  isLoading?: boolean;
  icon?: string;
  btnTitle?: string;
  bg?: string;
  textColor?: string;
};

const SwipeableButton = ({
  onSwipe,
  isLoading = false,
  icon = '',
  btnTitle,
  bg,
  textColor,
}: SwipeButtonPropsType) => {
  const X = useSharedValue(0);

  useEffect(() => {
    if (!isLoading) {
      X.value = withSpring(0);
    }
  }, [isLoading]);

  const handleSwipeComplete = () => {
    Vibration.vibrate([0, 400, 200, 400]);
    onSwipe();
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: e => {
      const newValue = e.translationX;

      if (newValue >= 0 && newValue <= SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < SWIPE_RANGE - 20) {
        X.value = withSpring(0);
      } else {
        runOnJS(handleSwipeComplete)();
      }
    },
  });

  const AnimatedStyles = {
    swipeButton: useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              X.value,
              [20, BUTTON_WIDTH],
              [0, BUTTON_WIDTH],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          [0, BUTTON_WIDTH / 4],
          [1, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              [20, SWIPE_RANGE],
              [0, BUTTON_WIDTH / 3],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <View
      style={[
        styles.swipeButtonContainer,
        {
          backgroundColor: bg,
        },
      ]}>
      <PanGestureHandler
        enabled={!isLoading}
        onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeButton, AnimatedStyles.swipeButton]}>
          {isLoading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <SvgIcon name={icon} size={47} />
          )}
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text
        style={[
          styles.swipeText,
          AnimatedStyles.swipeText,
          {color: textColor},
        ]}>
        {btnTitle}
      </Animated.Text>
      <SizedBox width={47} />
    </View>
  );
};

const styles = StyleSheet.create({
  swipeButtonContainer: {
    padding: RS(10),
    borderRadius: RS(5000),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: RH(67),
  },
  swipeButton: {
    position: 'absolute',
    left: RS(10),
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonDisabled: {
    backgroundColor: '#E4E9EE',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: RF(18),
    fontFamily: family.Medium,
    fontWeight: '400',
    zIndex: 2,
    color: 'grey',
    marginLeft: 80,
  },
  chevron: {
    height: 25,
    width: 20,
    tintColor: 'white',
  },
});

export default SwipeableButton;
