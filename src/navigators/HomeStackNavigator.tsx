import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chat from '../components/pages/HomePage/Chat';
import MoodChart from '../components/pages/HomePage/MoodChart';

const HomeStackNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="MoodChart" component={MoodChart} />
    </Stack.Navigator>
  );
};
export default HomeStackNavigator;
