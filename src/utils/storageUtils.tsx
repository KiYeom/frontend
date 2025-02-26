import { MMKV } from 'react-native-mmkv';
import { ONE_DAY_IN_MS } from '../constants/Constants';
import { TGender, TNotice, TVender } from '../constants/types';
import { getKoreanServerTodayDateString } from './times';
import { showAppNotice } from './app-notice';

export const storage = new MMKV();

//Tokens
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

//UserInfo
const USER_NICKNAME = 'user_nickname';
const USER_BIRTHDATE = 'user_birthdate';
const USER_GENDER = 'user_gender';
const NOTIFICATION_SENT = 'notification_sent';
const USER_ACCOUNT_PROVIDER = 'user_account_provider';

//DeviceInfo
const DEVICE_ID = 'device_id';

//Chatting
const CHATTING = 'chatting';

//NewIMessages
const NEW_I_MESSAGES = 'new_i_messages';

//RiskWithLetterId
const RISK_WITH_LETTER_ID = 'RISK_WITH_LETTER_ID';

//refreshChattingPageTimes
const REFRESH_CHAT = 'refresh_chat';

//READ_NOTICE
const READ_NOTICE = 'read_notice';
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
  provider?: string,
): void => {
  setUserInfo(nickname, birthdate, gender);
  setTokenInfo(accessToken, refreshToken);
  provider && setUserAccountProvider(provider);
  if (notice) {
    showAppNotice(notice);
  }
};

export const clearInfoWhenLogout = (): void => {
  clearUserInfo();
  clearTokenInfo();
  deleteChatting();
  deleteNewIMessages();
  deleteNotificationSent();
  deleteReadNotice();
  deleteUserAccountProvider();
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
//UserAccountProvider
export const setUserAccountProvider = (provider: TVender): void => {
  storage.set(USER_ACCOUNT_PROVIDER, provider);
};
export const getUserAccountProvider = (): string | undefined => {
  return storage.getString(USER_ACCOUNT_PROVIDER);
};
export const deleteUserAccountProvider = (): void => {
  storage.delete(USER_ACCOUNT_PROVIDER);
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

//READ_NOTICE
export const getReadNotice = (): number[] => {
  const numberArrayString = storage.getString(READ_NOTICE);
  if (!numberArrayString) return [];
  return JSON.parse(numberArrayString);
};

export const findReadNotice = (noticeId: number): boolean => {
  const readNotice = getReadNotice();
  return readNotice.includes(noticeId);
};

export const setReadNotice = (readNotice: number[]): void => {
  const readNoticeString = JSON.stringify(readNotice);
  storage.set(READ_NOTICE, readNoticeString);
};

export const addReadNotice = (noticeId: number): void => {
  const readNotice = getReadNotice();
  if (!readNotice.includes(noticeId)) {
    readNotice.push(noticeId);
    setReadNotice(readNotice);
  }
};

export const deleteReadNotice = (): void => {
  storage.delete(READ_NOTICE);
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
  const nowApiDateString = getKoreanServerTodayDateString(new Date());
  const riskDateApiDateString = getKoreanServerTodayDateString(new Date(riskData.timestamp));
  if (riskDateApiDateString === nowApiDateString) {
    return riskData;
  } else {
    deleteRiskData();
    return undefined;
  }
};

// 위험 데이터 저장
export const setRiskData = (riskData: TRiskData): void => {
  const data = JSON.stringify(riskData);
  storage.set(RISK_WITH_LETTER_ID, data);
};

// 위험 데이터 삭제
export const deleteRiskData = (): void => {
  storage.delete(RISK_WITH_LETTER_ID);
};
