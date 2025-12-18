import {Block, SizedBox, SvgIcon, Text} from '@components';
import {RF, SCREEN_HEIGHT} from '@helpers';
import {family, palette} from '@theme';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {SelectList} from 'react-native-select-bottom-list';
import style from './styles';

interface SelectItem {
  name: string;
  value: string;
  logo?: string;
  bankName?: string;
  account?: string;
  icon?: any;
  active?: string;
}

interface SelectProps {
  placeholder?: string;
  editable?: boolean;
  value?: string | string[];
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  white?: boolean;
  error?: string;
  data?: SelectItem[];
  onSelect?: (item: SelectItem | SelectItem[]) => void;
  activeTextStyle?: StyleProp<TextStyle>;
  searchPlaceholder?: string;
  headerTitle?: string;
  showSearch?: boolean;
  iconName?: string;
  multiple?: boolean;
  containerStyle?: ViewStyle;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const Select: FC<SelectProps> = ({
  placeholder = 'Select item',
  editable = true,
  value,
  label,
  labelStyle,
  white,
  error,
  data = [],
  onSelect,
  activeTextStyle,
  searchPlaceholder = 'Search',
  showSearch,
  headerTitle,
  iconName,
  multiple = false,
  containerStyle,
}) => {
  const [selectedValue, setSelectedValue] = useState<any>(value);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setSelectedValue(value);
    // Animate label when value changes
    const hasValue = multiple
      ? Array.isArray(value) && value.length > 0
      : !!value;
    if (hasValue) {
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value, multiple]);

  const handleSelect = (item: SelectItem | SelectItem[], index?: number) => {
    if (multiple && Array.isArray(item)) {
      // Multiple selection mode - item is an array of SelectItem objects
      const names = item.map(i => i.name);
      setSelectedValue(names);
      Animated.timing(labelAnim, {
        toValue: names.length > 0 ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      if (onSelect) {
        requestAnimationFrame(() => onSelect(item));
      }
    } else if (!multiple && typeof item === 'object') {
      // Single selection mode - item is a SelectItem object
      setSelectedValue(item?.name);
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      if (onSelect) {
        requestAnimationFrame(() => onSelect(item));
      }
    }
  };

  const getDisplayValue = () => {
    if (multiple && Array.isArray(selectedValue)) {
      if (selectedValue.length === 0) return placeholder;
      // Return comma-separated list for multiple selections with capitalization
      return selectedValue.map(val => capitalizeWords(val)).join(', ');
    }
    // Capitalize single selection display
    return selectedValue ? capitalizeWords(selectedValue) : placeholder;
  };

  // Get the selected item to access its icon
  const getSelectedItem = () => {
    if (multiple || !selectedValue || Array.isArray(selectedValue)) {
      return null;
    }
    return data.find(item => item.name === selectedValue);
  };

  const selectedItem = getSelectedItem();

  // Get selected values for multiple mode
  const selectedValuesForList =
    multiple && Array.isArray(selectedValue)
      ? selectedValue.map(val => data.find(d => d.name === val)).filter(Boolean)
      : [];

  // Determine what icon to show
  const renderIcon = () => {
    // Priority: selected item's icon > iconName prop
    if (selectedItem?.icon) {
      // Render icon (could be string URL, component, or factory function)
      if (typeof selectedItem.icon === 'string') {
        return (
          <Image
            source={{uri: selectedItem.icon}}
            style={{width: 24, height: 24, resizeMode: 'contain'}}
          />
        );
      }
      if (typeof selectedItem.icon === 'function') {
        return selectedItem.icon(); // Call the factory function
      }
      return selectedItem.icon;
    }

    if (iconName) {
      // Fallback to iconName prop
      return <SvgIcon name={iconName} size={24} />;
    }

    return null;
  };

  const iconElement = renderIcon();

  // Calculate dynamic height based on content
  // Each item is ~60px, header ~80px, search ~60px (if shown), padding ~40px
  const calculateListHeight = useMemo(() => {
    const ITEM_HEIGHT = 60;
    const HEADER_HEIGHT = 80;
    const SEARCH_HEIGHT = showSearch ? 70 : 0;
    const PADDING = 40;
    const DONE_BUTTON_HEIGHT = multiple ? 80 : 0;
    const MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
    const MIN_HEIGHT = 200;

    const contentHeight =
      HEADER_HEIGHT +
      SEARCH_HEIGHT +
      data.length * ITEM_HEIGHT +
      PADDING +
      DONE_BUTTON_HEIGHT;

    return Math.min(Math.max(contentHeight, MIN_HEIGHT), MAX_HEIGHT);
  }, [data.length, showSearch, multiple]);

  return (
    <View>
      <Block
        radius={8}
        style={[
          style.selectContainer,
          !editable && {
            backgroundColor: '#EFEFEF',
          },
          containerStyle,
        ]}>
        {selectedValue &&
        label &&
        (multiple
          ? Array.isArray(selectedValue) && selectedValue.length > 0
          : true) ? (
          <Animated.View
            style={[
              style.label,
              {
                opacity: labelAnim,
                transform: [
                  {
                    translateY: labelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text
              textTransform="uppercase"
              medium
              size={10}
              numberOfLines={1}
              style={[labelStyle, {color: palette.burnt, width: '50%'}]}>
              {label}
            </Text>
          </Animated.View>
        ) : null}
        <Block
          style={
            selectedValue &&
            label &&
            (multiple
              ? Array.isArray(selectedValue) && selectedValue.length > 0
              : true)
              ? {
                  height: 45,
                  marginTop: -5,
                }
              : null
          }
          row
          justify="space-between"
          alignItems="center">
          <SelectList
            disabled={!editable}
            style={style.selectPressable}
            placeHolder={placeholder}
            searchPlaceholder={searchPlaceholder}
            // @ts-ignore
            onSelect={handleSelect}
            value={getDisplayValue()}
            textStyle={[
              style.selectText,
              {
                color: (
                  multiple
                    ? Array.isArray(selectedValue) &&
                      selectedValue.length > 0
                    : selectedValue
                )
                  ? palette.shaft2
                  : palette.placeholder,
              },
            ]}
            headerTextStyle={{
              fontFamily: family.Medium,
              fontSize: RF(20),
            }}
            itemTextStyle={{fontFamily: family.Regular, fontSize: RF(14)}}
            listHeight={calculateListHeight}
            multiple={multiple}
            selectedValues={selectedValuesForList}
            showSearch={showSearch}
            data={data}
            itemValueKey="name"
            headerTitle={headerTitle}
          />
          <View pointerEvents="none" style={{position: 'absolute', right: 0}}>
            <SvgIcon name="caret-down" size={22} />
          </View>
        </Block>
      </Block>
      {error ? (
        <>
          <Text style={style.error}>{error}</Text>
          <SizedBox height={10} />
        </>
      ) : (
        <SizedBox height={10} />
      )}
    </View>
  );
};
