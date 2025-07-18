import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as React from 'react';
import { Platform } from 'react-native';
import { ssoLogin } from '../../apis/auth';
import { AuthStackName } from '../../constants/Constants';
import { TVender } from '../../constants/types';
import Analytics from '../../utils/analytics';
import { UseSigninStatus } from '../../utils/signin-status';
import {
  getDeviceIdFromMMKV,
  getUserAccountProvider,
  setInfoWhenLogin,
  setTokenInfo,
} from '../../utils/storageUtils';
import {
  ButtonContainer,
  Container,
  CookieImage,
  ImageContainer,
  LoginBtn,
  LoginBtnIcon,
  LoginBtnLabel,
  WelcomeDesc,
  WelcomeTitle,
} from './SignInPage.styles';
import { AuthProvider } from '../../constants/Constants';
import {
  checkPurchaseHistory,
  NewLoginInApp,
  tryRestoreEntitlementsForNewUser,
} from '../../services/inappService';

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
  const res = await ssoLogin(deviceId, AuthProvider.Guest);
  //console.log('res', res);
  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return OauthResult.NewUserSuccess;
  }

  if (!res.isNewUser) {
    Analytics.setUser(res.accessToken);
    NewLoginInApp(res.accessToken);

    setInfoWhenLogin(
      res.nickname,
      res.birthdate,
      res.gender,
      res.accessToken,
      res.refreshToken,
      res.notice,
      AuthProvider.Guest,
    );
    return OauthResult.OldUserSuccess;
  }

  return OauthResult.UnknownError;
};

const googleLogin = async (): Promise<OauthResult> => {
  //Google Sign-In SDK 초기화
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: `94079762653-60nhtdpo208dm5e9pqmmorbp6ueochvs.apps.googleusercontent.com`,
    offlineAccess: true,
  });

  let googleToken;
  try {
    await GoogleSignin.signOut(); //이전에 로그인된 구글 계정이 있다면 로그아웃
    await GoogleSignin.signIn(); //기기에서 구글 계정 선택 프롬프트를 띄우는 단계
    const googleTokens = await GoogleSignin.getTokens(); //로그인 성공 시, 구글로부터 인증 토큰을 받아옴
    googleToken = googleTokens.accessToken;
  } catch (error) {
    console.log(`[ERROR] googleLogin - signIn: ${error}`);
    console.log(`[ERROR] googleLogin - getTokens: ${JSON.stringify(error)}`);
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
      return OauthResult.UserCancel;
    }
    console.log(`[ERROR] googleLogin - signIn: ${error}`);
    return OauthResult.OauthError;
  }

  const res = await ssoLogin(googleToken, AuthProvider.Google);
  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    //setUserAccountProvider('google');
    return OauthResult.NewUserSuccess;
  }

  if (!res.isNewUser) {
    Analytics.setUser(res.accessToken);
    NewLoginInApp(res.accessToken);
    //setUserAccountProvider('google');
    setInfoWhenLogin(
      res.nickname,
      res.birthdate,
      res.gender,
      res.accessToken,
      res.refreshToken,
      res.notice,
      AuthProvider.Google,
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

  const res = await ssoLogin(credential.authorizationCode, AuthProvider.Apple);

  if (!res) {
    return OauthResult.BackendError;
  }

  if (res.isNewUser) {
    setTokenInfo(res.accessToken, res.refreshToken);
    return OauthResult.NewUserSuccess;
  }

  if (!res.isNewUser) {
    Analytics.setUser(res.accessToken);
    NewLoginInApp(res.accessToken);
    setInfoWhenLogin(
      '' + res.nickname,
      res.birthdate,
      res.gender,
      res.accessToken,
      res.refreshToken,
      res.notice,
      AuthProvider.Apple,
    );
    return OauthResult.OldUserSuccess;
  }

  return OauthResult.UnknownError;
};

//로그인 페이지
const Login: React.FC<any> = ({ navigation }) => {
  const { SigninStatus, setSigninStatus } = UseSigninStatus();
  const [loading, setLoading] = React.useState<boolean>(false);
  //const [lastVendor, setLastVendor] = React.useState<TVender | undefined>();
  //const [privacyModal, setPrivacyModal] = React.useState(false);
  //const [guestModal, setGuestModal] = React.useState(false);

  const onHandleLogin = async (vendor: TVender) => {
    setLoading(true);
    let oauthResult: OauthResult = OauthResult.UnknownError;
    try {
      switch (vendor) {
        case AuthProvider.Google:
          oauthResult = await googleLogin();
          break;
        case AuthProvider.Apple:
          oauthResult = await appleLogin();
          break;
        //case 'kakao':
        //break;
        case AuthProvider.Guest:
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
        await checkPurchaseHistory();
        //await tryRestoreEntitlementsForNewUser();
        return;
      }
      if (oauthResult === OauthResult.NewUserSuccess) {
        //새로운 유저
        navigation.navigate(AuthStackName.InputName, {
          isGuestMode: vendor === AuthProvider.Guest,
        });
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

  React.useEffect(() => {
    //console.log('😀😀😀😀😀Login Page😀😀😀😀😀😀', getUserAccountProvider());
  }, []);

  return (
    <Container>
      <WelcomeTitle>쿠키와 함께하는 {'\n'}힐링 채팅</WelcomeTitle>

      <ImageContainer>
        <CookieImage source={require('../../assets/images/cookielogin.png')} />
      </ImageContainer>
      <ButtonContainer>
        <WelcomeDesc>🚀이메일 하나로 3초만에 가입하기🚀</WelcomeDesc>
        <LoginBtn
          vendor={AuthProvider.Guest}
          activeOpacity={1}
          onPress={() => {
            //setLastVendor('guest');
            //setGuestModal(true);
            Analytics.clickGuestModeButton();
            onHandleLogin(AuthProvider.Guest);
          }}
          disabled={loading}>
          <LoginBtnLabel vendor={AuthProvider.Guest}>비회원으로 바로 시작하기</LoginBtnLabel>
        </LoginBtn>
        <LoginBtn
          vendor={AuthProvider.Google}
          activeOpacity={1}
          onPress={() => {
            Analytics.clickGoogleLoginButton();
            onHandleLogin(AuthProvider.Google);
          }}
          disabled={loading}>
          <LoginBtnIcon source={require('../../assets/images/google.png')} />
          <LoginBtnLabel vendor="google">구글로 로그인</LoginBtnLabel>
        </LoginBtn>
        {Platform.OS === 'ios' && (
          <LoginBtn
            vendor={AuthProvider.Apple}
            activeOpacity={1}
            onPress={() => {
              //setLastVendor('apple');
              //setPrivacyModal(true);
              Analytics.clickAppleLoginButton();
              onHandleLogin(AuthProvider.Apple);
              //if (lastVendor) onHandleLogin(lastVendor);
            }}
            disabled={loading}>
            <LoginBtnIcon source={require('../../assets/images/apple.png')} />
            <LoginBtnLabel vendor={AuthProvider.Apple}>애플로 로그인</LoginBtnLabel>
          </LoginBtn>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default Login;
