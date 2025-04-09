import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useNavigation, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import React from 'react';

//tab bar 랑 각 버튼을 정의할 수 있는 페이지
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        headerShown: false,
        headerTintColor: 'orange',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/stackChat'); /// your screen without Tab bar
          },
        })}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '보고서',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
