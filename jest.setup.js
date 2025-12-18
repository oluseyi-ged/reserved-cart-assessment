import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('./ReactotronConfig', () => ({
  __esModule: true,
  default: null,
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
  useFocusEffect: jest.fn(),
}));

// Mock Reanimated - FIXED VERSION
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      createAnimatedComponent: component => component,
    },
    useSharedValue: jest.fn(() => ({value: 0})),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedRef: jest.fn(() => ({current: null})),
    useDerivedValue: jest.fn(() => ({value: 0})),
    useAnimatedReaction: jest.fn(),
    useAnimatedProps: jest.fn(() => ({})),
    withTiming: jest.fn(value => value),
    withSpring: jest.fn(value => value),
    withDecay: jest.fn(value => value),
    withDelay: jest.fn(value => value),
    withSequence: jest.fn((...values) => values[0]),
    withRepeat: jest.fn(value => value),
    cancelAnimation: jest.fn(),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      bezier: jest.fn(),
    },
    Extrapolate: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    interpolate: jest.fn(),
    runOnJS: jest.fn(fn => fn),
    runOnUI: jest.fn(fn => fn),
  };
});

// Mock Bottom Sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({children, ...props}, ref) => (
      <View {...props}>{children}</View>
    )),
    BottomSheetModal: React.forwardRef(({children, ...props}, ref) => (
      <View {...props}>{children}</View>
    )),
    BottomSheetView: ({children, ...props}) => (
      <View {...props}>{children}</View>
    ),
    BottomSheetScrollView: ({children, ...props}) => {
      const {ScrollView} = require('react-native');
      return <ScrollView {...props}>{children}</ScrollView>;
    },
    useBottomSheet: () => ({
      snapToIndex: jest.fn(),
      snapToPosition: jest.fn(),
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
    }),
    useBottomSheetModal: () => ({
      dismiss: jest.fn(),
      dismissAll: jest.fn(),
    }),
  };
});

// MockReact Native Biometrics
jest.mock('react-native-biometrics', () => {
  return jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({available: false}),
    simplePrompt: jest.fn().mockResolvedValue({success: false}),
  }));
});

// Mock helpers
jest.mock('./src/helpers', () => ({
  HDP: jest.fn(value => value),
  WDP: jest.fn(value => value),
}));

// Silence console in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: console.log,
};
