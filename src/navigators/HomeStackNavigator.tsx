import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chat from '../components/pages/HomePage/Chat';
import LargeEmotionChart from '../components/pages/HomePage/LargeEmotionChart';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Header from '../components/header/header';
import { HomeStackName } from '../constants/Constants';
import { Easing } from 'react-native';
import Home from '../components/pages/HomePage/Home';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        gestureEnabled: false,
        animation: 'slide_from_bottom', // This enables the slide up animation
        headerShown: true,
      }}>
      <HomeStack.Screen
        name={HomeStackName.Chat}
        component={Chat}
        options={{ header: () => <Header title="쿠키의 채팅방" /> }}
      />
      <HomeStack.Screen
        name={HomeStackName.LargeEmotionChart}
        component={LargeEmotionChart}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        options={{ header: () => <Header /> }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
