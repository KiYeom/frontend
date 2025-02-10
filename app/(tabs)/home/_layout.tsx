import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: 'green' }}>
      <Stack.Screen
        name="index"
        options={{ headerTitle: 'home layout에서 커스텀한 홈 화면 헤더' }}
      />
    </Stack>
  );
}
