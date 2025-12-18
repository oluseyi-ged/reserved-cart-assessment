import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';
import {Walkthrough} from '../../screens/walkthrough';

jest.mock('@assets/images', () => ({
  Onboard1: 'mocked-onboard1',
  Onboard2: 'mocked-onboard2',
  Onboard3: 'mocked-onboard3',
  Onboard4: 'mocked-onboard4',
}));

jest.mock('@components', () => {
  const React = require('react');
  const {View, Text, TouchableOpacity} = require('react-native');

  return {
    Block: ({children, onPress, ...props}: any) => {
      const Component = onPress ? TouchableOpacity : View;
      return (
        <Component onPress={onPress} {...props}>
          {children}
        </Component>
      );
    },
    SizedBox: () => <View testID="sized-box" />,
    SvgIcon: (props: any) => <View testID="svg-icon" {...props} />,
    Text: ({children, onPress, ...props}: any) => {
      if (onPress) {
        return (
          <TouchableOpacity onPress={onPress} {...props}>
            <Text>{children}</Text>
          </TouchableOpacity>
        );
      }
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('@components/svg-icon/SvgIconContainer', () => {
  const React = require('react');
  const {TouchableOpacity, Text} = require('react-native');

  return {
    __esModule: true,
    default: ({onPress, ...props}: any) => (
      <TouchableOpacity
        testID="svg-icon-container"
        onPress={onPress}
        {...props}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const {View} = require('react-native');
  return ({children, ...props}: any) => <View {...props}>{children}</View>;
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    GestureHandlerRootView: ({children, ...props}: any) => (
      <View {...props}>{children}</View>
    ),
    GestureDetector: ({children, ...props}: any) => (
      <View {...props}>{children}</View>
    ),
    Gesture: {
      Pan: () => ({
        onEnd: jest.fn().mockReturnThis(),
        runOnJS: jest.fn().mockReturnThis(),
      }),
    },
  };
});

jest.mock('@helpers', () => ({
  SCREEN_WIDTH: 375,
  HDP: (value: number) => value,
}));

jest.mock('@utils/metrics', () => ({
  HS: (value: number) => value,
  VS: (value: number) => value,
}));

describe('Walkthrough', () => {
  const mockNavigation: any = {
    navigate: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders first walkthrough screen correctly', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    expect(
      getByText('Get onboard and start accepting rides Instantly'),
    ).toBeTruthy();
    expect(getByText(/Jump into a flexible schedule/)).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
  });

  it('shows Skip button on non-last screens', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    expect(getByText('Skip')).toBeTruthy();
  });

  it('navigates to next screen when arrow button is pressed', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const arrowButton = getByTestId('svg-icon-container');
    fireEvent.press(arrowButton);

    expect(
      getByText('Effortlessly monitor your booking schedule.'),
    ).toBeTruthy();
  });

  it('skips to last screen when Skip button is pressed', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(getByText('Earn money with ShopReserve App')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('renders last screen with Get Started button', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(getByText('Get Started')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText(/By joining/)).toBeTruthy();
  });

  it('does not show Skip button on last screen', () => {
    const {getByText, queryByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(queryByText('Skip')).toBeFalsy();
  });

  it('navigates to Signup when Get Started is pressed', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    const getStartedButton = getByText('Get Started');
    fireEvent.press(getStartedButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Auth', {
      screen: 'Signup',
    });
  });

  it('displays correct content for second screen', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const arrowButton = getByTestId('svg-icon-container');
    fireEvent.press(arrowButton);

    expect(
      getByText('Effortlessly monitor your booking schedule.'),
    ).toBeTruthy();
    expect(getByText(/Stay on top your appointments/)).toBeTruthy();
  });

  it('displays correct content for third screen', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const arrowButton = getByTestId('svg-icon-container');
    fireEvent.press(arrowButton);
    fireEvent.press(arrowButton);

    expect(getByText('Keep tabs on your earning with ease')).toBeTruthy();
    expect(getByText(/Our transparent payment system/)).toBeTruthy();
  });

  it('displays correct content for fourth screen', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const arrowButton = getByTestId('svg-icon-container');
    fireEvent.press(arrowButton);
    fireEvent.press(arrowButton);
    fireEvent.press(arrowButton);

    expect(getByText('Earn money with ShopReserve App')).toBeTruthy();
  });

  it('shows swipe to explore text on non-last screens', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    expect(getByText('Swipe to explore')).toBeTruthy();
  });

  it('does not show swipe to explore text on last screen', () => {
    const {getByText, queryByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(queryByText('Swipe to explore')).toBeFalsy();
  });

  it('renders GestureHandlerRootView wrapper', () => {
    const {getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    // Verify the component renders properly
    expect(
      getByText('Get onboard and start accepting rides Instantly'),
    ).toBeTruthy();
  });

  it('maintains screen state through navigation', () => {
    const {getByTestId, getByText} = renderWithProviders(
      <Walkthrough navigation={mockNavigation} />,
    );

    const arrowButton = getByTestId('svg-icon-container');

    // Go forward
    fireEvent.press(arrowButton);
    expect(
      getByText('Effortlessly monitor your booking schedule.'),
    ).toBeTruthy();

    // Go forward again
    fireEvent.press(arrowButton);
    expect(getByText('Keep tabs on your earning with ease')).toBeTruthy();

    // Verify we're on screen 3 (index 2)
    expect(getByText(/Our transparent payment system/)).toBeTruthy();
  });
});
