/* eslint-disable react-native/no-inline-styles */
import {Block, SvgIcon} from '@components';
import {Text} from '@components/text';
import {
  formatAmountInCurrency,
  MAX_AMOUNT_LENGTH_CURRENCY_SECTION,
  RS,
  trimNumber,
} from '@helpers';
import {family, palette} from '@theme';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface CurrencySectionProps extends TextInputProps {
  title?: string;
  amount?: string;
  error?: string;
  onChangeAmount?: (amount: string) => void;
  isEditable?: boolean;
  currency?: string;
}

const CurrencySection: React.FC<CurrencySectionProps> = ({
  title = 'Enter the amount',
  amount = '',
  error = '',
  onChangeAmount,
  isEditable = true,
  currency = '₦',
  autoFocus = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(amount);
  const [rawValue, setRawValue] = useState(amount);

  useEffect(() => {
    if (amount !== rawValue) {
      setRawValue(amount);
    }
  }, [amount]);

  // Sync local inputValue with prop amount when it changes externally
  React.useEffect(() => {
    setInputValue(amount);
  }, [amount]);

  const onChangeText = useCallback(
    (text: string) => {
      const cleanedText = trimNumber(text);
      setRawValue(cleanedText);
      onChangeAmount?.(cleanedText); // Send raw value
    },
    [onChangeAmount],
  );

  const onBlur = useCallback(() => {
    if (!rawValue) {
      return Keyboard.dismiss();
    }

    const numericValue = Number(rawValue.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericValue)) {
      const formatted = formatAmountInCurrency(numericValue);
      setRawValue(formatted); // show formatted value
      const cleanedFormatted = formatted.replace(/[^0-9.]/g, '');
      onChangeAmount?.(cleanedFormatted); // Send cleaned raw
    }
    Keyboard.dismiss();
  }, [rawValue, onChangeAmount]);

  return (
    <View style={styles.amountContainerStyle}>
      {title ? (
        <Text color={'#1D2667'} style={{marginBottom: RS(10)}} center size={14}>
          {title}
        </Text>
      ) : null}
      <Block row gap={inputValue?.length ? 10 : 0} align="flex-end">
        <Text color="#0F1545" size={32} fontFamily={family.Light}>
          {currency}
        </Text>
        <TextInput
          value={rawValue}
          style={[
            styles.amountInputTextStyle,
            !inputValue?.length && styles.emptyInputFieldStyle,
          ]}
          placeholderTextColor={palette.grey}
          underlineColorAndroid="transparent"
          placeholder="0.00"
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          onBlur={onBlur}
          editable={isEditable}
          maxLength={MAX_AMOUNT_LENGTH_CURRENCY_SECTION}
          {...props}
          autoFocus={autoFocus}
          selectionColor={palette.green}
          caretHidden
          // textAlign="left"
        />
      </Block>

      {error?.length > 0 && (
        <Block align="center" row gap={4}>
          <SvgIcon name="error-circle" size={20} />
          <Text color="#66191D" size={14}>
            {error}
          </Text>
        </Block>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  amountContainerStyle: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'red',
  },
  amountInputTextStyle: {
    fontSize: 48,
    textAlign: 'center',
    fontFamily: family.Medium,
    padding: 0,
    margin: 0,
    height: 50,
    color: '#0F1545',
  },
  emptyInputFieldStyle: {
    width: 150,
    marginLeft: -10,
  },
});

export default CurrencySection;
