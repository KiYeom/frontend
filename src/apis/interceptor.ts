import axios from 'axios';
import { getAppVersion, getDeviceOS } from '../utils/device-info';
import { UseSigninStatus } from '../utils/signin-status';
import {
  clearInfoWhenLogout,
  deleteAccessToken,
  getAccessToken,
  getDeviceIdFromMMKV,
  getRefreshToken,
  setAccessToken,
  setUserInfo,
} from '../utils/storageUtils';
import { showAppNotice } from '../utils/app-notice';
import * as Sentry from '@sentry/react-native';
import { parse } from 'react-native-svg';

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
      // Sentry 스코프를 사용하여 에러 태그 및 추가 정보를 설정
      Sentry.withScope((scope) => {
        scope.setTag('axios_error', 'true');
        if (error.response) {
          scope.setTag('status', error.response.status);
          const parsedData = JSON.parse(error.config.data);
          const question = parsedData?.question || 'no_question';
          scope.setExtra('user_question', question); // 유저 대화 내용
          scope.setExtra('request_url', error.config?.url); //요청한 url
          scope.setExtra('response_data', error.response.data); //응답 데이터
        } else {
          scope.setTag('error_type', 'network_error');
        }
        Sentry.captureException(error);
      });
      // Sentry 스코프를 사용하여 에러 태그 및 추가 정보를 설정
      console.error('instance Error: ', error.response);
      if (error.response && error.response.status === 419) {
        console.log('interseptor: 419 에러 발생');
        console.log('accessToken: ', getAccessToken());
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // refreshToken이 없으면 로그인이 안되어있는 상태
          clearInfoWhenLogout();
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
        showAppNotice(resDate.notice);
      }
    }
  } catch (error) {
    console.error('[ERROR] reissueAccessToken ', error);
    return;
  }
};

export const instance = createInstance();
