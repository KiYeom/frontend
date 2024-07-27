export const MALE = 1;
export const FEMALE = 2;
export const APP_VERSION = '1.0.0';
export const ACCESSTOKEN = 'ACCESSTOKEN';
export const REFRESHTOKEN = 'REFRESHTOKEN';
export const CHATLOG = 'CHATLOG';

export const GOOGLE = 'google';
export const APPLE = 'apple';

export const ERRORMESSAGE = '멍멍!🐶 쿠키 조금 아픈데 잠시 후에 다시 얘기해도 될까요?😣';

export const SPLASH_PATH = '/src/assets/images/splash.png'

export interface User {
  EMAIL: string | null;
  NICKNAME: string;
  BIRTHDATE: string | null;
  GENDER: number | null;
  DEVICEID: string | null;
  APPVERSION: string;
  DEVICEOS: string | null;
  PROVIDERNAME: string;
  PROVIDERCODE: any;
  NOTIFICATIONTOKEN: string;
  ACCESSTOKEN: string;
  REFRESHTOKEN: string;
  GOOGLEACCTOKEN: string;
  AUTHCODE: string | null;
  IDTOKEN: string | null;
}

export const USER: User = {
  EMAIL: 'email',
  NICKNAME: 'nickname',
  BIRTHDATE: null,
  GENDER: null,
  DEVICEID: 'deviceId',
  APPVERSION: '1.0.0',
  DEVICEOS: 'deviceOs',
  PROVIDERNAME: 'google',
  PROVIDERCODE: 'providerCode',
  NOTIFICATIONTOKEN: 'notificationToken',
  ACCESSTOKEN: 'accessToken', // 수정된 부분
  REFRESHTOKEN: 'refreshToken',
  GOOGLEACCTOKEN: '',
  AUTHCODE: '',
  IDTOKEN: '',
};

//채팅 로그 저장 타입
//sender : bot 혹은 user
//text : 발화자의 말
export interface Message {
  sender: string;
  text: string;
}

//설정에 메뉴목록들
export interface MenuItemProps {
  title: string;
  onPress: () => void;
}
