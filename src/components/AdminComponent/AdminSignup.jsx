import React, { useContext, useState } from 'react';
import { Eye ,EyeOff } from 'lucide-react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    Platform,
} from 'react-native';
import { ThemeContext } from '../../design/ThemeContext';
import { CustomColor } from '../../design/Color';


const AdminSignup = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme.mode === 'dark';

    const [SignupType, setSignupType] = useState('phone');
    const [credentials, setCredentials] = useState({ SignupId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (name, value) => {
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSignup = () => {
        Alert.alert('Success', 'Signup successful!');
        navigation.navigate('Home');
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isDark ? theme.background : CustomColor.WHITE_COOL },
            ]}
        >
            {/* Heading */}
            <Text style={[styles.title, { color: theme.text }]}>
                Register in to Your{'\n'}
                <Text style={styles.boldText}>IndiaCart Account!</Text>
            </Text>

            {/* Social Login */}
            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/mac-os.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/windows-10.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <View style={styles.formGroup}>
                {/* First & Last Name */}
                <View style={styles.nameRow}>
                    <View style={styles.nameInputWrapper}>
                        <Text style={[styles.label, { color: theme.text }]}>First Name</Text>
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor={theme.placeholder || '#999'}
                            style={[
                                styles.input,
                                styles.nameInput,
                                {
                                    backgroundColor: theme.inputBackground,
                                    color: theme.text,
                                    borderColor: isDark ? 'transparent' : '#ccc',
                                    borderWidth: isDark ? 0 : 1,
                                    ...(!isDark ? styles.lightShadow : {})
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.nameInputWrapper}>
                        <Text style={[styles.label, { color: theme.text }]}>Last Name</Text>
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor={theme.placeholder || '#999'}
                            style={[
                                styles.input,
                                styles.nameInput,
                                {
                                    backgroundColor: theme.inputBackground,
                                    color: theme.text,
                                    borderColor: isDark ? 'transparent' : '#ccc',
                                    borderWidth: isDark ? 0 : 1,
                                    ...(!isDark ? styles.lightShadow : {})
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Signup ID */}
                <Text style={[styles.label, { color: theme.text }]}>
                    {SignupType === 'phone' ? 'Phone Number' : 'Email'}
                </Text>
                <TextInput
                    placeholder={SignupType === 'phone' ? 'Enter phone number' : 'Enter email'}
                    keyboardType={SignupType === 'phone' ? 'phone-pad' : 'email-address'}
                    placeholderTextColor={theme.placeholder || '#999'}
                    value={credentials.SignupId}
                    onChangeText={(text) => handleChange('SignupId', text)}
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.inputBackground,
                            color: theme.text,
                            borderColor: isDark ? 'transparent' : '#ccc',
                            borderWidth: isDark ? 0 : 1,
                            ...(!isDark ? styles.lightShadow : {})
                        },
                    ]}
                />

                {/* Password */}
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <View
                    style={[
                        styles.passwordWrapper,
                        {
                            backgroundColor: theme.inputBackground,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            borderColor: isDark ? 'transparent' : '#ccc',
                            borderWidth: isDark ? 0 : 1,
                            ...(!isDark ? styles.lightShadow : {})
                        },
                    ]}
                >
                    <TextInput
                        placeholder="Enter password"
                        placeholderTextColor={theme.placeholder || '#999'}
                        secureTextEntry={!showPassword}
                        value={credentials.password}
                        onChangeText={(text) => handleChange('password', text)}
                        style={[
                            styles.input,
                            styles.passwordInput,
                            { color: theme.text, marginBottom: 0, backgroundColor: 'transparent' },
                        ]}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                       { showPassword ?<Eye color={theme.text} size={24} />:
                                <EyeOff color={theme.text} size={24} />}
                    </TouchableOpacity>
                </View>
                <Text style={styles.dummyText}>Minimum length is 8 characters</Text>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
                style={[styles.signupButton, !isDark && styles.lightShadow,
                { backgroundColor: CustomColor.CYAN_80 }]}
                onPress={handleSignup}
            >
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>

            {/* User Login Prompt */}
            <Text style={[styles.signupPrompt, { color: theme.text }]}>
                Have an account?{' '}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('AdminLogin')}>
                    Login
                </Text>
            </Text>

            {/* Admin Prompt */}
            <Text style={[styles.signupPrompt, { color: theme.text, marginTop: 12 }]}>
                User?{' '}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>
                    Log In
                </Text>{' '}
                |{' '}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                    Sign Up
                </Text>
            </Text>
        </View>
    );
};

export default AdminSignup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 24,
    },
    boldText: {
        fontWeight: 'bold',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    iconButton: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        marginLeft: 10,
        fontSize: 18,
    },
    signupButton: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    signupText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signupPrompt: {
        textAlign: 'center',
    },
    signupLink: {
        color: '#2563eb',
        fontWeight: '600',
    },
    dummyText: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    nameInputWrapper: {
        flex: 1,
    },
    nameInput: {
        marginBottom: 0,
    },
    lightShadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
});
