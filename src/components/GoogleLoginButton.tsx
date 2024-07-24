import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { SetStateAction, Dispatch } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as Device from 'expo-device';
import axios from 'axios';
import { storage } from '../utils/storageUtils';
import {
  ACCESSTOKEN,
  APP_VERSION,
  APPLE,
  GOOGLE,
  REFRESHTOKEN,
  USER,
} from '../constants/Constants';
import SignUp from '../navigators/SignUpStackNavigator';
import useIsSignInState from '../store/signInStatus';
import { handleLoginResponse, handleLoginError } from '../utils/LoginHandle';
//WebBrowser.maybeCompleteAuthSession();
// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
//web popup을 무시하기 위해 WebBrowser.maybeCompleteAuthSession()을 사용한다.
//사용하지 않으면 팝업 윈도우가 닫히지 않는다.

//구글 로그인
const GoogleLoginButton: React.FC<any> = ({ navigation }) => {
  const { isSignIn, setIsSignIn } = useIsSignInState();
  //console.log('구글 로그인 버튼 그려짐');
  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={async () => {
          //console.log("구글 버튼 눌림");
          GoogleSignin.configure({
            iosClientId: '94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com',
          });

          try {
            //const hasPreviousSignIn = await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const googleAccessToken = await (await GoogleSignin.getTokens()).accessToken;
            console.log('구글 로그인', userInfo);

            USER.PROVIDERNAME = 'google';
            USER.EMAIL = userInfo.user.email;
            USER.GOOGLEACCTOKEN = googleAccessToken;
            USER.DEVICEOS = '' + Device.osName + Device.osVersion; //기기가 안드로이드인지 ios인지
            //console.log("로그인 하는 기기의 OS", Device.osName); //기기의 운영체제
            //USER.DEVICEID = GOOGLE;
            USER.APPVERSION = APP_VERSION;

            //console.log("로그인을 위해 전달하려는 데이터", USER);
            // 로그인에 성공하면 JWT 토큰을 부여받는다.
            axios
              .post('https://api.remind4u.co.kr/v1/auth/google-login', {
                accessToken: USER.GOOGLEACCTOKEN,
                deviceId: USER.DEVICEID,
                appVersion: USER.APPVERSION,
                deviceOs: USER.DEVICEOS,
              })
              .then(function (response) {
                handleLoginResponse(response);
                setIsSignIn(true);
              })
              .catch(function (error) {
                setIsSignIn(false);
                handleLoginError(error, navigation);
              });
          } catch (error) {
            setIsSignIn(false);
            console.log('구글 로그인 한 적이 없는 경우', error);
          }
          //navigation.navigate("InfoScreen");
        }}
        disabled={false} // Set to true to disable the button
      />
    </View>
  );
};

export default GoogleLoginButton;

const styles = StyleSheet.create({
  container: {
    margin: 7,
  },
});
