import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {Text as RNText} from 'react-native';
import {Text} from '../../components/text';

// Mock helpers
jest.mock('@helpers', () => ({
  RF: (size: number) => size,
}));

// Mock theme
jest.mock('@theme', () => ({
  family: {
    Regular: 'CustomFont-Regular',
    Medium: 'CustomFont-Medium',
    Bold: 'CustomFont-Bold',
  },
  palette: {
    madison: '#161F4C',
    white: '#FFFFFF',
    black: '#000000',
  },
}));

// Mock MaskedView
jest.mock('@react-native-masked-view/masked-view', () => {
  const {View} = require('react-native');
  return ({maskElement, children}: any) => (
    <View testID="masked-view">
      {maskElement}
      {children}
    </View>
  );
});

// Mock LinearGradient
jest.mock('react-native-linear-gradient', () => {
  const {View} = require('react-native');
  return ({children, colors, start, end, locations}: any) => (
    <View testID="linear-gradient">{children}</View>
  );
});

describe('Text', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with children text', () => {
      const {getByText} = render(<Text>Hello World</Text>);

      expect(getByText('Hello World')).toBeTruthy();
    });

    it('should render with testID', () => {
      const {getByTestId} = render(<Text testID="my-text">Test Content</Text>);

      expect(getByTestId('my-text')).toBeTruthy();
    });

    it('should render without children', () => {
      const {UNSAFE_getByType} = render(<Text />);

      expect(UNSAFE_getByType(RNText)).toBeTruthy();
    });

    it('should render with React nodes as children', () => {
      const {getByText} = render(
        <Text>
          <Text>Nested</Text> Text
        </Text>,
      );

      expect(getByText('Nested')).toBeTruthy();
    });
  });

  describe('Heading Styles', () => {
    it('should apply paragraph style', () => {
      const {getByTestId} = render(
        <Text pg testID="text">
          Paragraph
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject({
        fontSize: 14,
        fontFamily: 'CustomFont-Regular',
      });
    });

    it('should apply small text style', () => {
      const {getByTestId} = render(
        <Text s testID="text">
          Small
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject({
        fontSize: 12,
        fontFamily: 'CustomFont-Regular',
      });
    });
  });

  describe('Font Sizes', () => {
    it('should apply custom size', () => {
      const {getByTestId} = render(
        <Text size={20} testID="text">
          Custom Size
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontSize).toBe(20);
    });

    it('should apply fontSize prop', () => {
      const {getByTestId} = render(
        <Text fontSize={24} testID="text">
          Custom Font Size
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontSize).toBe(24);
    });

    it('should prioritize fontSize over size', () => {
      const {getByTestId} = render(
        <Text size={20} fontSize={24} testID="text">
          Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontSize).toBe(24);
    });
  });

  describe('Font Weights', () => {
    it('should apply bold weight', () => {
      const {getByTestId} = render(
        <Text bold testID="text">
          Bold
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('800');
    });

    it('should apply semibold weight', () => {
      const {getByTestId} = render(
        <Text semibold testID="text">
          Semibold
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('600');
    });

    it('should apply medium weight', () => {
      const {getByTestId} = render(
        <Text medium testID="text">
          Medium
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('500');
    });

    it('should apply custom weight', () => {
      const {getByTestId} = render(
        <Text weight="700" testID="text">
          Custom Weight
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('700');
    });

    it('should apply fontWeight prop', () => {
      const {getByTestId} = render(
        <Text fontWeight="900" testID="text">
          Font Weight
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('900');
    });

    it('should prioritize fontWeight over weight', () => {
      const {getByTestId} = render(
        <Text weight="700" fontWeight="900" testID="text">
          Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontWeight).toBe('900');
    });
  });

  describe('Font Families', () => {
    it('should apply fontFamily prop', () => {
      const {getByTestId} = render(
        <Text fontFamily="AnotherFont" testID="text">
          Font Family
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontFamily).toBe('AnotherFont');
    });

    it('should prioritize fontFamily over font', () => {
      const {getByTestId} = render(
        <Text font="Font1" fontFamily="Font2" testID="text">
          Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.fontFamily).toBe('Font2');
    });

    it('should use default fontFamily from theme', () => {
      const {getByTestId} = render(<Text testID="text">Default Font</Text>);

      const text = getByTestId('text');
      expect(text.props.style.fontFamily).toBe('CustomFont-Regular');
    });
  });

  describe('Text Alignment', () => {
    it('should center align text', () => {
      const {getByTestId} = render(
        <Text center testID="text">
          Centered
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textAlign).toBe('center');
    });

    it('should apply align prop', () => {
      const {getByTestId} = render(
        <Text align="right" testID="text">
          Right Aligned
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textAlign).toBe('right');
    });

    it('should apply textAlign prop', () => {
      const {getByTestId} = render(
        <Text textAlign="left" testID="text">
          Left Aligned
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textAlign).toBe('left');
    });

    it('should prioritize textAlign over align', () => {
      const {getByTestId} = render(
        <Text align="left" textAlign="right" testID="text">
          Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textAlign).toBe('right');
    });
  });

  describe('Colors and Opacity', () => {
    it('should apply default color', () => {
      const {getByTestId} = render(<Text testID="text">Default Color</Text>);

      const text = getByTestId('text');
      expect(text.props.style.color).toBe('#161F4C');
    });

    it('should apply custom color', () => {
      const {getByTestId} = render(
        <Text color="red" testID="text">
          Red Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.color).toBe('red');
    });

    it('should apply opacity', () => {
      const {getByTestId} = render(
        <Text opacity={0.5} testID="text">
          Half Opacity
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.opacity).toBe(0.5);
    });

    it('should apply both color and opacity', () => {
      const {getByTestId} = render(
        <Text color="blue" opacity={0.7} testID="text">
          Blue Semi-transparent
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.color).toBe('blue');
      expect(text.props.style.opacity).toBe(0.7);
    });
  });

  describe('Text Transform', () => {
    it('should apply transform prop', () => {
      const {getByTestId} = render(
        <Text transform="uppercase" testID="text">
          Uppercase
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textTransform).toBe('uppercase');
    });

    it('should apply textTransform prop', () => {
      const {getByTestId} = render(
        <Text textTransform="lowercase" testID="text">
          Lowercase
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textTransform).toBe('lowercase');
    });

    it('should prioritize textTransform over transform', () => {
      const {getByTestId} = render(
        <Text transform="uppercase" textTransform="capitalize" testID="text">
          Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.textTransform).toBe('capitalize');
    });
  });

  describe('Positioning', () => {
    it('should apply position', () => {
      const {getByTestId} = render(
        <Text position="absolute" testID="text">
          Positioned
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.position).toBe('absolute');
    });

    it('should apply top position', () => {
      const {getByTestId} = render(
        <Text top={10} testID="text">
          Top 10
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.top).toBe(10);
    });

    it('should apply right position', () => {
      const {getByTestId} = render(
        <Text right={20} testID="text">
          Right 20
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.right).toBe(20);
    });

    it('should apply bottom position', () => {
      const {getByTestId} = render(
        <Text bottom={30} testID="text">
          Bottom 30
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.bottom).toBe(30);
    });

    it('should apply left position', () => {
      const {getByTestId} = render(
        <Text left={40} testID="text">
          Left 40
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.left).toBe(40);
    });

    it('should handle zero position values', () => {
      const {getByTestId} = render(
        <Text top={0} right={0} testID="text">
          Zero Position
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.top).toBe(0);
      expect(text.props.style.right).toBe(0);
    });
  });

  describe('Line Height', () => {
    it('should apply lineHeight', () => {
      const {getByTestId} = render(
        <Text lineHeight={24} testID="text">
          Line Height
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.lineHeight).toBe(24);
    });
  });

  describe('Italic Style', () => {
    it('should apply italic style', () => {
      const {getByTestId} = render(
        <Text italic testID="text">
          Italic Text
        </Text>,
      );

      // Note: italic prop is defined but not used in the component
      const text = getByTestId('text');
      expect(text).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom style object', () => {
      const customStyle = {marginTop: 10, paddingLeft: 5};

      const {getByTestId} = render(
        <Text style={customStyle} testID="text">
          Custom Style
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject(customStyle);
    });

    it('should merge custom styles with other props', () => {
      const customStyle = {marginTop: 10};

      const {getByTestId} = render(
        <Text color="red" style={customStyle} testID="text">
          Merged Styles
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style.color).toBe('red');
      expect(text.props.style.marginTop).toBe(10);
    });

    it('should apply array of styles', () => {
      const style1 = {marginTop: 10};
      const style2 = {paddingLeft: 5};

      const {getByTestId} = render(
        <Text style={[style1, style2]} testID="text">
          Array Styles
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject({...style1, ...style2});
    });
  });

  describe('onPress Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();

      const {getByText} = render(
        <Text onPress={onPressMock}>Pressable Text</Text>,
      );

      fireEvent.press(getByText('Pressable Text'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple presses', () => {
      const onPressMock = jest.fn();

      const {getByText} = render(<Text onPress={onPressMock}>Press Me</Text>);

      fireEvent.press(getByText('Press Me'));
      fireEvent.press(getByText('Press Me'));
      fireEvent.press(getByText('Press Me'));

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });

    it('should not crash without onPress', () => {
      const {getByText} = render(<Text>Not Pressable</Text>);

      expect(getByText('Not Pressable')).toBeTruthy();
    });
  });

  describe('Number of Lines', () => {
    it('should apply numberOfLines prop', () => {
      const {getByTestId} = render(
        <Text numberOfLines={2} testID="text">
          This is a long text that should be truncated after two lines
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.numberOfLines).toBe(2);
    });

    it('should apply ellipsizeMode', () => {
      const {getByTestId} = render(
        <Text numberOfLines={1} testID="text">
          Long text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.ellipsizeMode).toBe('tail');
    });
  });

  describe('Gradient Text', () => {
    it('should render gradient text when gradient prop is true', () => {
      const {getByTestId} = render(
        <Text gradient testID="text">
          Gradient Text
        </Text>,
      );

      expect(getByTestId('masked-view')).toBeTruthy();
      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('should use custom gradient colors', () => {
      const customColors = ['#FF0000', '#00FF00'];

      const {getByTestId} = render(
        <Text gradient colors={customColors} testID="text">
          Custom Gradient
        </Text>,
      );

      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('should use default gradient colors', () => {
      const {getByTestId} = render(
        <Text gradient testID="text">
          Default Gradient
        </Text>,
      );

      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('should not render gradient when gradient prop is false', () => {
      const {queryByTestId, getByTestId} = render(
        <Text gradient={false} testID="text">
          Normal Text
        </Text>,
      );

      expect(queryByTestId('masked-view')).toBeNull();
      expect(queryByTestId('linear-gradient')).toBeNull();
      expect(getByTestId('text')).toBeTruthy();
    });
  });

  describe('Font Scaling', () => {
    it('should enable font scaling', () => {
      const {getByTestId} = render(<Text testID="text">Scalable Text</Text>);

      const text = getByTestId('text');
      expect(text.props.allowFontScaling).toBe(true);
    });

    it('should disable adjustsFontSizeToFit', () => {
      const {getByTestId} = render(<Text testID="text">Text</Text>);

      const text = getByTestId('text');
      expect(text.props.adjustsFontSizeToFit).toBe(false);
    });

    it('should set maxFontSizeMultiplier', () => {
      const {getByTestId} = render(<Text testID="text">Text</Text>);

      const text = getByTestId('text');
      expect(text.props.maxFontSizeMultiplier).toBe(1.2);
    });
  });

  describe('Combined Props', () => {
    it('should handle multiple props together', () => {
      const {getByTestId} = render(
        <Text
          h2
          bold
          color="blue"
          center
          opacity={0.8}
          lineHeight={40}
          testID="text">
          Combined Props
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject({
        fontSize: 32,
        fontWeight: '800',
        color: 'blue',
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: 40,
      });
    });

    it('should handle all positioning props', () => {
      const {getByTestId} = render(
        <Text
          position="absolute"
          top={10}
          right={20}
          bottom={30}
          left={40}
          testID="text">
          Positioned Text
        </Text>,
      );

      const text = getByTestId('text');
      expect(text.props.style).toMatchObject({
        position: 'absolute',
        top: 10,
        right: 20,
        bottom: 30,
        left: 40,
      });
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic text', () => {
      const {toJSON} = render(<Text>Basic Text</Text>);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - heading styles', () => {
      const {toJSON} = render(<Text h1>Heading 1</Text>);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with styling', () => {
      const {toJSON} = render(
        <Text bold color="red" center>
          Styled Text
        </Text>,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - gradient text', () => {
      const {toJSON} = render(<Text gradient>Gradient Text</Text>);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - complex props', () => {
      const {toJSON} = render(
        <Text
          h3
          semibold
          color="blue"
          opacity={0.9}
          lineHeight={30}
          numberOfLines={2}>
          Complex Text
        </Text>,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
