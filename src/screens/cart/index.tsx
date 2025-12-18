/**
 * Cart Screen
 *
 * Displays all cart items with real-time countdown timers.
 * Handles expired items with animations and user feedback.
 *
 * Key Features:
 * - Real-time countdown for each item
 * - Visual feedback when items are expiring (< 1 minute)
 * - Automatic removal of expired items with animation
 * - Pull-to-refresh to sync timers
 */

import React, {useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Block, Text, Button, CartItemComponent} from '@components';
import {RS} from '@helpers';
import {palette, family} from '@theme';
import {CartItem} from '@types';
import {useAppSelector, useAppDispatch} from '../../store';
import {
  selectCartItems,
  selectExpiredItems,
  selectCartTotal,
  removeExpiredItems,
} from '@slices/cart';
import {useReservationTimers} from '@hooks/useReservationTimers';
import {useTimeSync} from '@hooks/useTimeSync';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  // Time sync hook
  const {syncNow} = useTimeSync();

  // Get cart data from Redux
  const cartItems = useAppSelector(selectCartItems);
  const expiredItems = useAppSelector(selectExpiredItems);
  const cartTotal = useAppSelector(selectCartTotal);

  // Timer management hook
  const {timers, isAnyExpiring, expiredItemIds, refreshTimers} =
    useReservationTimers();

  // Handle expired items
  useEffect(() => {
    if (expiredItems.length > 0) {
      Alert.alert(
        'Items Expired',
        `${expiredItems.length} item(s) have expired and will be removed from your cart.`,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(removeExpiredItems());
            },
          },
        ],
      );
    }
  }, [expiredItems.length, dispatch]);

  const handleRefresh = useCallback(async () => {
    await syncNow();
    refreshTimers();
  }, [syncNow, refreshTimers]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checkout.');
      return;
    }

    Alert.alert(
      'Checkout',
      `Total: $${cartTotal.toFixed(2)}\n\nThis is a demo - checkout not implemented.`,
    );
  }, [cartItems.length, cartTotal]);

  const handleContinueShopping = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: CartItem}) => {
      const timeInfo = timers[item.id];
      if (!timeInfo) return null;

      return <CartItemComponent item={item} timeInfo={timeInfo} />;
    },
    [timers],
  );

  const keyExtractor = useCallback((item: CartItem) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={styles.emptyContainer}>
        <Text size={48} color={palette.grey} style={styles.emptyIcon}>
          🛒
        </Text>
        <Text
          size={18}
          fontFamily={family.Medium}
          color={palette.shaft}
          center>
          Your cart is empty
        </Text>
        <Text size={14} color={palette.grey} center style={styles.emptySubtext}>
          Add some limited stock items to see the reservation timers in action!
        </Text>
        <Button
          title="Browse Products"
          onPress={handleContinueShopping}
          style={styles.browseButton}
        />
      </Animated.View>
    ),
    [handleContinueShopping],
  );

  const ListHeaderComponent = useCallback(() => {
    if (cartItems.length === 0) return null;

    return (
      <View style={styles.listHeader}>
        <Text size={14} color={palette.grey}>
          {cartItems.length} item(s) reserved
        </Text>
        {isAnyExpiring && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.warningBadge}>
            <Text size={12} color={palette.red} fontFamily={family.Medium}>
              ⚠️ Items expiring soon!
            </Text>
          </Animated.View>
        )}
      </View>
    );
  }, [cartItems.length, isAnyExpiring]);

  return (
    <Block flex={1} bg={palette.concrete}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + RS(10)}]}>
        <View style={styles.headerLeft}>
          <Button
            title="← Back"
            outlined
            onPress={handleContinueShopping}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
        </View>
        <Text size={20} fontFamily={family.Bold} color={palette.shaft}>
          Cart
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Cart Items List */}
      <FlashList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={140}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={palette.cornFlower}
          />
        }
      />

      {/* Bottom Bar with Total and Checkout */}
      {cartItems.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.bottomBar, {paddingBottom: insets.bottom + RS(16)}]}>
          <View style={styles.totalContainer}>
            <Text size={14} color={palette.grey}>
              Total
            </Text>
            <Text size={24} fontFamily={family.Bold} color={palette.shaft}>
              ${cartTotal.toFixed(2)}
            </Text>
          </View>
          <Button
            title="Checkout"
            onPress={handleCheckout}
            style={styles.checkoutButton}
          />
        </Animated.View>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RS(16),
    paddingBottom: RS(12),
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerLeft: {
    width: RS(80),
  },
  headerRight: {
    width: RS(80),
  },
  backButton: {
    minHeight: RS(36),
    paddingHorizontal: RS(12),
  },
  backButtonText: {
    fontSize: 14,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RS(16),
    paddingVertical: RS(12),
  },
  warningBadge: {
    backgroundColor: `${palette.red}15`,
    paddingHorizontal: RS(10),
    paddingVertical: RS(6),
    borderRadius: RS(16),
  },
  listContent: {
    paddingTop: RS(8),
    paddingBottom: RS(200),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: RS(32),
    paddingTop: RS(100),
  },
  emptyIcon: {
    marginBottom: RS(16),
  },
  emptySubtext: {
    marginTop: RS(8),
    marginBottom: RS(24),
  },
  browseButton: {
    minWidth: RS(200),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingHorizontal: RS(16),
    paddingTop: RS(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalContainer: {
    flex: 1,
  },
  checkoutButton: {
    minWidth: RS(150),
  },
});

export default CartScreen;
