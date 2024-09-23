import { css } from '@emotion/native';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as React from 'react';
import { Platform } from 'react-native';
import { ssoLogin } from '../../../apis/auth';
import { AuthStackName } from '../../../constants/Constants';
import { TVender } from '../../../constants/types';
import { UseSigninStatus } from '../../../utils/signin-status';
import { getDeviceIdFromMMKV, setInfoWhenLogin, setTokenInfo } from '../../../utils/storageUtils';
import GuestModal from '../../modals/guest-modal';
import PrivacyModal from '../../modals/privacy-modal';
import {
  ButtonContainer,
  Container,
  CookieImage,
  ImageContainer,
  LoginBtn,
  LoginBtnIcon,
  LoginBtnLabel,
  WelcomeTitle,
} from './sing-in.styles';

enum OauthResult {
  UserCancel,
  OldUserSuccess,
  NewUserSuccess,
  BackendError,
  OauthError,
  UnknownError,
}

const guestLogin = async (): Promise<OauthResult> => {
  const deviceId = getDeviceIdFromMMKV();
  if (!deviceId) {
    return OauthResult.UnknownError;
  }
  const res = await ssoLogin(deviceId, 'guest');
  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return OauthResult.NewUserSuccess;
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
    return OauthResult.OldUserSuccess;
  }

  return OauthResult.UnknownError;
};

const googleLogin = async (): Promise<OauthResult> => {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  let googleToken;
  try {
    await GoogleSignin.signOut();
    await GoogleSignin.signIn();
    const googleTokens = await GoogleSignin.getTokens();
    googleToken = googleTokens.accessToken;
    console.log('---googleToken---', googleToken);
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      return OauthResult.UserCancel;
    }
    return OauthResult.OauthError;
  }

  const res = await ssoLogin(googleToken, 'google');
  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return OauthResult.NewUserSuccess;
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
    return OauthResult.OldUserSuccess;
  }

  return OauthResult.UnknownError;
};

const appleLogin = async (): Promise<OauthResult> => {
  let credential;
  try {
    credential = await AppleAuthentication.signInAsync();
  } catch (error: any) {
    console.error(`[ERROR] appleLogin - signInAsync: ${error.code}`);
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return OauthResult.UserCancel;
    } else {
      return OauthResult.OauthError;
    }
  }

  if (!credential.authorizationCode) {
    return OauthResult.OauthError;
  }

  const res = await ssoLogin(credential.authorizationCode, 'apple');

  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return OauthResult.NewUserSuccess;
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
    return OauthResult.OldUserSuccess;
  }

  return OauthResult.UnknownError;
};

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
  const { SigninStatus, setSigninStatus } = UseSigninStatus();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lastVendor, setLastVendor] = React.useState<TVender | undefined>();
  const [privacyModal, setPrivacyModal] = React.useState(false);
  const [guestModal, setGuestModal] = React.useState(false);

  const onHandleLogin = async (vendor: TVender) => {
    setLoading(true);
    let oauthResult: OauthResult = OauthResult.UnknownError;
    try {
      switch (vendor) {
        case 'google':
          oauthResult = await googleLogin();
          break;
        case 'apple':
          oauthResult = await appleLogin();
          break;
        case 'kakao':
          break;
        case 'guest':
          oauthResult = await guestLogin();
          break;
      }
      setLoading(false);
      //로그인이 사용자로 취소, 기존 유저 성공, 새 유저 성공, 백엔드 실패, sso제공자 실패, 알 수 없는 실패 6가지로 나눔
      if (oauthResult === OauthResult.UserCancel) {
        //사용자가 로그인을 취소
        return;
      }
      if (oauthResult === OauthResult.OldUserSuccess) {
        //로그인 성공
        setSigninStatus(true);
        return;
      }
      if (oauthResult === OauthResult.NewUserSuccess) {
        //새로운 유저
        navigation.navigate(AuthStackName.InputName, { isGuestMode: vendor === 'guest' });
        return;
      }
      if (oauthResult === OauthResult.BackendError) {
        alert('서버와의 통신이 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      if (oauthResult === OauthResult.OauthError) {
        alert('소셜로그인 회사와의 통신이 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      alert('알 수 없는 이유로 실패했습니다. 잠시 후 다시 시도해주세요.');
      return;
    } catch (error) {
      console.error(`[ERROR] onHandleLogin: ${error}`);
      setLoading(false);
      return;
    }
  };

  return (
    <Container>
      <WelcomeTitle>쿠키와 함께하는 {'\n'}힐링 채팅</WelcomeTitle>

      <ImageContainer>
        <CookieImage source={require('../../../assets/images/cookielogin.png')} />
      </ImageContainer>
      <ButtonContainer style={css``}>
        {/* <LoginBtn vendor="kakao" activeOpacity={1} onPress={() => {}}>
          <LoginBtnIcon source={require('../../../assets/images/kakao.png')} />
          <LoginBtnLabel vendor="kakao">카카오 로그인</LoginBtnLabel>
        </LoginBtn> */}

        <LoginBtn
          vendor="guest"
          activeOpacity={1}
          onPress={() => {
            setLastVendor('guest');
            setGuestModal(true);
          }}
          disabled={loading}>
          <LoginBtnLabel vendor="guest">비회원으로 바로 시작하기</LoginBtnLabel>
        </LoginBtn>
        <LoginBtn
          vendor="google"
          activeOpacity={1}
          onPress={() => {
            setLastVendor('google');
            setPrivacyModal(true);
          }}
          disabled={loading}>
          <LoginBtnIcon source={require('../../../assets/images/google.png')} />
          <LoginBtnLabel vendor="google">구글로 로그인</LoginBtnLabel>
        </LoginBtn>
        {Platform.OS === 'ios' && (
          <LoginBtn
            vendor="apple"
            activeOpacity={1}
            onPress={() => {
              setLastVendor('apple');
              setPrivacyModal(true);
            }}
            disabled={loading}>
            <LoginBtnIcon source={require('../../../assets/images/apple.png')} />
            <LoginBtnLabel vendor="apple">애플로 로그인</LoginBtnLabel>
          </LoginBtn>
        )}
      </ButtonContainer>
      <PrivacyModal
        modalVisible={privacyModal}
        onSubmit={() => {
          if (lastVendor) onHandleLogin(lastVendor);
        }}
        onClose={() => setPrivacyModal(false)}
      />
      <GuestModal
        modalVisible={guestModal}
        onSubmit={() => {
          onHandleLogin('guest');
        }}
        onClose={() => setGuestModal(false)}
      />
    </Container>
  );
};

export default Login;
