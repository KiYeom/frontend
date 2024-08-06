import axios from 'axios';
import { Alert } from 'react-native';
import { clearInfoWhenLogout, getAccessToken, getRefreshToken } from '../utils/storageUtils';
import useIsSignInState from '../utils/signInStatus';
import { reissueAccessToken } from './auth';

function setInterceptor(instance: any) {
  instance.interceptors.request.use(async function (config: any) {
    console.log('tokenInInterceptor: ', getAccessToken());
    const tokenValue = getAccessToken();
    config.headers.Authorization = `Bearer ${tokenValue}`;
    console.log('config: ', config.headers);
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
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // refreshToken이 없으면 로그인이 안되어있는 상태
          clearInfoWhenLogout();
          const { setIsSignIn } = useIsSignInState();
          setIsSignIn(false);
          return;
        }

        console.log('reissueAccessToken Run');
        await reissueAccessToken(refreshToken, false);
        const accessToken = getAccessToken();
        if (!accessToken) {
          // refreshToken이 없으면 로그인이 안되어있는 상태
          clearInfoWhenLogout();
          const { setIsSignIn } = useIsSignInState();
          setIsSignIn(false);
          return;
        }

        instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return instance(error.config);
      } else {
        console.error(error, ' 네트워크 연결 문제');
        Alert.alert('네트워크 연결 오류', '인터넷 연결을 확인해주세요.');
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

export const instance = createInstance();
