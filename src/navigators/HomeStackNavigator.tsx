import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chat from '../components/pages/HomePage/Chat';
import MoodChart from '../components/pages/HomePage/MoodChart';
import Header from '../components/header/header';
const HomeStackNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ header: () => <Header title="쿠키의 채팅방" /> }}
      />
      <Stack.Screen name="MoodChart" component={MoodChart} />
    </Stack.Navigator>
  );
};
export default HomeStackNavigator;
