//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from 'react';
import InfoName from '../components/pages/sign-up/InfoName';
import InfoAge from '../components/pages/sign-up/InfoAge';
import InfoGender from '../components/pages/sign-up/InfoGender';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Touchable, TouchableOpacity, View, Text } from 'react-native';
import palette from '../assets/styles/theme';
import { USER } from '../constants/Constants';
import useIsSignInState from '../store/signInStatus';
import { googleSignUp, appleSignUp } from '../utils/SignUpHandle';
import InputName from '../components/pages/sign-up/input-name/input-name';
import { rsHeight, rsWidth } from '../utils/responsive-size';
import { css } from '@emotion/native';
import Icon from '../components/icons/icons';
import Header from '../components/header/header';
import InputProfile from '../components/pages/sign-up/input-profile/input-profile';

const SignUpStackNavigator: React.FC<any> = ({ navigation }) => {
  const Stack = createNativeStackNavigator();
  const { isSignIn, setIsSignIn } = useIsSignInState();
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
