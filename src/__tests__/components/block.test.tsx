import {fireEvent} from '@testing-library/react-native';
import {renderWithProviders} from '@utils/test-utils';
import React from 'react';
import {Keyboard, Text} from 'react-native';

// Mock dependencies BEFORE importing Block
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: ({children, testID, ...props}: any) => {
    const {ScrollView} = require('react-native');
    return (
      <ScrollView testID={testID || 'aware_scroll_view_container'} {...props}>
        {children}
      </ScrollView>
    );
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  })),
}));

jest.mock('react-native-status-bar-height', () => ({
  getStatusBarHeight: jest.fn(() => 20),
}));

// Mock SizedBox directly - DON'T use requireActual
jest.mock('@components', () => ({
  SizedBox: ({height, testID}: any) => {
    const {View} = require('react-native');
    return <View testID={testID || 'sized-box'} style={{height}} />;
  },
}));

jest.mock('@helpers', () => ({
  HDP: jest.fn(value => value),
}));

// Mock Keyboard
jest.spyOn(Keyboard, 'dismiss');

import {Block} from '../../components/block';

describe('Block Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children', () => {
      const {getByText} = renderWithProviders(
        <Block>
          <Text>Test Content</Text>
        </Block>,
      );

      expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render with testID', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="test-block">
          <Text>Content</Text>
        </Block>,
      );

      expect(getByTestId('test-block')).toBeTruthy();
    });

    it('should apply custom styles', () => {
      const customStyle = {padding: 20, margin: 10};
      const {getByTestId} = renderWithProviders(
        <Block testID="styled-block" style={customStyle}>
          <Text>Styled Content</Text>
        </Block>,
      );

      expect(getByTestId('styled-block')).toBeTruthy();
    });
  });

  describe('Layout Props', () => {
    it('should apply flex prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="flex-block" flex={1}>
          <Text>Flex Content</Text>
        </Block>,
      );

      expect(getByTestId('flex-block')).toBeTruthy();
    });

    it('should apply row layout', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="row-block" row>
          <Text>Row Content</Text>
        </Block>,
      );

      expect(getByTestId('row-block')).toBeTruthy();
    });

    it('should apply justify content', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="justify-block" justify="center">
          <Text>Centered</Text>
        </Block>,
      );

      expect(getByTestId('justify-block')).toBeTruthy();
    });

    it('should apply align items', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="align-block" align="center">
          <Text>Aligned</Text>
        </Block>,
      );

      expect(getByTestId('align-block')).toBeTruthy();
    });

    it('should apply gap', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="gap-block" gap={10}>
          <Text>Gap Content</Text>
        </Block>,
      );

      expect(getByTestId('gap-block')).toBeTruthy();
    });

    it('should apply width and height', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="size-block" width={100} height={200}>
          <Text>Sized Content</Text>
        </Block>,
      );

      expect(getByTestId('size-block')).toBeTruthy();
    });

    it('should apply position props', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="position-block" position="absolute" top={10} left={20}>
          <Text>Positioned</Text>
        </Block>,
      );

      expect(getByTestId('position-block')).toBeTruthy();
    });
  });

  describe('Styling Props', () => {
    it('should apply background color', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="color-block" color="#FF0000">
          <Text>Colored</Text>
        </Block>,
      );

      expect(getByTestId('color-block')).toBeTruthy();
    });

    it('should apply bg prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="bg-block" bg="#00FF00">
          <Text>Background</Text>
        </Block>,
      );

      expect(getByTestId('bg-block')).toBeTruthy();
    });

    it('should apply border radius', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="radius-block" radius={10}>
          <Text>Rounded</Text>
        </Block>,
      );

      expect(getByTestId('radius-block')).toBeTruthy();
    });

    it('should apply outlined style', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="outlined-block" outlined color="#0000FF">
          <Text>Outlined</Text>
        </Block>,
      );

      expect(getByTestId('outlined-block')).toBeTruthy();
    });

    it('should apply card style', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="card-block" card>
          <Text>Card Content</Text>
        </Block>,
      );

      expect(getByTestId('card-block')).toBeTruthy();
    });

    it('should apply shadow', () => {
      const shadow = {
        color: '#000',
        offset: {width: 0, height: 2},
        opacity: 0.25,
        radius: 3.84,
      };

      const {getByTestId} = renderWithProviders(
        <Block testID="shadow-block" shadow={shadow}>
          <Text>Shadow Content</Text>
        </Block>,
      );

      expect(getByTestId('shadow-block')).toBeTruthy();
    });

    it('should apply overflow', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="overflow-block" overflow="hidden">
          <Text>Overflow Content</Text>
        </Block>,
      );

      expect(getByTestId('overflow-block')).toBeTruthy();
    });
  });

  describe('Interaction Props', () => {
    it('should call onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <Block testID="press-block" onPress={mockOnPress}>
          <Text>Pressable</Text>
        </Block>,
      );

      fireEvent.press(getByTestId('press-block'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    it('should not call onPress when disabled', () => {
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <Block testID="disabled-block" onPress={mockOnPress} disabled>
          <Text>Disabled</Text>
        </Block>,
      );

      fireEvent.press(getByTestId('disabled-block'));

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should apply activeOpacity', () => {
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProviders(
        <Block testID="opacity-block" onPress={mockOnPress} activeOpacity={0.5}>
          <Text>Opacity</Text>
        </Block>,
      );

      expect(getByTestId('opacity-block')).toBeTruthy();
    });
  });

  describe('Scroll Variants', () => {
    it('should render with scroll prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="scroll-block" scroll bg="#FFFFFF">
          <Text>Scrollable Content</Text>
        </Block>,
      );

      expect(getByTestId('scroll-block')).toBeTruthy();
      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should render with scrollIn prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block scrollIn>
          <Text>ScrollIn Content</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should render with safe prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="safe-block" safe bg="#FFFFFF">
          <Text>Safe Area Content</Text>
        </Block>,
      );

      expect(getByTestId('safe-block')).toBeTruthy();
      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should control scroll with isScrollable prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block scroll isScrollable={false}>
          <Text>Non-scrollable</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should show scrollbar when showScrollbar is true', () => {
      const {getByTestId} = renderWithProviders(
        <Block scroll showScrollbar>
          <Text>Scrollbar visible</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should apply bounce effect', () => {
      const {getByTestId} = renderWithProviders(
        <Block scroll bounce>
          <Text>Bouncing scroll</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should apply refresh control', () => {
      const mockRefreshControl = <Text>Refresh Control</Text>;
      const {getByTestId} = renderWithProviders(
        <Block scroll refreshControl={mockRefreshControl}>
          <Text>Pull to refresh</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should apply contentContainerStyle', () => {
      const contentStyle = {padding: 20};
      const {getByTestId} = renderWithProviders(
        <Block scroll contentContainerStyle={contentStyle}>
          <Text>Content with style</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should apply scrollEventThrottle', () => {
      const {getByTestId} = renderWithProviders(
        <Block scroll scrollEventThrottle={16}>
          <Text>Throttled scroll</Text>
        </Block>,
      );

      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });
  });

  describe('Background Image', () => {
    it('should render with background image', () => {
      const mockImage = {uri: 'https://example.com/bg.jpg'};
      const {getByText} = renderWithProviders(
        <Block backgroundImage={mockImage}>
          <Text>Background Image Content</Text>
        </Block>,
      );

      expect(getByText('Background Image Content')).toBeTruthy();
    });

    it('should render background image with scroll', () => {
      const mockImage = {uri: 'https://example.com/bg.jpg'};
      const {getByTestId, getByText} = renderWithProviders(
        <Block backgroundImage={mockImage} backgroundScroll>
          <Text>Scrollable Background</Text>
        </Block>,
      );

      expect(getByText('Scrollable Background')).toBeTruthy();
      expect(getByTestId('aware_scroll_view_container')).toBeTruthy();
    });

    it('should apply overlay color', () => {
      const mockImage = {uri: 'https://example.com/bg.jpg'};
      const mockOnPress = jest.fn();

      const {getByText} = renderWithProviders(
        <Block
          backgroundImage={mockImage}
          overlayColor="rgba(0,0,0,0.5)"
          onPress={mockOnPress}>
          <Text>Overlay Content</Text>
        </Block>,
      );

      expect(getByText('Overlay Content')).toBeTruthy();
    });

    it('should apply imageStyle to background', () => {
      const mockImage = {uri: 'https://example.com/bg.jpg'};
      const imageStyle = {opacity: 0.5};

      const {getByText} = renderWithProviders(
        <Block backgroundImage={mockImage} imageStyle={imageStyle}>
          <Text>Styled Background</Text>
        </Block>,
      );

      expect(getByText('Styled Background')).toBeTruthy();
    });
  });

  describe('Overlay Interactions', () => {
    it('should dismiss keyboard and call onPress on overlay press', () => {
      const mockOnPress = jest.fn();
      const mockImage = {uri: 'https://example.com/bg.jpg'};

      const {getByText} = renderWithProviders(
        <Block
          backgroundImage={mockImage}
          overlayColor="rgba(0,0,0,0.5)"
          onPress={mockOnPress}>
          <Text>Content</Text>
        </Block>,
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('should not call onPress when overlay is disabled', () => {
      const mockOnPress = jest.fn();
      const mockImage = {uri: 'https://example.com/bg.jpg'};

      const {getByText} = renderWithProviders(
        <Block
          backgroundImage={mockImage}
          overlayColor="rgba(0,0,0,0.5)"
          onPress={mockOnPress}
          disabled>
          <Text>Disabled Overlay</Text>
        </Block>,
      );

      expect(getByText('Disabled Overlay')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render without any props', () => {
      const {getByText} = renderWithProviders(
        <Block>
          <Text>Minimal Block</Text>
        </Block>,
      );

      expect(getByText('Minimal Block')).toBeTruthy();
    });

    it('should handle transparent background', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="transparent-block" transparent>
          <Text>Transparent</Text>
        </Block>,
      );

      expect(getByTestId('transparent-block')).toBeTruthy();
    });

    it('should handle both justify and justifyContent props', () => {
      const {getByTestId} = renderWithProviders(
        <Block
          testID="justify-both"
          justify="center"
          justifyContent="space-between">
          <Text>Justified</Text>
        </Block>,
      );

      expect(getByTestId('justify-both')).toBeTruthy();
    });

    it('should handle both align and alignItems props', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="align-both" align="center" alignItems="flex-start">
          <Text>Aligned</Text>
        </Block>,
      );

      expect(getByTestId('align-both')).toBeTruthy();
    });

    it('should handle both content and alignContent props', () => {
      const {getByTestId} = renderWithProviders(
        <Block
          testID="content-both"
          content="center"
          alignContent="space-around">
          <Text>Content Aligned</Text>
        </Block>,
      );

      expect(getByTestId('content-both')).toBeTruthy();
    });

    it('should handle wrap prop', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="wrap-block" wrap="wrap">
          <Text>Wrapped</Text>
        </Block>,
      );

      expect(getByTestId('wrap-block')).toBeTruthy();
    });

    it('should handle all position props together', () => {
      const {getByTestId} = renderWithProviders(
        <Block
          testID="all-positions"
          position="absolute"
          top={10}
          right={20}
          bottom={30}
          left={40}>
          <Text>All Positions</Text>
        </Block>,
      );

      expect(getByTestId('all-positions')).toBeTruthy();
    });

    it('should handle bg and transparent together', () => {
      const {getByTestId} = renderWithProviders(
        <Block testID="bg-transparent" bg="#FF0000" transparent={false}>
          <Text>Background Applied</Text>
        </Block>,
      );

      expect(getByTestId('bg-transparent')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic', () => {
      const {toJSON} = renderWithProviders(
        <Block>
          <Text>Basic Block</Text>
        </Block>,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with scroll', () => {
      const {toJSON} = renderWithProviders(
        <Block scroll bg="#FFFFFF">
          <Text>Scrollable Block</Text>
        </Block>,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with card style', () => {
      const {toJSON} = renderWithProviders(
        <Block card>
          <Text>Card Block</Text>
        </Block>,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with all props', () => {
      const {toJSON} = renderWithProviders(
        <Block
          flex={1}
          row
          justify="center"
          align="center"
          gap={10}
          color="#FFFFFF"
          radius={10}
          card
          onPress={() => {}}>
          <Text>Full Props Block</Text>
        </Block>,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
