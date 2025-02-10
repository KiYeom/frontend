import { Stack } from 'expo-router/stack';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import React from 'react';
import { View } from 'react-native';
//import Header from '../src/components/header/header';
import Header from '../mycomponents/header/header';

//글로벌 레이아웃에서 공통 헤더 사용하기
export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => <Header title="커스텀 헤더" />,
        }}>
        <Stack.Screen name="(tabs)" />
        {/*<Stack.Screen name="stackChat" options={{ title: 'Chat' }} />*/}
        <Stack.Screen name="auth" />
        <Slot />
      </Stack>
    </View>
  );
}
