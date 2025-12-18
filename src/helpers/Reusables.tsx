import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import {RH, RS, SCREEN_HEIGHT} from '@helpers';
import {family, palette} from '@theme';
import {debounce} from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const ErrorInfo: React.FC<any> = ({message}) => {
  return (
    <Block row gap={12} bg="#FFF5F5" radius={4} style={styles.errorBox}>
      <SvgIcon name="error" size={26} />
      <Text fontFamily={family.Light} color="#66191D" size={12}>
        {message}
      </Text>
    </Block>
  );
};

type ErrorFallbackProps = {
  error: Error | null;
  resetError: () => void;
};

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleRetry = useCallback(
    debounce(() => {
      resetError();
    }, 300),
    [resetError],
  );

  const safeErrorMessage = error?.message || 'An unexpected error occurred';

  return (
    <Animated.View style={[animatedStyle, {flex: 1}]}>
      <Block
        bg="#FAFAFF"
        safe
        flex={1}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        style={{paddingHorizontal: RS(24)}}>
        <SizedBox height={SCREEN_HEIGHT * 0.25} />
        <Block align="center" gap={RS(16)}>
          <SvgIcon name="logo" size={RS(64)} />
          <Text size={24} fontFamily={family.Bold} color={palette.fadeBlue}>
            Oops! Something Went Wrong
          </Text>
          <Text
            size={16}
            fontFamily={family.Regular}
            color={palette.dark}
            textAlign="center">
            {safeErrorMessage}
          </Text>
          <SizedBox height={RH(24)} />
          <Button
            title="Try Again"
            onPress={handleRetry}
            textStyle={{color: palette.white, fontFamily: family.Medium}}
            style={{width: '100%', borderRadius: RS(8)}}
            accessibilityLabel="Retry button"
          />
          <Text
            size={12}
            fontFamily={family.Light}
            color={palette.blue}
            textAlign="center">
            If this issue persists, please contact support at
            support@simpliride.com
          </Text>
        </Block>
      </Block>
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  txItemBox: {
    paddingTop: RS(10),
    paddingBottom: RS(14),
    paddingHorizontal: RS(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADEFF',
  },
  errorBox: {
    borderWidth: 0.5,
    borderColor: '#FDE7E8',
    paddingVertical: RS(8),
    paddingHorizontal: RS(16),
    marginBottom: RS(16),
  },
  txBox: {
    paddingHorizontal: RS(24),
    paddingTop: RS(40),
    paddingBottom: RS(50),
  },
  itemStatusBox: {
    paddingHorizontal: RS(6),
    paddingVertical: RS(4),
    borderRadius: RS(16),
  },
});
