import * as Sentry from '@sentry/react-native';
import { instance } from './interceptor';
import { getIsDemo } from '../utils/storageUtils';
import { TCommonResult } from './common.types';
import { TDemoChats } from './demo.types';

export const getDemoAllow = async (): Promise<TCommonResult | undefined> => {
  try {
    const response = await instance.post('/v1/demo/allow');
    return response.data;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return undefined;
  }
};

export const getDemoAnalyticsPush = async (): Promise<void> => {
  try {
    if (!getIsDemo()) {
      return;
    }
    await instance.get('/v1/demo/analytics-push');
    return;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};

export const getDemoActivePush = async (): Promise<void> => {
  try {
    if (!getIsDemo()) {
      return;
    }
    await instance.get('/v1/demo/active-push');
    return;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};

export const getDemoOldPush = async (): Promise<void> => {
  try {
    if (!getIsDemo()) {
      return;
    }
    await instance.get('/v1/demo/old-push');
    return;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};

export const requestAnalytics = async (): Promise<void> => {
  try {
    if (!getIsDemo()) {
      return;
    }
    await instance.get('/v1/analyze/daily-update');
    return;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};

export const requestDemoChat = async (): Promise<TDemoChats | undefined> => {
  try {
    if (!getIsDemo()) {
      return;
    }
    const res = await instance.get('/v1/demo/get-chat');
    return res.data;
  } catch (error) {
    Sentry.captureException(error); // Sentry에 에러 전송
    return;
  }
};
