import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../../design/ThemeContext';
import BackButton from '../../../components/BackButton';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomColor } from '../../../design/Color';
const { width } = Dimensions.get('window');

const ViewCategory = () => {
    const { theme } = useContext(ThemeContext);
    const { fetchedCategories } = useSelector((state) => state.manage);
    const Navigator = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFiltered(fetchedCategories || []);
        } else {
            const term = searchTerm.toLowerCase();
            const result = (fetchedCategories || []).filter((product) =>
                product.name?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term)
            );
            setFiltered(result);
        }
    }, [searchTerm, fetchedCategories]);

    // Handle card tap
    const handleCardPress = (category) => {
        dispatch({type:"SET_CURRENT_SELECTED_SUBCATEGORY" , payload:category});
        Navigator.navigate('editManageCategory')
        // you can navigate, open modal, or dispatch here
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <BackButton color={theme.text} title={'Categories'}/>

            <View style={styles.searchBox}>
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
            </View>

            {(filtered || []).map((product) => (
                <TouchableOpacity key={product._id} onPress={() => handleCardPress(product)} activeOpacity={0.85}>
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
                        <View style={styles.details}>
                          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                            {product.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
            ))}
        </ScrollView>
    );
};


export default ViewCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    searchBox: {
        marginBottom: 16,
    },
    searchLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    searchInput: {
        fontSize: 14,
        fontWeight: '600',
        height: 45,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    imageScroll: {
        flexDirection: 'row',
    },
    noImageBox: {
        width: width * 0.4,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderRadius: 8,
        marginRight: 10,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    desc: {
        marginTop: 4,
        fontSize: 14,
    },
    price: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    stock: {
        marginTop: 4,
        fontSize: 14,
    },
    tag: {
        fontSize: 12,
        marginTop: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    variationBox: {
        marginTop: 10,
    },
    variationTitle: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    variation: {
        marginBottom: 4,
    },
    variationName: {
        fontSize: 13,
    },
    variationOptions: {
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        height: 60,
        marginHorizontal: 6,
        marginVertical: 6,
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
});
