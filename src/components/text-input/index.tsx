/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {Block, SizedBox, SvgIcon, Text} from '@components';
// import {SvgIcon} from '@components/svg-icon';
import {InfoBubble} from '@assets/images';
import {RF, RS} from '@helpers';
import {family, palette} from '@theme';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, ImageBackground, TextInput as TN, View} from 'react-native';
import style from './styles';

interface Props {
  padding?: number;
  onSubmit?: () => void;
  // onPress?: () => void;
  onFocus?: () => void;
  onBlur?: (text?: string) => void;
  onChangeText?: any;
  onClear?: any;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  value?: any;
  containerStyle?: any;
  inputStyle?: any;
  marginTop?: number;
  textAlign?: 'left' | 'right' | 'center';
  error?: string | boolean;
  editable?: boolean;
  maxLength?: number;
  placeholder?: any;
  inputErrMsg?: any;
  charLength?: any;
  multiline?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  textPaddingVertical?: number;
  bottomTitle?: string;
  rightIcon?: string;
  shouldFocus?: boolean;
  onTouchStart?: () => void;
  [x: string]: any;
  lessMargin?: boolean;
  isError?: boolean;
  label?: string;
  info?: string;
  type?: 'password' | 'text';
  iconName1?: string;
  iconName2?: string;
  iconSize1?: number;
  iconSize2?: number;
  onPress1?: any;
  onPress2?: any;
  placeholderTextColor?: string;
  numberOfLines?: number;
  innerStyle?: any;
  bordered?: boolean;
  white?: boolean;
  autoCorrect?: boolean;
  labelStyle?: any;
  firstText?: any;
  isAmount?: boolean;
  clearable?: boolean;
  successMsg?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  customFormat?: boolean;
  rightContent?: any;
}
export const TextInput: FC<Props> = ({
  inputStyle,
  placeholder,
  placeholderTextColor = '#B9BCC9',
  keyboardType,
  onSubmit,
  onFocus,
  onBlur,
  editable = true,
  textAlign,
  textAlignVertical,
  multiline,
  refValue,
  value,
  maxLength,
  type,
  label,
  info,
  charLength = 0,
  onChangeText,
  iconName1,
  iconName2,
  isAmount,
  iconSize1,
  iconSize2,
  onPress1,
  onPress2,
  numberOfLines,
  innerStyle,
  bordered,
  shouldFocus,
  autoCorrect,
  white,
  error,
  labelStyle,
  firstText,
  clearable,
  onClear,
  successMsg,
  autoCapitalize = 'none',
  customFormat = false,
  rightContent,
}) => {
  const [focused, setFocused] = useState(false);
  const [valueText, setValueText] = useState(0);
  const [secure, setSecure] = useState(type === 'password' ? true : false);
  const [formattedValue, setFormattedValue] = useState(value);
  const [showInfo, setShowInfo] = useState(false);
  const labelAnim = useRef(
    new Animated.Value(value || formattedValue ? 1 : 0),
  ).current;
  const infoAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const shouldShowLabel = focused || value || formattedValue;

  useEffect(() => {
    if (value) {
      setValueText(value.length);
    }
  }, [value]);

  useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [error]);

  useEffect(() => {
    Animated.timing(successAnim, {
      toValue: successMsg ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [successMsg]);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: shouldShowLabel ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [shouldShowLabel]);

  const handleTextChange = inputText => {
    if (customFormat) {
      // Skip internal formatting when customFormat is true
      onChangeText(inputText);
      return;
    }

    if (isAmount) {
      const numericText = inputText.replace(/[^0-9.]/g, '');
      const parts = numericText.split('.');
      if (parts?.length > 1) {
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedText = `${integerPart}.${parts[1]}`;
        setFormattedValue(formattedText);
        onChangeText(inputText);
      } else {
        const formattedText = numericText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setFormattedValue(formattedText);
        onChangeText(inputText);
      }
    } else {
      setFormattedValue(inputText);
      onChangeText(inputText);
    }
  };

  const labelAnimStyle = {
    opacity: labelAnim,
    transform: [
      {
        translateY: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View>
      <View
        style={[
          style.inputContainer,
          inputStyle,
          bordered && style.bordered,
          focused && {borderColor: palette.cornFlower},
          !editable && {backgroundColor: palette.disabled},
        ]}>
        {label && (
          <Animated.View
            style={[
              style.labelAbsolute,
              labelAnimStyle,
              {
                pointerEvents: shouldShowLabel ? 'auto' : 'none',
                width: '50%',
              },
            ]}>
            <Text
              textTransform="uppercase"
              medium
              size={10}
              opacity={!editable ? 0.3 : undefined}
              style={[labelStyle, {color: palette.burnt}]}>
              {label}
            </Text>
          </Animated.View>
        )}

        <Block align="center" row>
          {iconName1 ? (
            <SvgIcon
              name={iconName1}
              size={iconSize1 || 20}
              onPress={onPress1}
              containerStyle={{marginLeft: RS(25)}}
            />
          ) : (
            <View
              style={{
                marginRight: RS(8),
              }}
            />
          )}
          {firstText ? (
            <Text
              style={[
                {
                  color: bordered ? '#fff' : '#082932',
                  fontSize: RF(14),
                  paddingLeft: RS(10),
                },
              ]}>
              {firstText}
            </Text>
          ) : null}
          <TN
            allowFontScaling={false}
            placeholder={placeholder}
            style={[
              {
                paddingLeft: RS(16),
                flex: 1,
                color: palette.burnt,
                opacity: editable ? undefined : 0.3,
                fontSize: RF(14),
                fontFamily: family.Medium,
              },
              innerStyle,
            ]}
            placeholderTextColor={bordered ? '#EAFFD270' : placeholderTextColor}
            onFocus={() => {
              setFocused(true);
              onFocus && onFocus();
            }}
            onBlur={() => {
              setFocused(false);
              onBlur && onBlur();
            }}
            maxLength={maxLength}
            editable={editable}
            secureTextEntry={secure}
            textAlign={textAlign}
            textAlignVertical={textAlignVertical || 'top'}
            multiline={multiline}
            onSubmitEditing={onSubmit}
            ref={refValue}
            onChangeText={text => {
              onChangeText && onChangeText(text);
              handleTextChange(text);
            }}
            value={
              customFormat
                ? value
                : !formattedValue?.length
                ? value
                : formattedValue
            }
            keyboardType={isAmount ? 'numeric' : keyboardType}
            autoCapitalize={autoCapitalize}
            numberOfLines={numberOfLines}
            autoFocus={shouldFocus}
            autoCorrect={autoCorrect}
          />
          {iconName2 ? (
            <SvgIcon
              name={iconName2}
              size={iconSize2 || 20}
              onPress={onPress2}
              containerStyle={{marginRight: RS(12.5)}}
            />
          ) : null}
          {clearable && valueText > 0 ? (
            <>
              <SvgIcon name="check" size={iconSize2 || 16} />
              <SizedBox width={12} />
              <SvgIcon
                name="close"
                size={16}
                onPress={() => {
                  onClear();
                  setFormattedValue('');
                  setValueText(0);
                }}
              />
            </>
          ) : null}
          {type === 'password' && (
            <Text
              onPress={() => setSecure(!secure)}
              style={{
                color: '#5D0084',
                fontSize: RF(10),
                paddingHorizontal: RS(10),
                alignSelf: 'center',
              }}>
              {secure ? 'Show' : 'Hide'}
            </Text>
          )}

          {rightContent ? rightContent : null}

          {info ? (
            <Block>
              <SvgIcon
                name="info"
                size={15}
                containerStyle={{
                  marginRight: 24,
                }}
                onPress={() => {
                  const next = !showInfo;
                  setShowInfo(next);
                  Animated.timing(infoAnim, {
                    toValue: next ? 1 : 0,
                    duration: 250,
                    useNativeDriver: true,
                  }).start();

                  if (next) {
                    setTimeout(() => {
                      setShowInfo(false);
                      Animated.timing(infoAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                      }).start();
                    }, 5000);
                  }
                }}
              />
              <Animated.View
                style={{
                  opacity: infoAnim,
                  transform: [
                    {
                      scale: infoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                }}>
                {showInfo && (
                  <ImageBackground source={InfoBubble} style={style.infoBox}>
                    <Text color={palette.grey2} size={11} numberOfLines={2}>
                      {info}
                    </Text>
                  </ImageBackground>
                )}
              </Animated.View>
            </Block>
          ) : null}
        </Block>
      </View>
      <Animated.View
        style={{
          opacity: successAnim,
          transform: [
            {
              translateY: successAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        }}>
        {successMsg ? (
          <Block top={8} row alignItems="center" gap={5}>
            <SvgIcon name="verify-deep" size={20} />
            <Text color="#195742">{successMsg}</Text>
          </Block>
        ) : null}
      </Animated.View>

      {charLength > 0 ? (
        <Text style={[style.bvnLength]}>
          {valueText} /{charLength}
        </Text>
      ) : null}
      <Animated.View
        style={{
          opacity: errorAnim,
          transform: [
            {
              translateY: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-5, 0],
              }),
            },
          ],
        }}>
        {error ? (
          <>
            <Text size={10} style={[style.error]}>
              {error}
            </Text>
            <SizedBox height={16} />
          </>
        ) : (
          <SizedBox height={10} />
        )}
      </Animated.View>
    </View>
  );
};
