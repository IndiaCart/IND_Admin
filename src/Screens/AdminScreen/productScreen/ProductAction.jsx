import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import BackButton from '../../../components/BackButton';
import MenuButton from '../../../components/AdminComponent/MenuButton';
import {
  ShoppingBag,
  FilePlus2,
  Pencil,
  Trash2,
  Axis3D,
} from 'lucide-react-native';
import { ThemeContext } from '../../../design/ThemeContext';
const ProductAction = () => {
  const { theme } = useContext(ThemeContext);

  // your menu actions for this page
  const actions = [
    { icon: <ShoppingBag />, label: 'Products', navigateTo: 'products' },
    { icon: <FilePlus2 />, label: 'Create Product', navigateTo: 'createProduct' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <BackButton color={theme.text} title={'Product Actions'}/>

      <ScrollView contentContainerStyle={styles.content}>
        {actions.map((action, idx) => (
          <MenuButton
            key={idx}
            icon={React.cloneElement(action.icon, { color: theme.text, size: 24 })}
            label={action.label}
            navigateTo={action.navigateTo}
            style={styles.menuButton}
            textStyle={{ color: theme.text }}
            badge={!action.navigateTo && { text: 'Soon', color: theme.primary }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductAction;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'start',
    marginLeft: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuButton: {
    marginVertical: 8,
  },
});
