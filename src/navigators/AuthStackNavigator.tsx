//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/Header.tsx';
import Login from '../pages/sign-in/SignInPage';
import InputName from '../pages/sign-up/SignUpPage.tsx';
//import InputProfile from '../pages/sign-up/input-profile/input-profile';
import { AuthStackName } from '../constants/Constants';
import { UseRightStatus } from '../utils/right-status';

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator: React.FC<any> = ({ navigation }) => {
  const { RightStatus, setRightStatus } = UseRightStatus();
  const clickRight = () => {
    setRightStatus(!RightStatus);
  };

  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={AuthStackName.Login}
        component={Login}
        options={{
          header: () => <></>,
        }}
      />
      <AuthStack.Screen
        name={AuthStackName.InputName}
        component={InputName}
        options={{
          header: () => <Header />,
        }}
      />
      {/*<AuthStack.Screen
        name={AuthStackName.InputProfile}
        component={InputProfile}
        options={{
          header: () => <Header isRight={true} rightText="Skip" rightFunction={clickRight} />,
        }}
      />*/}
    </AuthStack.Navigator>
  );
};
export default AuthStackNavigator;
