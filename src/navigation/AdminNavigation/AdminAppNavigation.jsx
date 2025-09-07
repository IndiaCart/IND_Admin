import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import EditProfile from '../../Screens/AdminScreen/EditProfile';
import MainTabs from './MainTab';

const Admin = createNativeStackNavigator();
// Contains Admin related All Routes
const AdminAppNavigation = () => {
  return (
    <>
     <Admin.Navigator screenOptions={{ headerShown: false }}>
      <Admin.Screen name="MainTabs" component={MainTabs} />
      {/* <Admin.Screen name="EditProfile" component={EditProfile} /> */}
    </Admin.Navigator>
    </>
  );
};

export default AdminAppNavigation;
