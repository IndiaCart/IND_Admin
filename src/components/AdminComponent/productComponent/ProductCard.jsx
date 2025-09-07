import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ThemeContext } from '../../../design/ThemeContext';
import { CustomColor } from '../../../design/Color';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={() => onPress?.(product)} activeOpacity={0.85}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.background,
            borderColor: theme.mode === 'dark'
              ? CustomColor.WHITE
              : CustomColor.GREY_60,
            borderWidth: 1,
          },
        ]}
      >
        <Image
          source={{
            uri: product?.images?.[0]?.url || 'https://via.placeholder.com/400x300',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={[styles.price, { color: theme.text }]}>
            ₹{product.price}
          </Text>
          <Text
            style={[styles.description, { color: theme.text }]}
            numberOfLines={2}
          >
            {product.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 120,
    // width: width - 32,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  image: {
    width: '30%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  details: {
    width: '70%',
    padding: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
  },
});

export default ProductCard;
