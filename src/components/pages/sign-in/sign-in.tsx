import * as React from 'react';
import { Platform } from 'react-native';
import  { LoginBtnLabel, LoginBtn, LoginBtnIcon, ButtonContainer, Container, WelcomeTitle, CookieImage, ImageContainer } from './sing-in.styles'
import { css } from '@emotion/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import SignUpStackNavigator from '../../../navigators/SignUpStackNavigator';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { ssoLogin } from '../../../apis/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../../utils/storageUtils';
import { ACCESSTOKEN, REFRESHTOKEN } from '../../../constants/Constants';

const windowDimensions = require('react-native').Dimensions.get('window');
const screenDimensions = require('react-native').Dimensions.get('screen');


const googleLogin = async () => {
  GoogleSignin.configure({
    iosClientId: '94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com',
  });

  try {
    const userInfo = await GoogleSignin.signIn();
    const googleAccessToken = await (await GoogleSignin.getTokens()).accessToken;
    const res = await ssoLogin(googleAccessToken, 'google');
  

    if(res){
      console.log('accessToken', res.accessToken);
      storage.set(ACCESSTOKEN, res.accessToken);
      storage.set(REFRESHTOKEN, res.refreshToken);
    }
    
  } catch (error) {
    console.error(`[ERROR] ${error}`);
  }
}

const appleLogin = async () => { 
  try {
    const credential = await AppleAuthentication.signInAsync();
    if(credential.identityToken){
      const res = await ssoLogin(credential.identityToken, 'apple');

      if(res){
        console.log(res.accessToken);
        storage.set(ACCESSTOKEN, res.accessToken);
        storage.set(REFRESHTOKEN, res.refreshToken);
      }
    }
  }
  catch(error){   
    console.error(`[ERROR] ${error}`);
  }
}


//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {

  const onHandleLogin = async (vendor: "google" | "apple" |"kakao") => {
    try{
      switch(vendor){
        case "google":
          await googleLogin();
          break;
        case "apple":
          await appleLogin();
          break;
        case "kakao":
          break;
      }
      navigation.navigate(SignUpStackNavigator);
    } catch(error){
      console.error(`[ERROR] ${error}`);
    }
    
  }


  return (
    <Container>
        <WelcomeTitle>
          쿠키와 함께하는 {"\n"}힐링 채팅
        </WelcomeTitle>

        <ImageContainer>
          <CookieImage source={require("../../../assets/images/cookieLogin.png")}/>
        </ImageContainer>
        <ButtonContainer style={css`
          
          `}>
          <LoginBtn vendor='kakao' activeOpacity={1} onPress={() => navigation.navigate(SignUpStackNavigator)}>
            <LoginBtnIcon source={require("../../../assets/images/kakao.png")}/><LoginBtnLabel vendor="kakao">카카오 로그인</LoginBtnLabel>
          </LoginBtn>
          <LoginBtn vendor='google' activeOpacity={1} onPress={() => onHandleLogin("google")}>
          <LoginBtnIcon source={require("../../../assets/images/google.png")}/><LoginBtnLabel vendor='google'>구글로 로그인</LoginBtnLabel>
          </LoginBtn>
          {Platform.OS === "ios" && 
            <LoginBtn vendor='apple' activeOpacity={1} onPress={() => onHandleLogin("apple")}>
              <LoginBtnIcon source={require("../../../assets/images/apple.png")}/><LoginBtnLabel vendor="apple">애플로 로그인</LoginBtnLabel>
            </LoginBtn>
          }
      </ButtonContainer>
    </Container>
  );
};




export default Login;
