// app/(tabs)/chat/_layout.tsx
import React from 'react';

import { Stack } from 'expo-router/stack';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { View, Text } from 'react-native';

//_layout.tsx : auth 관련 페이지 공통 레이아웃
//로그인 초기 화면 -> 회원가입 닉네임 입력 화면 -> 채팅 화면
export default function AuthenticationPage() {
  return (
    <Stack screenOptions={{ headerTintColor: 'green', headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
