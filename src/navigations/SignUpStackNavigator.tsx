//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from 'react';
import InfoName from '../screen/SignUpPage/InfoName';
import InfoAge from '../screen/SignUpPage/InfoAge';
import InfoGender from '../screen/SignUpPage/InfoGender';
import Tabbar from './BottomTabNavigator';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SignUpStackNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }}>
      <Stack.Screen name="InfoName" component={InfoName} options={{ title: '이름' }} />
      <Stack.Screen name="InfoAge" component={InfoAge} options={{ title: '나이' }} />
      <Stack.Screen name="InfoGender" component={InfoGender} options={{ title: '성별' }} />
    </Stack.Navigator>
  );
};
export default SignUpStackNavigator;
