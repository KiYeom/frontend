import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import Chat from '../components/pages/HomePage/Chat';
import LargeEmotionChart from '../components/pages/HomePage/LargeEmotionChart';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Profile from '../components/pages/Profile/profile';
import { HomeStackName } from '../constants/Constants';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator>
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
      <HomeStack.Screen
        name={HomeStackName.Profile}
        component={Profile}
        options={{ header: () => <Header /> }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
