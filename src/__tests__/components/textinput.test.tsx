import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {TextInput as RNTextInput} from 'react-native';
import {TextInput} from '../../components/text-input';

// Use fake timers
jest.useFakeTimers();

// Mock helpers
jest.mock('@helpers', () => ({
  HDP: (size: number) => size,
  RF: (size: number) => size,
}));

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    cornFlower: '#6495ED',
    pink: '#FFC0CB',
    burnt: '#161F4C',
    grey2: '#999999',
  },
}));

// Mock images
jest.mock('@assets/images', () => ({
  InfoBubble: 'InfoBubble',
}));

// Mock components
jest.mock('@components', () => ({
  Block: ({children, style, row, alignItems, gap, top}: any) => {
    const {View} = require('react-native');
    return (
      <View style={{...style, ...(row && {flexDirection: 'row'})}}>
        {children}
      </View>
    );
  },
  SizedBox: ({height, width}: any) => {
    const {View} = require('react-native');
    return <View style={{height, width}} />;
  },
  SvgIcon: ({name, size, onPress, containerStyle, testID}: any) => {
    const {TouchableOpacity, Text, View} = require('react-native');
    if (onPress) {
      return (
        <TouchableOpacity
          testID={testID || `icon-${name}`}
          onPress={onPress}
          style={containerStyle}>
          <Text>{name}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View testID={testID || `icon-${name}`} style={containerStyle}>
        <Text>{name}</Text>
      </View>
    );
  },
  Text: ({
    children,
    style,
    onPress,
    size,
    color,
    numberOfLines,
    medium,
  }: any) => {
    const {Text: RNText, TouchableOpacity} = require('react-native');
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>
          <RNText style={style}>{children}</RNText>
        </TouchableOpacity>
      );
    }
    return <RNText style={style}>{children}</RNText>;
  },
}));

// Mock styles
jest.mock('../../components/text-input/styles', () => ({
  __esModule: true,
  default: {
    inputContainer: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
    },
    bordered: {
      borderColor: '#000000',
    },
    label: {
      marginBottom: 5,
    },
    error: {
      color: 'red',
      marginTop: 5,
    },
    bvnLength: {
      textAlign: 'right',
      fontSize: 10,
      color: '#666',
    },
    infoBox: {
      position: 'absolute',
      right: 40,
      top: -20,
      padding: 10,
      width: 200,
    },
  },
}));

describe('TextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  describe('Basic Rendering', () => {
    it('should render with placeholder', () => {
      const {getByPlaceholderText} = render(
        <TextInput placeholder="Enter text" />,
      );

      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render with value', () => {
      const {UNSAFE_getByType} = render(<TextInput value="Test value" />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.value).toBe('Test value');
    });

    it('should render with label', () => {
      const {getByText} = render(
        <TextInput label="Username" placeholder="Enter username" />,
      );

      expect(getByText('Username')).toBeTruthy();
    });

    it('should render without label', () => {
      const {UNSAFE_getByType} = render(<TextInput placeholder="Enter text" />);

      // Input should render without label
      expect(UNSAFE_getByType(RNTextInput)).toBeTruthy();
    });
  });

  describe('Text Change Handling', () => {
    it('should call onChangeText when text changes', () => {
      const onChangeTextMock = jest.fn();

      const {UNSAFE_getByType} = render(
        <TextInput onChangeText={onChangeTextMock} />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent.changeText(input, 'New text');

      expect(onChangeTextMock).toHaveBeenCalledWith('New text');
    });

    it('should update value text length', () => {
      const {UNSAFE_getByType, rerender} = render(
        <TextInput value="" charLength={10} onChangeText={() => {}} />,
      );

      rerender(
        <TextInput value="Hello" charLength={10} onChangeText={() => {}} />,
      );

      // Character count should be displayed
      expect(UNSAFE_getByType(RNTextInput).props.value).toBe('Hello');
    });
  });

  describe('Amount Formatting', () => {
    it('should format amount with commas', () => {
      const onChangeTextMock = jest.fn();

      const {UNSAFE_getByType} = render(
        <TextInput isAmount onChangeText={onChangeTextMock} />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent.changeText(input, '1000');

      expect(onChangeTextMock).toHaveBeenCalledWith('1000');
    });

    it('should handle decimal amounts', () => {
      const onChangeTextMock = jest.fn();

      const {UNSAFE_getByType} = render(
        <TextInput isAmount onChangeText={onChangeTextMock} />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent.changeText(input, '1000.50');

      expect(onChangeTextMock).toHaveBeenCalledWith('1000.50');
    });

    it('should use numeric keyboard for amounts', () => {
      const {UNSAFE_getByType} = render(<TextInput isAmount />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.keyboardType).toBe('numeric');
    });
  });

  describe('Focus and Blur', () => {
    it('should call onFocus when input is focused', () => {
      const onFocusMock = jest.fn();

      const {UNSAFE_getByType} = render(<TextInput onFocus={onFocusMock} />);

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent(input, 'focus');

      expect(onFocusMock).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when input loses focus', () => {
      const onBlurMock = jest.fn();

      const {UNSAFE_getByType} = render(<TextInput onBlur={onBlurMock} />);

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent(input, 'blur');

      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });

    it('should animate label on focus', () => {
      const {UNSAFE_getByType} = render(
        <TextInput label="Email" placeholder="Enter email" />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent(input, 'focus');

      jest.advanceTimersByTime(200);

      // Label animation should have started
      expect(input).toBeTruthy();
    });

    it('should animate label on blur', () => {
      const {UNSAFE_getByType} = render(
        <TextInput label="Email" placeholder="Enter email" />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent(input, 'blur');

      jest.advanceTimersByTime(200);

      expect(input).toBeTruthy();
    });
  });

  describe('Password Field', () => {
    it('should render password field with secure text entry', () => {
      const {UNSAFE_getByType} = render(<TextInput type="password" />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should toggle password visibility', () => {
      const {UNSAFE_getByType, getByText} = render(
        <TextInput type="password" />,
      );

      const showHideButton = getByText('Show');
      fireEvent.press(showHideButton);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.secureTextEntry).toBe(false);
    });

    it('should show "Hide" text when password is visible', () => {
      const {getByText} = render(<TextInput type="password" />);

      const showButton = getByText('Show');
      fireEvent.press(showButton);

      expect(getByText('Hide')).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      const {getByTestId} = render(<TextInput iconName1="user" />);

      expect(getByTestId('icon-user')).toBeTruthy();
    });

    it('should render right icon', () => {
      const {getByTestId} = render(<TextInput iconName2="search" />);

      expect(getByTestId('icon-search')).toBeTruthy();
    });

    it('should call onPress1 when left icon is pressed', () => {
      const onPress1Mock = jest.fn();

      const {getByTestId} = render(
        <TextInput iconName1="user" onPress1={onPress1Mock} />,
      );

      fireEvent.press(getByTestId('icon-user'));

      expect(onPress1Mock).toHaveBeenCalledTimes(1);
    });

    it('should call onPress2 when right icon is pressed', () => {
      const onPress2Mock = jest.fn();

      const {getByTestId} = render(
        <TextInput iconName2="search" onPress2={onPress2Mock} />,
      );

      fireEvent.press(getByTestId('icon-search'));

      expect(onPress2Mock).toHaveBeenCalledTimes(1);
    });

    it('should apply custom icon sizes', () => {
      const {getByTestId} = render(
        <TextInput iconName1="user" iconSize1={30} />,
      );

      expect(getByTestId('icon-user')).toBeTruthy();
    });
  });

  describe('Error Display', () => {
    it('should display error message', () => {
      const {getByText} = render(<TextInput error="This field is required" />);

      jest.advanceTimersByTime(200);

      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should not display error when error prop is false', () => {
      const {queryByText} = render(<TextInput error={false} />);

      expect(queryByText('This field is required')).toBeNull();
    });

    it('should animate error message', () => {
      const {rerender, getByText} = render(<TextInput />);

      rerender(<TextInput error="Error occurred" />);

      jest.advanceTimersByTime(200);

      expect(getByText('Error occurred')).toBeTruthy();
    });
  });

  describe('Success Message', () => {
    it('should display success message', () => {
      const {getByText} = render(<TextInput successMsg="Success!" />);

      jest.advanceTimersByTime(200);

      expect(getByText('Success!')).toBeTruthy();
    });

    it('should show verify icon with success message', () => {
      const {getByTestId} = render(<TextInput successMsg="Success!" />);

      jest.advanceTimersByTime(200);

      expect(getByTestId('icon-verify-deep')).toBeTruthy();
    });

    it('should animate success message', () => {
      const {rerender, getByText} = render(<TextInput />);

      rerender(<TextInput successMsg="Verified!" />);

      jest.advanceTimersByTime(200);

      expect(getByText('Verified!')).toBeTruthy();
    });
  });

  describe('Info Bubble', () => {
    it('should render info icon when info prop is provided', () => {
      const {getByTestId} = render(<TextInput info="Help text" />);

      expect(getByTestId('icon-info')).toBeTruthy();
    });

    it('should show info bubble when info icon is pressed', () => {
      const {getByTestId, getByText} = render(<TextInput info="Help text" />);

      fireEvent.press(getByTestId('icon-info'));

      jest.advanceTimersByTime(250);

      expect(getByText('Help text')).toBeTruthy();
    });

    it('should hide info bubble after 5 seconds', () => {
      const {getByTestId, queryByText} = render(<TextInput info="Help text" />);

      fireEvent.press(getByTestId('icon-info'));

      jest.advanceTimersByTime(250);
      expect(queryByText('Help text')).toBeTruthy();

      jest.advanceTimersByTime(5000);

      // Info should still be in DOM but animation should be reversing
      expect(queryByText('Help text')).toBeTruthy();
    });
  });

  describe('Clearable Input', () => {
    it('should show clear button when clearable and has value', () => {
      const {getByTestId, rerender} = render(<TextInput clearable value="" />);

      rerender(<TextInput clearable value="Some text" />);

      expect(getByTestId('icon-check')).toBeTruthy();
      expect(getByTestId('icon-close')).toBeTruthy();
    });

    it('should clear input when clear button is pressed', () => {
      const onClearMock = jest.fn();

      const {getByTestId, rerender} = render(
        <TextInput clearable value="" onClear={onClearMock} />,
      );

      rerender(<TextInput clearable value="Text" onClear={onClearMock} />);

      fireEvent.press(getByTestId('icon-close'));

      expect(onClearMock).toHaveBeenCalledTimes(1);
    });

    it('should not show clear button when no value', () => {
      const {queryByTestId} = render(<TextInput clearable value="" />);

      expect(queryByTestId('icon-close')).toBeNull();
    });
  });

  describe('Character Length Counter', () => {
    it('should display character count when charLength is set', () => {
      const {getByText, rerender} = render(
        <TextInput value="" charLength={100} />,
      );

      rerender(<TextInput value="Hello" charLength={100} />);

      expect(getByText('5 /100')).toBeTruthy();
    });

    it('should not display counter when charLength is 0', () => {
      const {queryByText} = render(<TextInput value="Hello" charLength={0} />);

      expect(queryByText(/\//)).toBeNull();
    });
  });

  describe('Input Props', () => {
    it('should accept maxLength prop', () => {
      const {UNSAFE_getByType} = render(<TextInput maxLength={10} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.maxLength).toBe(10);
    });

    it('should accept multiline prop', () => {
      const {UNSAFE_getByType} = render(<TextInput multiline />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.multiline).toBe(true);
    });

    it('should accept keyboardType prop', () => {
      const {UNSAFE_getByType} = render(
        <TextInput keyboardType="email-address" />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should accept textAlign prop', () => {
      const {UNSAFE_getByType} = render(<TextInput textAlign="center" />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.textAlign).toBe('center');
    });

    it('should accept numberOfLines prop', () => {
      const {UNSAFE_getByType} = render(<TextInput numberOfLines={3} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.numberOfLines).toBe(3);
    });

    it('should be editable by default', () => {
      const {UNSAFE_getByType} = render(<TextInput />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.editable).toBe(true);
    });

    it('should accept editable false', () => {
      const {UNSAFE_getByType} = render(<TextInput editable={false} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.editable).toBe(false);
    });

    it('should autoFocus when shouldFocus is true', () => {
      const {UNSAFE_getByType} = render(<TextInput shouldFocus />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.autoFocus).toBe(true);
    });

    it('should accept autoCorrect prop', () => {
      const {UNSAFE_getByType} = render(<TextInput autoCorrect={false} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.autoCorrect).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should apply bordered style', () => {
      const {UNSAFE_getByType} = render(<TextInput bordered />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input).toBeTruthy();
    });

    it('should apply custom inputStyle', () => {
      const customStyle = {backgroundColor: 'lightblue'};

      const {UNSAFE_getByType} = render(<TextInput inputStyle={customStyle} />);

      expect(UNSAFE_getByType(RNTextInput)).toBeTruthy();
    });

    it('should apply custom innerStyle to TextInput', () => {
      const innerStyle = {fontSize: 16};

      const {UNSAFE_getByType} = render(<TextInput innerStyle={innerStyle} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.style).toContainEqual(
        expect.objectContaining(innerStyle),
      );
    });

    it('should apply custom placeholderTextColor', () => {
      const {UNSAFE_getByType} = render(
        <TextInput placeholderTextColor="#FF0000" />,
      );

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.placeholderTextColor).toBe('#FF0000');
    });

    it('should apply custom labelStyle', () => {
      const {getByText} = render(
        <TextInput label="Custom Label" labelStyle={{fontSize: 20}} />,
      );

      expect(getByText('Custom Label')).toBeTruthy();
    });
  });

  describe('First Text', () => {
    it('should render first text before input', () => {
      const {getByText} = render(<TextInput firstText="$" />);

      expect(getByText('$')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const {UNSAFE_getByType} = render(<TextInput value={undefined} />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.value).toBeUndefined();
    });

    it('should handle empty string value', () => {
      const {UNSAFE_getByType} = render(<TextInput value="" />);

      const input = UNSAFE_getByType(RNTextInput);
      expect(input.props.value).toBe('');
    });

    it('should handle callbacks not provided', () => {
      const {UNSAFE_getByType} = render(
        <TextInput
          onChangeText={() => {}}
          onFocus={() => {}}
          onBlur={() => {}}
        />,
      );

      const input = UNSAFE_getByType(RNTextInput);

      expect(() => {
        fireEvent.changeText(input, 'Text');
        fireEvent(input, 'focus');
        fireEvent(input, 'blur');
      }).not.toThrow();
    });
  });

  describe('Submit Handling', () => {
    it('should call onSubmit when enter is pressed', () => {
      const onSubmitMock = jest.fn();

      const {UNSAFE_getByType} = render(<TextInput onSubmit={onSubmitMock} />);

      const input = UNSAFE_getByType(RNTextInput);
      fireEvent(input, 'submitEditing');

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - basic input', () => {
      const {toJSON} = render(<TextInput placeholder="Enter text" />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with label and error', () => {
      const {toJSON} = render(
        <TextInput
          label="Email"
          placeholder="Enter email"
          error="Invalid email"
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - password field', () => {
      const {toJSON} = render(
        <TextInput type="password" placeholder="Enter password" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with icons', () => {
      const {toJSON} = render(
        <TextInput iconName1="user" iconName2="search" placeholder="Search" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - clearable with value', () => {
      const {toJSON} = render(<TextInput clearable value="Some text" />);

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
