import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../../design/ThemeContext';
import BackButton from '../../../components/BackButton';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomColor } from '../../../design/Color';

const { width } = Dimensions.get('window');
// Placeholder demo image — change to a local asset if you prefer (require('./assets/no-image.png'))
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400.png?text=No+Image';

const ViewSubCategory = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchedSubCategory } = useSelector((state) => state.manage) || [];
  const Navigator = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(fetchedSubCategory || []);
    } else {
      const term = searchTerm.toLowerCase();
      const result = (fetchedSubCategory || []).filter((product) => {
        return (
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.Category?.name?.toLowerCase().includes(term) ||
          product.Category?._id?.toLowerCase().includes(term)
        );
      });
      setFiltered(result);
    }
  }, [searchTerm, fetchedSubCategory]);

  const handleCardPress = (category) => {
    dispatch({ type: 'SET_CURRENT_SELECTED_SUBCATEGORY', payload: category });
    Navigator.navigate('editManageSubCategory');
  };

  // counts for the right-hand box
  const totalCount = (fetchedSubCategory || []).length;
  const shownCount = (filtered || []).length;
console.log("subCategory", fetchedSubCategory)
  const renderItem = ({ item }) => {
    const categoryName = item.Category?.name || 'Unknown category';
    const hasImage = !!(item.image || item.Category?.image);
    const imageUri = item.image || item.Category?.image || PLACEHOLDER_IMAGE;
    const isPlaceholder = !hasImage;

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => handleCardPress(item)}
        style={[
          styles.card,
          {
            backgroundColor: theme.mode === 'dark' ? '#0f1720' : '#fff',
            borderColor: theme.mode === 'dark' ? CustomColor.WHITE : CustomColor.GREY_60,
          },
        ]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {isPlaceholder && (
            <View style={[styles.demoBadge, { backgroundColor: theme.inputBackground }]}>
              <Text style={[styles.demoBadgeText, { color: theme.placeholder }]}>demo</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.rowTop}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.chev, { color: theme.placeholder }]}>›</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.categoryPill, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
              <Text style={[styles.categoryPillText, { color: theme.text }]} numberOfLines={1}>
                {categoryName}
              </Text>
            </View>

            <Text style={[styles.idText, { color: theme.placeholder }]} numberOfLines={1}>
              {_shortId(item._id)}
            </Text>
          </View>

          {item.description ? (
            <Text style={[styles.desc, { color: theme.text }]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BackButton color={theme.text} title={'Sub categories'} />

      <View style={styles.searchRow}>
        <TextInput
          mode="outlined"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Type to search..."
          placeholderTextColor={theme.placeholder}
          outlineColor={theme.text}
          activeOutlineColor={theme.primary}
          textColor={theme.text}
          theme={{
            roundness: 20,
            colors: {
              background: theme.inputBackground,
              text: theme.text,
              placeholder: theme.placeholder,
              primary: theme.primary,
              outline: theme.border,
            },
          }}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.inputBackground,
            },
          ]}
        />

        <View style={[styles.countBox, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
          <Text style={[styles.countText, { color: theme.text }]}>{shownCount} / {totalCount}</Text>
          <Text style={[styles.countLabel, { color: theme.placeholder }]}>shown / total</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.placeholder }}>No subcategories found.</Text>
          </View>
        }
      />
    </View>
  );
};

// shortens long IDs for display
const _shortId = (id = '') => {
  if (!id) return '';
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
};

export default ViewSubCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  // Search row (input + count)
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 14,
    height: 46,
    flex: 1,
  },
  countBox: {
    width: 92,
    height: 46,
    marginLeft: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
  },
  countLabel: {
    fontSize: 10,
    marginTop: 2,
  },

  // Card
  card: {
    height: 100,
    marginVertical: 8,
    marginHorizontal: 6,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },

  imageWrap: {
    width: 110,
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  demoBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  details: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    maxWidth: width * 0.55,
  },
  chev: {
    fontSize: 26,
    lineHeight: 26,
    marginLeft: 6,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 0.5,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  idText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  desc: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
});
