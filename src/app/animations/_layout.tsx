import React from 'react';
import { Pressable } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack } from 'expo-router';

import Index from './index';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerStyle: { backgroundColor: 'rgb(13,34,47)' },
        headerTitleStyle: { color: 'white' },
        headerLeft: () => (
          <Link asChild href="/animations">
            <Pressable>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Link asChild href="/">
              <Pressable>
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
