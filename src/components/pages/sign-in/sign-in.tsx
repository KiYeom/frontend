import * as React from 'react';
import { Platform } from 'react-native';
import {
  LoginBtnLabel,
  LoginBtn,
  LoginBtnIcon,
  ButtonContainer,
  Container,
  WelcomeTitle,
  CookieImage,
  ImageContainer,
} from './sing-in.styles';
import { css } from '@emotion/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import SignUpStackNavigator from '../../../navigators/SignUpStackNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ssoLogin } from '../../../apis/auth';
import { storage } from '../../../utils/storageUtils';
import { ACCESSTOKEN, NICKNAME, REFRESHTOKEN, USER } from '../../../constants/Constants';
import HomeStackNavigator from '../../../navigators/HomeStackNavigator';
import useIsSignInState from '../../../store/signInStatus';

const windowDimensions = require('react-native').Dimensions.get('window');
const screenDimensions = require('react-native').Dimensions.get('screen');

const googleLogin = async () => {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  try {
    //TODO: 사용자가 로그인을 취소할 때의 처리 필요
    const googleUserInfo = await GoogleSignin.signIn();
    console.log(googleUserInfo);
    const googleTokens = await await GoogleSignin.getTokens();
    console.log(googleTokens);
    const googleAccessToken = googleTokens.accessToken;
    console.log('유정이짱', googleAccessToken);
    const res = await ssoLogin(googleAccessToken, 'google');

    if (res) {
      storage.set(ACCESSTOKEN, res.accessToken);
      storage.set(REFRESHTOKEN, res.refreshToken);
      //유저의 개인 정보 저장

      console.log(res);
      USER.IS_NEW_USER = res.isNewUser;
      if (res.isNewUser === true && res.nickname) {
        console.log(res.nickname);
        USER.NICKNAME = res.nickname;
      }
    }
  } catch (error: any) {
    console.error(`[ERROR] ${error}`);
  }
};

const appleLogin = async () => {
  try {
    //TODO: 사용자가 로그인을 취소할 때의 처리 필요
    const credential = await AppleAuthentication.signInAsync();
    if (credential.identityToken) {
      const res = await ssoLogin(credential.identityToken, 'apple');

      if (res) {
        console.log(res.accessToken);
        storage.set(ACCESSTOKEN, res.accessToken);
        storage.set(REFRESHTOKEN, res.refreshToken);
        USER.IS_NEW_USER = res.isNewUser;
        if (res.isNewUser === true && res.nickname) {
          USER.NICKNAME = res.nickname;
        }
      }
    }
  } catch (error) {
    console.error(`[ERROR] ${error}`);
  }
};

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
  const { isSignIn, setIsSignIn } = useIsSignInState();
  const onHandleLogin = async (vendor: 'google' | 'apple' | 'kakao') => {
    try {
      switch (vendor) {
        case 'google':
          await googleLogin();
          break;
        case 'apple':
          await appleLogin();
          break;
        case 'kakao':
          break;
      }
      if (USER.IS_NEW_USER === true) {
        //새로운 유저
        navigation.navigate(SignUpStackNavigator);
      } else if (USER.IS_NEW_USER === false) {
        //기존 유저인 경우
        setIsSignIn(true);
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error(`[ERROR] ${error}`);
    }
  };

  return (
    <Container>
      <WelcomeTitle>쿠키와 함께하는 {'\n'}힐링 채팅</WelcomeTitle>

      <ImageContainer>
        <CookieImage source={require('../../../assets/images/cookieLogin.png')} />
      </ImageContainer>
      <ButtonContainer style={css``}>
        <LoginBtn
          vendor="kakao"
          activeOpacity={1}
          onPress={() => navigation.navigate(SignUpStackNavigator)}>
          <LoginBtnIcon source={require('../../../assets/images/kakao.png')} />
          <LoginBtnLabel vendor="kakao">카카오 로그인</LoginBtnLabel>
        </LoginBtn>
        <LoginBtn vendor="google" activeOpacity={1} onPress={() => onHandleLogin('google')}>
          <LoginBtnIcon source={require('../../../assets/images/google.png')} />
          <LoginBtnLabel vendor="google">구글로 로그인</LoginBtnLabel>
        </LoginBtn>
        {Platform.OS === 'ios' && (
          <LoginBtn vendor="apple" activeOpacity={1} onPress={() => onHandleLogin('apple')}>
            <LoginBtnIcon source={require('../../../assets/images/apple.png')} />
            <LoginBtnLabel vendor="apple">애플로 로그인</LoginBtnLabel>
          </LoginBtn>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default Login;
