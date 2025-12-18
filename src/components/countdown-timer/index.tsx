/**
 * CountdownTimer Component
 *
 * Displays a real-time countdown for cart item reservations.
 * Uses Reanimated for smooth color transitions when time is running low.
 *
 * Features:
 * - Smooth color transition from normal -> warning -> critical
 * - Pulsing animation when time is critical (< 30 seconds)
 * - Accessible (announces time changes to screen readers)
 */

import React, {useEffect} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import {Text} from '@components/text';
import {RS} from '@helpers';
import {palette} from '@theme';
import {ReservationTimeInfo} from '@types';

interface CountdownTimerProps {
  timeInfo: ReservationTimeInfo;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  showLabel?: boolean;
}

const SIZES = {
  small: {fontSize: 12, padding: 4, minWidth: 50},
  medium: {fontSize: 16, padding: 8, minWidth: 70},
  large: {fontSize: 24, padding: 12, minWidth: 100},
};

const COLORS = {
  normal: palette.cornFlower, // > 1 minute
  warning: '#FFA500', // 30s - 1 minute (orange)
  critical: '#FF4444', // < 30 seconds (red)
  expired: palette.grey, // 0 seconds
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeInfo,
  size = 'medium',
  style,
  showLabel = true,
}) => {
  const {remainingSeconds, formattedTime, isExpired} = timeInfo;
  const sizeConfig = SIZES[size];

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Determine color based on remaining time
  const getTimerColor = () => {
    if (isExpired) return COLORS.expired;
    if (remainingSeconds < 30) return COLORS.critical;
    if (remainingSeconds < 60) return COLORS.warning;
    return COLORS.normal;
  };

  // Pulse animation when critical
  useEffect(() => {
    if (remainingSeconds < 30 && !isExpired) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, {duration: 500, easing: Easing.inOut(Easing.ease)}),
          withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
        ),
        -1, // Infinite repeat
        true,
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, {duration: 200});
    }

    return () => {
      cancelAnimation(scale);
    };
  }, [remainingSeconds, isExpired, scale]);

  // Fade out when expired
  useEffect(() => {
    if (isExpired) {
      opacity.value = withTiming(0.6, {duration: 300});
    }
  }, [isExpired, opacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const timerColor = getTimerColor();

  return (
    <Animated.View
      style={[styles.container, animatedContainerStyle, style]}
      accessibilityLabel={`Time remaining: ${formattedTime}`}
      accessibilityRole="timer"
      accessibilityLiveRegion="polite">
      <View
        style={[
          styles.timerBox,
          {
            backgroundColor: `${timerColor}15`,
            borderColor: timerColor,
            padding: RS(sizeConfig.padding),
            minWidth: RS(sizeConfig.minWidth),
          },
        ]}>
        {showLabel && !isExpired && (
          <Text size={10} color={timerColor} style={styles.label}>
            Reserved for
          </Text>
        )}
        <Text
          size={sizeConfig.fontSize}
          bold
          color={timerColor}
          style={styles.time}>
          {isExpired ? 'EXPIRED' : formattedTime}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerBox: {
    borderRadius: RS(8),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginBottom: RS(2),
  },
  time: {
    fontVariant: ['tabular-nums'], // Monospace numbers for stable width
  },
});
