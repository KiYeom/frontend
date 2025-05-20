import { MMKV } from 'react-native-mmkv';
import { ONE_DAY_IN_MS } from '../constants/Constants';
import { TGender, TNotice, TVender, TPLAN } from '../constants/types';
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
const USER_PLAN = 'user_plan';
const CAN_SEND_PHOTO = 'canSendPhoto';
const NOTIFICATION_SENT = 'notification_sent';
const USER_ACCOUNT_PROVIDER = 'user_account_provider';

//DeviceInfo
const DEVICE_ID = 'device_id';

//Chatting
const CHATTING = 'chatting';

//NewIMessages
const NEW_I_MESSAGES = 'new_i_messages';
//v3
const V3_MESSAGES = 'v3_message';

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

//photocard
const PHOTO_CARD_LYRIC_ID = 'PHOTO_CARD_LYRIC_ID';
const PHOTO_CARD_IMAGE_ID = 'PHOTO_CARD_IMAGE_ID';

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
  deleteNewIMessagesV3();
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

//UserPlan
export const getUserPlan = (): string | undefined => {
  return storage.getString(USER_PLAN);
};
export const setUserPlan = (userPlan: TPLAN): void => {
  storage.set(USER_PLAN, userPlan);
};
export const deleteUserPlan = (): void => {
  storage.delete(USER_PLAN);
};

//Photo
export const getCanSendPhoto = (): boolean => {
  return storage.getBoolean(CAN_SEND_PHOTO) ?? false;
};
export const setCanSendPhoto = (canSendPhoto: boolean): void => {
  storage.set(CAN_SEND_PHOTO, canSendPhoto);
};
export const deleteCanSendPhoto = (): void => {
  storage.delete(CAN_SEND_PHOTO);
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

//Chatting - 없어질 코드들
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

//1.5.7 UPDATE : v3
export const getNewIMessagesV3 = (): string | undefined => {
  return storage.getString(V3_MESSAGES);
};
export const setNewIMessagesV3 = (newIMessages: string): void => {
  storage.set(V3_MESSAGES, newIMessages);
};
export const deleteNewIMessagesV3 = (): void => {
  storage.delete(V3_MESSAGES);
};
//v3 key가 있는지 확인하는 함수 (있으면 true 없으면 false)
export const doesV3KeyExist = () => {
  return storage.contains(V3_MESSAGES);
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

// 사용자의 위험 데이터 상황을 로컬에서 가지고 오는 함수
// {"timestamp":1741267035726,"isRead":true,"letterIndex":3}
export const getRiskData = (): TRiskData | undefined => {
  const data = storage.getString(RISK_WITH_LETTER_ID);
  //console.log('getRiskData data : ', data);
  if (!data) return undefined;
  const riskData = JSON.parse(data);
  const nowApiDateString = getKoreanServerTodayDateString(new Date());
  const riskDateApiDateString = getKoreanServerTodayDateString(new Date(riskData.timestamp));
  //위험 편지를 처음 받고, 하루가 지나가면 삭제
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

// 포토카드 가사 및 이미지 저장
export const savePhotoCardData = (lyricObject: happyLyricsObject, imageSource: any): void => {
  try {
    // 가사 객체 저장
    const lyricData = JSON.stringify(lyricObject);
    storage.set(PHOTO_CARD_LYRIC_ID, lyricData);

    // 이미지는 id와 위치 정보만 저장 (source는 require()로 불러오는 객체라 직렬화 불가)
    const imageData = JSON.stringify({
      id: imageSource.id,
      textPosition: imageSource.textPosition,
    });
    storage.set(PHOTO_CARD_IMAGE_ID, imageData);

    console.log('포토카드 데이터 저장 완료');
  } catch (e) {
    console.error('포토카드 데이터 저장 실패:', e);
  }
};

// 저장된 포토카드 가사 로드
export const getPhotoCardLyric = (): happyLyricsObject | null => {
  const lyricData = storage.getString(PHOTO_CARD_LYRIC_ID);
  if (!lyricData) return null;

  try {
    return JSON.parse(lyricData);
  } catch (e) {
    console.error('포토카드 가사 파싱 오류:', e);
    return null;
  }
};

// 저장된 포토카드 이미지 로드 (backgroundImages 배열 필요)
export const getPhotoCardImage = (backgroundImages: any[]): any | null => {
  const imageData = storage.getString(PHOTO_CARD_IMAGE_ID);
  if (!imageData) return null;

  try {
    const parsedData = JSON.parse(imageData);
    // ID를 기반으로 원본 이미지 객체 찾기
    return backgroundImages.find((img) => img.id === parsedData.id) || null;
  } catch (e) {
    console.error('포토카드 이미지 파싱 오류:', e);
    return null;
  }
};

// 포토카드 데이터 삭제
export const deletePhotoCardData = (): void => {
  storage.delete(PHOTO_CARD_LYRIC_ID);
  storage.delete(PHOTO_CARD_IMAGE_ID);
  console.log('포토카드 데이터 삭제 완료');
};
