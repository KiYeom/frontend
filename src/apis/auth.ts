import { TVender } from '../constants/types';
import { getAppVersion, getDeviceOS } from '../utils/device-info';
import { getDeviceIdFromMMKV } from '../utils/storageUtils';
import { TAuth, TNewUser } from './auth.types';
import { instance } from './interceptor';

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
  /*console.log('===============', {
    ...profile,
    deviceId: getDeviceIdFromMMKV(),
    appVersion: getAppVersion(),
    deviceOs: getDeviceOS(),
  });*/
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
