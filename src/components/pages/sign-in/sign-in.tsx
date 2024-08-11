import * as React from 'react';
import { Platform } from 'react-native';
import { useEffect } from 'react';
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
import AuthStackNavigator from '../../../navigators/AuthStackNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ssoLogin } from '../../../apis/auth';
import { getAccessToken, setInfoWhenLogin, setTokenInfo } from '../../../utils/storageUtils';
import { TVender } from '../../../constants/types';
import { UseSigninStatus } from '../../../utils/signin-status';
import { AuthStackName } from '../../../constants/Constants';

const googleLogin = async (): Promise<boolean> => {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  let googleToken;
  try {
    await GoogleSignin.signIn();
    const googleTokens = await GoogleSignin.getTokens();
    googleToken = googleTokens.accessToken;
    //console.log('---googleToken---', googleToken);
  } catch (error) {
    console.error(`[ERROR] GoogleSignin.signIn(): ${error}`);
    return false;
  }

  const res = await ssoLogin(googleToken, 'google');
  if (!res) {
    return false;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return false;
  }

  if (!res.isNewUser) {
    setInfoWhenLogin(
      res.nickname,
      res.birthdate,
      res.gender,
      res.accessToken,
      res.refreshToken,
      res.notice,
    );
    return true;
  }

  return false;
};

const appleLogin = async (): Promise<boolean> => {
  let credential;
  try {
    credential = await AppleAuthentication.signInAsync();
  } catch (error) {
    console.error(`[ERROR] appleLogin - signInAsync: ${error}`);
    return false;
  }

  if (!credential.authorizationCode) {
    return false;
  }

  const res = await ssoLogin(credential.authorizationCode, 'apple');

  if (!res) {
    return false;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return true;
  }

  if (!res.isNewUser) {
    setInfoWhenLogin(
      '' + res.nickname,
      res.birthdate,
      res.gender,
      res.accessToken,
      res.refreshToken,
      res.notice,
    );
    return true;
  }

  return false;
};

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
  const { SigninStatus, setSigninStatus } = UseSigninStatus();
  const onHandleLogin = async (vendor: TVender) => {
    let isSsoLoginSuccess = false;
    try {
      switch (vendor) {
        case 'google':
          isSsoLoginSuccess = await googleLogin();
          break;
        case 'apple':
          isSsoLoginSuccess = await appleLogin();
          break;
        case 'kakao':
          break;
      }
      if (isSsoLoginSuccess) {
        //로그인 성공
        setSigninStatus(true);
        return;
      }
      if (getAccessToken()) {
        //새로운 유저
        navigation.navigate(AuthStackName.InputName);
        return;
      }
    } catch (error) {
      console.error(`[ERROR] onHandleLogin: ${error}`);
    }
  };

  return (
    <Container>
      <WelcomeTitle>쿠키와 함께하는 {'\n'}힐링 채팅</WelcomeTitle>

      <ImageContainer>
        <CookieImage source={require('../../../assets/images/cookielogin.png')} />
      </ImageContainer>
      <ButtonContainer style={css``}>
        <LoginBtn vendor="kakao" activeOpacity={1} onPress={() => {}}>
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
