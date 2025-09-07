// MenuButton.js

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../design/ThemeContext';
import { CustomColor } from '../../design/Color';

const MenuButton = ({
  icon,
  label,
  navigateTo, 
  onPress,
}) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handlePress = () => {
    if (onPress) return onPress();
    if (navigateTo) navigation.navigate(navigateTo);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor:theme.mode =="dark"? CustomColor.PRUSSIAN_70 : CustomColor.WHITE_COOL,
          borderColor: theme.text,
        },
      ]}
    >
      {/* Left Icon */}
      <View style={styles.left}>
        {React.cloneElement(icon, {
          color: theme.mode =="dark"? CustomColor.WHITE : CustomColor.PRUSSIAN_100,
          size: 20,
        })}
      </View>

      {/* Label */}
      <Text style={[styles.label, { color: theme.text }]}>
        {label}
      </Text>

      {/* Right side: badge (if any) + chevron */}
      <View style={styles.right}>
        <ChevronRight color={theme.text} size={20} />
      </View>
    </TouchableOpacity>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  left: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
