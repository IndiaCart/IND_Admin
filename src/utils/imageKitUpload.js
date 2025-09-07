import axios from 'axios';
import {IMAGEKIT_PUBLIC_KEY ,HOSTED_URL , IMAGEKIT_UPLOAD_BASE_URL} from '@env';
import { getAuthForImageKit, uploadImgToImageKitUrl } from './apis/platformAPI';

export const uploadToImageKit = async (file, folderName = "" , dispatch) => {
  dispatch({type:"START_MANAGE_LOADING"})
  try {
    const authRes = await axios.get(`${HOSTED_URL}${getAuthForImageKit}`);
    const auth = authRes.data;
    const formData = new FormData();
    console.log("sss", auth)
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formData.append('fileName', file.name);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    // these are comming from backend inside auth file;
    formData.append('signature', auth.signature);
    formData.append('token', auth.token);
    formData.append('expire', auth.expire);

     // folder name here (like "products" or "users") for upload in which folder
    if (folderName) {
      formData.append('folder', `ind/${folderName}`);
    }
    const response = await axios.post(`${IMAGEKIT_UPLOAD_BASE_URL}${uploadImgToImageKitUrl}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Imager upload" , response)
    if(response){
       dispatch({type:"STOP_LOADING_MANAGE"})
    }else{
      dispatch({type:"STOP_LOADING_MANAGE"})
    }

    return response.data;
  } catch (error) {
    dispatch({type:"STOP_LOADING_MANAGE"})
    console.log('ImageKit Upload Error:', error);
    throw error;
  }
};
