export const MALE = 1;
export const FEMALE = 2;

export const APP_VERSION = "1.0.0"
export const ACCESSTOKEN = "ACCESSTOKEN";
export const REFRESHTOKEN = "REFRESHTOKEN";

export interface User {
  EMAIL : string;
  NICKNAME: string;
  BIRTHDATE: string;
  GENDER: number | null;
  DEVICEID: string;
  APPVERSION: string;
  DEVICEOS: string;
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