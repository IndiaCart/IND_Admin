import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

// ========== Admin Screens ==========
import AdminLogin from '../components/AdminComponent/AdminLogin';
import AdminSignup from '../components/AdminComponent/AdminSignup';
import AdminAppNavigation from './AdminNavigation/AdminAppNavigation';

// ========== Navigators ==========
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Admin Dashboard Flow
          <Stack.Screen name="AdminHome" component={AdminAppNavigation} />
        ) : (
          // Admin Auth Flow
          <>
            <Stack.Screen name="AdminLogin" component={AdminLogin} />
            <Stack.Screen name="AdminSignup" component={AdminSignup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
