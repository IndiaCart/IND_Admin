import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Manage from '../../components/AdminComponent/productComponent/Manage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateProduct from '../../Screens/AdminScreen/productScreen/CreateProduct';
import ProductAction from '../../Screens/AdminScreen/productScreen/ProductAction';
import ViewProduct from '../../Screens/AdminScreen/productScreen/ViewProduct';
import ProductInfoEditor from '../../Screens/AdminScreen/productScreen/ProductInfoEditor';
import CategoryAction from '../../Screens/AdminScreen/categoryScreen/categoryAction';
import ViewCategory from '../../Screens/AdminScreen/categoryScreen/ViewCategory';
import CategoryInfoEditor from '../../Screens/AdminScreen/categoryScreen/CategoryInfoEditor';
import CreateCategory from '../../Screens/AdminScreen/categoryScreen/CreateCategory';
import ViewSubCategory from '../../Screens/AdminScreen/categoryScreen/ViewSubCategory';
import SubCategoryInfoEditor from '../../Screens/AdminScreen/categoryScreen/SubCategoryInfoEditor';
import CreateSubCategory from '../../Screens/AdminScreen/categoryScreen/CreateSubCategory';

const ManagesStack = createNativeStackNavigator();

const ManageStack = () => {
  return (
    <ManagesStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='manage' >
      {/* Main Manage Component */}
      <ManagesStack.Screen name="manage" component={Manage} />

      {/* productAction Route */}
      <ManagesStack.Screen name="productAction" component={ProductAction} />
      <ManagesStack.Screen name="createProduct" component={CreateProduct} />
      <ManagesStack.Screen name="products" component={ViewProduct} />
      <ManagesStack.Screen name="editManageProduct" component={ProductInfoEditor} />
      
    {/* Category , sub-category , variation Route */}
      <ManagesStack.Screen name="categoryAction" component={CategoryAction} />
    {/* =========================================================================== */}
      <ManagesStack.Screen name="Category" component={ViewCategory} />
       <ManagesStack.Screen name="createCategory" component={CreateCategory} />
      <ManagesStack.Screen name="editManageCategory" component={CategoryInfoEditor} />

      {/* SubCategory Route */}
       <ManagesStack.Screen name="SubCategory" component={ViewSubCategory} />
       <ManagesStack.Screen name="CreateSubCategory" component={CreateSubCategory} />
       <ManagesStack.Screen name="editManageSubCategory" component={SubCategoryInfoEditor} />

      {/* Variation */}
       <ManagesStack.Screen name="variation" component={ViewCategory} />
       <ManagesStack.Screen name="CreateVariation" component={CreateCategory} />
       <ManagesStack.Screen name="editManageVariation" component={SubCategoryInfoEditor} />


    </ManagesStack.Navigator>
  )
}

export default ManageStack