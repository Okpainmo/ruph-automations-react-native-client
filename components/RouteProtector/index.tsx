import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChildProp {
  children: React.ReactNode;
}

function RouteProtector({ children }: ChildProp) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          router.replace('/(auth)/log-in');
        } else {
          const parsed = JSON.parse(userData);
          if (!parsed.email) {
            router.replace('/(auth)/log-in');
          }
        }
      } catch (error) {
        console.log('RouteProtector error:', error);
        router.replace('/(auth)/log-in');
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  if (checking) {
    // Optional: loading indicator while checking AsyncStorage
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007bff' />
      </View>
    );
  }

  return <SafeAreaView style={styles.safeContainer}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});

export default RouteProtector;
