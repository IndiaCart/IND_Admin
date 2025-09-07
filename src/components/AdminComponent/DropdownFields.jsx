// components/DropdownFields.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ThemeContext } from '../../design/ThemeContext';
import CustomInputField from '../CustomInputField';

const DropdownFields = ({ fields, onSelectChange, selectedVariations, isEditMode = true }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedValues, setSelectedValues] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [inputField, setInputField] = useState({});

  const dropdownFields = fields.filter((f) => f.type === 'dropdown');
  const textFields = fields.filter((f) => f.type === 'text');

  // Prefill dropdowns by matching variation.name to field.name
 useEffect(() => {
  if (
    selectedVariations &&
    Array.isArray(selectedVariations) &&
    Object.keys(selectedValues).length === 0 &&
    Object.keys(inputField).length === 0
  ) {
    const prefilledDropdowns = {};
    const prefilledTexts = {};

    selectedVariations.forEach((variation) => {
      // Dropdown prefill
      const dropdownField = dropdownFields.find(f => f.name === variation.name);
      if (dropdownField) {
        const val = variation.value ?? (Array.isArray(variation.options) && variation.options[0]);
        if (val) prefilledDropdowns[dropdownField._id] = val;
      }

      // Text prefill
      const textField = textFields.find(f => f.name === variation.name);
      if (textField) {
        const val = variation.value ?? (Array.isArray(variation.options) && variation.options[0]);
        if (val) prefilledTexts[textField._id] = val;
      }
    });

    setSelectedValues(prefilledDropdowns);
    setInputField(prefilledTexts);
  }
}, [selectedVariations, dropdownFields, textFields]);


  const openField = (field) => {
    if (isEditMode) setActiveField(field);
  };
  const closeField = () => setActiveField(null);

  const handleSelect = (field, option) => {
    const updated = { ...selectedValues, [field._id]: option };
    setSelectedValues(updated);
    onSelectChange(field, option);
    closeField();
  };

  const handleTextChange = (field, value) => {
    setInputField((prev) => ({ ...prev, [field._id]: value }));
    onSelectChange(field, value);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown fields */}
      {dropdownFields.map((field) => {
        const isDisabled = !isEditMode;
        const displayText = selectedValues[field._id] || `Select ${field.name}`;
        return (
          <View key={field._id} style={styles.dropdownWrapper}>
            <Text style={[styles.label, { color: theme.text }]}>{field.name}</Text>
            <TouchableOpacity
              disabled={isDisabled}
              style={[
                styles.box,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: isDisabled ? theme.placeholder : theme.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => openField(field)}
            >
              <Text
                style={[
                  styles.boxText,
                  { color: isDisabled ? theme.placeholder : theme.text },
                ]}
              >
                {displayText}
              </Text>
              <ChevronDown
                size={18}
                color={isDisabled ? theme.placeholder : theme.text}
              />
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Text fields */}
      {textFields.map((field) => (
        <View key={field._id} style={{ width: '48%', minWidth: 150 }}>
          <CustomInputField
            label={field.name}
            isRequired
            editable={isEditMode}
            value={inputField[field._id] || ''}
            onChangeText={(value) => handleTextChange(field, value)}
          />
        </View>
      ))}

      {/* Options modal */}
      <Modal
        visible={!!activeField}
        transparent
        animationType="fade"
        onRequestClose={closeField}
      >
        <View style={styles.modalWrapper}>
          <TouchableWithoutFeedback onPress={closeField}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>  
            <View style={[styles.modalHandle, { backgroundColor: theme.placeholder }]} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>  
              Select {activeField?.name}
            </Text>
            <FlatList
              data={activeField?.options || []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(activeField, item)}
                >
                  <Text style={[styles.optionText, { color: theme.text }]}>  
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownFields;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
  },
  dropdownWrapper: {
    width: '48%',
    minWidth: 150,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  boxText: {
    fontSize: 14,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  modalContent: {
    maxHeight: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});
