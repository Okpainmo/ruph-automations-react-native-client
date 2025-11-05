import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RouteProtector from '../../components/RouteProtector';

export default function ActivateControllerScreen() {
  const routerNav = useRouter();

  const [email, setEmail] = useState('');
  // const [controllerId /* setControllerId */] = useState('');
  const [controllerName, setControllerName] = useState('');
  const [controllerBatchId, setControllerBatchId] = useState(''); // NEW
  const [loading, setLoading] = useState(false);

  const isDisabled = !controllerName || !controllerBatchId; // NEW

  // Fetch user email from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setEmail(parsed.email || '');
        }
      } catch (error) {
        console.log('Failed to get user email:', error);
      }
    };
    fetchUser();
  }, []);

  const handleActivate = async () => {
    if (!email) {
      Alert.alert('Error', 'User email not available.');
      return;
    }

    if (!controllerBatchId) {
      Alert.alert('Error', 'Controller Batch ID is required.');
      return;
    }

    setLoading(true);

    try {
      // Fetch user data from AsyncStorage to get access token
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        Alert.alert('Error', 'User not found in local storage.');
        setLoading(false);
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const accessToken = parsedUser.accessToken;

      const payload = {
        ownerEmail: email, // prefilled
        // controllerId,
        controllerName,
        isActivated: true, // auto add
      };

      console.log(accessToken, email);

      const response = await axios.patch(
        `https://api.ruphautomations.zedlabs.xyz/api/v1/system/update-controller/${controllerBatchId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            email: email, // optional header if your backend uses it
            client: 'mobile',
          },
        }
      );

      console.log('Activation successful:', response.data);

      Alert.alert('Success', 'Controller activated successfully');
      routerNav.push('/(main)/controllers');
    } catch (error: any) {
      console.log('Activation failed:', error.response || error.message);
      Alert.alert(
        'Activation Failed',
        error.response?.data?.responseMessage || 'Could not activate controller'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteProtector>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => routerNav.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Activate Controller</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>User Email</Text>
          <TextInput
            value={email}
            style={[
              styles.input,
              { backgroundColor: '#f3f4f6', color: '#6b7280' },
            ]}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Controller Batch ID</Text>
          <TextInput
            value={controllerBatchId}
            onChangeText={setControllerBatchId}
            placeholder='Enter Batch ID'
            autoCapitalize='characters'
            style={styles.input}
          />
        </View>

        {/* <View style={styles.formGroup}>
          <Text style={styles.label}>Controller ID</Text>
          <TextInput
            value={controllerId}
            onChangeText={setControllerId}
            placeholder='e.g., CTR-0001'
            autoCapitalize='characters'
            style={styles.input}
          />
        </View> */}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Controller Name</Text>
          <TextInput
            value={controllerName}
            onChangeText={setControllerName}
            placeholder='e.g., Main Pump Room'
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (isDisabled || loading) && styles.buttonDisabled,
          ]}
          disabled={isDisabled || loading}
          onPress={handleActivate}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Activating...' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
    </RouteProtector>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
