import { instance } from './interceptor';
import { TCommonResult } from './common.types';
import { TAllowedNotifications, TSetNotification } from './notification.types';
import { TDisplayUserInfo, TUserInfo } from './setting.types';

export const updateUserInfo = async (
  profile: TDisplayUserInfo,
): Promise<TDisplayUserInfo | undefined> => {
  try {
    const res = await instance.patch('/v1/users/update-user', profile);
    return res.data;
  } catch (error) {
    console.log('[ERROR] user edit info', error);
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

export const deavtivate = async (reasons: string[]): Promise<TCommonResult | undefined> => {
  try {
    const reasonString = JSON.stringify(reasons);
    const res = await instance.delete('/v1/auth/deactivate', {
      params: { reasons: reasonString },
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] deavtivate: ', error);
    return;
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
