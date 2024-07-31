import axios from 'axios';
import { TAuth, TNewUser } from './auth.types';
import { storage } from '../utils/storageUtils';
import { REFRESHTOKEN, USER } from '../constants/Constants';
import { instance } from './interceptor';

//INFO: SSO 로그인
export const ssoLogin = async (
  code: string,
  vender: 'google' | 'apple' | 'kakao',
): Promise<TAuth | undefined> => {
  try {
    const res = await instance.post('/v1/auth/sso-login', {
      providerName: vender,
      providerCode: code,
      deviceId: USER.DEVICEID,
      appVersion: USER.APPVERSION,
      deviceOs: USER.DEVICEOS,
    });

    //TODO: isNewUser가 true일 경우 회원가입 페이지로 이동

    //TODO: isNewUser가 false일 경우 로그인 성공 -> 메인 페이지로 이동

    return res.data;
  } catch (error) {
    console.error('[ERROR] ssoLogin', error);
    return;
  }
};

//INFO: 회원가입
export const updateUserProfile = async (profile: TNewUser): Promise<TAuth | undefined> => {
  try {
    const res = await instance.patch('/v1/auth/update-new-user', {
      ...profile,
      deviceId: USER.DEVICEID,
      appVersion: USER.APPVERSION,
      deviceOs: USER.DEVICEOS,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] updateUserProfile', error);
    return;
  }
};

//INFO: refreshToken으로 accessToken 재발급
export const getGenerateAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = storage.getString(REFRESHTOKEN);
  console.log('리프레시 토큰: ', refreshToken);
  try {
    const res = await axios.patch('/auth/refresh', {
      deviceId: USER.DEVICEID,
      appVersion: USER.APPVERSION,
      deviceOs: USER.DEVICEOS,
      refreshToken: refreshToken,
      isAppStart: false,
    });

    if (res.status === 200) {
      return res.data.data.accessToken;
    } else return;
  } catch (error) {
    console.error('[ERROR] getGenerateAccessToken ', error);
    return;
  }
};
