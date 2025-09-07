// utils/deleteImage.js
import axios from 'axios';
import {HOSTED_URL} from '@env'
import { deleteFileFromServerUrl } from './apis/adminAPI';
export const deleteImageFromServer = async ( dispatch ,fileId) => {
  dispatch({type:"START_MANAGE_LOADING"})
  try {
    const res = await axios.delete(`${HOSTED_URL}${deleteFileFromServerUrl}/${fileId}`);
    dispatch({type:"STOP_LOADING_MANAGE"})
    return res.data;
  } catch (err) {
     dispatch({type:"STOP_LOADING_MANAGE"})
    console.error('Error deleting image:', err.response?.data || err.message);
    throw err;
  }
};
