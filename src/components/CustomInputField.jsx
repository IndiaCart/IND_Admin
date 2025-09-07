import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../design/ThemeContext';
import { CustomColor } from '../design/Color';
import PropTypes from 'prop-types';

const CustomInputField = ({ label, isRequired, value, onChangeText, placeholder, optional, isEditable = true }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      {label ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={[styles.label, { color: theme.text }]}>
            {label}
            {isRequired && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
          {optional && (
            <Text style={{ fontStyle: 'italic', fontSize: 12, color: theme.text }}>(Optional)</Text>
          )}
        </View>
      ) : null}

      {/* Input Field */}
      <TextInput
        editable={isEditable}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1f1f1f' : CustomColor.GREY_10,
            color: theme.text,
            borderColor: isDarkMode ? '#444' : '#ccc',
            opacity: isEditable ? 1 : 0.6,
          },
        ]}
      />
    </View>
  );
};

// Default props
CustomInputField.defaultProps = {
  label: '',
  isRequired: false,
  value: '',
  onChangeText: () => {},
  placeholder: '',
  optional: false,
  isEditable: true,
};

// Prop types
CustomInputField.propTypes = {
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  optional: PropTypes.bool,
  isEditable: PropTypes.bool,
};

// Styles
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.2,
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default CustomInputField;
