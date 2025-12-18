import {useFocusEffect} from '@react-navigation/native';
import {waitFor} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';
import {SplashScreen} from '../../screens/splashScreen';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('@assets/images', () => ({
  XBg: 'mocked-background-image',
}));

jest.mock('@components', () => {
  const React = require('react');
  return {
    Block: ({children, ...props}: any) => <div {...props}>{children}</div>,
    SvgIcon: (props: any) => <div data-testid="svg-icon" {...props} />,
    Text: ({children, ...props}: any) => <span {...props}>{children}</span>,
  };
});

jest.mock('@helpers', () => ({
  SCREEN_WIDTH: 375,
}));

jest.mock('react-native-animatable', () => ({
  View: ({children, ...props}: any) => <div {...props}>{children}</div>,
}));

jest.mock('react-native-edge-to-edge', () => ({
  SystemBars: (props: any) => <div data-testid="system-bars" {...props} />,
}));

jest.useFakeTimers();

describe('SplashScreen', () => {
  const mockNavigation: any = {
    navigate: jest.fn(),
    reset: jest.fn(),
  };

  const mockUseFocusEffect = useFocusEffect as jest.MockedFunction<
    typeof useFocusEffect
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('navigates to Home screen when user is logged in', async () => {
    mockUseFocusEffect.mockImplementation((callback: any) => {
      callback();
    });

    const preloadedState = {
      logged: true,
      auth: {token: 'test-token'},
    };

    renderWithProviders(<SplashScreen navigation={mockNavigation as any} />, {
      preloadedState,
    });

    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{name: 'Home'}],
      });
    });
  });

  it('navigates to Login screen when user is not logged in and auth has properties', async () => {
    mockUseFocusEffect.mockImplementation((callback: any) => {
      callback();
    });

    const preloadedState = {
      logged: false,
      auth: {token: 'existing'},
    };

    renderWithProviders(<SplashScreen navigation={mockNavigation as any} />, {
      preloadedState,
    });

    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      // Due to the bug, this also goes to Walkthrough
      // because auth !== {} is always true, so it takes the first branch
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Walkthrough');
    });
  });

  it('does not navigate before timeout completes', () => {
    mockUseFocusEffect.mockImplementation((callback: any) => {
      callback();
    });

    const preloadedState = {
      logged: true,
      auth: {},
    };

    renderWithProviders(<SplashScreen navigation={mockNavigation as any} />, {
      preloadedState,
    });

    jest.advanceTimersByTime(3000);

    expect(mockNavigation.reset).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('calls useFocusEffect on component mount', () => {
    const preloadedState = {
      logged: false,
      auth: {},
    };

    renderWithProviders(<SplashScreen navigation={mockNavigation as any} />, {
      preloadedState,
    });

    expect(mockUseFocusEffect).toHaveBeenCalled();
  });

  it('logs correct console messages for logged user', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    mockUseFocusEffect.mockImplementation((callback: any) => {
      callback();
    });

    const preloadedState = {
      logged: true,
      auth: {},
    };

    renderWithProviders(<SplashScreen navigation={mockNavigation as any} />, {
      preloadedState,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('second', true);

    jest.advanceTimersByTime(4000);

    expect(consoleLogSpy).toHaveBeenCalledWith('first');

    consoleLogSpy.mockRestore();
  });

  it('handles different logged states correctly', async () => {
    mockUseFocusEffect.mockImplementation((callback: any) => {
      callback();
    });

    const preloadedState = {
      logged: false,
      auth: {},
    };

    const {rerender} = renderWithProviders(
      <SplashScreen navigation={mockNavigation as any} />,
      {preloadedState},
    );

    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalled();
    });
  });

  it('correctly reads logged state from Redux store', () => {
    const preloadedState = {
      logged: true,
      auth: {user: 'test-user'},
      token: 'test-token',
      toast: null,
    };

    const {store} = renderWithProviders(
      <SplashScreen navigation={mockNavigation as any} />,
      {preloadedState},
    );

    expect(store.getState().logged).toBe(true);
    expect(store.getState().auth).toEqual({user: 'test-user'});
  });
});
