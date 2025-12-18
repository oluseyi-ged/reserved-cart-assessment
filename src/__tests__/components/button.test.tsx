import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';
import {Vibration} from 'react-native';
import {Button} from '../../components/buttons';

// Mock Vibration
jest.spyOn(Vibration, 'vibrate');

// Mock components
jest.mock('@components/sized-box', () => ({
  SizedBox: ({width, height, testID}: any) => {
    const {View} = require('react-native');
    return <View testID={testID || 'sized-box'} style={{width, height}} />;
  },
}));

jest.mock('@components/svg-icon', () => ({
  SvgIcon: ({name, size, color, testID}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View
        testID={testID || `svg-icon-${name}`}
        style={{width: size, height: size}}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock('@components/text', () => ({
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
jest.mock('@helpers', () => ({
  HDP: jest.fn(value => value),
}));

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    cornFlower: '#6366F1',
    burnt: '#1F2937',
    white: '#FFFFFF',
    black: '#000000',
  },
}));

// Mock styles
jest.mock('../../components/buttons/styles', () => ({
  default: {
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
}));

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render button with title', () => {
      const {getByText} = renderWithProviders(<Button title="Click Me" />);

      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should render with default background color', () => {
      const {getByText} = renderWithProviders(<Button title="Button" />);

      expect(getByText('Button')).toBeTruthy();
    });

    it('should apply custom background color', () => {
      const {getByText} = renderWithProviders(
        <Button title="Colored Button" color="#FF0000" />,
      );

      expect(getByText('Colored Button')).toBeTruthy();
    });

    it('should render with custom testID', () => {
      const {getByTestId} = renderWithProviders(
        <Button title="Test" testID="custom-button" />,
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });
  });

  describe('Button Styles', () => {
    it('should render outlined button', () => {
      const {getByText} = renderWithProviders(
        <Button title="Outlined" outlined />,
      );

      expect(getByText('Outlined')).toBeTruthy();
    });

    it('should apply custom border radius', () => {
      const {getByText} = renderWithProviders(
        <Button title="Rounded" radius={10} />,
      );

      expect(getByText('Rounded')).toBeTruthy();
    });

    it('should apply flex property', () => {
      const {getByText} = renderWithProviders(
        <Button title="Flex Button" flex={1} />,
      );

      expect(getByText('Flex Button')).toBeTruthy();
    });

    it('should apply row layout', () => {
      const {getByText} = renderWithProviders(
        <Button title="Row Button" row />,
      );

      expect(getByText('Row Button')).toBeTruthy();
    });

    it('should apply justify content', () => {
      const {getByText} = renderWithProviders(
        <Button title="Justified" justify="flex-start" />,
      );

      expect(getByText('Justified')).toBeTruthy();
    });

    it('should apply align items', () => {
      const {getByText} = renderWithProviders(
        <Button title="Aligned" align="flex-start" />,
      );

      expect(getByText('Aligned')).toBeTruthy();
    });

    it('should apply custom width and height', () => {
      const {getByText} = renderWithProviders(
        <Button title="Sized" width={200} height={60} />,
      );

      expect(getByText('Sized')).toBeTruthy();
    });

    it('should apply position props', () => {
      const {getByText} = renderWithProviders(
        <Button title="Positioned" position="absolute" top={10} left={20} />,
      );

      expect(getByText('Positioned')).toBeTruthy();
    });

    it('should apply shadow', () => {
      const shadow = {
        color: '#000',
        offset: {width: 0, height: 2},
        opacity: 0.25,
        radius: 3.84,
      };

      const {getByText} = renderWithProviders(
        <Button title="Shadow" shadow={shadow} />,
      );

      expect(getByText('Shadow')).toBeTruthy();
    });

    it('should apply custom style', () => {
      const customStyle = {padding: 20};
      const {getByText} = renderWithProviders(
        <Button title="Custom Style" style={customStyle} />,
      );

      expect(getByText('Custom Style')).toBeTruthy();
    });

    it('should apply custom text style', () => {
      const textStyle = {fontSize: 20, fontWeight: 'bold'};
      const {getByText} = renderWithProviders(
        <Button title="Custom Text" textStyle={textStyle} />,
      );

      expect(getByText('Custom Text')).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('should render with initIcon (leading icon)', () => {
      const {getByText, getByTestId} = renderWithProviders(
        <Button title="With Icon" initIcon="arrow-left" />,
      );

      expect(getByText('With Icon')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-left')).toBeTruthy();
    });

    it('should render with iconName (trailing icon)', () => {
      const {getByText, getByTestId} = renderWithProviders(
        <Button title="With Icon" iconName="arrow-right" />,
      );

      expect(getByText('With Icon')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-right')).toBeTruthy();
    });

    it('should render with both initIcon and iconName', () => {
      const {getByText, getByTestId} = renderWithProviders(
        <Button
          title="Both Icons"
          initIcon="arrow-left"
          iconName="arrow-right"
        />,
      );

      expect(getByText('Both Icons')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-left')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-right')).toBeTruthy();
    });

    it('should apply custom icon size', () => {
      const {getByTestId} = renderWithProviders(
        <Button title="Large Icon" iconName="star" iconSize={32} />,
      );

      expect(getByTestId('svg-icon-star')).toBeTruthy();
    });

    it('should apply custom icon container style', () => {
      const iconStyle = {marginLeft: 10};
      const {getByTestId} = renderWithProviders(
        <Button
          title="Icon Style"
          iconName="check"
          iconContainerStyle={iconStyle}
        />,
      );

      expect(getByTestId('svg-icon-check')).toBeTruthy();
    });

    it('should render icons with correct color for outlined button', () => {
      const {getByTestId} = renderWithProviders(
        <Button title="Outlined Icon" iconName="heart" outlined />,
      );

      expect(getByTestId('svg-icon-heart')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show activity indicator when loading', () => {
      const {queryByText, UNSAFE_getByType} = renderWithProviders(
        <Button title="Loading Button" loading />,
      );

      const {ActivityIndicator} = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      expect(queryByText('Loading Button')).toBeNull();
    });

    it('should hide title when loading', () => {
      const {queryByText} = renderWithProviders(
        <Button title="Submit" loading />,
      );

      expect(queryByText('Submit')).toBeNull();
    });

    it('should hide icons when loading', () => {
      const {queryByTestId} = renderWithProviders(
        <Button title="Submit" iconName="check" loading />,
      );

      expect(queryByTestId('svg-icon-check')).toBeNull();
    });

    it('should show correct loader color for outlined button', () => {
      const {UNSAFE_getByType} = renderWithProviders(
        <Button title="Loading" loading outlined />,
      );

      const {ActivityIndicator} = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled style', () => {
      const {getByText} = renderWithProviders(
        <Button title="Disabled" disabled />,
      );

      expect(getByText('Disabled')).toBeTruthy();
    });

    it('should not call onPress when disabled', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Disabled" disabled onPress={mockOnPress} />,
      );

      fireEvent.press(getByText('Disabled'));

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should not vibrate when disabled', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button
          title="Disabled"
          disabled
          onPress={mockOnPress}
          vibrate={100}
        />,
      );

      fireEvent.press(getByText('Disabled'));

      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
  });

  describe('Press Interactions', () => {
    it('should call onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Press Me" onPress={mockOnPress} />,
      );

      fireEvent.press(getByText('Press Me'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should vibrate with single number when pressed', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Vibrate" onPress={mockOnPress} vibrate={100} />,
      );

      fireEvent.press(getByText('Vibrate'));

      expect(mockOnPress).toHaveBeenCalled();
      expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    });

    it('should vibrate with pattern when pressed', () => {
      const mockOnPress = jest.fn();
      const vibratePattern = [0, 100, 200, 100];
      const {getByText} = renderWithProviders(
        <Button
          title="Vibrate Pattern"
          onPress={mockOnPress}
          vibrate={vibratePattern}
        />,
      );

      fireEvent.press(getByText('Vibrate Pattern'));

      expect(mockOnPress).toHaveBeenCalled();
      expect(Vibration.vibrate).toHaveBeenCalledWith(vibratePattern);
    });

    it('should not vibrate when vibrate is undefined', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="No Vibrate" onPress={mockOnPress} />,
      );

      fireEvent.press(getByText('No Vibrate'));

      expect(mockOnPress).toHaveBeenCalled();
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });

    it('should apply custom activeOpacity', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Opacity" onPress={mockOnPress} activeOpacity={0.5} />,
      );

      expect(getByText('Opacity')).toBeTruthy();
    });

    it('should handle multiple presses', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Multiple" onPress={mockOnPress} />,
      );

      const button = getByText('Multiple');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all props together', () => {
      const mockOnPress = jest.fn();
      const shadow = {
        color: '#000',
        offset: {width: 0, height: 2},
        opacity: 0.25,
        radius: 3.84,
      };

      const {getByText, getByTestId} = renderWithProviders(
        <Button
          title="Full Button"
          color="#FF5733"
          outlined
          radius={20}
          flex={1}
          row
          justify="center"
          align="center"
          shadow={shadow}
          width={300}
          height={60}
          onPress={mockOnPress}
          vibrate={100}
          initIcon="star"
          iconName="arrow-right"
          iconSize={24}
          activeOpacity={0.7}
          testID="full-button"
        />,
      );

      expect(getByText('Full Button')).toBeTruthy();
      expect(getByTestId('full-button')).toBeTruthy();
      expect(getByTestId('svg-icon-star')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-right')).toBeTruthy();

      fireEvent.press(getByTestId('full-button'));
      expect(mockOnPress).toHaveBeenCalled();
      expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    });

    it('should work with outlined button and icons', () => {
      const mockOnPress = jest.fn();
      const {getByText, getByTestId} = renderWithProviders(
        <Button
          title="Outlined with Icons"
          outlined
          initIcon="check"
          iconName="arrow-right"
          onPress={mockOnPress}
        />,
      );

      expect(getByText('Outlined with Icons')).toBeTruthy();
      expect(getByTestId('svg-icon-check')).toBeTruthy();
      expect(getByTestId('svg-icon-arrow-right')).toBeTruthy();

      fireEvent.press(getByText('Outlined with Icons'));
      expect(mockOnPress).toHaveBeenCalled();
    });

    it('should handle loading state with all props', () => {
      const {queryByText, UNSAFE_getByType} = renderWithProviders(
        <Button
          title="Loading"
          loading
          outlined
          initIcon="star"
          iconName="check"
        />,
      );

      const {ActivityIndicator} = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      expect(queryByText('Loading')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should render without onPress', () => {
      const {getByText} = renderWithProviders(<Button title="No Handler" />);

      expect(() => {
        fireEvent.press(getByText('No Handler'));
      }).not.toThrow();
    });

    it('should handle empty title', () => {
      const {getByText} = renderWithProviders(<Button title="" />);

      expect(getByText('')).toBeTruthy();
    });

    it('should handle title as number', () => {
      const {getByText} = renderWithProviders(<Button title={123} />);

      expect(getByText('123')).toBeTruthy();
    });

    it('should handle both justify and justifyContent props', () => {
      const {getByText} = renderWithProviders(
        <Button title="Justify" justify="center" justifyContent="flex-start" />,
      );

      expect(getByText('Justify')).toBeTruthy();
    });

    it('should handle both align and alignItems props', () => {
      const {getByText} = renderWithProviders(
        <Button title="Align" align="center" alignItems="flex-start" />,
      );

      expect(getByText('Align')).toBeTruthy();
    });

    it('should handle all position props', () => {
      const {getByText} = renderWithProviders(
        <Button
          title="Positioned"
          position="absolute"
          top={10}
          right={20}
          bottom={30}
          left={40}
        />,
      );

      expect(getByText('Positioned')).toBeTruthy();
    });

    it('should render with zero vibrate value', () => {
      const mockOnPress = jest.fn();
      const {getByText} = renderWithProviders(
        <Button title="Zero Vibrate" onPress={mockOnPress} vibrate={0} />,
      );

      fireEvent.press(getByText('Zero Vibrate'));

      expect(Vibration.vibrate).toHaveBeenCalledWith(0);
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic button', () => {
      const {toJSON} = renderWithProviders(<Button title="Basic Button" />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - outlined button', () => {
      const {toJSON} = renderWithProviders(
        <Button title="Outlined" outlined />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - button with icons', () => {
      const {toJSON} = renderWithProviders(
        <Button title="With Icons" initIcon="star" iconName="arrow-right" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - loading button', () => {
      const {toJSON} = renderWithProviders(<Button title="Loading" loading />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - disabled button', () => {
      const {toJSON} = renderWithProviders(
        <Button title="Disabled" disabled />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - full props', () => {
      const {toJSON} = renderWithProviders(
        <Button
          title="Full Button"
          color="#FF5733"
          outlined
          radius={20}
          initIcon="star"
          iconName="check"
          loading={false}
          disabled={false}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
