import {Block, SvgIcon} from '@components';
import {Text} from '@components/text';
import {RS, SCREEN_WIDTH} from '@helpers';
import {hideToast} from '@slices/toast';
import {palette} from '@theme';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'store';

// Toast.tsx
const Toast = () => {
  const dispatch = useDispatch();
  const {isVisible, message, title, type} = useSelector(
    (state: RootState) => state.toast,
  );

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();
  const timerRef = useRef<NodeJS.Timeout>(null);

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(hideToast());
    });
  };

  const show = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    slideAnim.setValue(-100);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(() => {
      handleClose();
    }, 4000);
  };

  useEffect(() => {
    if (isVisible) {
      show();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, message, title, type]);

  if (!isVisible) return null;

  const backgroundColor = {
    success: '#4CD964',
    error: '#E01E1E',
    warning: '#FF9800',
  }[type];

  const iconName = {
    success: 'success',
    error: 'caution',
    warning: 'info-white',
  }[type];

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor,
            transform: [{translateY: slideAnim}],
            top: insets.top + RS(10),
          },
        ]}>
        <SvgIcon name={iconName || 'verify'} size={24} />
        <Block flex={1}>
          {/* <Text size={14} color={palette.white} bold>
            {title}
          </Text>
          <SizedBox height={3} /> */}
          <Text style={{width: '100%'}} size={14} color={palette.white}>
            {message}
          </Text>
        </Block>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 10,
    flexDirection: 'row',
    zIndex: 999,
    width: SCREEN_WIDTH * 0.8,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Toast;
