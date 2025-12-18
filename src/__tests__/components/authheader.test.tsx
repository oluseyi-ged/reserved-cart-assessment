import {Text} from '@components';
import AuthHeader from '@components/auth-header';
import {useNavigation} from '@react-navigation/native';
import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock the components
jest.mock('@components', () => ({
  Block: ({children, testID, ...props}: any) => {
    const {View} = require('react-native');
    return (
      <View testID={testID} {...props}>
        {children}
      </View>
    );
  },
  SvgIcon: ({name, onPress, testID}: any) => {
    const {TouchableOpacity, Text} = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} testID={testID || `svg-icon-${name}`}>
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
  Text: ({children, testID, ...props}: any) => {
    const {Text: RNText} = require('react-native');
    return (
      <RNText testID={testID} {...props}>
        {children}
      </RNText>
    );
  },
}));

// Mock helpers
jest.mock('@helpers', () => ({
  HDP: jest.fn(value => value),
}));

describe('AuthHeader', () => {
  const mockGoBack = jest.fn();
  const mockNavigation = {
    goBack: mockGoBack,
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = renderWithProviders(<AuthHeader />);
      expect(getByText('Need help?')).toBeTruthy();
    });

    it('should render the app icon by default', () => {
      const {getByTestId} = renderWithProviders(<AuthHeader />);
      expect(getByTestId('svg-icon-app-icon')).toBeTruthy();
    });

    it('should render the title when provided', () => {
      const {getByText, queryByTestId} = renderWithProviders(
        <AuthHeader title="Sign In" />,
      );
      expect(getByText('Sign In')).toBeTruthy();
      expect(queryByTestId('svg-icon-app-icon')).toBeNull();
    });

    it('should render back arrow when back prop is true', () => {
      const {getByTestId} = renderWithProviders(<AuthHeader back />);
      expect(getByTestId('svg-icon-arrow-back')).toBeTruthy();
    });

    it('should hide logo when hideLogo is true', () => {
      const {queryByTestId} = renderWithProviders(<AuthHeader hideLogo />);
      expect(queryByTestId('svg-icon-app-icon')).toBeNull();
    });

    it('should render custom header left element', () => {
      const CustomElement = () => <Text testID="custom-left">Custom Left</Text>;
      const {getByTestId} = renderWithProviders(
        <AuthHeader headerLeftElement={<CustomElement />} />,
      );
      expect(getByTestId('custom-left')).toBeTruthy();
    });

    it('should render custom header right element', () => {
      const CustomElement = () => (
        <Text testID="custom-right">Custom Right</Text>
      );
      const {getByTestId, queryByText} = renderWithProviders(
        <AuthHeader headerRightElement={<CustomElement />} />,
      );
      expect(getByTestId('custom-right')).toBeTruthy();
      expect(queryByText('Need help?')).toBeNull();
    });
  });

  describe('Back Button Behavior', () => {
    it('should call navigation.goBack when back arrow is pressed', () => {
      const {getByTestId} = renderWithProviders(<AuthHeader back />);
      const backButton = getByTestId('svg-icon-arrow-back');

      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('should call custom onBackPress when provided', () => {
      const mockOnBackPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <AuthHeader back onBackPress={mockOnBackPress} />,
      );
      const backButton = getByTestId('svg-icon-arrow-back');

      fireEvent.press(backButton);

      expect(mockOnBackPress).toHaveBeenCalledTimes(1);
      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });

  describe('Conditional Rendering', () => {
    it('should prioritize back button over headerLeftElement', () => {
      const CustomElement = () => <Text testID="custom-left">Custom</Text>;
      const {getByTestId, queryByTestId} = renderWithProviders(
        <AuthHeader back headerLeftElement={<CustomElement />} />,
      );

      expect(getByTestId('svg-icon-arrow-back')).toBeTruthy();
      expect(queryByTestId('custom-left')).toBeNull();
    });

    it('should prioritize title over logo', () => {
      const {getByText, queryByTestId} = renderWithProviders(
        <AuthHeader title="My Title" />,
      );

      expect(getByText('My Title')).toBeTruthy();
      expect(queryByTestId('svg-icon-app-icon')).toBeNull();
    });

    it('should show nothing in left section when hideLogo is true and no other elements', () => {
      const {queryByTestId} = renderWithProviders(<AuthHeader hideLogo />);

      expect(queryByTestId('svg-icon-app-icon')).toBeNull();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with back button, title, and custom right element', () => {
      const CustomRight = () => <Text testID="custom-right">Skip</Text>;
      const {getByTestId, getByText} = renderWithProviders(
        <AuthHeader
          back
          title="Create Account"
          headerRightElement={<CustomRight />}
        />,
      );

      expect(getByTestId('svg-icon-arrow-back')).toBeTruthy();
      expect(getByText('Create Account')).toBeTruthy();
      expect(getByTestId('custom-right')).toBeTruthy();
    });

    it('should handle all props together', () => {
      const mockOnBackPress = jest.fn();
      const CustomRight = () => <Text testID="custom-right">Done</Text>;

      const {getByTestId, getByText} = renderWithProviders(
        <AuthHeader
          back
          title="Profile"
          onBackPress={mockOnBackPress}
          headerRightElement={<CustomRight />}
        />,
      );

      const backButton = getByTestId('svg-icon-arrow-back');
      fireEvent.press(backButton);

      expect(mockOnBackPress).toHaveBeenCalled();
      expect(getByText('Profile')).toBeTruthy();
      expect(getByTestId('custom-right')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot with default props', () => {
      const {toJSON} = renderWithProviders(<AuthHeader />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with all props', () => {
      const CustomRight = () => <Text>Custom</Text>;
      const {toJSON} = renderWithProviders(
        <AuthHeader
          back
          title="Test Title"
          headerRightElement={<CustomRight />}
        />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
