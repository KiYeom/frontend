//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InputName from '../components/pages/sign-up/input-name/input-name';
import Header from '../components/header/header';
import InputProfile from '../components/pages/sign-up/input-profile/input-profile';

const SignUpStackNavigator: React.FC<any> = ({ navigation }) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }}>
      <Stack.Screen
        name="input-name"
        component={InputName}
        options={{
          title: '',
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="input-profile"
        component={InputProfile}
        options={{
          title: '',
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};
export default SignUpStackNavigator;
