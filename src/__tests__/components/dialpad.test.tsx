import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';

// ===== ALL MOCKS FIRST =====

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

// Mock components
// Mock components
jest.mock('@components', () => ({
  SvgIcon: ({name, size, testID, onPress}: any) => {
    const {View, Text, TouchableOpacity} = require('react-native');

    // If there's an onPress, wrap in TouchableOpacity (like real component)
    if (onPress) {
      return (
        <TouchableOpacity
          testID={testID || `svg-icon-${name}`}
          onPress={onPress}>
          <Text>{name}</Text>
        </TouchableOpacity>
      );
    }

    // Otherwise just a View (like real component)
    return (
      <View testID={testID || `svg-icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
  Text: ({children, testID, style, ...props}: any) => {
    const {Text: RNText} = require('react-native');
    return (
      <RNText testID={testID} style={style} {...props}>
        {children}
      </RNText>
    );
  },
}));

// Mock helpers
const mockTriggerToast = jest.fn();
jest.mock('@helpers', () => ({
  triggerToast: mockTriggerToast,
}));

// Mock styles
jest.mock('../../components/dial-pad/styles', () => ({
  default: {
    dialBox: {
      padding: 10,
    },
    dialPadContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 40,
    },
  },
}));

import ReactNativeBiometrics from 'react-native-biometrics';
import {DialpadKeypad} from '../../components/dial-pad';

describe('DialpadKeypad Component', () => {
  const mockSetValue = jest.fn();
  const mockOnPinComplete = jest.fn();
  let mockIsSensorAvailable: jest.Mock;
  let mockSimplePrompt: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockInstance = new (ReactNativeBiometrics as any)();
    mockIsSensorAvailable = mockInstance.isSensorAvailable;
    mockSimplePrompt = mockInstance.simplePrompt;
    mockIsSensorAvailable.mockResolvedValue({available: false});
    mockSimplePrompt.mockResolvedValue({success: false});
  });

  describe('PIN Mode - Basic Rendering', () => {
    it('should render dialpad in PIN mode', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      expect(getByText('1')).toBeTruthy();
      expect(getByText('9')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
    });

    it('should not render decimal point in PIN mode', () => {
      const {queryByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      expect(queryByText('.')).toBeNull();
    });

    it('should render backspace icon', () => {
      const {getByTestId} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="pin" />,
      );

      expect(getByTestId('svg-icon-backspace')).toBeTruthy();
    });

    it('should render custom dialpad content', () => {
      const customContent = ['A', 'B', 'C', 'D', 'E', 'F'];
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          dialPadContent={customContent}
        />,
      );

      expect(getByText('A')).toBeTruthy();
      expect(getByText('F')).toBeTruthy();
    });
  });

  describe('PIN Mode - Input Handling', () => {
    it('should add digit when pressed', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      fireEvent.press(getByText('1'));

      expect(mockSetValue).toHaveBeenCalledWith('1');
    });

    it('should append digits sequentially', () => {
      const {getByText, rerender} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      fireEvent.press(getByText('1'));
      expect(mockSetValue).toHaveBeenCalledWith('1');

      rerender(
        <DialpadKeypad
          value="1"
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      fireEvent.press(getByText('2'));
      expect(mockSetValue).toHaveBeenCalledWith('12');
    });

    it('should respect pinLength limit', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value="1234"
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      fireEvent.press(getByText('5'));

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should call onPinComplete when PIN is complete', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value="123"
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
          onPinComplete={mockOnPinComplete}
        />,
      );

      fireEvent.press(getByText('4'));

      expect(mockSetValue).toHaveBeenCalledWith('1234');
      expect(mockOnPinComplete).toHaveBeenCalledWith('1234');
    });

    it('should handle different pinLength values', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value="12345"
          setValue={mockSetValue}
          mode="pin"
          pinLength={6}
          onPinComplete={mockOnPinComplete}
        />,
      );

      fireEvent.press(getByText('6'));

      expect(mockSetValue).toHaveBeenCalledWith('123456');
      expect(mockOnPinComplete).toHaveBeenCalledWith('123456');
    });
  });

  describe('Amount Mode - Basic Rendering', () => {
    it('should render dialpad in amount mode', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      expect(getByText('1')).toBeTruthy();
      expect(getByText('9')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
      expect(getByText('.')).toBeTruthy();
    });

    it('should render decimal point in amount mode', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      expect(getByText('.')).toBeTruthy();
    });
  });

  describe('Amount Mode - Input Handling', () => {
    it('should add digits in amount mode', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('5'));

      expect(mockSetValue).toHaveBeenCalledWith('5');
    });

    it('should add decimal point', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="10" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('.'));

      expect(mockSetValue).toHaveBeenCalledWith('10.');
    });

    it('should not add multiple decimal points', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="10.5" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('.'));

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not add decimal as first character', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('.'));

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should limit to two decimal places', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="10.99" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('5'));

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should allow two decimal places', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="10.9" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('5'));

      expect(mockSetValue).toHaveBeenCalledWith('10.95');
    });

    it('should replace leading zero with digit', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="0" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('5'));

      expect(mockSetValue).toHaveBeenCalledWith('5');
    });

    it('should allow zero followed by decimal', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="0" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByText('.'));

      expect(mockSetValue).toHaveBeenCalledWith('0.');
    });
  });

  describe('Backspace Functionality', () => {
    it('should remove last character when backspace is pressed', () => {
      const {getByTestId} = renderWithProviders(
        <DialpadKeypad value="123" setValue={mockSetValue} mode="pin" />,
      );

      fireEvent.press(getByTestId('svg-icon-backspace'));

      expect(mockSetValue).toHaveBeenCalledWith('12');
    });

    it('should handle backspace on empty value', () => {
      const {getByTestId} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="pin" />,
      );

      fireEvent.press(getByTestId('svg-icon-backspace'));

      expect(mockSetValue).toHaveBeenCalledWith('');
    });

    it('should work in amount mode', () => {
      const {getByTestId} = renderWithProviders(
        <DialpadKeypad value="10.50" setValue={mockSetValue} mode="amount" />,
      );

      fireEvent.press(getByTestId('svg-icon-backspace'));

      expect(mockSetValue).toHaveBeenCalledWith('10.5');
    });
  });

  describe('Loading State', () => {
    it('should show activity indicator when loading', () => {
      const {UNSAFE_getByType} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          loading={true}
        />,
      );

      const {ActivityIndicator} = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should disable buttons when loading', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          loading={true}
        />,
      );

      fireEvent.press(getByText('1'));

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not show loading indicator by default', () => {
      const {UNSAFE_queryByType} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="pin" />,
      );

      const {ActivityIndicator} = require('react-native');
      expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull();
    });
  });

  describe('Custom Props', () => {
    it('should apply custom dialPadSize', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          dialPadSize={100}
        />,
      );

      expect(getByText('1')).toBeTruthy();
    });

    it('should apply custom dialPadTextSize', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          dialPadTextSize={24}
        />,
      );

      expect(getByText('1')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="pin" />,
      );

      fireEvent.press(getByText('1'));
      expect(mockSetValue).toHaveBeenCalledWith('1');
    });

    it('should handle mode switching', () => {
      const {getByText, queryByText, rerender} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="pin" />,
      );

      expect(queryByText('.')).toBeNull();

      rerender(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      expect(getByText('.')).toBeTruthy();
    });

    it('should handle rapid button presses', () => {
      const {getByText} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      const button = getByText('1');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockSetValue).toHaveBeenCalledTimes(3);
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - PIN mode', () => {
      const {toJSON} = renderWithProviders(
        <DialpadKeypad
          value=""
          setValue={mockSetValue}
          mode="pin"
          pinLength={4}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - amount mode', () => {
      const {toJSON} = renderWithProviders(
        <DialpadKeypad value="" setValue={mockSetValue} mode="amount" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - loading state', () => {
      const {toJSON} = renderWithProviders(
        <DialpadKeypad
          value="123"
          setValue={mockSetValue}
          mode="pin"
          loading={true}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});

// TODO: Implement tests for Biometrics - Availability Check and Biometrics - Authentication.
// Description:
//   Ensure Dialpad handles biometric authentication and checking of biometric availability correctly.
// Steps:
//   1. Write test cases for successful and failed availability checks
//   2. Verify biometric authentication flows, including successes and failures
//   3. Cover any necessary edge cases (e.g., biometric permission denied)
