import axios from 'axios';
import { Alert } from 'react-native';
import {
  clearInfoWhenLogout,
  deleteAccessToken,
  getAccessToken,
  getDeviceIdFromMMKV,
  getRefreshToken,
  setAccessToken,
  setNotice,
  setUserInfo,
} from '../utils/storageUtils';
import { UseSigninStatus } from '../utils/signin-status';
import { getAppVersion, getDeviceOS } from '../utils/device-info';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

function setInterceptor(instance: any) {
  instance.interceptors.request.use(async function (config: any) {
    const tokenValue = getAccessToken();
    config.headers.Authorization = `Bearer ${tokenValue}`;
    return config;
  });

  instance.interceptors.response.use(
    function (response: any) {
      return response.data;
    },
    async function (error: any) {
      console.error('instance Error: ', error.response);
      if (error.response && error.response.status === 419) {
        console.log('interseptor: 419 에러 발생');
        console.log('accessToken: ', getAccessToken());
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // refreshToken이 없으면 로그인이 안되어있는 상태
          clearInfoWhenLogout();
          await GoogleSignin.signOut();
          const { SigninStatus, setSigninStatus } = UseSigninStatus();
          console.log('[Interceptor - NoRefresh] LogOut: 1, SigninStatus: ', SigninStatus);
          setSigninStatus(false);
          return;
        }

        console.log('reissueAccessToken Run');
        await reissueAccessToken(refreshToken, false);
        const accessToken = getAccessToken();
        if (!accessToken) {
          // refreshToken이 없으면 로그인이 안되어있는 상태
          clearInfoWhenLogout();
          await GoogleSignin.signOut();
          const { SigninStatus, setSigninStatus } = UseSigninStatus();
          console.log('[Interceptor - Reissue Wrong] LogOut: 2, SigninStatus: ', SigninStatus);
          setSigninStatus(false);
          return;
        }

        instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return instance(error.config);
      } else {
        console.error(error, ' 네트워크 연결 문제');
      }
      return Promise.reject(error);
    },
  );
  return instance;
}

function createInstance() {
  const instance = axios.create({
    baseURL: `https://api.remind4u.co.kr/`,
  });

  return setInterceptor(instance);
}

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

export const instance = createInstance();
