import { Platform } from 'react-native';
import { TCommonResult } from './common.types';
import { instance } from './interceptor';
import { TAllowedNotifications, TSetNotification } from './notification.types';
import { TDisplayUserInfo, TLatestVersion, TUserInfo } from './setting.types';

export const updateUserInfo = async (
  profile: TDisplayUserInfo,
): Promise<TDisplayUserInfo | undefined> => {
  try {
    const res = await instance.patch('/v1/users/update-user', profile);
    return res.data;
  } catch (error) {
    //console.log('[ERROR] user edit info', error);
    return;
  }
};

//INFO: 토큰 설정하기
export const logout = async (deviceId: string): Promise<TCommonResult | undefined> => {
  try {
    const res = await instance.delete('/v1/auth/logout', {
      data: {
        deviceId,
      },
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] logout', error);
    return;
  }
};

export const deactivate = async (reasons: string): Promise<TCommonResult> => {
  try {
    const res = await instance.delete('/v1/auth/deactivate', {
      params: { reasons },
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] deavtivate: ', error);
    return { result: false };
  }
};

export const changeNickname = async (nickname: string): Promise<TCommonResult | undefined> => {
  try {
    const res = await instance.patch('/v1/users/nickname', {
      nickname,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] changeNickname', error);
    return;
  }
};

export const getUserInfo = async (): Promise<TUserInfo | undefined> => {
  try {
    const res = await instance.get('/v1/users/me');
    return res.data;
  } catch (error) {
    console.error('[ERROR] gerUserInfo function error', error);
    return;
  }
};

//INFO: 토큰 권한 정보 받기
export const getNotificationStatus = async (): Promise<TAllowedNotifications | undefined> => {
  try {
    const res = await instance.get('/v1/notification/allowed-notifications');
    return res.data;
  } catch (error) {
    console.error('[ERROR] get allowed Token', error);
    return;
  }
};

//INFO: 토큰 권한 정보 받기
export const setNotificationStatus = async (
  notificationName: string,
  isAllow: boolean,
): Promise<TSetNotification | undefined> => {
  try {
    const res = await instance.patch('/v1/notification', {
      notificationName,
      isAllow,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] get allowed Token', error);
    return;
  }
};

//INFO: 최신 버전 받기
export const getLatestVersion = async (): Promise<TLatestVersion | undefined> => {
  try {
    const res = await instance.get('/v1/users/check-version', {
      params: {
        platform: Platform.OS,
      },
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] getlatest version', error);
    return;
  }
};

//INFO: 기관 연결하기
export const connectOrganizationApi = async (
  code: string,
): Promise<{ result: boolean } | undefined> => {
  try {
    const res = await instance.post('/v1/users/connect', {
      organization: code,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR]connect organization: ', error);
    return;
  }
};

//INFO: 기관 연결 해제하기
export const disconnectOrganizationApi = async (): Promise<{ result: boolean } | undefined> => {
  try {
    const res = await instance.delete('/v1/users/connect');
    return res.data;
  } catch (error) {
    console.error('[ERROR]connect organization: ', error);
    return;
  }
};

// ========== 🍔🍔🍔🍔🍔 사이드바 설정 함수 🍔🍔🍔🍔🍔 ==========//
// 햄버거바에서 사용자의 채팅 문체를 직접 설정하는setChatStyle 함수
export const switchChatTone = async (isInFormal: boolean): Promise<boolean> => {
  try {
    const res = await instance.patch('/v1/users/update-format', { isInFormal });
    //console.log('updateChattingFormat success', res);
    return true;
  } catch (error) {
    //console.log('error');
  }
  return false;
};

//1.5.7 UPDATE : 사용자 정보 (이모지 선호) 변경
export const switchEmojiTone = async (wantsEmo: boolean): Promise<boolean> => {
  try {
    const res = await instance.patch('/v1/users/update-emoji', { wantsEmo });
    //console.log('updateEmoji success', res);
    return true;
  } catch (error) {
    //console.log('error');
  }
  return false;
};
