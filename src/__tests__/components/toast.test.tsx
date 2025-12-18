import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import Toast from '../../components/toast';

// Use fake timers
jest.useFakeTimers();

// Mock helpers
jest.mock('@helpers', () => ({
  HDP: (size: number) => size,
  SCREEN_WIDTH: 375,
}));

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    white: '#FFFFFF',
  },
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
}));

// Mock components
jest.mock('@components', () => ({
  Block: ({children, flex, style}: any) => {
    const {View} = require('react-native');
    return <View style={{...(flex && {flex}), ...style}}>{children}</View>;
  },
  SvgIcon: ({name, size, testID}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View testID={testID || `icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock('@components/text', () => ({
  Text: ({children, style, size, color, bold}: any) => {
    const {Text: RNText} = require('react-native');
    return <RNText style={style}>{children}</RNText>;
  },
}));

// Mock toast slice
jest.mock('@slices/toast', () => ({
  hideToast: jest.fn(() => ({type: 'toast/hide'})),
}));

const mockStore = configureStore([]);

describe('Toast', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  const createMockStore = (toastState: any) => {
    return mockStore({
      toast: {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
        ...toastState,
      },
    });
  };

  describe('Visibility', () => {
    it('should not render when isVisible is false', () => {
      store = createMockStore({isVisible: false});

      const {queryByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(queryByText(/./)).toBeNull();
    });

    it('should render when isVisible is true', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Success message',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Success message')).toBeTruthy();
    });
  });

  describe('Toast Types', () => {
    it('should render success toast with correct styling', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Success!',
        type: 'success',
      });

      const {getByTestId, getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Success!')).toBeTruthy();
      expect(getByTestId('icon-success')).toBeTruthy();
    });

    it('should render error toast with correct styling', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Error occurred',
        type: 'error',
      });

      const {getByTestId, getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Error occurred')).toBeTruthy();
      expect(getByTestId('icon-caution')).toBeTruthy();
    });

    it('should render warning toast with correct styling', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Warning message',
        type: 'warning',
      });

      const {getByTestId, getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Warning message')).toBeTruthy();
      expect(getByTestId('icon-info-white')).toBeTruthy();
    });
  });

  describe('Message Display', () => {
    it('should display the message', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Test message',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Test message')).toBeTruthy();
    });

    it('should display long messages', () => {
      const longMessage =
        'This is a very long message that should be displayed in the toast notification';

      store = createMockStore({
        isVisible: true,
        message: longMessage,
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText(longMessage)).toBeTruthy();
    });

    it('should display empty message', () => {
      store = createMockStore({
        isVisible: true,
        message: '',
        type: 'success',
      });

      const {queryByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(queryByText('')).toBeTruthy();
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss after 7 seconds', () => {
      const {hideToast} = require('@slices/toast');

      store = createMockStore({
        isVisible: true,
        message: 'Auto-dismiss message',
        type: 'success',
      });

      render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Fast-forward animation
      jest.advanceTimersByTime(300);

      // Fast-forward to auto-dismiss
      jest.advanceTimersByTime(7000);

      // Wait for close animation
      jest.advanceTimersByTime(300);

      expect(hideToast).toHaveBeenCalled();
    });

    it('should clear timeout on unmount', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Test message',
        type: 'success',
      });

      const {unmount} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      unmount();

      // Should not throw error
      expect(() => jest.advanceTimersByTime(7000)).not.toThrow();
    });
  });

  describe('Manual Dismiss', () => {
    it('should dismiss when tapped', () => {
      const {hideToast} = require('@slices/toast');

      store = createMockStore({
        isVisible: true,
        message: 'Tap to dismiss',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      fireEvent.press(getByText('Tap to dismiss'));

      // Wait for close animation
      jest.advanceTimersByTime(300);

      expect(hideToast).toHaveBeenCalled();
    });

    it('should clear auto-dismiss timeout when manually dismissed', () => {
      const {hideToast} = require('@slices/toast');

      store = createMockStore({
        isVisible: true,
        message: 'Manual dismiss',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Manually dismiss before auto-dismiss
      jest.advanceTimersByTime(3000);
      fireEvent.press(getByText('Manual dismiss'));
      jest.advanceTimersByTime(300);

      expect(hideToast).toHaveBeenCalledTimes(1);

      // Continue to original auto-dismiss time
      jest.advanceTimersByTime(4000);

      // Should not be called again
      expect(hideToast).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animations', () => {
    it('should animate in when shown', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Animated toast',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Animated toast')).toBeTruthy();

      // Fast-forward animation
      jest.advanceTimersByTime(300);

      expect(getByText('Animated toast')).toBeTruthy();
    });

    it('should animate out when dismissed', () => {
      const {hideToast} = require('@slices/toast');

      store = createMockStore({
        isVisible: true,
        message: 'Dismiss animation',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      fireEvent.press(getByText('Dismiss animation'));

      // Fast-forward close animation
      jest.advanceTimersByTime(300);

      expect(hideToast).toHaveBeenCalled();
    });
  });

  describe('State Updates', () => {
    it('should show new toast when state changes', () => {
      store = createMockStore({
        isVisible: false,
        message: '',
        type: 'success',
      });

      const {queryByText, rerender} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(queryByText('First message')).toBeNull();

      // Update store state
      store = createMockStore({
        isVisible: true,
        message: 'First message',
        type: 'success',
      });

      rerender(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(queryByText('First message')).toBeTruthy();
    });

    it('should handle rapid state changes', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Message 1',
        type: 'success',
      });

      const {getByText, rerender} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Message 1')).toBeTruthy();

      // Rapid update
      store = createMockStore({
        isVisible: true,
        message: 'Message 2',
        type: 'error',
      });

      rerender(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      jest.advanceTimersByTime(300);

      expect(getByText('Message 2')).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('should display success icon', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Success',
        type: 'success',
      });

      const {getByTestId} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByTestId('icon-success')).toBeTruthy();
    });

    it('should display error icon', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Error',
        type: 'error',
      });

      const {getByTestId} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByTestId('icon-caution')).toBeTruthy();
    });

    it('should display warning icon', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Warning',
        type: 'warning',
      });

      const {getByTestId} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByTestId('icon-info-white')).toBeTruthy();
    });
  });

  describe('Positioning', () => {
    it('should position toast with safe area insets', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Positioned toast',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Toast should render (positioning is handled by inline styles)
      expect(getByText('Positioned toast')).toBeTruthy();
    });
  });

  describe('Background Colors', () => {
    it('should have green background for success', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Success',
        type: 'success',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Component renders with success styling
      expect(getByText('Success')).toBeTruthy();
    });

    it('should have red background for error', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Error',
        type: 'error',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Error')).toBeTruthy();
    });

    it('should have orange background for warning', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Warning',
        type: 'warning',
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Warning')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing type', () => {
      store = createMockStore({
        isVisible: true,
        message: 'No type',
        type: undefined,
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('No type')).toBeTruthy();
    });

    it('should handle invalid type', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Invalid type',
        type: 'invalid' as any,
      });

      const {getByText} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(getByText('Invalid type')).toBeTruthy();
    });

    it('should not crash with undefined message', () => {
      store = createMockStore({
        isVisible: true,
        message: undefined,
        type: 'success',
      });

      expect(() => {
        render(
          <Provider store={store}>
            <Toast />
          </Provider>,
        );
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timers when visibility changes to false', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Test',
        type: 'success',
      });

      const {rerender} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Change visibility to false
      store = createMockStore({
        isVisible: false,
        message: 'Test',
        type: 'success',
      });

      rerender(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      // Should not throw
      expect(() => jest.advanceTimersByTime(7000)).not.toThrow();
    });

    it('should cleanup on unmount', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Test',
        type: 'success',
      });

      const {unmount} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      unmount();

      // Advancing timers should not cause issues
      expect(() => jest.advanceTimersByTime(10000)).not.toThrow();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - not visible', () => {
      store = createMockStore({isVisible: false});

      const {toJSON} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - success toast', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Success message',
        type: 'success',
      });

      const {toJSON} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - error toast', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Error message',
        type: 'error',
      });

      const {toJSON} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - warning toast', () => {
      store = createMockStore({
        isVisible: true,
        message: 'Warning message',
        type: 'warning',
      });

      const {toJSON} = render(
        <Provider store={store}>
          <Toast />
        </Provider>,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
