import { MMKV } from 'react-native-mmkv';
import { ONE_DAY_IN_MS } from '../constants/Constants';
import { TGender, TNotice } from '../constants/types';

export const storage = new MMKV();

//Tokens
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

//UserInfo
const USER_NICKNAME = 'user_nickname';
const USER_BIRTHDATE = 'user_birthdate';
const USER_GENDER = 'user_gender';
const NOTIFICATION_SENT = 'notification_sent';

//DeviceInfo
const DEVICE_ID = 'device_id';

//Chatting
const CHATTING = 'chatting';

//Notice
const NOTICE = 'notice';

//dangerSign
const RISK = 'RISK';

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
  storage.delete(NOTIFICATION_SENT);
  storage.delete(DANDER_SIGN);
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
  deleteNotificationSent();
};

//Tokens
//AccessToken
export const getAccessToken = (): string | undefined => {
  return storage.getString(ACCESS_TOKEN);
};

export const setAccessToken = (accessToken: string): void => {
  storage.set(ACCESS_TOKEN, accessToken);
};

export const deleteAccessToken = (): void => {
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

//User
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

//NotificationSent
export const getNotificationSent = (): boolean | undefined => {
  return storage.getBoolean(NOTIFICATION_SENT);
};

export const setNotificationSent = (notificationSent: boolean): void => {
  storage.set(NOTIFICATION_SENT, notificationSent);
};

export const deleteNotificationSent = (): void => {
  storage.delete(NOTIFICATION_SENT);
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

//ai 답변 저장하기
export const saveAiResponse = (aiResponse: string) => {
  storage.set('AIRESPONSE', aiResponse);
};
//ai 답변 가져오기
export const getAiResponse = () => {
  return storage.getString('AIRESPONSE');
};

// INFO : 위험 신호
// 위험 데이터 저장 {메세지 확인 여부, 타임스탬프}
export const saveRiskData = (isChecked: boolean, timestamp: number): void => {
  const data = JSON.stringify({ isChecked, timestamp });
  storage.set(RISK, data);
};

// 위험 데이터 삭제
export const clearRiskData = (): void => {
  storage.delete(RISK);
};

// 데이터를 불러오는 함수
//6시간 전 : 1729465494744
//36시간 전 : 1729357537247
// 데이터를 불러오는 함수
export const getRiskData = (): { isChecked: boolean; timestamp: number } | null => {
  const data = storage.getString(RISK); //isCheked, timestamp
  if (data != null) {
    try {
      // 데이터가 존재한다면
      const parsedData = JSON.parse(data);
      parsedData.isChecked = Boolean(parsedData.isChecked); // 문자열 'true'를 boolean true로 변환
      parsedData.timestamp = Number(parsedData.timestamp); // 문자열을 숫자로 변환
      const currentTime = new Date().getTime();
      if (currentTime - parsedData.timestamp > ONE_DAY_IN_MS) {
        // 24시간이 경과한 경우 -> 로컬을 비운다
        clearRiskData();
        return null;
      }
      return parsedData;
    } catch (error) {
      console.error('Error parsing risk data:', error);
      return null;
    }
  }
  return null;
};
