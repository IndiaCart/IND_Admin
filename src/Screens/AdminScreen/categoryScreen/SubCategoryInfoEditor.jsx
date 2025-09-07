import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
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
import { updateSubCategoryUrl } from '../../../utils/apis/adminAPI';
import { pickImageFromGallery } from '../../../utils/imagePicker';
import { uploadToImageKit } from '../../../utils/imageKitUpload';
import { getAllCategory, getAllSubCategory } from '../../../Redux/action/adminManage/productManage';
import UniversalDropdown from '../../../components/UniversalDropdown';
import axios from 'axios';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400.png?text=No+Image';

const initialFormState = {
  name: '',
  description: '',
  images: [],
  categoryId: '', // parent category id for this subcategory
};

const SubCategoryInfoEditor = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  // NOTE: adjust this selector if your store uses a different key for the currently selected subcategory.
  const { currentSelectedCategory,currentSelectedSubCategory, loading } = useSelector((state) => state.manage); /* <-- adjust if your state key differs */

  // categories for dropdown - try multiple keys in state for robustness
  const categoriesFromStore =
    useSelector((state) => state.manage.fetchedCategory) ||
    useSelector((state) => state.manage.categories) ||
    useSelector((state) => state.manage.allCategory) ||
    useSelector((state) => state.manage.fetchedCategories) ||
    [];

  const origRef = useRef(initialFormState);
  const [form, setForm] = useState(initialFormState);
  const [editForm, setEditForm] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // dropdown visibility state
  const [isCategoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  useEffect(() => {
    // fetch categories for dropdown
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (currentSelectedCategory) {
      // currentSelectedCategory is assumed to be the SUBCATEGORY object; it may have a nested Category object.
      const loaded = {
        name: currentSelectedCategory.name || '',
        description: currentSelectedCategory.description || '',
        // prefer nested Category._id (the parent), otherwise fallback to a categoryId field if present
        categoryId:
          currentSelectedCategory.Category?._id ||
          currentSelectedCategory.categoryId ||
          currentSelectedCategory.category || // sometimes stored differently
          '',
        // support both images or images array
        images: currentSelectedCategory.images || currentSelectedCategory.image ? (
          Array.isArray(currentSelectedCategory.images) ? currentSelectedCategory.images : (currentSelectedCategory.image ? [{ url: currentSelectedCategory.image }] : [])
        ) : [],
      };
      setForm(loaded);
      origRef.current = loaded;
      setEditForm({});
    } else {
      // reset if nothing selected
      setForm(initialFormState);
      origRef.current = initialFormState;
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

  const handleCategorySelect = (categoryObj) => {
    // categoryObj will be the selected category from UniversalDropdown
    const catId = categoryObj?._id || categoryObj?.id || '';
    handleFieldChange('categoryId', catId);
  };

  const handleDeleteImage = (imgObj, index) => {
    // imgObj expected { fileId, url } or similar
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
              console.error(err);
          }
      };

  

  const handleSubmit = async () => {
    // Validation
    const { name, categoryId } = form;
    if (!name || !categoryId) {
      return Alert.alert('Missing fields', 'Please provide subcategory name and select a parent category.');
    }

    // build payload: send only changed fields (editForm) when in edit mode, otherwise send form
    const payload = isEditMode ? editForm : form;
    // Ensure payload includes required fields (some APIs need full object)
    payload.name = payload.name || form.name;
    payload.description = payload.description || form.description;
    payload.images = payload.images || form.images;
    payload.category = payload.category || payload.categoryId || form.categoryId;
    try {
      // Using updateCategoryUrl here — if you have updateSubCategoryUrl replace it.
      const resourceId = currentSelectedCategory?._id || form._id || ''; // subcategory id
      if (!resourceId) {
        return Alert.alert('Error', 'No subcategory selected to update.');
      }

      console.log("formdata", payload)
      const resp = await fetch(`${HOSTED_URL}${updateSubCategoryUrl}/${resourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (resp.ok) {
        // refresh lists (if you have a dedicated getAllSubCategory, use it)
        dispatch(getAllSubCategory());
        Alert.alert('Success', 'Subcategory updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        // reset edit mode & state
        setIsEditMode(false);
        setEditForm({});
      } else {
        console.error('Update failed', data);
        Alert.alert('Error', data.message || 'Something went wrong while updating.');
      }
    } catch (err) {
      console.error('Network error', err);
      Alert.alert('Error', err?.message || 'Network error');
    }
  };

  // helper to show image url or placeholder
  const _imageUrlOrPlaceholder = (img, idx) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return PLACEHOLDER_IMAGE;
  };

const handleDelete = (itemId) => {
  console.log("id", itemId)
  Alert.alert(
    "Are you sure?",
    "Do you want to delete this item?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("item", itemId)
            console.log("dd", `${HOSTED_URL}${updateSubCategoryUrl}/${itemId}`)
            const res = await axios.delete(`${HOSTED_URL}${updateSubCategoryUrl}/${itemId}`);
            if (res.data.success) {
              // Update your state here after deletion
              console.log("Deleted successfully");
               dispatch(getAllSubCategory());
                Alert.alert('Success', 'Subcategory updated successfully!', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
              Alert.alert("Error", res.data.message || "Failed to delete");
            }
          } catch (error) {
            console.error('Delete error', error);
            Alert.alert("Error", error?.message || "Something went wrong");
          }
        }
      }
    ]
  );
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackButton color={theme.text} title={isEditMode ? 'Edit SubCategory' : 'SubCategory Details'} />
          <TouchableOpacity
            onPress={() => {
              // toggling edit mode resets editForm
              setIsEditMode((prev) => {
                const next = !prev;
                if (!next) {
                  // if cancelling edits, revert to original loaded values
                  setForm(origRef.current);
                  setEditForm({});
                }
                return next;
              });
            }}
            style={[
              styles.editButtonWrapper,
              {
                backgroundColor: isEditMode ? CustomColor.RED_80 : CustomColor.WHITE,
                borderColor: CustomColor.CYAN_60,
                marginRight: 16,
              },
            ]}
          >
            <Text style={[styles.editButtonText, { color: isEditMode ? CustomColor.RED_10 : CustomColor.PRUSSIAN_80 }]}>
              {isEditMode ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={styles.content} extraScrollHeight={100}>
          {/* Category Dropdown */}
          <Text style={[styles.label, { color: theme.text }]}>Parent Category</Text>
          <UniversalDropdown
            data={categoriesFromStore || []}
            placeholder="Select Category"
            labelExtractor={(item) => item?.name || 'Unnamed'}
            onSelect={handleCategorySelect}
            isVisible={isCategoryDropdownVisible}
            setIsVisible={(vis) => {
              setCategoryDropdownVisible(vis);
            }}
            disabled={!isEditMode}
            selectedData={
              // find currently selected category object to show in dropdown when not editing
              (categoriesFromStore || []).find((c) => c._id === form.categoryId) || null
            }
            isRequired
          />

          {/* Subcategory Name */}
          <CustomInputField
            label="SubCategory Name"
            isRequired
            value={form.name}
            onChangeText={(text) => handleFieldChange('name', text)}
            isEditable={isEditMode}
          />

          {/* Description */}
          <CustomInputField
            label="Description"
            value={form.description}
            onChangeText={(text) => handleFieldChange('description', text)}
            isEditable={isEditMode}
            multiline
          />

          {/* Images */}
          {(form.images?.length !== 0 || isEditMode) && (
            <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Images</Text>
          )}

          <View style={styles.imageRow}>
            {loading && <ImageUploadShimmer style={{ width: 120, height: 120 }} />}
            {!loading &&
              (form.images || []).map((img, idx) => {
                const uri = _imageUrlOrPlaceholder(img, idx);
                return (
                  <View key={idx} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.imageThumb} />
                    {isEditMode && (
                      <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteImage(img, idx)}>
                        <X size={16} color="red" />
                      </TouchableOpacity>
                    )}
                    {!isEditMode && !img && (
                      <View style={styles.demoBadge}>
                        <Text style={styles.demoBadgeText}>demo</Text>
                      </View>
                    )}
                  </View>
                );
              })}

            {/* Upload button */}
            {!loading && isEditMode && (
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

          {/* Update button */}
          {isEditMode && (
            <CustomButton title={'Update SubCategory'} onPress={handleSubmit} loading={loading} color="#5A4187" />
          )}

          {isEditMode && (
            <CustomButton title={'Delete'} onPress={()=>handleDelete(currentSelectedSubCategory._id)} loading={loading} color={CustomColor.RED_80} />
          )}
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

  demoBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default SubCategoryInfoEditor;
