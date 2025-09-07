import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../../design/ThemeContext';
import BackButton from '../../../components/BackButton';
import { TextInput } from 'react-native-paper';
import ProductCard from '../../../components/AdminComponent/productComponent/ProductCard';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ViewProduct = () => {
    const { theme } = useContext(ThemeContext);
    const { fetchedProduct } = useSelector((state) => state.manage);
    const Navigator = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFiltered(fetchedProduct || []);
        } else {
            const term = searchTerm.toLowerCase();
            const result = (fetchedProduct || []).filter((product) =>
                product.name?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term)
            );
            setFiltered(result);
        }
    }, [searchTerm, fetchedProduct]);

    // Handle card tap
    const handleCardPress = (product) => {
        dispatch({type:"SET_CURRENT_SELECTED_PRODUCT" , payload:product});
        Navigator.navigate('editManageProduct')
        // you can navigate, open modal, or dispatch here
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <BackButton color={theme.text} title={'Products'}/>

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
                <ProductCard
                    key={product._id}
                    product={product}
                    onPress={handleCardPress}
                />
            ))}
        </ScrollView>
    );
};


export default ViewProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    searchBox: {
        marginBottom: 16,
        // borderRadius:10,
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
    
});
