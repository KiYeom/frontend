import * as Sentry from '@sentry/react-native';
import { instance } from './interceptor';
import { getIsDemo } from '../utils/storageUtils';

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
