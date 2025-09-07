import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import { HOSTED_URL } from '@env';
import { useDispatch } from 'react-redux';
import { persistor } from '../Redux/Store';
import { verifyGoogleLoginUrl } from './apis/platformAPI';
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};


export const handleGoogleLogin = async (dispatch) => {
  try {
    dispatch({type:"START_LOADING"});
    const response = await GoogleLogin();
    const { idToken, user } = response.data;
    console.log("google response =>", response)
    if (!idToken || !user?.email) {
      throw new Error("Missing ID token or user email from Google");
    }
    // 👇 Send to your backend
    const backendResp = await axios.post(`${HOSTED_URL}${verifyGoogleLoginUrl}`, {
      token: idToken,
      email: user.email,
    });

    if(backendResp.data.success){
      dispatch({type:"GOOGLE_LOGIN_SUCCESS", payload:backendResp.data})
    }else{
      dispatch({type:"STOP_LOADING"})
      return
    }
  } catch (error) {
     dispatch({type:"STOP_LOADING"})
      console.error("Google login failed:", error?.response?.data || error.message);
  }
};

export const handleGoogleLogout= async(dispatch)=> {
	try {
		await GoogleSignin.signOut();

    //Clear Redux state & persisted storage
      dispatch({type: 'LOGOUT_USER' });
      await persistor.purge();
      console.log("Logout successfull..")
		// Perform additional cleanup and logout operations.
	} catch (error) {
		console.log('Google Sign-Out Error: ', error);
	}
}