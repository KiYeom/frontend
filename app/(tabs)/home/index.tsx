import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

//home 화면에서는 채팅 화면과 감정 입력 화면으로 이동할 수 있다.
//슬래시는 절대 경로 (ex. /stackChat는 앱 루트 경로에서 stackChat 페이지로 이동)
export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Pressable onPress={() => router.push('/stackChat')}>
        <Text>채팅 화면으로 이동</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/diary')}>
        <Text>감정 입력 화면으로 이동</Text>
      </Pressable>
    </View>
  );
}
