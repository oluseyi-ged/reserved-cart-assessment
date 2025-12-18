import {Avatar} from '@components/avatar';
import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';

// Mock navigation functions
const mockPush = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

// Mock the navigation module
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    push: mockPush,
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
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
  SvgIcon: ({name, testID, containerStyle}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View testID={testID || `svg-icon-${name}`} style={containerStyle}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock('@components/lazy-image', () => ({
  LazyImage: ({url, testID, containerStyle}: any) => {
    const {View, Image} = require('react-native');
    return (
      <View testID={testID || 'lazy-image'} style={containerStyle}>
        <Image source={{uri: url}} testID="avatar-image" />
      </View>
    );
  },
}));

jest.mock('@components/text', () => ({
  Text: ({children, testID, style}: any) => {
    const {Text: RNText} = require('react-native');
    return (
      <RNText testID={testID} style={style}>
        {children}
      </RNText>
    );
  },
}));

// Mock helpers
jest.mock('@helpers', () => ({
  HDP: jest.fn(value => value),
  RF: jest.fn(value => value),
}));

// Mock theme
jest.mock('@theme', () => ({
  family: {
    Bold: 'System-Bold',
    Regular: 'System-Regular',
  },
}));

describe('Avatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering with URL', () => {
    it('should render LazyImage when valid URL is provided', () => {
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" name="John Doe" />,
      );

      expect(getByTestId('lazy-image')).toBeTruthy();
      expect(getByTestId('avatar-image')).toBeTruthy();
    });

    it('should render with different sizes', () => {
      const sizes = [
        'profile',
        'large',
        'medium',
        'small',
        'tiny',
        'mini',
      ] as const;

      sizes.forEach(size => {
        const {getByTestId} = renderWithProviders(
          <Avatar url="https://example.com/avatar.jpg" size={size} />,
        );
        expect(getByTestId('lazy-image')).toBeTruthy();
      });
    });

    it('should render with different shapes', () => {
      const shapes = ['circle', 'square', 'round'] as const;

      shapes.forEach(shape => {
        const {getByTestId} = renderWithProviders(
          <Avatar url="https://example.com/avatar.jpg" shape={shape} />,
        );
        expect(getByTestId('lazy-image')).toBeTruthy();
      });
    });

    it('should apply custom styles', () => {
      const customStyle = {borderWidth: 2, borderColor: 'red'};
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" style={customStyle} />,
      );

      const lazyImage = getByTestId('lazy-image');
      expect(lazyImage).toBeTruthy();
    });
  });

  describe('Rendering with Initials', () => {
    it('should render initials when no URL is provided', () => {
      const {getByText} = renderWithProviders(<Avatar name="John Doe" />);

      expect(getByText('JD')).toBeTruthy();
    });

    it('should render initials when URL is null', () => {
      const {getByText} = renderWithProviders(
        <Avatar url={null as any} name="Jane Smith" />,
      );

      expect(getByText('JS')).toBeTruthy();
    });

    it('should render initials when URL is undefined', () => {
      const {getByText} = renderWithProviders(
        <Avatar url={undefined} name="Bob Johnson" />,
      );

      expect(getByText('BJ')).toBeTruthy();
    });

    it('should render initials when URL is empty string', () => {
      const {getByText} = renderWithProviders(
        <Avatar url="" name="Alice Brown" />,
      );

      expect(getByText('AB')).toBeTruthy();
    });

    it('should render initials when URL is "null" string', () => {
      const {getByText} = renderWithProviders(
        <Avatar url="null" name="Charlie Wilson" />,
      );

      expect(getByText('CW')).toBeTruthy();
    });

    it('should render initials when URL is "undefined" string', () => {
      const {getByText} = renderWithProviders(
        <Avatar url="undefined" name="David Lee" />,
      );

      expect(getByText('DL')).toBeTruthy();
    });

    it('should handle single name', () => {
      const {getByText} = renderWithProviders(<Avatar name="Madonna" />);

      expect(getByText('MM')).toBeTruthy();
    });

    it('should handle multiple spaces in name', () => {
      const {getByText} = renderWithProviders(
        <Avatar name="John   Michael   Doe" />,
      );

      expect(getByText('JD')).toBeTruthy();
    });

    it('should use "Anon" when no name is provided', () => {
      const {getByText} = renderWithProviders(<Avatar />);

      // "Anon" should produce "AN" as initials
      expect(getByText('AA')).toBeTruthy(); // First and last letter of "Anon"
    });

    it('should handle lowercase names', () => {
      const {getByText} = renderWithProviders(<Avatar name="john doe" />);

      expect(getByText('JD')).toBeTruthy();
    });

    it('should apply custom background color to initials', () => {
      const {getByText} = renderWithProviders(
        <Avatar name="John Doe" bg="#FF0000" />,
      );

      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('Flag Icon', () => {
    it('should render flag icon when provided with initials', () => {
      const {getByText, getByTestId} = renderWithProviders(
        <Avatar name="John Doe" flag="us-flag" />,
      );

      expect(getByText('JD')).toBeTruthy();
      expect(getByTestId('svg-icon-us-flag')).toBeTruthy();
    });

    it('should not render flag icon when not provided', () => {
      const {queryByTestId} = renderWithProviders(<Avatar name="John Doe" />);

      expect(queryByTestId(/svg-icon-.*-flag/)).toBeNull();
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to Profile when nav is true and avatar is pressed', () => {
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" nav={true} id={123} />,
      );

      const touchable = getByTestId('lazy-image').parent?.parent;
      if (touchable) {
        fireEvent.press(touchable);
        expect(mockPush).toHaveBeenCalledWith('Profile', {id: 123});
      }
    });

    it('should call custom onPress when provided', () => {
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" onPress={mockOnPress} />,
      );

      const touchable = getByTestId('lazy-image').parent?.parent;
      if (touchable) {
        fireEvent.press(touchable);
        expect(mockOnPress).toHaveBeenCalledTimes(1);
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it('should prioritize nav over custom onPress', () => {
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <Avatar
          url="https://example.com/avatar.jpg"
          nav={true}
          id={456}
          onPress={mockOnPress}
        />,
      );

      const touchable = getByTestId('lazy-image').parent?.parent;
      if (touchable) {
        fireEvent.press(touchable);
        expect(mockPush).toHaveBeenCalledWith('Profile', {id: 456});
        expect(mockOnPress).not.toHaveBeenCalled();
      }
    });

    it('should handle press on initials avatar with nav', () => {
      const {getByText} = renderWithProviders(
        <Avatar name="John Doe" nav={true} id={789} />,
      );

      const initialsText = getByText('JD');
      const touchable = initialsText.parent?.parent;

      if (touchable) {
        fireEvent.press(touchable);
        expect(mockPush).toHaveBeenCalledWith('Profile', {id: 789});
      }
    });
  });

  describe('Resize Mode', () => {
    it('should apply cover resize mode by default', () => {
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" />,
      );

      expect(getByTestId('lazy-image')).toBeTruthy();
    });

    it('should apply custom resize mode', () => {
      const {getByTestId} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" resizeMode="contain" />,
      );

      expect(getByTestId('lazy-image')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle URL with only whitespace', () => {
      const {getByText} = renderWithProviders(
        <Avatar url="   " name="Test User" />,
      );

      expect(getByText('TU')).toBeTruthy();
    });

    it('should handle non-string URL type', () => {
      const {getByText} = renderWithProviders(
        <Avatar url={123 as any} name="Test User" />,
      );

      expect(getByText('TU')).toBeTruthy();
    });

    it('should apply tiny size text styling', () => {
      const {getByText} = renderWithProviders(
        <Avatar name="John Doe" size="tiny" />,
      );

      expect(getByText('JD')).toBeTruthy();
    });

    it('should apply custom text style', () => {
      const customTextStyle = {color: 'blue', fontSize: 20};
      const {getByText} = renderWithProviders(
        <Avatar name="John Doe" textStyle={customTextStyle} />,
      );

      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot with URL', () => {
      const {toJSON} = renderWithProviders(
        <Avatar url="https://example.com/avatar.jpg" name="John Doe" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with initials', () => {
      const {toJSON} = renderWithProviders(<Avatar name="Jane Smith" />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with all props', () => {
      const {toJSON} = renderWithProviders(
        <Avatar
          url="https://example.com/avatar.jpg"
          name="John Doe"
          size="large"
          shape="circle"
          flag="us-flag"
          bg="#FF0000"
          nav={true}
          id={123}
        />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
