import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

const CustomButton = ({
  title = 'Submit',          // Button text
  onPress,                  // Function to execute
  loading = false,          // Loading state
  color = '#5A4187',        // Button color (default: your provided color)
  textColor = '#fff',       // Text color
  disabled = false          // Optional: disable button
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, opacity: disabled || loading ? 0.7 : 1 }
      ]}
      onPress={!loading && !disabled ? onPress : null}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700'
  }
});
