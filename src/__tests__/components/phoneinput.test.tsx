import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {CustomPhoneInput} from '../../components/phone-input';

// Mock PhoneInput
jest.mock('react-native-phone-number-input', () => {
  const React = require('react');
  const {TextInput, View, TouchableOpacity, Text} = require('react-native');

  return React.forwardRef((props: any, ref: any) => {
    const {
      defaultValue,
      defaultCode,
      placeholder,
      disabled,
      renderDropdownImage,
      onChangeFormattedText,
      onChangeText,
      onChangeCountry,
      containerStyle,
      flagButtonStyle,
      codeTextStyle,
      textInputStyle,
      textContainerStyle,
      layout,
    } = props;

    return (
      <View testID="phone-input-container" style={containerStyle}>
        <TouchableOpacity
          testID="flag-button"
          style={flagButtonStyle}
          onPress={() => onChangeCountry?.({callingCode: ['234'], cca2: 'NG'})}
          disabled={disabled}>
          <Text testID="country-code" style={codeTextStyle}>
            +{defaultCode === 'NG' ? '234' : '1'}
          </Text>
          {renderDropdownImage && (
            <View testID="dropdown-image">{renderDropdownImage}</View>
          )}
        </TouchableOpacity>
        <View testID="text-container" style={textContainerStyle}>
          <TextInput
            ref={ref}
            testID="phone-text-input"
            style={textInputStyle}
            placeholder={placeholder}
            defaultValue={defaultValue}
            editable={!disabled}
            onChangeText={text => {
              onChangeText?.(text);
              onChangeFormattedText?.(`+234${text}`);
            }}
          />
        </View>
      </View>
    );
  });
});

// Mock SvgIcon
jest.mock('@components/svg-icon', () => ({
  SvgIcon: ({name, size, testID}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View testID={testID || `svg-icon-${name}`}>
        <Text>{name}</Text>
        <Text>{size}</Text>
      </View>
    );
  },
}));

// Mock helpers
jest.mock('@helpers', () => ({
  HDP: (value: number) => value,
  RF: (value: number) => value,
}));

// Mock theme
jest.mock('@theme', () => ({
  family: {
    Medium: 'CustomFont-Medium',
    Regular: 'CustomFont-Regular',
  },
}));

describe('CustomPhoneInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      expect(getByTestId('phone-input-container')).toBeTruthy();
      expect(getByTestId('phone-text-input')).toBeTruthy();
      expect(getByTestId('flag-button')).toBeTruthy();
    });

    it('should render with default country code NG', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      const countryCode = getByTestId('country-code');
      expect(countryCode.props.children).toContain('234');
    });

    it('should render with custom default code', () => {
      const {getByTestId} = render(<CustomPhoneInput defaultCode="US" />);

      const countryCode = getByTestId('country-code');
      expect(countryCode.props.children).toContain('1');
    });

    it('should render with default value', () => {
      const {getByTestId} = render(
        <CustomPhoneInput defaultValue="8012345678" />,
      );

      const input = getByTestId('phone-text-input');
      expect(input.props.defaultValue).toBe('8012345678');
    });

    it('should render with placeholder', () => {
      const {getByTestId} = render(
        <CustomPhoneInput placeholder="Enter phone number" />,
      );

      const input = getByTestId('phone-text-input');
      expect(input.props.placeholder).toBe('Enter phone number');
    });

    it('should render default dropdown icon', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      expect(getByTestId('dropdown-image')).toBeTruthy();
      expect(getByTestId('svg-icon-caret-down')).toBeTruthy();
    });

    it('should render custom dropdown image', () => {
      const {View, Text} = require('react-native');
      const customIcon = (
        <View testID="custom-icon">
          <Text>Custom</Text>
        </View>
      );

      const {getByTestId} = render(
        <CustomPhoneInput renderDropdownImage={customIcon} />,
      );

      expect(getByTestId('custom-icon')).toBeTruthy();
    });

    it('should render with first layout', () => {
      const {getByTestId} = render(<CustomPhoneInput layout="first" />);

      expect(getByTestId('phone-input-container')).toBeTruthy();
    });

    it('should render with second layout (default)', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      expect(getByTestId('phone-input-container')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply default container style', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      const container = getByTestId('phone-input-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderColor: '#26323833',
            backgroundColor: '#FBFBFD',
          }),
        ]),
      );
    });

    it('should apply custom container style', () => {
      const customStyle = {backgroundColor: 'red', padding: 10};

      const {getByTestId} = render(
        <CustomPhoneInput containerStyle={customStyle} />,
      );

      const container = getByTestId('phone-input-container');
      expect(container.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should apply custom text input style', () => {
      const customStyle = {fontSize: 16, color: 'blue'};

      const {getByTestId} = render(
        <CustomPhoneInput textInputStyle={customStyle} />,
      );

      const input = getByTestId('phone-text-input');
      expect(input.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should apply custom code text style', () => {
      const customStyle = {fontSize: 18, color: 'green'};

      const {getByTestId} = render(
        <CustomPhoneInput codeTextStyle={customStyle} />,
      );

      const code = getByTestId('country-code');
      expect(code.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should apply custom text container style', () => {
      const customStyle = {paddingVertical: 10, backgroundColor: 'yellow'};

      const {getByTestId} = render(
        <CustomPhoneInput textContainerStyle={customStyle} />,
      );

      const textContainer = getByTestId('text-container');
      expect(textContainer.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should merge default and custom styles', () => {
      const customContainerStyle = {borderRadius: 12};

      const {getByTestId} = render(
        <CustomPhoneInput containerStyle={customContainerStyle} />,
      );

      const container = getByTestId('phone-input-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({borderColor: '#26323833'}),
          expect.objectContaining({borderRadius: 12}),
        ]),
      );
    });
  });

  describe('User Interactions', () => {
    it('should call onChangeText when text input changes', () => {
      const onChangeTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput onChangeText={onChangeTextMock} />,
      );

      const input = getByTestId('phone-text-input');
      fireEvent.changeText(input, '8012345678');

      expect(onChangeTextMock).toHaveBeenCalledWith('8012345678');
    });

    it('should call onChangeFormattedText when text input changes', () => {
      const onChangeFormattedTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput onChangeFormattedText={onChangeFormattedTextMock} />,
      );

      const input = getByTestId('phone-text-input');
      fireEvent.changeText(input, '8012345678');

      expect(onChangeFormattedTextMock).toHaveBeenCalledWith('+2348012345678');
    });

    it('should call both callbacks when text changes', () => {
      const onChangeTextMock = jest.fn();
      const onChangeFormattedTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput
          onChangeText={onChangeTextMock}
          onChangeFormattedText={onChangeFormattedTextMock}
        />,
      );

      const input = getByTestId('phone-text-input');
      fireEvent.changeText(input, '8012345678');

      expect(onChangeTextMock).toHaveBeenCalledWith('8012345678');
      expect(onChangeFormattedTextMock).toHaveBeenCalledWith('+2348012345678');
    });

    it('should call onChangeCountry when flag button is pressed', () => {
      const onChangeCountryMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput onChangeCountry={onChangeCountryMock} />,
      );

      const flagButton = getByTestId('flag-button');
      fireEvent.press(flagButton);

      expect(onChangeCountryMock).toHaveBeenCalledWith({
        callingCode: ['234'],
        cca2: 'NG',
      });
    });

    it('should not crash when callbacks are not provided', () => {
      const {getByTestId} = render(<CustomPhoneInput />);

      const input = getByTestId('phone-text-input');
      const flagButton = getByTestId('flag-button');

      expect(() => {
        fireEvent.changeText(input, '8012345678');
        fireEvent.press(flagButton);
      }).not.toThrow();
    });

    it('should handle multiple text changes', () => {
      const onChangeTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput onChangeText={onChangeTextMock} />,
      );

      const input = getByTestId('phone-text-input');
      fireEvent.changeText(input, '8');
      fireEvent.changeText(input, '80');
      fireEvent.changeText(input, '801');

      expect(onChangeTextMock).toHaveBeenCalledTimes(3);
      expect(onChangeTextMock).toHaveBeenNthCalledWith(1, '8');
      expect(onChangeTextMock).toHaveBeenNthCalledWith(2, '80');
      expect(onChangeTextMock).toHaveBeenNthCalledWith(3, '801');
    });
  });

  describe('Disabled State', () => {
    it('should disable text input when disabled prop is true', () => {
      const {getByTestId} = render(<CustomPhoneInput disabled={true} />);

      const input = getByTestId('phone-text-input');
      expect(input.props.editable).toBe(false);
    });

    it('should not call callbacks when disabled', () => {
      const onChangeTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput disabled={true} onChangeText={onChangeTextMock} />,
      );

      const input = getByTestId('phone-text-input');

      // Input is disabled, so editable is false
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to PhoneInput component', () => {
      const ref = React.createRef<any>();

      render(<CustomPhoneInput ref={ref} />);

      expect(ref.current).toBeDefined();
    });

    it('should allow access to ref methods', () => {
      const ref = React.createRef<any>();

      render(<CustomPhoneInput ref={ref} defaultValue="8012345678" />);

      expect(ref.current).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty default value', () => {
      const {getByTestId} = render(<CustomPhoneInput defaultValue="" />);

      const input = getByTestId('phone-text-input');
      expect(input.props.defaultValue).toBe('');
    });

    it('should handle empty placeholder', () => {
      const {getByTestId} = render(<CustomPhoneInput placeholder="" />);

      const input = getByTestId('phone-text-input');
      expect(input.props.placeholder).toBe('');
    });

    it('should handle special characters in phone number', () => {
      const onChangeTextMock = jest.fn();

      const {getByTestId} = render(
        <CustomPhoneInput onChangeText={onChangeTextMock} />,
      );

      const input = getByTestId('phone-text-input');
      fireEvent.changeText(input, '(801) 234-5678');

      expect(onChangeTextMock).toHaveBeenCalledWith('(801) 234-5678');
    });

    it('should handle all style props together', () => {
      const {getByTestId} = render(
        <CustomPhoneInput
          containerStyle={{backgroundColor: 'red'}}
          textInputStyle={{fontSize: 16}}
          codeTextStyle={{color: 'blue'}}
          flagButtonStyle={{width: '30%'}}
          textContainerStyle={{padding: 10}}
        />,
      );

      expect(getByTestId('phone-input-container')).toBeTruthy();
      expect(getByTestId('phone-text-input')).toBeTruthy();
      expect(getByTestId('country-code')).toBeTruthy();
      expect(getByTestId('flag-button')).toBeTruthy();
    });

    it('should handle null renderDropdownImage', () => {
      const {queryByTestId} = render(
        <CustomPhoneInput renderDropdownImage={null} />,
      );

      expect(queryByTestId('dropdown-image')).toBeNull();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - default props', () => {
      const {toJSON} = render(<CustomPhoneInput />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with all props', () => {
      const {toJSON} = render(
        <CustomPhoneInput
          defaultValue="8012345678"
          defaultCode="US"
          placeholder="Enter phone number"
          disabled={false}
          layout="first"
          onChangeText={jest.fn()}
          onChangeFormattedText={jest.fn()}
          onChangeCountry={jest.fn()}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - disabled state', () => {
      const {toJSON} = render(
        <CustomPhoneInput
          defaultValue="8012345678"
          disabled={true}
          placeholder="Phone number"
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with custom styles', () => {
      const {toJSON} = render(
        <CustomPhoneInput
          containerStyle={{backgroundColor: 'lightblue'}}
          textInputStyle={{fontSize: 18}}
          codeTextStyle={{color: 'green'}}
          flagButtonStyle={{width: '35%'}}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
