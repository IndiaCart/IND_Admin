// top-level imports remain same
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import {
    StyleSheet, View, Text, Button, Image, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react-native';

import BackButton from '../../../components/BackButton';
import CustomInputField from '../../../components/CustomInputField';
import UniversalDropdown from '../../../components/UniversalDropdown';
import DropdownFields from '../../../components/AdminComponent/DropdownFields';
import ImageUploadShimmer from '../../../components/Shimmer/ImageUploadShimmer';

import { ThemeContext } from '../../../design/ThemeContext';
import { CustomColor } from '../../../design/Color';
import { pickImageFromGallery } from '../../../utils/imagePicker';
import { uploadToImageKit } from '../../../utils/imageKitUpload';
import { deleteImageFromServer } from '../../../utils/deleteImageFromServer';
import { HOSTED_URL } from '@env';
import { updateProductUrl } from '../../../utils/apis/adminAPI';
import CustomButton from '../../../components/CustomButton';
import { getAllProduct } from '../../../Redux/action/adminManage/productManage';

// 🔧 Move useRef inside the component
const initialFormState = {
    name: '',
    description: '',
    price: '',
    brand: '',
    selectedCategory: '',
    selectedSubCategory: '',
    productId: '',
    images: [],
    stock: '',
    variations: [],
};

const ProductInfoEditor = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const { fetchedCategories, fetchedSubCategory, fetchedVariation, loading, currentSelectedProduct } =
        useSelector((state) => state.manage);

    const origRef = useRef(initialFormState);

    const [form, setForm] = useState(initialFormState);
    const [editForm, setEditForm] = useState({});
    const [displaySubCategory, setDisplaySubCategory] = useState([]);
    const [filteredVariationDisplay, setFilteredVariationDisplay] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCategoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
    const [isSubCategoryDropdownVisible, setSubCategoryDropdownVisible] = useState(false);

    const resetForm = () => {
        setForm(initialFormState);
        setDisplaySubCategory([]);
        setFilteredVariationDisplay([]);
    };

    useEffect(() => {
        if (currentSelectedProduct) {
            const loaded = {
                name: currentSelectedProduct.name || '',
                description: currentSelectedProduct.description || '',
                price: String(currentSelectedProduct.price || ''),
                brand: currentSelectedProduct.brand || '',
                productId: currentSelectedProduct._id,
                selectedCategory: currentSelectedProduct.category._id || '',
                selectedSubCategory: currentSelectedProduct.subCategory._id || '',
                stock: String(currentSelectedProduct.stock || ''),
                images: currentSelectedProduct.images || [],
                variations: currentSelectedProduct.variations || [],
            };
            setForm(loaded);
            origRef.current = loaded;
            setEditForm({});
        }
    }, [currentSelectedProduct]);
    const updateEditForm = (key, value) => {
        const original = origRef.current[key];
        const changed = JSON.stringify(original) !== JSON.stringify(value);
        setEditForm((prev) => {
            if (changed) return { ...prev, [key]: value };
            const { [key]: _, ...rest } = prev;
            return rest;
        });
    };

    const handleFieldChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        updateEditForm(key, value);
    };

    const handleCategorySelect = (item) => {
        handleFieldChange('selectedCategory', item._id);
        handleFieldChange('selectedSubCategory', '');
        handleFieldChange('variations', []);
        setCategoryDropdownVisible(false);
    };

    const handleSubCategorySelect = (item) => {
        handleFieldChange('selectedSubCategory', item._id);
        setSubCategoryDropdownVisible(false);
    };

    const handleDeleteImage = (uri, index) => {
        deleteImageFromServer(dispatch, uri?.fileId);
        const updated = form.images.filter((_, i) => i !== index);
        handleFieldChange('images', updated);
    };

    useEffect(() => {
        if (!form.selectedCategory) {
            setDisplaySubCategory([]);
        } else {
            setDisplaySubCategory(
                fetchedSubCategory.filter(
                    (item) => item.Category._id === form.selectedCategory
                )
            );
        }
    }, [fetchedSubCategory, form.selectedCategory]);
    const variationFields = useMemo(() => {
        if (!fetchedVariation?.length || !form.selectedCategory) return [];
        const categoryVariations = fetchedVariation.filter(
            (v) => v.category?._id === form.selectedCategory
        );
        const hasSubs = categoryVariations.some((v) => v.subCategory);
        if (hasSubs && !form.selectedSubCategory) return [];
        const specific = categoryVariations.find(
            (v) => v.subCategory?._id === form.selectedSubCategory
        );
        return specific?.fields || categoryVariations.find((v) => !v.subCategory)?.fields || [];
    }, [fetchedVariation, form.selectedCategory, form.selectedSubCategory]);

    useEffect(() => {
        setFilteredVariationDisplay(variationFields);
    }, [variationFields]);

    const pickAndUpload = async () => {
        try {
            const asset = await pickImageFromGallery();
            if (!asset) return;
            const fileData = await uploadToImageKit(asset, 'product', dispatch);
            const updated = [...form.images, { fileId: fileData.fileId, url: fileData.url }];
            handleFieldChange('images', updated);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        const { name, price, selectedCategory, productId } = form;
        if (!name || !price || !selectedCategory) {
            return Alert.alert('Missing fields', 'Please fill in all required fields.');
        }
        // 🔧 Only use editForm if in edit mode, else full form
        const payload = isEditMode
            ? { ...editForm, price: parseFloat(editForm.price || form.price) }
            : { ...form, price: parseFloat(form.price) };

        try {
            const resp = await fetch(`${HOSTED_URL}${updateProductUrl}/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            if (resp.ok) {
                dispatch(getAllProduct());

                Alert.alert('Success', 'Product updated successfully!', [
                    { text: 'OK', onPress: () => {
                        navigation.goBack() }
                    },
                ]);
                resetForm();
            } else {
                console.error(data);
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            Alert.alert(err.message || 'Error', 'Network error');
        }
    };

    const handleOutsidePress = () => {
        Keyboard.dismiss();
        setCategoryDropdownVisible(false);
        setSubCategoryDropdownVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <BackButton color={theme.text} title={isEditMode ? 'Edit Product' : 'Product Details'} />
                    <TouchableOpacity
                        onPress={() => setIsEditMode(prev => !prev)}
                        style={[
                            styles.editButtonWrapper,
                            { backgroundColor: isEditMode ? CustomColor.RED_80 : CustomColor.WHITE, borderColor: CustomColor.CYAN_60, marginRight: 16 }
                        ]}
                    >
                        <Text style={[styles.editButtonText, { color: isEditMode ? CustomColor.RED_10 : CustomColor.PRUSSIAN_80 }]}>
                            {isEditMode ? 'Cancel' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAwareScrollView contentContainerStyle={styles.content} extraScrollHeight={100}>
                    <View style={{ paddingVertical: 8 }}>
                        <UniversalDropdown
                            data={fetchedCategories}
                            placeholder="Select Category"
                            labelExtractor={(item) => item?.name}
                            onSelect={handleCategorySelect}
                            disabled={!isEditMode}
                            isVisible={isCategoryDropdownVisible}
                            setIsVisible={(vis) => {
                                setCategoryDropdownVisible(vis);
                                if (vis) setSubCategoryDropdownVisible(false);
                            }}
                            isRequired
                            selectedData={currentSelectedProduct?.category || null}
                        />
                    </View>

                    <View style={{ paddingVertical: 8, marginBottom: 10 }}>
                        <UniversalDropdown
                            data={displaySubCategory}
                            placeholder="Select SubCategory"
                            labelExtractor={(item) => item?.name}
                            onSelect={handleSubCategorySelect}
                            isVisible={isSubCategoryDropdownVisible}
                            setIsVisible={(vis) => {
                                setSubCategoryDropdownVisible(vis);
                                if (vis) setCategoryDropdownVisible(false);
                            }}
                            disabled={!form.selectedCategory || !isEditMode}
                            selectedData={currentSelectedProduct?.subCategory || null}
                            isRequired
                        />
                    </View>

                    <CustomInputField label="Product Name" isRequired value={form.name} onChangeText={(text) => handleFieldChange('name', text)} isEditable={isEditMode} />
                    <CustomInputField label="Description" value={form.description} onChangeText={(text) => handleFieldChange('description', text)} isEditable={isEditMode} />
                    <CustomInputField label="Price" isRequired value={form.price} onChangeText={(text) => handleFieldChange('price', text)} isEditable={isEditMode} />
                    <CustomInputField label="Brand" optional value={form.brand} onChangeText={(text) => handleFieldChange('brand', text)} isEditable={isEditMode} />
                    <CustomInputField label="Stock" placeholder="Enter stock quantity" value={form.stock} onChangeText={(text) => handleFieldChange('stock', text)} isEditable={isEditMode} />

                    <DropdownFields
                        fields={filteredVariationDisplay}
                        isEditMode={isEditMode}
                        selectedVariations={currentSelectedProduct.variations}
                        onSelectChange={(fieldId, selectedOption) => {
                            const updated = [...form.variations];
                            const index = updated.findIndex(v => v.name === fieldId.name);
                            if (index !== -1) {
                                updated[index] = {
                                        ...updated[index],
                                        options: [selectedOption]
                                    };
                            } else {
                                updated.push({ name: fieldId.name, options: [selectedOption] });
                            }
                            handleFieldChange('variations', updated);
                        }}
                    />

                    <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Images</Text>
                    <View style={styles.imageRow}>
                        {loading && <ImageUploadShimmer style={{ width: 120, height: 120 }} />}
                        {!loading && form.images.map((img, idx) => (
                            <View key={idx} style={styles.imageWrapper}>
                                <Image source={{ uri: img.url }} style={styles.imageThumb} />
                                {isEditMode && (
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() => handleDeleteImage(img, idx)}
                                    >
                                        <X size={16} color="red" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {!loading && isEditMode && (
                            <TouchableOpacity
                                style={[
                                    styles.fakeImageBox,
                                    {
                                        backgroundColor:
                                            theme.mode === 'dark' ? CustomColor.GREY_90 : CustomColor.GREY_20,
                                    },
                                ]}
                                onPress={pickAndUpload}
                            >
                                <Plus size={36} color={CustomColor.WHITE} />
                                <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>Upload</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {isEditMode && <CustomButton
                        title={'Edit Product'}
                        onPress={handleSubmit}
                        loading={loading}
                        color="#5A4187"
                    />}

                </KeyboardAwareScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    label: { fontSize: 16, marginBottom: 4 },
    imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
    imageWrapper: { position: 'relative', marginBottom: 10 },
    imageThumb: { width: 120, height: 120, borderRadius: 8 },
    deleteIcon: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 2 },
    fakeImageBox: {
        width: 120,
        height: 120,
        borderWidth: 2,
        borderColor: '#aaa',
        borderRadius: 8,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    editButtonWrapper: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CustomColor.GREY_60,
        alignSelf: 'flex-end',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginVertical: 10,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ProductInfoEditor;
