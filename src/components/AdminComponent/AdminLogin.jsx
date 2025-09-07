import React, { useContext, useState, useRef, useEffect } from 'react';
import { HOSTED_URL } from '@env';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { ThemeContext } from '../../design/ThemeContext';
import { CustomColor } from '../../design/Color';
import { Eye, EyeOff } from 'lucide-react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import detectLoginType from '../../utils/detectLoginType';
import { adminLoginUrl, adminVarifyOTPUrl, sendOtpForLoginUrl } from '../../utils/apis/platformAPI';
import { Portal, Snackbar } from 'react-native-paper';
import loginIcon from "../../assets/acces_icon.png";
import { handleGoogleLogin } from '../../utils/GoogleLogin';
import BackButton from '../BackButton';
import CustomButton from '../CustomButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OTP_LENGTH = 6;

const AdminLogin = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [mode, setMode] = useState('otp'); // 'password' | 'otp'
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.user || {});
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [showSnackBarMessage, setShowSnackBarMessage] = useState("");
  const otpInputs = useRef([]);

  const isEmail = loginId.includes('@');
  const idField = isEmail ? 'email' : 'phoneNumber';

  /**
   * Sends OTP to the entered email or phone number
   */
  const sendOtp = async () => {
    if (!loginId) {
      setShowSnackBarMessage("Please enter email or phone number");
      setShowSnackBar(true);
      return;
    }

    try {
      dispatch({ type: "START_LOADING" });
      const response = await axios.post(`${HOSTED_URL}${sendOtpForLoginUrl}`, { [idField]: loginId });

      if (response?.data?.success) {
        setOtpSent(true);
        setMode('otp');
        setTimeout(() => otpInputs.current[0]?.focus(), 200);
      } else {
        setShowSnackBarMessage(response?.data?.message || "Failed to send OTP");
        setShowSnackBar(true);
      }
    } catch (err) {
      setShowSnackBarMessage(err?.response?.data?.message || err.message || "Failed to send OTP");
      setShowSnackBar(true);
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  /**
   * Resets OTP state when cleared
   */
  useEffect(() => {
    if (otp.every(digit => digit === '')) {
      setInvalidOtp(false);
    }
  }, [otp]);

  /**
   * Verifies OTP for admin login
   */
  const verifyOtpAndLogin = async () => {
    const code = otp.join('');
    console.log("code length", code.length)
    console.log("code OTP_LENGTH", OTP_LENGTH)
    if (code.length < OTP_LENGTH) {
      setShowSnackBarMessage(`Please enter ${OTP_LENGTH}-digit code`);
      setShowSnackBar(true);
      return;
    }

    dispatch({ type: "START_LOADING" });
    try {
      const response = await axios.post(`${HOSTED_URL}${adminVarifyOTPUrl}`, { [idField]: loginId, otp: code });
      const { success, errorType ,message } = response.data;
      console.log("otp res", response.data)
      if (success) {
          dispatch({ type: "EMAIL_PASSWORD_LOGIN_SUCCESS", payload: response.data });
        } else if (errorType === "INVALID_OTP") {
          setInvalidOtp(true);
          setShowSnackBarMessage(message || "Something went wrong");
        } else if (errorType === "NOT_ADMIN") {
          setShowSnackBarMessage("This account is not authorized as an admin");
          setOtpSent(false);
          resetOtpField();
        } else {
          setShowSnackBarMessage(message || "Something went wrong");
        }
    } catch (err) {
      setShowSnackBarMessage(err?.response?.data?.message || err.message || "OTP verification failed");
    } finally {
      dispatch({ type: "STOP_LOADING" });
      setShowSnackBar(true);
    }
  };

  /**
   * Handles admin login via email/phone and password
   */
  const handleLogin = async () => {
    if (!loginId || !password) {
      setShowSnackBarMessage("Please enter credentials");
      setShowSnackBar(true);
      return;
    }

    const field = detectLoginType(loginId);
    dispatch({ type: "START_LOADING" });
    try {
      const response = await axios.post(`${HOSTED_URL}${adminLoginUrl}`, { [field]: loginId, password });
      if (response?.data?.success) {
        dispatch({ type: "EMAIL_PASSWORD_LOGIN_SUCCESS", payload: response.data });
      } else {
        setShowSnackBarMessage(response?.data?.message || 'Login failed');
        setShowSnackBar(true);
      }
    } catch (err) {
      setShowSnackBarMessage(err?.response?.data?.message || err.message || 'Login error');
      setShowSnackBar(true);
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  /**
   * Handles OTP input per digit and triggers auto-submit when filled
   */
  const handleOtpInput = (text, idx) => {
  if (!/^\d?$/.test(text)) return;

  const newOtp = [...otp];

  // If user clears a field (backspace)
  if (!text) {
    newOtp[idx] = ""; // Clear current field
    setOtp(newOtp);

    // Always move focus backward if possible
    if (idx > 0) {
      otpInputs.current[idx - 1]?.focus();
    }
    return;
  }

  // If user types a digit
  newOtp[idx] = text;
  setOtp(newOtp);

  // Move focus forward
  if (idx < OTP_LENGTH - 1) {
    otpInputs.current[idx + 1]?.focus();
  }
};
const handleKeyPress = (e, idx) => {
  if (e.nativeEvent.key === 'Backspace') {
    if (otp[idx] === '' && idx > 0) {
      // Move focus to previous field if current one is already empty
      otpInputs.current[idx - 1]?.focus();
    } else {
      // Clear the current field
      const newOtp = [...otp];
      newOtp[idx] = '';
      setOtp(newOtp);
    }
  }
};

  /**
   * Resets OTP input fields
   */
  const resetOtpField = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimeout(() => otpInputs.current[0]?.focus(), 150);
  };

  /**
   * Handles OTP resend request
   */
  const handleResendOtp = async () => {
    resetOtpField();
    await sendOtp();
  };

  const onDismissSnackBar = () => {
    setShowSnackBar(false);
    setShowSnackBarMessage("");
  };

  /**
   * Handles Google login flow
   */
  const handleLoginViaGoogle = async () => {
    try {
      await handleGoogleLogin(dispatch);
    } catch (err) {
      console.log('Google Login error:', err.message);
    }
  };
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.background === '#fff' ? 'dark-content' : 'light-content'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kavo}
        >
          {otpSent && <BackButton color={theme.text} title={'Mobile number verification'} />}
          {!otpSent && <Text style={[styles.title, { color: '#5A4187' }]}>Admin</Text>}
          <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: 20 }]} keyboardShouldPersistTaps="handled">
            {/* Top illustration area - full width */}


            <View style={[styles.topArea, { backgroundColor: theme.background }]}>
              <Image source={loginIcon} style={styles.heroImage} />
            </View>
            {/* form area - full width */}
            <View style={styles.form}>
              {!otpSent && <TextInput
                placeholder="Email or Phone"
                value={loginId}
                onChangeText={setLoginId}
                keyboardType={'email-address'}
                placeholderTextColor={'#5A4187'}
                style={[
                  styles.inputPill,
                  { backgroundColor: '#E8DDE5', color: '#5A4187' }
                ]}
              />}

              {mode === 'password' && (
                <View style={[styles.inputRow, { backgroundColor: '#E8DDE5', borderColor: theme.inputBorder || theme.border }]}>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={'#5A4187'}
                    style={[styles.inputInner, { color: theme.text }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={20} color={theme.text} /> : <Eye size={20} color={theme.text} />}
                  </TouchableOpacity>
                </View>
              )}

              {mode === 'otp' && otpSent && (
                <View style={[styles.otpContainer, { backgroundColor: '#E8DDE5' }]}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      type={Number}
                      ref={ref => otpInputs.current[idx] = ref}
                      value={digit}
                      onChangeText={text => handleOtpInput(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="numeric"
                      maxLength={1}
                      style={[styles.otpBox, { borderBottomColor: invalidOtp ? CustomColor.RED_60 : '#5A4187', color: invalidOtp ? CustomColor.RED_60 : '#5A4187' }]}
                    />
                  ))}
                </View>
              )}

              {invalidOtp && <Text style={{ color: CustomColor.RED_60 }}>Invalide Otp</Text>}


              {otpSent && <TouchableOpacity onPress={handleResendOtp
              } style={[styles.resendBtn]}>
                <Text style={styles.resendBtnText}>Resend code?</Text>
              </TouchableOpacity>}

              <CustomButton
                title={otpSent ? 'Verify OTP' : mode === 'password' ? 'Login' : 'Send OTP'}
                onPress={otpSent ? verifyOtpAndLogin : mode === 'password' ? handleLogin : sendOtp}
                loading={loading}
                color="#5A4187"
              />

              <View style={styles.rowCenter}>
                <TouchableOpacity onPress={() => { setMode(mode === 'password' ? 'otp' : 'password'); setOtp(Array(OTP_LENGTH).fill('')); }}>
                  <Text style={styles.switchText}>
                    {mode === 'password' ? 'Or Login with OTP' : 'Or Login with Password'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.orRow}>
                <View style={styles.line} />
                <Text style={[styles.orText, { color: theme.placeholder }]}>OR login with</Text>
                <View style={styles.line} />
              </View>


              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.iconButton} onPress={handleLoginViaGoogle}>
                  <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                  <Image source={require('../../assets/mac-os.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Image source={require('../../assets/windows-10.png')} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomRow}>
                <Text style={[styles.smallText, { color: theme.placeholder }]}>Login with user? </Text>
                <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                  <Text style={[styles.linkText]}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* subtle footer bubble */}
            <View style={styles.footerWrap}>
              <View style={[styles.footerBubble, { backgroundColor: CustomColor.CYAN_10 }]} />
            </View>

            <Portal>
              <Snackbar visible={showSnackBar} onDismiss={onDismissSnackBar} duration={5000}>
                {showSnackBarMessage}
              </Snackbar>
            </Portal>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  kavo: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 36,
    paddingTop: 0,
    width: '100%',
  },
  topArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    marginBottom: 6,
    position: 'relative',
  },
  topBubble: {
    position: 'absolute',
    left: -40,
    top: -10,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.45,
    borderRadius: 40,
    opacity: 0.18,
  },
  topBubbleSmall: {
    position: 'absolute',
    right: -30,
    top: 10,
    width: 110,
    height: 110,
    borderRadius: 80,
    opacity: 0.12,
  },
  heroImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 6,
    textAlign: 'center',
    fontFamily: "serif"
  },

  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'stretch',
    marginTop: 8,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: { fontSize: 15, fontWeight: '600', color: '#666' },

  form: {
    width: '100%',
    marginTop: 4,
    alignItems: 'center',
    paddingHorizontal: 0,
  },

  inputPill: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  inputRow: {
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputInner: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    fontWeight: "600",
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 16,
    width: '100%',
    alignSelf: "flex-end",
    borderRadius: 30,
    height: 60,
    paddingLeft: 12,
    paddingRight: 12
  },
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    backgroundColor: 'transparent',
  },

  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  rowCenter: { width: '100%', alignItems: 'center', marginTop: 6 },
  switchText: { fontSize: 14, color: '#666' },

  orRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: '#E6E6E6' },
  orText: { marginHorizontal: 10, fontSize: 13 },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 14,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: { color: '#fff', fontSize: 20, fontWeight: '700' },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  smallText: { fontSize: 13 },
  linkText: { fontSize: 13, color: CustomColor.CYAN_80, fontWeight: '700' },

  footerWrap: {
    alignSelf: 'stretch',
    marginTop: 18,
    alignItems: 'flex-start',
    paddingLeft: 8,
  },
  footerBubble: {
    width: 80,
    height: 80,
    borderRadius: 50,
    opacity: 0.16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain'
  },
  resendBtn: {
    marginVertical: 20
  },
  resendBtnText: {
    fontSize: 18,
    fontWeight: "700",
    textDecorationLine: "underline",
    color: "#5A4187"
  }
});
