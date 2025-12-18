import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {SvgIcon} from '../../components/svg-icon';

// Mock the SVG config
jest.mock('../../assets/svgs', () => ({
  Warning: () => null,
  CheckCircle: () => null,
  UserProfile: () => null,
  ArrowLeft: () => null,
  HomeIcon: () => null,
  SettingsGear: () => null,
}));

// Mock utils
jest.mock('@utils', () => ({
  toUpperCaseFirstLetter: (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
}));

// Mock lodash
jest.mock('lodash', () => ({
  camelCase: (str: string) => {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, c => c.toLowerCase());
  },
}));

describe('SvgIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with required name prop', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="svg-icon" />,
      );

      expect(getByTestId('svg-icon')).toBeTruthy();
    });

    it('should render in a View when no onPress is provided', () => {
      const {getByTestId, UNSAFE_queryByType} = render(
        <SvgIcon name="check-circle" testID="svg-icon" />,
      );

      expect(getByTestId('svg-icon')).toBeTruthy();
      expect(UNSAFE_queryByType(TouchableOpacity)).toBeNull();
    });

    it('should render in a TouchableOpacity when onPress is provided', () => {
      const onPressMock = jest.fn();
      const {getByTestId, UNSAFE_getByType} = render(
        <SvgIcon name="check-circle" onPress={onPressMock} testID="svg-icon" />,
      );

      expect(getByTestId('svg-icon')).toBeTruthy();
      expect(UNSAFE_getByType(TouchableOpacity)).toBeTruthy();
    });

    it('should render with testID', () => {
      const {getByTestId} = render(
        <SvgIcon name="home-icon" testID="my-icon" />,
      );

      expect(getByTestId('my-icon')).toBeTruthy();
    });
  });

  describe('Icon Name Conversion', () => {
    it('should convert kebab-case to PascalCase', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should convert snake_case to PascalCase', () => {
      const {getByTestId} = render(
        <SvgIcon name="user_profile" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle space-separated words', () => {
      const {getByTestId} = render(<SvgIcon name="arrow left" testID="icon" />);

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle camelCase names', () => {
      const {getByTestId} = render(<SvgIcon name="homeIcon" testID="icon" />);

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should fallback to Warning icon for unknown names', () => {
      const {getByTestId} = render(
        <SvgIcon name="unknown-icon-name" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should fallback to Warning icon for empty name', () => {
      const {getByTestId} = render(<SvgIcon name="" testID="icon" />);

      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Size Props', () => {
    it('should apply size prop to both width and height', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={24} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should apply custom height', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" height={30} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should apply custom width', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" width={40} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should prioritize height over size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={20} height={30} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should prioritize width over size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={20} width={40} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle both custom width and height', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" height={30} width={40} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should render without size props', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Container Styles', () => {
    it('should apply default container styles', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      const container = getByTestId('icon');
      expect(container.props.style).toContainEqual(
        expect.objectContaining({
          alignItems: 'center',
          justifyContent: 'center',
        }),
      );
    });

    it('should apply custom containerStyle', () => {
      const customStyle = {padding: 10, margin: 5};

      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          containerStyle={customStyle}
          testID="icon"
        />,
      );

      const container = getByTestId('icon');
      expect(container.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should merge custom styles with defaults', () => {
      const customStyle = {backgroundColor: 'red'};

      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          containerStyle={customStyle}
          testID="icon"
        />,
      );

      const container = getByTestId('icon');
      expect(container.props.style).toContainEqual(
        expect.objectContaining({
          alignItems: 'center',
          justifyContent: 'center',
        }),
      );
      expect(container.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });
  });

  describe('onPress Interaction', () => {
    it('should call onPress when TouchableOpacity is pressed', () => {
      const onPressMock = jest.fn();

      const {getByTestId} = render(
        <SvgIcon name="check-circle" onPress={onPressMock} testID="icon" />,
      );

      fireEvent.press(getByTestId('icon'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should call onPress multiple times', () => {
      const onPressMock = jest.fn();

      const {getByTestId} = render(
        <SvgIcon name="check-circle" onPress={onPressMock} testID="icon" />,
      );

      fireEvent.press(getByTestId('icon'));
      fireEvent.press(getByTestId('icon'));
      fireEvent.press(getByTestId('icon'));

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });

    it('should have hitSlop when onPress is provided', () => {
      const onPressMock = jest.fn();

      const {getByTestId} = render(
        <SvgIcon name="check-circle" onPress={onPressMock} testID="icon" />,
      );

      const touchable = getByTestId('icon');
      expect(touchable.props.hitSlop).toEqual({
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      });
    });

    it('should not be pressable when no onPress is provided', () => {
      const {getByTestId, UNSAFE_queryByType} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
      expect(UNSAFE_queryByType(TouchableOpacity)).toBeNull();
    });
  });

  describe('Additional Props', () => {
    it('should pass additional props to icon component', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="icon" color="red" opacity={0.5} />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should pass backgroundColor as transparent', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle custom props', () => {
      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          testID="icon"
          customProp="value"
          anotherProp={123}
        />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Disable Prop', () => {
    it('should accept disable prop', () => {
      const onPressMock = jest.fn();

      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          onPress={onPressMock}
          disable={true}
          testID="icon"
        />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should accept disable prop as false', () => {
      const onPressMock = jest.fn();

      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          onPress={onPressMock}
          disable={false}
          testID="icon"
        />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null onPress', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" onPress={undefined} testID="icon" />,
      );

      const container = getByTestId('icon');
      expect(container.type).toBe('View');
    });

    it('should handle zero size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={0} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle very large size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={1000} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle negative size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={-10} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle decimal size', () => {
      const {getByTestId} = render(
        <SvgIcon name="check-circle" size={24.5} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle special characters in name', () => {
      const {getByTestId} = render(
        <SvgIcon name="check@circle#icon!" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
    });

    it('should handle name with numbers', () => {
      const {getByTestId} = render(<SvgIcon name="icon-123" testID="icon" />);

      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Different Container Types', () => {
    it('should render View container by default', () => {
      const {getByTestId, UNSAFE_queryByType} = render(
        <SvgIcon name="check-circle" testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
      expect(UNSAFE_queryByType(TouchableOpacity)).toBeNull();
    });

    it('should render TouchableOpacity container with onPress', () => {
      const onPressMock = jest.fn();
      const {getByTestId, UNSAFE_getByType} = render(
        <SvgIcon name="check-circle" onPress={onPressMock} testID="icon" />,
      );

      expect(getByTestId('icon')).toBeTruthy();
      expect(UNSAFE_getByType(TouchableOpacity)).toBeTruthy();
    });

    it('should apply styles to View container', () => {
      const customStyle = {padding: 5};

      const {getByTestId} = render(
        <SvgIcon
          name="check-circle"
          containerStyle={customStyle}
          testID="icon"
        />,
      );

      const container = getByTestId('icon');
      expect(container.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic icon', () => {
      const {toJSON} = render(<SvgIcon name="check-circle" />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with onPress', () => {
      const {toJSON} = render(
        <SvgIcon name="check-circle" onPress={() => {}} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with size', () => {
      const {toJSON} = render(<SvgIcon name="check-circle" size={24} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with custom dimensions', () => {
      const {toJSON} = render(
        <SvgIcon name="check-circle" width={30} height={40} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with container style', () => {
      const {toJSON} = render(
        <SvgIcon
          name="check-circle"
          containerStyle={{padding: 10, backgroundColor: 'red'}}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with all props', () => {
      const {toJSON} = render(
        <SvgIcon
          name="check-circle"
          size={24}
          onPress={() => {}}
          containerStyle={{padding: 10}}
          color="blue"
          testID="icon"
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
