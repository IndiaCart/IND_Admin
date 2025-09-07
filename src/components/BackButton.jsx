import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../design/ThemeContext';

const BackButton = ({ margin = 12, size = 24, color = '#000', title }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      accessibilityHint="Navigates to the previous screen"
      style={[styles.container, { margin }]}
    >
      {Platform.OS === 'ios' ? (
        <ChevronLeft size={size} color={color || theme.text} />
      ) : (
        <ArrowLeft size={size} color={color || theme.text} />
      )}
      {title && (
        <Text style={[styles.title, { color: color || theme.text }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom:10
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
  },
});
