import { Stack } from 'expo-router';
import React from 'react';

function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='controllers'
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='activate-controller'
        options={{
          // Set the presentation mode to modal for our modal route.
          // presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='controller/[id]'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default AuthLayout;
