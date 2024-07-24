import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Chat from '../screen/Chat';
import Home from '../screen/Home';
import Setting from '../screen/SettingPage/Setting';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const color = '#58C3A5';

const BottomTabNavigator: React.FC<any> = ({ isSignIn, setIsSignIn }) => {
  console.log('채팅 화면 새로 그려짐..');
  const click = () => {
    //console.log("클릭함");
  };
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        //headerShown : false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#58C3A5' }, //상단 탭 바
        tabBarStyle: { backgroundColor: '#F0F3F8' }, //하단 탭 바
        headerTintColor: '#fff', // 헤더 텍스트 색상
        headerTitleStyle: {
          fontFamily: 'Pretendard-Bold', // 사용할 폰트 패밀리
          fontSize: 17, // 폰트 크기
        },
        tabBarActiveTintColor: '#58C3A5',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#58C3A5' }, //상단 탭 바
          headerTintColor: '#fff', // 헤더 텍스트 색상
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold', // 사용할 폰트 패밀리
            fontSize: 17, // 폰트 크기
          },
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
          title: 'Setting',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});
export default BottomTabNavigator;
