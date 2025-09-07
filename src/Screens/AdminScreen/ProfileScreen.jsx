import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { handleGoogleLogout } from '../../utils/GoogleLogin';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Sign out of Google
      await handleGoogleLogout(dispatch);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Public',
              state: {
                index: 0,
                routes: [{ name: 'Login' }],
              },
            },
          ],
        })
      );
    } catch (err) {
      Alert.alert('Logout Error', 'Unable to log out. Please try again.');
      console.log('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Logout"
          color="#dc3545"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden', // ensures button corners stay rounded on Android
  },
});
