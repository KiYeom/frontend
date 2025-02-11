// app/(tabs)/chat/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router/stack';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChatStackLayout() {
  const navigation = useNavigation();
  return (
    <Stack screenOptions={{ headerTintColor: 'skyblue' }}>
      <Stack.Screen
        name="index"
        // 채팅 화면 전용 옵션 설정: 상단에 뒤로가기 버튼 표시, 헤더 보이기
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => {
                  // 스택에 이전 화면이 존재하면 뒤로가기, 없으면 (tabs)/home으로 이동
                  if (navigation.canGoBack() && navigation.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(tabs)/home');
                  }
                }}>
                <Text>뒤로가기</Text>
              </Pressable>
            );
          },
          // 기본 제공되는 뒤로가기 버튼을 사용하거나, 직접 커스텀 할 수 있음
        }}
      />
    </Stack>
  );
}
