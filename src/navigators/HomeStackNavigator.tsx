import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chat from '../components/pages/HomePage/Chat';
import MoodChart from '../components/pages/HomePage/MoodChart';
import Header from '../components/header/header';
import { HomeStackName } from '../constants/Constants';
import Home from '../components/pages/HomePage/Home';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={HomeStackName.Chat}
        component={Chat}
        options={{ header: () => <Header title="쿠키의 채팅방" /> }}
      />
      <HomeStack.Screen name={HomeStackName.MoodChart} component={MoodChart} />
    </HomeStack.Navigator>
  );
};
export default HomeStackNavigator;
