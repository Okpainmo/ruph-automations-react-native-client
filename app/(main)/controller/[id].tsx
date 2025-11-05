import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RouteProtector from '../../../components/RouteProtector';

interface Controller {
  id: number;
  controllerId: string;
  ownerEmail: string;
  controllerName: string;
  circuitEndPoint_1: string;
  circuitEndPoint_2: string;
  circuitEndPoint_3: string;
  circuitEndPoint_4: string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export default function ControllerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [controller, setController] = useState<Controller | null>(null);
  const [loading, setLoading] = useState(true);
  const [switches, setSwitches] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
  });

  // Fetch controller details
  useEffect(() => {
    const fetchController = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const user: UserData | null = storedUser
          ? JSON.parse(storedUser)
          : null;

        if (!user?.email || !user?.accessToken) {
          Alert.alert('Session expired', 'Please log in again.');
          router.replace('/(auth)/log-in');
          return;
        }

        const response = await axios.get(
          `https://api.ruphautomations.zedlabs.xyz/api/v1/system/get-controller/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              email: user.email,
              client: 'mobile',
              'Content-Type': 'application/json',
            },
          }
        );

        const fetchedController = response.data?.response?.system;
        const newAccessToken = response.data?.response?.accessToken;
        const newRefreshToken = response.data?.response?.refreshToken;

        console.log(fetchedController);

        if (newAccessToken && newRefreshToken) {
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({
              ...user,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );
        }

        setController(fetchedController);
      } catch (err: any) {
        console.error('Error fetching controller:', err?.message || err);
        Alert.alert('Error', 'Failed to load controller.');
      } finally {
        setLoading(false);
      }
    };

    fetchController();
  }, [id]);

  // Handle switch toggles
  const handleSwitchChange1 = async (value: boolean) => {
    try {
      const url = String(controller?.circuitEndPoint_1);
      const response = await axios.patch(url, {
        relay1: value === false ? 1 : 0,
      });

      console.log(response);
      console.log(response.status);

      if (response.status === 200) {
        setSwitches({ ...switches, c1: !value });
      }
    } catch (error: any) {
      console.log(error);
      console.error('Error toggling switch:', error?.message || error);
      Alert.alert('Error', 'Failed to toggle circuit.');
    }
  };

  const handleSwitchChange2 = async (value: boolean) => {
    try {
      const url = String(controller?.circuitEndPoint_2);
      const response = await axios.patch(url, {
        relay2: value === false ? 1 : 0,
      });

      console.log(response);
      console.log(response.status);

      if (response.status === 200) {
        setSwitches({ ...switches, c2: !value });
      }
    } catch (error: any) {
      console.log(error);
      console.error('Error toggling switch:', error?.message || error);
      Alert.alert('Error', 'Failed to toggle circuit.');
    }
  };

  const handleSwitchChange3 = async (value: boolean) => {
    try {
      const url = String(controller?.circuitEndPoint_3);
      const response = await axios.patch(url, {
        relay3: value === false ? 1 : 0,
      });

      console.log(response);
      console.log(response.status);

      if (response.status === 200) {
        setSwitches({ ...switches, c3: !value });
      }
    } catch (error: any) {
      console.log(error);
      console.error('Error toggling switch:', error?.message || error);
      Alert.alert('Error', 'Failed to toggle circuit.');
    }
  };

  const handleSwitchChange4 = async (value: boolean) => {
    try {
      const url = String(controller?.circuitEndPoint_4);
      const response = await axios.patch(url, {
        relay4: value === false ? 1 : 0,
      });

      console.log(response);
      console.log(response.status);

      if (response.status === 200) {
        setSwitches({ ...switches, c4: !value });
      }
    } catch (error: any) {
      console.log(error);
      console.error('Error toggling switch:', error?.message || error);
      Alert.alert('Error', 'Failed to toggle circuit.');
    }
  };

  if (loading) {
    return (
      <RouteProtector>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size='large' color='#007bff' />
        </View>
      </RouteProtector>
    );
  }

  if (!controller) {
    return (
      <RouteProtector>
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginTop: 30 }}>
            Controller not found.
          </Text>
        </View>
      </RouteProtector>
    );
  }

  return (
    <RouteProtector>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{controller.controllerName}</Text>
        </View>

        {/* Circuits */}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Circuit 1</Text>
          <Switch
            value={switches['c1']}
            onValueChange={() => handleSwitchChange1(switches['c1'])}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Circuit 2</Text>
          <Switch
            value={switches['c2']}
            onValueChange={() => handleSwitchChange2(switches['c2'])}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Circuit 3</Text>
          <Switch
            value={switches['c3']}
            onValueChange={() => handleSwitchChange3(switches['c3'])}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Circuit 4</Text>
          <Switch
            value={switches['c4']}
            onValueChange={() => handleSwitchChange4(switches['c4'])}
          />
        </View>
      </View>
    </RouteProtector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: '#f9fafb',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  switchRow: {
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
  },
});
