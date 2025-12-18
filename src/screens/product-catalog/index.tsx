/**
 * ProductCatalog Screen
 *
 * Displays list of products that can be added to cart.
 * Each product shows limited stock badge and Add to Cart button.
 */

import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Block, Text, Button} from '@components';
import {RS, RH} from '@helpers';
import {palette, family} from '@theme';
import {Product} from '@types';
import {MOCK_PRODUCTS, simulateAddToCart} from '@services/mockProducts';
import {useAppDispatch, useAppSelector} from '../../store';
import {addToCart, selectCartItemCount} from '@slices/cart';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAdding,
  isInCart,
}) => {
  return (
    <View style={styles.card}>
      {/* Product Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text size={32} color={palette.grey}>
          {product.name.charAt(0)}
        </Text>
      </View>

      {/* Limited Stock Badge */}
      {product.isLimitedStock && (
        <View style={styles.limitedBadge}>
          <Text size={10} color={palette.white} fontFamily={family.Medium}>
            {product.stockCount} left
          </Text>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.cardContent}>
        <Text
          size={14}
          fontFamily={family.Medium}
          color={palette.shaft}
          numberOfLines={2}>
          {product.name}
        </Text>
        <Text
          size={16}
          fontFamily={family.SemiBold}
          color={palette.cornFlower}
          style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            isInCart && styles.addButtonDisabled,
          ]}
          onPress={() => onAddToCart(product)}
          disabled={isAdding || isInCart}>
          {isAdding ? (
            <ActivityIndicator size="small" color={palette.white} />
          ) : (
            <Text size={12} color={palette.white} fontFamily={family.Medium}>
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ProductCatalog: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const cartItems = useAppSelector(state => state.cart.items);

  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const handleAddToCart = useCallback(
    async (product: Product) => {
      setAddingProductId(product.id);

      try {
        // Simulate API call to reserve item
        const {serverTimestamp, reservationDurationMs} = await simulateAddToCart(
          product.id,
        );

        // Add to cart with server timestamp
        dispatch(
          addToCart({
            product,
            quantity: 1,
            serverTimestamp,
            reservationDurationMs,
          }),
        );
      } catch (error) {
        console.error('Failed to add to cart:', error);
      } finally {
        setAddingProductId(null);
      }
    },
    [dispatch],
  );

  const handleGoToCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const isProductInCart = useCallback(
    (productId: string) => {
      return cartItems.some(
        item => item.product.id === productId && !item.isExpired,
      );
    },
    [cartItems],
  );

  const renderItem = useCallback(
    ({item}: {item: Product}) => (
      <ProductCard
        product={item}
        onAddToCart={handleAddToCart}
        isAdding={addingProductId === item.id}
        isInCart={isProductInCart(item.id)}
      />
    ),
    [handleAddToCart, addingProductId, isProductInCart],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <Block flex={1} bg={palette.concrete}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + RS(10)}]}>
        <Text size={24} fontFamily={family.Bold} color={palette.shaft}>
          Shop
        </Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleGoToCart}>
          <Text size={14} color={palette.white} fontFamily={family.Medium}>
            Cart ({cartItemCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={MOCK_PRODUCTS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
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
  cartButton: {
    backgroundColor: palette.cornFlower,
    paddingHorizontal: RS(16),
    paddingVertical: RS(8),
    borderRadius: RS(20),
  },
  listContent: {
    padding: RS(12),
    paddingBottom: RS(100),
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: palette.white,
    borderRadius: RS(12),
    marginBottom: RS(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    height: RS(120),
    backgroundColor: palette.concrete,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitedBadge: {
    position: 'absolute',
    top: RS(8),
    right: RS(8),
    backgroundColor: palette.red,
    paddingHorizontal: RS(8),
    paddingVertical: RS(4),
    borderRadius: RS(4),
  },
  cardContent: {
    padding: RS(12),
  },
  price: {
    marginTop: RS(4),
    marginBottom: RS(8),
  },
  addButton: {
    backgroundColor: palette.cornFlower,
    paddingVertical: RS(10),
    borderRadius: RS(8),
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: palette.grey,
  },
});

export default ProductCatalog;
