import { MMKV } from 'react-native-mmkv';
import { TGender, TNotice } from '../constants/types';

export const storage = new MMKV();

//Tokens
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

//UserInfo
const USER_NICKNAME = 'user_nickname';
const USER_BIRTHDATE = 'user_birthdate';
const USER_GENDER = 'user_gender';

//DeviceInfo
const DEVICE_ID = 'device_id';

//Chatting
const CHATTING = 'chatting';

//Notice
const NOTICE = 'notice';

//AccessToken
export const getAccessToken = (): string | undefined => {
  return storage.getString(ACCESS_TOKEN);
};

export const setAccessToken = (accessToken: string): void => {
  storage.set(ACCESS_TOKEN, accessToken);
};

export const deleteAccessToken = (): void => {
  console.error('deleteAccessToken');
  storage.delete(ACCESS_TOKEN);
};

//RefreshToken
export const getRefreshToken = (): string | undefined => {
  return storage.getString(REFRESH_TOKEN);
};

export const setRefreshToken = (refreshToken: string): void => {
  storage.set(REFRESH_TOKEN, refreshToken);
};

export const deleteRefreshToken = (): void => {
  storage.delete(REFRESH_TOKEN);
};

//UserNickname
export const getUserNickname = (): string | undefined => {
  return storage.getString(USER_NICKNAME);
};

export const setUserNickname = (nickname: string): void => {
  storage.set(USER_NICKNAME, nickname);
};

export const deleteUserNickname = (): void => {
  storage.delete(USER_NICKNAME);
};

//UserBirthdate
export const getUserBirthdate = (): string | undefined => {
  return storage.getString(USER_BIRTHDATE);
};

export const setUserBirthdate = (birthdate: string): void => {
  storage.set(USER_BIRTHDATE, birthdate);
};

export const deleteUserBirthdate = (): void => {
  storage.delete(USER_BIRTHDATE);
};

//UserGender
export const getUserGender = (): TGender | undefined => {
  return storage.getString(USER_GENDER) as TGender;
};

export const setUserGender = (userGender: TGender): void => {
  storage.set(USER_GENDER, userGender);
};

export const deleteUserGender = (): void => {
  storage.delete(USER_GENDER);
};

//DeviceId
export const getDeviceIdFromMMKV = (): string | undefined => {
  return storage.getString(DEVICE_ID);
};

export const setDeviceId = (deviceId: string): void => {
  storage.set(DEVICE_ID, deviceId);
};

export const deleteDeviceId = (): void => {
  storage.delete(DEVICE_ID);
};

//Chatting
export const getChatting = (): string | undefined => {
  return storage.getString(CHATTING);
};

export const setChatting = (chatting: string): void => {
  storage.set(CHATTING, chatting);
};

export const deleteChatting = (): void => {
  storage.delete(CHATTING);
};

//Notice
export const getNotice = (): TNotice | undefined => {
  const noticeString = storage.getString(NOTICE);
  if (!noticeString) {
    return undefined;
  }
  return JSON.parse(noticeString);
};

export const setNotice = (notice: TNotice): void => {
  storage.set(NOTICE, JSON.stringify(notice));
};

export const deleteNotice = (): void => {
  storage.delete(NOTICE);
};

//setTokenInfo
export const setTokenInfo = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

//clearTokenInfo
export const clearTokenInfo = (): void => {
  storage.delete(ACCESS_TOKEN);
  storage.delete(REFRESH_TOKEN);
};

//setUserInfo
export const setUserInfo = (
  nickname: string | null,
  birthdate: string | null,
  gender: TGender | null,
): void => {
  if (nickname) setUserNickname(nickname);
  if (birthdate) setUserBirthdate(birthdate);
  if (gender) setUserGender(gender);
};

//clearUserInfo
export const clearUserInfo = (): void => {
  storage.delete(USER_NICKNAME);
  storage.delete(USER_BIRTHDATE);
  storage.delete(USER_GENDER);
};

export const setInfoWhenLogin = (
  nickname: string | null,
  birthdate: string | null,
  gender: TGender | null,
  accessToken: string,
  refreshToken: string,
  notice: TNotice | null,
): void => {
  setUserInfo(nickname, birthdate, gender);
  setTokenInfo(accessToken, refreshToken);
  if (notice) setNotice(notice);
};

export const clearInfoWhenLogout = (): void => {
  clearUserInfo();
  clearTokenInfo();
  deleteNotice();
  deleteChatting();
};
