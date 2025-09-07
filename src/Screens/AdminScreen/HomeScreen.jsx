import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../design/ThemeContext';
import { pickImageFromGallery } from '../../utils/imagePicker';
import { uploadToImageKit } from '../../utils/imageKitUpload';
import { Portal, Snackbar } from 'react-native-paper';

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handlePick = async () => {
    try {
      const imageData = await pickImageFromGallery();
      const uploaded = await uploadToImageKit(imageData, 'product');
      if (uploaded) {
        setShowSnackBar(true);
      }
      console.log('uploaded =>', uploaded);
    } catch (err) {
      console.error('Upload Error:', err);
      Alert.alert('Upload Failed', err.message || 'Something went wrong');
    }
  };

  const onDismissSnackBar = () => setShowSnackBar(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>Welcome to Home screen</Text>
      <Text style={{ color: theme.text }} onPress={handlePick}>Pick</Text>

      <Portal>
        <Snackbar
          visible={showSnackBar}
          onDismiss={onDismissSnackBar}
          duration={3000}
        >
          Image uploaded successfully!
        </Snackbar>
      </Portal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
});
