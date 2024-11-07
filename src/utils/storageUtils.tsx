import { MMKV } from 'react-native-mmkv';
import { ONE_DAY_IN_MS } from '../constants/Constants';
import { TGender, TNotice } from '../constants/types';
import { getApiDateString } from './times';

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

//NewIMessages
const NEW_I_MESSAGES = 'new_i_messages';

//Notice
const NOTICE = 'notice';

//RiskWithLetterId
const RISK_WITH_LETTER_ID = 'RISK_WITH_LETTER_ID';

//refreshChattingPageTimes
const REFRESH_CHAT = 'refresh_chat';

//isDemo
const IS_DEMO = 'is_demo';

//isScoreDemo
const IS_SCORE_DEMO = 'is_score_demo';

//setTokenInfo
export const setTokenInfo = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

//clearTokenInfo
export const clearTokenInfo = (): void => {
  deleteAccessToken();
  deleteRefreshToken();
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
  deleteUserNickname();
  deleteUserBirthdate();
  deleteUserGender();
  deleteNotificationSent();
  deleteRiskData();
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
  deleteNewIMessages();
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

//NewIMessages
export const getNewIMessages = (): string | undefined => {
  return storage.getString(NEW_I_MESSAGES);
};

export const setNewIMessages = (newIMessages: string): void => {
  storage.set(NEW_I_MESSAGES, newIMessages);
};

export const deleteNewIMessages = (): void => {
  storage.delete(NEW_I_MESSAGES);
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

//refreshChattingPageTimes
export const getRefreshChat = (): number => {
  return storage.getNumber(REFRESH_CHAT) ?? 0;
};

export const setRefreshChat = (refreshChat: number): void => {
  storage.set(REFRESH_CHAT, refreshChat);
};

export const deleteRefreshChat = (): void => {
  storage.delete(REFRESH_CHAT);
};

export const addRefreshChat = (times: number): number => {
  const refreshChat = getRefreshChat();
  setRefreshChat(refreshChat + times);
  return refreshChat + times;
};

//isDemo
export const getIsDemo = (): boolean => {
  return storage.getBoolean(IS_DEMO) ?? false;
};

export const setIsDemo = (isDemo: boolean): void => {
  deleteRiskData();
  storage.set(IS_DEMO, isDemo);
};

export const deleteIsDemo = (): void => {
  deleteRiskData();
  storage.delete(IS_DEMO);
};

//isScoreDemo
export const getIsScoreDemo = (): boolean => {
  const result = storage.getBoolean(IS_SCORE_DEMO) ?? false;
  if (result) {
    deleteIsScoreDemo();
  }
  return result;
};

export const setIsScoreDemo = (isScoreDemo: boolean): void => {
  storage.set(IS_SCORE_DEMO, isScoreDemo);
};

export const deleteIsScoreDemo = (): void => {
  storage.delete(IS_SCORE_DEMO);
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
export type TRiskData = {
  timestamp: number;
  isRead: boolean;
  letterIndex: number | null;
};

export const getRiskData = (): TRiskData | undefined => {
  const data = storage.getString(RISK_WITH_LETTER_ID);
  if (!data) return undefined;
  const riskData = JSON.parse(data);
  const nowApiDateString = getApiDateString(new Date());
  const riskDateApiDateString = getApiDateString(new Date(riskData.timestamp));
  if (riskDateApiDateString === nowApiDateString) {
    return riskData;
  } else {
    deleteRiskData();
    return undefined;
  }
};

// 위험 데이터 저장
export const setRiskData = (riskDate: TRiskData): void => {
  const data = JSON.stringify(riskDate);
  storage.set(RISK_WITH_LETTER_ID, data);
};

// 위험 데이터 삭제
export const deleteRiskData = (): void => {
  storage.delete(RISK_WITH_LETTER_ID);
};
