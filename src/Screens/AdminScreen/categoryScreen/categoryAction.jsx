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
  SquaresSubtract,
  PackagePlus,
  ChartBarStacked,
  GitPullRequestCreate
} from 'lucide-react-native';
import { ThemeContext } from '../../../design/ThemeContext';
const CategoryAction = () => {
  const { theme } = useContext(ThemeContext);

  // your menu actions for this page
  const actions = [
    { icon: <ShoppingBag />, label: 'Category', navigateTo: 'Category' },
    { icon: <FilePlus2 />, label: 'Create Category', navigateTo: 'createCategory' },
    { icon: <SquaresSubtract />, label: 'SubCategory', navigateTo: 'SubCategory' },
    { icon: <PackagePlus />, label: 'Create SubCategory', navigateTo: 'CreateSubCategory' },
    { icon: <ChartBarStacked />, label: 'variation', navigateTo: 'variation' },
    { icon: <GitPullRequestCreate />, label: 'CreateVariation', navigateTo: 'CreateVariation' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <BackButton color={theme.text} title={'Category Actions'}/>

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

export default CategoryAction;

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
