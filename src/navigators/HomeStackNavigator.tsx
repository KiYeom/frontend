import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
import Chat from '../components/pages/HomePage/Chat';
import SmallEmotionChart from '../components/pages/HomePage/SmallEmotionChart';
import Profile from '../components/pages/Profile/profile';
import { HomeStackName } from '../constants/Constants';
import NewChat from '../components/pages/HomePage/new-chat';

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
        name={HomeStackName.SmallEmotionChart}
        component={SmallEmotionChart}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen
        name={HomeStackName.Profile}
        component={Profile}
        options={{ header: () => <Header /> }}
      />
      <HomeStack.Screen
        name={HomeStackName.NewChat}
        component={NewChat}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
