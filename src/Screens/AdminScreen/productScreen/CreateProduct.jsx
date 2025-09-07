import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    Alert,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
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
import { HOSTED_URL } from '@env'
import { createProductUrl } from '../../../utils/apis/adminAPI';

const initialFormState = {
    name: '',
    description: '',
    price: '',
    brand: '',
    selectedCategory: '',
    selectedSubCategory: '',
    images: [],
    stock: '',
    variations: []
};

const CreateProduct = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const { fetchedCategories, fetchedSubCategory, fetchedVariation, loading } =
        useSelector((state) => state.manage);

    // form state
    const [form, setForm] = useState(initialFormState);
    const [displaySubCategory, setDisplaySubCategory] = useState([]);
    const [filteredVariationDisplay, setFilteredVariationDisplay] = useState([]);
    // dropdown visibility
    const [isCategoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
    const [isSubCategoryDropdownVisible, setSubCategoryDropdownVisible] = useState(false);

    // reset form
    const resetForm = () => {
        setForm(initialFormState);
        setDisplaySubCategory([]);
        setFilteredVariationDisplay([]);
    };

    // delete single image by index
    const handleDeleteImage = (uri, index) => {
        deleteImageFromServer(dispatch, uri?.fileId);
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };
    console.log(form)
    // filter subcategories when category changes
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

    // derive variation fields
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

    // update variation display
    useEffect(() => {
        setFilteredVariationDisplay(variationFields);
    }, [variationFields]);

    // image picker & upload
    const pickAndUpload = async () => {
        try {
            const asset = await pickImageFromGallery();
            console.log("aaset", asset)
            if (!asset) return;
            const fileData = await uploadToImageKit(asset, 'product', dispatch);
            console.log("fileData", fileData);
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, { fileId: fileData.fileId, url: fileData.url }],
            }));
        } catch (err) {
            console.error(err);
            Alert.alert('Upload failed', 'Could not upload image');
        }
    };

    // submit form
    const handleSubmit = async () => {
        const { name, price, selectedCategory } = form;
        if (!name || !price || !selectedCategory) {
            return Alert.alert('Missing fields', 'Please fill in all required fields.');
        }
        const payload = { ...form, price: parseFloat(form.price) };
        try {
            const resp = await fetch(`${HOSTED_URL}${createProductUrl}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            console.log("ressss", resp)
            if (resp.ok) {
                Alert.alert('Success', 'Product created!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
                resetForm();
            } else {
                console.error(data);
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Network error');
        }
    };

    // close dropdowns on outside press
    const handleOutsidePress = () => {
        Keyboard.dismiss();
        setCategoryDropdownVisible(false);
        setSubCategoryDropdownVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <BackButton  color={theme.text} title={'Create Product'}/>
                <KeyboardAwareScrollView contentContainerStyle={styles.content} extraScrollHeight={100}>

                    {/* Category Dropdown */}
                    <View style={{ paddingVertical: 8 }}>
                        <UniversalDropdown
                            data={fetchedCategories}
                            placeholder="Select Category"
                            labelExtractor={(item) => item.name}
                            onSelect={(item) => {
                                setForm({ ...form, selectedCategory: item._id, selectedSubCategory: '' , variations: [] });
                                setCategoryDropdownVisible(false);
                            }}
                            isVisible={isCategoryDropdownVisible}
                            setIsVisible={(vis) => {
                                setCategoryDropdownVisible(vis);
                                if (vis) setSubCategoryDropdownVisible(false);
                            }}
                            isRequired
                        />
                    </View>

                    {/* SubCategory Dropdown */}
                    <View style={{ paddingVertical: 8, marginBottom: 10 }}>
                        <UniversalDropdown
                            data={displaySubCategory}
                            placeholder="Select SubCategory"
                            labelExtractor={(item) => item.name}
                            onSelect={(item) => {
                                setForm({ ...form, selectedSubCategory: item._id });
                                setSubCategoryDropdownVisible(false);
                            }}
                            isVisible={isSubCategoryDropdownVisible}
                            setIsVisible={(vis) => {
                                setSubCategoryDropdownVisible(vis);
                                if (vis) setCategoryDropdownVisible(false);
                            }}
                            disabled={!form.selectedCategory}
                            isRequired
                        />
                    </View>

                    {/* Inputs */}
                    <CustomInputField label="Product Name" isRequired value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
                    <CustomInputField label="Description" value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />
                    <CustomInputField label="Price" isRequired value={form.price} onChangeText={(text) => setForm({ ...form, price: text })} />
                    <CustomInputField label="Brand" optional value={form.brand} onChangeText={(text) => setForm({ ...form, brand: text })} />
                    <CustomInputField label="Stock" placeholder="Enter stock quantity" value={form.stock} onChangeText={(text) => setForm({ ...form, stock: text })} />
                    
                    {/* Variation Fields */}
                    <DropdownFields fields={filteredVariationDisplay} onSelectChange={
                        (fieldId, selectedOption) => {
                            setForm((prev) => {
                            const updatedVariations = [...prev.variations];
                            const index = updatedVariations.findIndex((v) => v.name === fieldId.name);

                            if (index !== -1) {
                                // Update existing variation
                                updatedVariations[index].options = [selectedOption];
                            } else {
                                // Add new variation
                                updatedVariations.push({
                                name: fieldId.name,
                                options: [selectedOption],
                                });
                            }
                            return {
                                ...prev,
                                variations: updatedVariations,
                            };
                            });  
                        }
                        } />

                    {/* Images */}
                    <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Images</Text>
                    <View style={styles.imageRow}>
                        {loading && <ImageUploadShimmer style={{ width: 120, height: 120 }} />}

                        {!loading && form.images.length > 0 &&
                            form.images.map((img, idx) => (
                                <View key={idx} style={styles.imageWrapper}>
                                    <Image source={{ uri: img.url }} style={styles.imageThumb} />
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() => handleDeleteImage(img, idx)}
                                    >
                                        <X size={16} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        }

                        {!loading && (
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
                    {/* Submit */}
                    {loading ? <ActivityIndicator size="large" color={theme.primary} /> : <Button title="Create Product" onPress={handleSubmit} color={theme.primary} />}

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
});

export default CreateProduct;
