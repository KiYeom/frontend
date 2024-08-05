import axios from 'axios';
import { TAuth, TNewUser } from './auth.types';
import { storage } from '../utils/storageUtils';
import { REFRESHTOKEN, USER } from '../constants/Constants';
import { instance } from './interceptor';
import { TCommonResult } from './common.types';
import { TAllowedNotifications, TSetNotification } from './notification.types';

//INFO: 토큰 설정하기
export const setNotificationToken = async (
  notificationToken: string,
  deviceId: string,
): Promise<TCommonResult | undefined> => {
  try {
    const res = await instance.patch('/v1/notification/token', {
      deviceId,
      notificationToken,
    });
    return res.data;
  } catch (error) {
    console.error('[ERROR] Set Token', error);
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
