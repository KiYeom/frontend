import * as React from 'react';
import { Platform } from 'react-native';
import  { LoginBtnLabel, LoginBtn, LoginBtnIcon, ButtonContainer, Container, WelcomeTitle, CookieImage, ImageContainer } from './sing-in.styles'
import { Button, View, Text, TouchableOpacity, Image } from 'react-native';
import { css } from '@emotion/native';
import SignUpStackNavigator from '../../../navigators/SignUpStackNavigator';

const windowDimensions = require('react-native').Dimensions.get('window');
const screenDimensions = require('react-native').Dimensions.get('screen');

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
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
          <LoginBtn vendor='google' activeOpacity={1}>
          <LoginBtnIcon source={require("../../../assets/images/google.png")}/><LoginBtnLabel vendor='google'>구글로 로그인</LoginBtnLabel>
          </LoginBtn>
          {Platform.OS === "ios" && 
            <LoginBtn vendor='apple' activeOpacity={1}>
              <LoginBtnIcon source={require("../../../assets/images/apple.png")}/><LoginBtnLabel vendor="apple">애플로 로그인</LoginBtnLabel>
            </LoginBtn>
          }
      </ButtonContainer>
    </Container>
  );
};




export default Login;
