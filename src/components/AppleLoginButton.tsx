import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, StyleSheet } from 'react-native';
import { USER, ACCESSTOKEN, REFRESHTOKEN, APP_VERSION } from '../constants/Constants';
import axios from 'axios';
import { storage } from '../../utils/storageUtils';
import useIsSignInState from '../store/signInStatus';
import * as Device from 'expo-device';
import { PaperProvider } from 'react-native-paper';
import { Portal, Modal, Button } from 'react-native-paper';
import { useState } from 'react';

const AppleLoginButton: React.FC<any> = ({ navigation }) => {
  const { isSignIn, setIsSignIn } = useIsSignInState();
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton //애플 로그인 버튼 생긴거 설정
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          //console.log("애플 로그인 버튼 눌림");
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
                storage.set(ACCESSTOKEN, response.data.data.accessToken); //access token을 storage에 저장
                storage.set(REFRESHTOKEN, response.data.data.refreshToken); //refresh token을 storage에 저장
                USER.NICKNAME = response.data.data.nickname;
                USER.GENDER = response.data.data.gender;
                USER.BIRTHDATE = response.data.data.birthdate;
                setIsSignIn(true); //로그인 성공하면 tabbar 페이지로 이동
                //navigation.navigate("Main"); //저장하고 메인 페이지로 이동
                console.log('애플 로그인을 위해 전달한 데이터 : ', response);
              })
              .catch(function (error) {
                console.log('애플 로그인 버튼 클릭 후 시스템 로그인 안 됨 json', error);
                setIsSignIn(false);
                console.log('서버에 애플 로그인 실패');
                console.log(error);
                console.log(USER.PROVIDERCODE, USER.DEVICEID, USER.APPVERSION, USER.DEVICEOS);
                console.log(
                  typeof USER.PROVIDERCODE,
                  typeof USER.DEVICEID,
                  typeof USER.APPVERSION,
                  typeof USER.DEVICEOS
                );
                if (error.response.status == 404) {
                  console.log('존재하지 않는 사용자');
                  navigation.navigate('InfoScreen');
                }
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
        }}
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
