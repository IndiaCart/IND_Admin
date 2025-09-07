import {launchImageLibrary} from 'react-native-image-picker';

/**
 * Opens gallery and returns the selected image details
 */
export const pickImageFromGallery = () => {
    console.log("pickerr")
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8},
      (response) => {
        if (response.didCancel) {
          reject('User cancelled image picker');
        } else if (response.errorCode) {
          reject(`ImagePicker Error: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          resolve({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          });
        } else {
          reject('No image selected');
        }
      }
    );
  });
};
