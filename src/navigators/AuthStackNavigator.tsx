//처음 회원가입을 하면 infoscreen으로 가서... 이름, 나이, 성별 물어보기
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InputName from '../components/pages/sign-up/input-name/input-name';
import Header from '../components/header/header';
import InputProfile from '../components/pages/sign-up/input-profile/input-profile';
import { UseRightStatus } from '../utils/right-status';
import { AuthStackName } from '../constants/Constants';
import Login from '../components/pages/sign-in/sign-in';

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator: React.FC<any> = ({ navigation }) => {
  const { RightStatus, setRightStatus } = UseRightStatus();
  const clickRight = () => {
    console.log('clickRight', RightStatus);
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
      <AuthStack.Screen
        name={AuthStackName.InputProfile}
        component={InputProfile}
        options={{
          header: () => <Header isRight={true} rightText="Skip" rightFunction={clickRight} />,
        }}
      />
    </AuthStack.Navigator>
  );
};
export default AuthStackNavigator;
