import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RouteProtector from '../../components/RouteProtector';

interface Controller {
  id: number;
  controllerId: string;
  ownerEmail: string;
  controllerName: string;
  createdAt: string;
  updatedAt: string;
  isActivated: boolean;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export default function ControllersScreen() {
  const router = useRouter();
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchControllers = async () => {
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
          // `https://api.ruphautomations.zedlabs.xyz/api/v1/system/get-all-controllers/?email=${user.email}`,
          `https://api.ruphautomations.xyz/api/v1/system/get-all-controllers/?email=${user.email}`,
          // `http://localhost:5000/api/v1/system/get-all-controllers/?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              email: user.email,
              client: 'mobile',
              'Content-Type': 'application/json',
            },
          }
        );

        const newAccessToken = response.data?.response?.accessToken;
        const newRefreshToken = response.data?.response?.refreshToken;

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

        const systems = response.data?.response?.systems || [];
        setControllers(systems);
      } catch (err: any) {
        console.error('Error fetching controllers:', err?.message || err);
        Alert.alert('Error', 'Failed to fetch controllers.');
      } finally {
        setLoading(false);
      }
    };

    fetchControllers();
  }, []);

  return (
    <RouteProtector>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Controllers</Text>
        </View>

        {/* Content */}
        {loading ? (
          <ActivityIndicator
            size='large'
            color='#007bff'
            style={{ marginTop: 50 }}
          />
        ) : controllers.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#666' }}>
            No controllers found.
          </Text>
        ) : (
          <FlatList
            data={controllers}
            keyExtractor={(item) => item.controllerId}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: '/(main)/controller/[id]',
                  params: { id: item.id },
                }}
                asChild
              >
                <TouchableOpacity style={styles.listItem}>
                  <Text style={styles.listItemTitle}>
                    {item.controllerName}
                  </Text>
                  <Text style={styles.listItemSub}>{item.controllerId}</Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}

        {/* Add Controller button */}
        <Link href='/(main)/activate-controller' asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Controller</Text>
          </TouchableOpacity>
        </Link>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItemSub: {
    fontSize: 12,
    color: '#666666',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 'auto',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
