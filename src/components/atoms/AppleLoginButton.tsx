import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, StyleSheet } from 'react-native';
import { USER, ACCESSTOKEN, REFRESHTOKEN, APP_VERSION } from '../../constants/Constants';
import axios from 'axios';
import { storage } from '../../utils/storageUtils';
import useIsSignInState from '../../store/signInStatus';
import * as Device from 'expo-device';
import { PaperProvider } from 'react-native-paper';
import { Portal, Modal, Button } from 'react-native-paper';
import { useState } from 'react';
import { handleLoginResponse, handleLoginError } from '../../utils/LoginHandle';

const AppleLoginButton: React.FC<any> = ({ navigation }) => {
  const { isSignIn, setIsSignIn } = useIsSignInState();
  //애플 로그인 버튼을 클릭했을 때의 함수
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        //로그인하여 유저 정보를 crendential에 저장
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ], //애플이 앱으로 접근할 때 요청되는 사용자 정보 범위의 배열 (보안상 처음 로그인 할 때만 유저 정보를 준다)
      });
      console.log(credential);
      USER.AUTHCODE = credential.authorizationCode;
      USER.IDTOKEN = credential.identityToken;
      USER.DEVICEOS = '' + Device.osName + Device.osVersion;
      USER.APPVERSION = APP_VERSION;
      USER.PROVIDERNAME = 'apple';

      axios
        .post('https://api.remind4u.co.kr/v1/auth/apple-login', {
          authCode: USER.AUTHCODE,
          idToken: USER.IDTOKEN,
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
    } catch (error: any) {
      console.log('살패');
      console.log('소셜 로그인 자제 안 됨 json', error);
      console.log(error);
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton //애플 로그인 버튼 생긴거 설정
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
});
export default AppleLoginButton;
