import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, Image, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react-native';

import BackButton from '../../../components/BackButton';
import CustomInputField from '../../../components/CustomInputField';
import ImageUploadShimmer from '../../../components/Shimmer/ImageUploadShimmer';
import CustomButton from '../../../components/CustomButton';
import { ThemeContext } from '../../../design/ThemeContext';
import { CustomColor } from '../../../design/Color';
import { deleteImageFromServer } from '../../../utils/deleteImageFromServer';
import { HOSTED_URL } from '@env';
import { updateCategoryUrl } from '../../../utils/apis/adminAPI';
import { pickImageFromGallery } from '../../../utils/imagePicker';
import { uploadToImageKit } from '../../../utils/imageKitUpload';
import { getAllCategory } from '../../../Redux/action/adminManage/productManage';

const initialFormState = {
    name: '',
    description: '',
    images: [],
};

const CategoryInfoEditor = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const { currentSelectedCategory, loading } = useSelector((state) => state.manage);

    const origRef = useRef(initialFormState);
    const [form, setForm] = useState(initialFormState);
    const [editForm, setEditForm] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    const resetForm = () => {
        setForm(initialFormState);
        setEditForm({});
    };

    useEffect(() => {
        if (currentSelectedCategory) {
            const loaded = {
                name: currentSelectedCategory.name || '',
                description: currentSelectedCategory.description || '',
                categoryId: currentSelectedCategory._id,
                images: currentSelectedCategory.images || [],
            };
            setForm(loaded);
            origRef.current = loaded;
            setEditForm({});
        }
    }, [currentSelectedCategory]);

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

    const handleDeleteImage = (uri, index) => {
        deleteImageFromServer(dispatch, uri?.fileId);
        const updated = form.images.filter((_, i) => i !== index);
        handleFieldChange('images', updated);
    };

    const pickAndUpload = async () => {
        try {
            const asset = await pickImageFromGallery();
            if (!asset) return;
            const fileData = await uploadToImageKit(asset, 'category', dispatch);
            const updated = [...form.images, { fileId: fileData.fileId, url: fileData.url }];
            handleFieldChange('images', updated);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        const { name, categoryId } = form;
        if (!name || !categoryId) {
            return Alert.alert('Missing fields', 'Please provide category name and required details.');
        }

        const payload = isEditMode ? editForm : form;
        try {
            const resp = await fetch(`${HOSTED_URL}${updateCategoryUrl}/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            if (resp.ok) {
                dispatch(getAllCategory());
                Alert.alert('Success', 'Category updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
                resetForm();
            } else {
                console.error(data);
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.message || 'Network error');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <BackButton color={theme.text} title={isEditMode ? 'Edit Category' : 'Category Details'} />
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
                    <CustomInputField
                        label="Category Name"
                        isRequired
                        value={form.name}
                        onChangeText={(text) => handleFieldChange('name', text)}
                        isEditable={isEditMode}
                    />

                    <CustomInputField
                        label="Description"
                        value={form.description}
                        onChangeText={(text) => handleFieldChange('description', text)}
                        isEditable={isEditMode}
                        multiline
                    />

                   { (form.images.length !=0 || isEditMode)&& <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Images</Text>}
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
                        title={'Update Category'}
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
    editButtonText: { fontSize: 12, fontWeight: '600' },
});

export default CategoryInfoEditor;
