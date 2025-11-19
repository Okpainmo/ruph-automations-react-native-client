import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Store user data in AsyncStorage
const storeUserData = async (userData: {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (error: any) {
    console.log('AsyncStorage error:', error);
    throw new Error('Failed to store user data');
  }
};

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = !name || !email || !password || !repeatPassword;

  const handleSignUp = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        // 'https://api.ruphautomations.zedlabs.xyz/api/v1/auth/register',
        'https://api.ruphautomations.xyz/api/v1/auth/register',
        // 'http://localhost:5000/api/v1/auth/register',
        { name, email, password }
      );

      const { response: data, responseMessage } = response.data;
      console.log(responseMessage);

      await storeUserData({
        id: data.userProfile.id,
        name: data.userProfile.name,
        email: data.userProfile.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      router.push('/(main)/controllers');
    } catch (error: any) {
      console.log('Sign-up error:', error.response || error.message);
      Alert.alert(
        'Sign-Up Failed',
        error.response?.data?.responseMessage || 'Unable to sign up'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sign Up</Text>
        </View>

        {/* Name Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='Your Name'
            style={styles.inputField}
          />
        </View>

        {/* Email Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='email@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            style={styles.inputField}
          />
        </View>

        {/* Password Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder='Enter your password'
              secureTextEntry={!showPassword}
              style={[
                styles.passwordInput,
                { flex: 1, borderRightWidth: 0, borderLeftWidth: 0 },
              ]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              <Text style={{ color: '#007bff', fontWeight: '600' }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Password Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Repeat Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              placeholder='Repeat your password'
              secureTextEntry={!showRepeatPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              style={styles.toggleButton}
            >
              <Text style={{ color: '#007bff', fontWeight: '600' }}>
                {showRepeatPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            styles.button,
            (isDisabled || loading) && styles.buttonDisabled,
          ]}
          disabled={isDisabled || loading}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Link to Log In */}
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Link href='/(auth)/log-in' asChild>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Already have an account?{' '}
              <Text style={{ color: '#007bff' }}>log in instead</Text>
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, padding: 16, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  backButtonText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold' },
  formGroup: { gap: 8 },
  label: { fontSize: 14, color: '#666666' },

  // Regular Input
  inputField: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },

  // Password Input Container
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingRight: 12,
    backgroundColor: '#FFFFFF',
    height: 55,
  },

  // Password Input
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderRadius: 10,
  },

  toggleButton: { marginLeft: 12 },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
});
