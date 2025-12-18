/**
 * CartItem Component
 *
 * Displays a single cart item with:
 * - Product info (name, price, quantity)
 * - Real-time countdown timer
 * - Remove button
 * - Quantity controls
 *
 * Handles expired state with visual feedback
 */

import React, {useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import {Text} from '@components/text';
import {Block} from '@components/block';
import {CountdownTimer} from '@components/countdown-timer';
import {RS} from '@helpers';
import {palette, family} from '@theme';
import {CartItem as CartItemType, ReservationTimeInfo} from '@types';
import {useAppDispatch} from '../../store';
import {removeFromCart, updateQuantity} from '@slices/cart';

interface CartItemProps {
  item: CartItemType;
  timeInfo: ReservationTimeInfo;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  timeInfo,
}) => {
  const dispatch = useAppDispatch();
  const {product, quantity, isExpired} = item;

  const handleRemove = useCallback(() => {
    dispatch(removeFromCart({cartItemId: item.id}));
  }, [dispatch, item.id]);

  const handleIncrement = useCallback(() => {
    if (!isExpired) {
      dispatch(updateQuantity({cartItemId: item.id, quantity: quantity + 1}));
    }
  }, [dispatch, item.id, quantity, isExpired]);

  const handleDecrement = useCallback(() => {
    if (!isExpired && quantity > 1) {
      dispatch(updateQuantity({cartItemId: item.id, quantity: quantity - 1}));
    }
  }, [dispatch, item.id, quantity, isExpired]);

  // Animated style for expired state
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isExpired ? 0.5 : 1, {duration: 300}),
  }));

  return (
    <Animated.View
      style={[styles.container, containerAnimatedStyle]}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}>
      {/* Product Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text size={24} color={palette.grey}>
            {product.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text
            size={16}
            fontFamily={family.Medium}
            color={palette.shaft}
            numberOfLines={1}
            style={styles.productName}>
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text size={18} color={palette.grey}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        <Text size={14} color={palette.cornFlower} fontFamily={family.SemiBold}>
          ${product.price.toFixed(2)}
        </Text>

        {/* Limited Stock Badge */}
        {product.isLimitedStock && (
          <View style={styles.limitedBadge}>
            <Text size={10} color={palette.red}>
              Limited Stock
            </Text>
          </View>
        )}

        {/* Quantity Controls & Timer Row */}
        <View style={styles.bottomRow}>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={isExpired || quantity <= 1}
              style={[
                styles.quantityButton,
                (isExpired || quantity <= 1) && styles.quantityButtonDisabled,
              ]}>
              <Text size={16} color={palette.shaft}>
                −
              </Text>
            </TouchableOpacity>
            <Text
              size={14}
              fontFamily={family.Medium}
              color={palette.shaft}
              style={styles.quantityText}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={handleIncrement}
              disabled={isExpired}
              style={[
                styles.quantityButton,
                isExpired && styles.quantityButtonDisabled,
              ]}>
              <Text size={16} color={palette.shaft}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Countdown Timer */}
          <CountdownTimer timeInfo={timeInfo} size="small" showLabel={false} />
        </View>

        {/* Expired Message */}
        {isExpired && (
          <View style={styles.expiredMessage}>
            <Text size={12} color={palette.red}>
              Reservation expired - Item will be removed
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.white,
    borderRadius: RS(12),
    padding: RS(12),
    marginHorizontal: RS(16),
    marginVertical: RS(6),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    marginRight: RS(12),
  },
  imagePlaceholder: {
    width: RS(80),
    height: RS(80),
    borderRadius: RS(8),
    backgroundColor: palette.concrete,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: RS(4),
  },
  productName: {
    flex: 1,
    marginRight: RS(8),
  },
  removeButton: {
    padding: RS(4),
  },
  limitedBadge: {
    backgroundColor: `${palette.red}15`,
    paddingHorizontal: RS(6),
    paddingVertical: RS(2),
    borderRadius: RS(4),
    alignSelf: 'flex-start',
    marginTop: RS(4),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RS(8),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.concrete,
    borderRadius: RS(8),
    padding: RS(4),
  },
  quantityButton: {
    width: RS(28),
    height: RS(28),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RS(6),
    backgroundColor: palette.white,
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantityText: {
    minWidth: RS(24),
    textAlign: 'center',
    marginHorizontal: RS(8),
  },
  expiredMessage: {
    marginTop: RS(8),
    padding: RS(8),
    backgroundColor: `${palette.red}10`,
    borderRadius: RS(6),
  },
});
