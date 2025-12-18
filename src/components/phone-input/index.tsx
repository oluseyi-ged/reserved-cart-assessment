import {Block} from '@components/block';
import {SvgIcon} from '@components/svg-icon';
import {Text} from '@components/text';
import {RF, RH} from '@helpers';
import {family, palette} from '@theme';
import React, {forwardRef} from 'react';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

interface CustomPhoneInputProps {
  defaultValue?: string;
  defaultCode?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  codeTextStyle?: TextStyle;
  flagButtonStyle?: ViewStyle;
  textContainerStyle?: ViewStyle;
  renderDropdownImage?: React.ReactNode;
  onChangeFormattedText?: (text: string) => void;
  onChangeText?: (text: string) => void;
  onChangeCountry?: (country: any) => void;
  disabled?: boolean;
  layout?: 'first' | 'second';
  textInputProps?: any;
  maxLength?: number;
}

export const CustomPhoneInput = forwardRef<PhoneInput, CustomPhoneInputProps>(
  (props, ref) => {
    const {
      defaultValue = '',
      defaultCode = 'NG',
      placeholder = '',
      containerStyle,
      textInputStyle,
      codeTextStyle,
      flagButtonStyle,
      textContainerStyle,
      renderDropdownImage = <SvgIcon name="caret-down" size={22} />,
      onChangeFormattedText,
      onChangeText,
      onChangeCountry,
      disabled = false,
      layout = 'second',
      textInputProps,
      maxLength,
    } = props;

    return (
      <Block>
        <Text
          size={10}
          medium
          position="absolute"
          left={27}
          top={4.16}
          style={{
            zIndex: 9999,
          }}>
          {'PHONE NUMBER'}
        </Text>
        <PhoneInput
          ref={ref}
          defaultValue={defaultValue}
          // @ts-ignore
          defaultCode={defaultCode}
          layout={layout}
          placeholder={placeholder}
          disabled={disabled}
          renderDropdownImage={renderDropdownImage}
          flagButtonStyle={[styles.flagButtonStyle, flagButtonStyle]}
          containerStyle={[styles.containerStyle, containerStyle]}
          codeTextStyle={[styles.codeTextStyle, codeTextStyle]}
          textInputStyle={[styles.textInputStyle, textInputStyle]}
          textContainerStyle={[styles.textContainerStyle, textContainerStyle]}
          onChangeFormattedText={onChangeFormattedText}
          onChangeText={onChangeText}
          onChangeCountry={onChangeCountry}
          textInputProps={{
            placeholderTextColor: palette.placeholder,
            maxLength,
            ...textInputProps,
          }}
        />
      </Block>
    );
  },
);

const styles = StyleSheet.create({
  containerStyle: {
    borderColor: '#26323833',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    height: RH(68),
    paddingVertical: 0,
    width: '100%',
    backgroundColor: '#FBFBFD',
  },
  flagButtonStyle: {
    width: '40%',
  },
  codeTextStyle: {
    fontSize: RF(14),
    fontFamily: family.Medium,
    color: '#161F4CCC',
  },
  textInputStyle: {
    fontSize: RF(12),
    fontFamily: family.Medium,
    color: '#161F4C',
    letterSpacing: 2,
  },
  textContainerStyle: {
    paddingVertical: 0,
  },
});
