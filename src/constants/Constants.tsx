export enum USER {
  NICKNAME = 'NICKNAME',
  BIRTHDATE = 'BIRTHDATE',
  GENDER = 'GENDER',
}
export const MALE = 1;
export const FEMALE = 2;

interface User {
  email: string;
  providerName: string;
  providerCode: string;
  nickname: string;
  birthdate: string;
  gender: number | null;
  deviceId: string;
  appVersion: string;
  deviceOs: string;
  notificationToken: string;
}

export const DATA : User = {
  email : "email",
  providerName : "providerName",
  providerCode : "providerCode",
  nickname : "nickname",
  birthdate : "birthdate",
  gender : null,
  deviceId : "qwer1234",
  appVersion : "v1.0.0",
  deviceOs : "ios15.1",
  notificationToken : "qweqr1234"
};