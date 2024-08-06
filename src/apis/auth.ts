import axios from 'axios';
import { TAuth, TNewUser } from './auth.types';
import { instance } from './interceptor';
import { getAppVersion, getDeviceId, getDeviceOS } from '../utils/device-info';
import {
  deleteAccessToken,
  getDeviceIdFromMMKV,
  setAccessToken,
  setNotice,
  setUserInfo,
} from '../utils/storageUtils';
import { TVender } from '../constants/types';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

//INFO: SSO 로그인
export const ssoLogin = async (code: string, vender: TVender): Promise<TAuth | undefined> => {
  try {
    const res = await instance.post('/v1/auth/sso-login', {
      providerName: vender,
      providerCode: code,
      deviceId: getDeviceIdFromMMKV(),
      appVersion: getAppVersion(),
      deviceOs: getDeviceOS(),
    });
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
      deviceId: getDeviceIdFromMMKV(),
      appVersion: getAppVersion(),
      deviceOs: getDeviceOS(),
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] updateUserProfile: ', error);
    return;
  }
};

//INFO: refreshToken으로 accessToken 재발급
export const reissueAccessToken = async (
  refreshToken: string,
  isAppStart: boolean = false,
): Promise<void> => {
  try {
    deleteAccessToken();
    const res = await axios.patch('https://api.remind4u.co.kr/v1/auth/refresh', {
      deviceId: getDeviceIdFromMMKV(),
      appVersion: getAppVersion(),
      deviceOs: getDeviceOS(),
      refreshToken: refreshToken,
      isAppStart,
    });

    if (res.data.data) {
      const resDate = res.data.data;
      setAccessToken(resDate.accessToken);
      if (isAppStart) {
        setUserInfo(resDate.nickname, resDate.birthdate, resDate.gender);
      }
      if (resDate.notice) {
        setNotice(resDate.notice);
      }
    }
  } catch (error) {
    console.error('[ERROR] reissueAccessToken ', error);
    return;
  }
};
