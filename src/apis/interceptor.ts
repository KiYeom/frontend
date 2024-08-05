import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getGenerateAccessToken } from './auth';
import { storage } from '../utils/storageUtils';
import { ACCESSTOKEN } from '../constants/Constants';

function setInterceptor(instance: any) {
  instance.interceptors.request.use(async function (config: any) {
    const tokenValue = storage.getString(ACCESSTOKEN);
    console.log('interseptor: ', tokenValue);
    config.headers.Authorization = `Bearer ${tokenValue}`;
    return config;
  });
  instance.interceptors.response.use(
    function (response: any) {
      return response.data;
    },
    async function (error: any) {
      if (error.response && error.response.status === 419) {
        console.log('interseptor: 419 에러 발생');
        const accessToken = await getGenerateAccessToken();
        if (accessToken) {
          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          storage.set(ACCESSTOKEN, accessToken);
          return instance(error.config);
        } else {
          storage.clearAll();
          //TODO: 로그인 화면으로 넘어가는 로직 추가
        }
      } else if (!error.response) {
        console.error(error, ' 네트워크 연결 문제');
        Alert.alert('네트워크 연결 오류', '인터넷 연결을 확인해주세요.');
      } else {
        console.error('interseptor: ', error.response.data);
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
