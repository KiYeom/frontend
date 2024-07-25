//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from 'react';
import InfoName from '../components/pages/SignUpPage/InfoName';
import InfoAge from '../components/pages/SignUpPage/InfoAge';
import InfoGender from '../components/pages/SignUpPage/InfoGender';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import palette from '../assets/styles/theme';
import { USER } from '../constants/Constants';
import useIsSignInState from '../store/signInStatus';
import { googleSignUp, appleSignUp } from '../utils/SignUpHandle';

const SignUpStackNavigator: React.FC<any> = ({ navigation }) => {
  const Stack = createNativeStackNavigator();
  const { isSignIn, setIsSignIn } = useIsSignInState();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }}>
      <Stack.Screen
        name="InfoName"
        component={InfoName}
        options={{
          title: '이름',
        }}
      />
      <Stack.Screen
        name="InfoAge"
        component={InfoAge}
        options={{
          title: '나이',
          headerRight: () => (
            <Button
              title="건너뛰기"
              onPress={() => navigation.navigate('InfoGender')}
              color={palette.neutral[300]}
            />
          ),
        }}
      />
      <Stack.Screen
        name="InfoGender"
        component={InfoGender}
        options={{
          title: '성별',
          headerRight: () => (
            <Button
              title="건너뛰기"
              onPress={async () => {
                if (USER.PROVIDERNAME === 'google') {
                  alert(`구글 ${USER.PROVIDERNAME}`);
                  googleSignUp(setIsSignIn);
                  //navigation.navigate('Home');
                } else if (USER.PROVIDERNAME === 'apple') {
                  alert(`얘플 ${USER.PROVIDERNAME}`);
                  appleSignUp(setIsSignIn);
                  //navigation.navigate('Home');
                }
              }}
              color={palette.neutral[300]}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
export default SignUpStackNavigator;
