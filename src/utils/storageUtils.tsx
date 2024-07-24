import { MMKV } from 'react-native-mmkv';
export const GOOGLE_KEY = 'google_auth_key';

//access token, refresh token, 대화 로그를 저장할 mmkv storage 생성
export const storage = new MMKV();
