export const MALE = 1;
export const FEMALE = 2;

export const APP_VERSION = "1.0.0"
export const ACCESSTOKEN = "ACCESSTOKEN";
export const REFRESHTOKEN = "REFRESHTOKEN";
export const CHATLOG = 'CHATLOG';

export const GOOGLE = 'google';
export const APPLE = 'apple';

export const ERRORMESSAGE = "멍멍!🐶 쿠키 조금 아픈데 잠시 후에 다시 얘기해도 될까요?😣";


export interface User {
  EMAIL : string;
  NICKNAME: string;
  BIRTHDATE: string;
  GENDER: number | null;
  DEVICEID: string;
  APPVERSION: string;
  DEVICEOS: string | null;
  PROVIDERNAME: string;
  PROVIDERCODE: string;
  NOTIFICATIONTOKEN: string;
  ACCESSTOKEN: string;
  REFRESHTOKEN: string;
}

export const USER : User = {
  EMAIL : "email",
  NICKNAME : "nickname",
  BIRTHDATE : 'birthdate',
  GENDER : null,
  DEVICEID : 'deviceId',
  APPVERSION : "appVersion",
  DEVICEOS : "deviceOs",
  PROVIDERNAME : "google",
  PROVIDERCODE : "providerCode",
  NOTIFICATIONTOKEN : "notificationToken",
  ACCESSTOKEN : "accessToken", // 수정된 부분
  REFRESHTOKEN : "refreshToken",
}