import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react-native';

import BackButton from '../../../components/BackButton';
import CustomInputField from '../../../components/CustomInputField';
import ImageUploadShimmer from '../../../components/Shimmer/ImageUploadShimmer';
import CustomButton from '../../../components/CustomButton';
import UniversalDropdown from '../../../components/UniversalDropdown';

import { ThemeContext } from '../../../design/ThemeContext';
import { CustomColor } from '../../../design/Color';
import { getAllCategory } from '../../../Redux/action/adminManage/productManage';
import { pickImageFromGallery } from '../../../utils/imagePicker';
import { uploadToImageKit } from '../../../utils/imageKitUpload';
import { HOSTED_URL } from '@env';
import { deleteImageFromServer } from '../../../utils/deleteImageFromServer';
import { createSubCategoryUrl } from '../../../utils/apis/adminAPI';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400.png?text=No+Image';

const CreateSubCategory = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [isCategoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

const { fetchedCategories, fetchedSubCategory, fetchedVariation, currentSelectedProduct } = useSelector((state) => state.manage);


  const [form, setForm] = useState({
    name: '',
    description: '',
    images: [],
    categoryId: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategorySelect = (categoryObj) => {
    console.log("c", categoryObj)
    const catId = categoryObj?._id || '';
    handleFieldChange('categoryId', catId);
  };

  const handleDeleteImage = (imgObj, index) => {
    if (imgObj?.fileId) deleteImageFromServer(dispatch, imgObj.fileId);
    const updated = form.images.filter((_, i) => i !== index);
    handleFieldChange('images', updated);
  };

  const pickAndUpload = async () => {
    try {
      const asset = await pickImageFromGallery();
      if (!asset) return;
      const fileData = await uploadToImageKit(asset, 'subcategory', dispatch);
      const updated = [...form.images, { fileId: fileData.fileId, url: fileData.url }];
      handleFieldChange('images', updated);
    } catch (err) {
      console.error('Image upload error', err);
      Alert.alert('Upload error', err?.message || 'Could not upload image');
    }
  };

  const handleSubmit = async () => {
    console.log("form", form)
    const { name, categoryId } = form;
    if (!name || !categoryId) {
      return Alert.alert('Missing fields', 'Please provide a subcategory name and select a category.');
    }

    try {
      setLoading(true);
      const resp = await fetch(`${HOSTED_URL}${createSubCategoryUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          images: form.images,
          categoryId: form.categoryId,
        }),
      });

      const data = await resp.json();
      setLoading(false);

      if (resp.ok) {
        Alert.alert('Success', 'Subcategory created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        console.error('Create failed', data);
        Alert.alert('Error', data.message || 'Something went wrong while creating subcategory.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Network error', err);
      Alert.alert('Error', err?.message || 'Network error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <BackButton color={theme.text} title="Create SubCategory" />
        <KeyboardAwareScrollView contentContainerStyle={styles.content} extraScrollHeight={100}>
          {/* Parent Category */}
          <Text style={[styles.label, { color: theme.text }]}>Parent Category</Text>
          <UniversalDropdown
            data={fetchedCategories}
            placeholder="Select Category"
            labelExtractor={(item) => item?.name || 'Unnamed'}
            onSelect={handleCategorySelect}
            selectedData={fetchedCategories.find((c) => c._id === form.categoryId) || null}
            isRequired
            isVisible={isCategoryDropdownVisible}
            setIsVisible={setCategoryDropdownVisible}
          />

          {/* Subcategory Name */}
          <CustomInputField
            label="SubCategory Name"
            isRequired
            value={form.name}
            onChangeText={(text) => handleFieldChange('name', text)}
            isEditable
          />

          {/* Description */}
          <CustomInputField
            label="Description"
            value={form.description}
            onChangeText={(text) => handleFieldChange('description', text)}
            isEditable
            multiline
          />

          {/* Images */}
          {(form.images?.length !== 0) && (
            <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Images</Text>
          )}
          <View style={styles.imageRow}>
            {loading && <ImageUploadShimmer style={{ width: 120, height: 120 }} />}
            {!loading &&
              (form.images || []).map((img, idx) => (
                <View key={idx} style={styles.imageWrapper}>
                  <Image source={{ uri: img.url || PLACEHOLDER_IMAGE }} style={styles.imageThumb} />
                  <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteImage(img, idx)}>
                    <X size={16} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

            {/* Upload Button */}
            {!loading && (
              <TouchableOpacity
                style={[
                  styles.fakeImageBox,
                  {
                    backgroundColor: theme.mode === 'dark' ? CustomColor.GREY_90 : CustomColor.GREY_20,
                    borderColor: theme.border,
                  },
                ]}
                onPress={pickAndUpload}
              >
                <Plus size={36} color={CustomColor.WHITE} />
                <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <CustomButton title="Create SubCategory" onPress={handleSubmit} loading={loading} color="#5A4187" />
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '600' },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
    marginRight: 10,
  },
  imageThumb: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
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
    marginRight: 10,
  },
});

export default CreateSubCategory;
